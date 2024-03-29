from pythonSrc.StockReport import format_ext_link
import pandas as pd
import math
import os
import csv

from pythonSrc.Constants import *
from pythonSrc.Utils import *
from pythonSrc.Stock import *
from pythonSrc.StockReport import *


def calc_stock_volume(stock):
    alert_message = ""

    if os.path.exists(stock.raw_csv_file):

        # 새로운 종목의 경우 파일 만들고, headaer 생성
        if os.path.exists(stock.calc_csv_file) == False:
            set_csv_header(stock.calc_csv_file)

        row_count = get_csv_row_count(stock.raw_csv_file)
        # 공휴일을 제외하고 VOLUME_CALC_LENGTH일 의 데이터를 가져오기 위해 csv에서 2배수로 데이터를 읽는다.
        df = pd.read_csv(
            stock.raw_csv_file,
            names=["Date", "Open", "High", "Low", "Close", "Volume", "Change"],
            skiprows=row_count - VOLUME_CALC_LENGTH[0]*2
        )

        # 마지막 날짜(오늘)에 대한 데이터를 캐싱해둠
        df_today = df.tail(1)
        df_today_volume = df_today.iloc[0]['Volume']
        df_today_price = df_today.iloc[0]['Close']

        stock.today_data = StockData(open=df_today.iloc[0]['Open'],
            close=df_today_price, volume=df_today_volume,
            high=df_today.iloc[0]['High'], low=df_today.iloc[0]['Low'])

        # 오늘 날짜를 제외( 평균에서 오늘 값을 제외하기 위해서 )
        df = df[:-1]

        # 주식시장이 열리지 않는 날은 값이 0 이므로, 해당 값이 있을 경우 drop 하고, VOLUME_CALC_LENGTH 만큼의 최신 데이터를 가져온다.
        # 데이터 자체가, 열리지 않는 날의 값을 모두 0으로 갖고있게 되므로, 평균 계산시 영향을 끼치게 된다.
        df = df[~(df[["Open", "High", "Low", "Close", "Volume"]] == 0).any(axis=1)]

        # 전날 데이터와 비교를 위해서 캐싱( 오늘이 월요일이면, 지난주 금요일로( 0의 날짜를 모두 제거 했기 때문 ))
        df_prev_day = df.tail(1)
        if df_prev_day.empty == True:
            return alert_message
        df_prev_price = df_prev_day.iloc[0]['Close']
        
        stock.prev_data = StockData(open=df_prev_day.iloc[0]['Open'],
                                    close=df_prev_price,
                                    volume=df_prev_day.iloc[0]['Volume'],
                                    high=df_prev_day.iloc[0]['High'],
                                    low=df_prev_day.iloc[0]['Low'])

        calculated_row = ([TODAY])
        alert_result = {"mean_volume_over_alert": {"days": [], "%": [], "over": []},
                        "max_volume_over_alert": {"days": [], "%": [], "over": []},
                        "max_price_over_alert": {"days": [], "%": [], "over": []}}

        for day in VOLUME_CALC_LENGTH:
            df = df.tail(day)
            calculate_daily_values(
                df, day, df_today_volume, df_today_price, stock.alert_percent,
                calculated_row, alert_result, stock)

        # 파일에 데이터 추가
        write_calc_data = get_fetch_start_date(stock.calc_csv_file)
        if write_calc_data == True:
            with open(stock.calc_csv_file, "a") as csvfile:
                writer = csv.writer(csvfile)
                writer.writerow(calculated_row)

        for alert_info in stock.alert_price_list:
            alert_message += check_alert_price(stock.nation,
                                            df_prev_day, df_today, alert_info)
        
        alert_message += format_alert_message(alert_result)

        if alert_message:
            main_link = f'> ' + '<{}|{}>'.format(
                f'https://arclien.github.io/stock/code/{stock.ticker}', f'{stock.name}:{stock.ticker}') + f'\n'
            additional_link = format_ext_link(stock.nation, stock.ticker)
            diff_symbol = "+" if df_today_price > df_prev_price else "-"
            diff_value = get_diff_percent(df_prev_price, df_today_price)
            if abs(diff_value) > 5:
                diff_value = "`{}`".format(diff_value)
            return f'{main_link}' + f'> {TODAY} 거래량: {df_today_volume} / 가격: {df_today_price} ({diff_symbol}{diff_value}%)\n' + alert_message + f'> {additional_link}\n'
        else:
            return alert_message
            
    return alert_message


# 새로운 종목의 경우, 새로운 csv 파일 생성 후 header 추가
def set_csv_header(csv_file):
    with open(csv_file, "a") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(STOCK_CALC_LIST_HEADER)

# csv 파일을 가져와서 총 length를 계산


def get_csv_row_count(csv_file):
    with open(csv_file, "r") as f:
        reader = csv.reader(f)
        return len(list(reader))


def calculate_daily_values(df, day, df_today_volume, df_today_price, alert_percent, calculated_row, alert_result, stock):
    _max_price = math.ceil(df.describe().loc['max']['Close'])
    _average_price = math.ceil(df.describe().loc['mean']['Close'])
    _min_price = math.ceil(df.describe().loc['min']['Close'])
    _max_volume = math.ceil(df.describe().loc['max']['Volume'])
    _average_volume = math.ceil(df.describe().loc['mean']['Volume'])
    _min_volume = math.ceil(df.describe().loc['min']['Volume'])    
    _start_price = df.head(1).iloc[0]['Close']
    _end_price = df.tail(1).iloc[0]['Close']

    # dataframe 정렬 by volume
    df_sorted = df.sort_values(['Volume'], ascending=True)
    # volume 기준 상/하위 5% row 지움
    df_sorted.drop(df_sorted.tail(
        math.ceil(len(df) * 0.05)).index,  inplace=True)
    df_sorted.drop(df_sorted.head(
        math.ceil(len(df) * 0.05)).index,  inplace=True)
    # adjusted_mean
    _adjusted_mean = math.ceil(df_sorted.describe().loc['mean']['Volume'])

    calculated_row.append(_max_volume)
    calculated_row.append(_min_volume)
    calculated_row.append(_average_volume)
    calculated_row.append(_adjusted_mean)

    stock_stat = StockStatistics(day, _max_price, _average_price, _min_price,
                            _max_volume, _average_volume, _min_volume, _adjusted_mean,
                            _start_price, _end_price)

    stock.time_series.append(stock_stat)

    # alert_result 계산
    # 최근 3일 평균을 구해야 하는데, volume이 있는 날( 주식시장 개장일 )만 평균 3일 체크
    if not df_today_volume == 0:
        diff_percent = get_diff_percent(_adjusted_mean, df_today_volume)
        if diff_percent >= alert_percent and df_today_volume > _adjusted_mean:
            alert_result["mean_volume_over_alert"]["days"].append(day)
            alert_result["mean_volume_over_alert"]["%"].append(diff_percent)
            alert_result["mean_volume_over_alert"]["over"].append(
                round(df_today_volume - _adjusted_mean))

        if df_today_volume > _max_volume:
            alert_result["max_volume_over_alert"]["days"].append(day)
            alert_result["max_volume_over_alert"]["%"].append(
                get_diff_percent(_max_volume, df_today_volume))
            alert_result["max_volume_over_alert"]["over"].append(
                round(df_today_volume - _max_volume))

    if df_today_price > _max_price:
        alert_result["max_price_over_alert"]["days"].append(day)
        alert_result["max_price_over_alert"]["%"].append(
            get_diff_percent(_max_price, df_today_price))
        alert_result["max_price_over_alert"]["over"].append(
            round(df_today_price - _max_price, 2))


def check_alert_price(nation, df_yesterday, df_today, alert_info):
    alert_price = alert_info[0]
    if alert_price == 0 or df_today.iloc[0]['Volume'] == 0 or df_yesterday.iloc[0]['Volume'] == 0:
        return ""

    inner_alarm_message = ""
    today_price = df_today.iloc[0]['Close']
    today_high = df_today.iloc[0]['High']
    today_low = df_today.iloc[0]['Low']
    yesterday_price = df_yesterday.iloc[0]['Close']

    if nation == 'ko':
        alert_price = int(alert_price)
    else:
        alert_price = float(alert_price)

    # https://trello.com/c/Dx9Q0IOy
    # 1. 전날 종가가 35000미만이고 오늘 종가가 35000이상이면, 35000 (돌파) (혹은 위쪽 화살표)
    # 2. 전날 종가가 35000초과이고 오늘 종가가 35000이하이면 35000 (하향돌파) (혹은 아래쪽 화살표)
    # 3. 전날/오늘 종가가 다 35000 초과인데, 장중 최저가가 35000이하면 35000 (지지)
    # 4. 전날/오늘 종가가 다 35000 미만인데, 장중 최고가가 35000이상이면 35000 (저항)
    if yesterday_price < alert_price and today_price >= alert_price:
        inner_alarm_message += f'> *가격알림: `{alert_price}{alert_info[1]}` 돌파* \n'
    elif yesterday_price > alert_price and today_price <= alert_price:
        inner_alarm_message += f'> *가격알림: `{alert_price}{alert_info[1]}` 하향돌파* \n'
    elif yesterday_price > alert_price and today_price > alert_price and today_low <= alert_price:
        inner_alarm_message += f'> *가격알림: {alert_price}{alert_info[1]} 지지* \n'
    elif yesterday_price < alert_price and today_price < alert_price and today_high >= alert_price:
        inner_alarm_message += f'> *가격알림: {alert_price}{alert_info[1]} 저항* \n'

    return inner_alarm_message


def format_alert_message(alert_result):
    alert_message = ""

    # 가격, 최대 거래량, 평균 거래량 순으로 출력
    if len(alert_result["max_price_over_alert"]["days"]) > 0:
        alert_message += "> "
        alert_message += "/".join(map(lambda x: "`{}`".format(x) if x >= 90 else str(x), alert_result["max_price_over_alert"]["days"]))
        alert_message += f'일 최대 *가격* 갱신 (+{alert_result["max_price_over_alert"]["%"][0]}%, +{alert_result["max_price_over_alert"]["over"][0]}) \n'

    if len(alert_result["max_volume_over_alert"]["days"]) > 0:
        alert_message += "> "
        alert_message += "/".join(map(lambda x: "`{}`".format(x) if x >= 90 else str(x), alert_result["max_volume_over_alert"]["days"]))
        alert_message += f'일 최대거래량갱신 (+{alert_result["max_volume_over_alert"]["%"][0]}%, +{alert_result["max_volume_over_alert"]["over"][0]}) \n'

    if len(alert_result["mean_volume_over_alert"]["days"]) > 0:
        alert_message += "> "
        alert_message += "/".join(map(lambda x: "`{}`".format(x) if x >= 90 else str(x), alert_result["mean_volume_over_alert"]["days"]))
        alert_message += f'일 평균거래량갱신 (+{alert_result["mean_volume_over_alert"]["%"][0]}%, +{alert_result["mean_volume_over_alert"]["over"][0]}) \n'

    return alert_message