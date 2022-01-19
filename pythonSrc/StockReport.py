import time

from pythonSrc.Constants import *

def generate_new_stock_report(stock_dic, nation):
    # stock_dic 안에 StockData, StockStatistics 데이터가 다 차있어야 한다.
    print("generate new stock report for {} stocks, target nation = {}, wday={}, cur time = {}({}".format(len(stock_dic), nation, time.localtime().tm_wday, CURRENT_TIME2, CURRENT_TIME))
    stock_report = ""
    
    alert_price_message = ""
    price_alert_level1 = []
    price_alert_level2 = []
    volume_alert_level1_up = []
    volume_alert_level1_down = []
    volume_alert_level2_up = []
    volume_alert_level2_down = []
    
    # 계산하기
    for stock in stock_dic.values():
        if not stock.nation == nation: 
            continue
        
        if len(stock.time_series) <= 0 or stock.today_data.volume == 0:
            continue
        
        alert_price_message += check_alert_price(stock)
        volume_added = False
        price_added = False
        
        for days_data in stock.time_series:
            if stock.today_data.close > days_data.max_price and not price_added:
                if days_data.day_range >= 90:
                    price_alert_level1.append(stock.name)
                else:
                    price_alert_level2.append(stock.name)
                price_added = True
                
            if stock.today_data.volume > days_data.max_volume and not volume_added:
                if days_data.day_range >= 90:
                    if stock.today_data.close > stock.today_data.open:
                        volume_alert_level1_up.append(stock.name)
                    else:
                        volume_alert_level1_down.append(stock.name)
                else:
                    if stock.today_data.close > stock.today_data.open:
                        volume_alert_level2_up.append(stock.name)
                    else:
                        volume_alert_level2_down.append(stock.name)
                volume_added = True
        
    # 출력
    if alert_price_message:
        stock_report += "가격알림:\n"
        stock_report += alert_price_message
        stock_report += "\n"
        
    if len(price_alert_level1) > 0:
        stock_report += "가격알림 (90일 이상 최고가): \n> "
        for s in price_alert_level1:
            stock_report += s
            stock_report += ","
        stock_report += "\n\n"
            
    if len(price_alert_level2) > 0:
        stock_report += "가격알림 (90일 미만 최고가): \n> "
        for s in price_alert_level2:
            stock_report += s
            stock_report += ","
        stock_report += "\n\n"
            
    if len(volume_alert_level1_up) > 0 or len(volume_alert_level1_down) > 0:
        stock_report += "높은 거래량알림 (90이상): \n"
        stock_report += "> 상승: "
        for s in volume_alert_level1_up:
            stock_report += s
            stock_report += ","
        stock_report += "\n> 하락: "
        for s in volume_alert_level1_down:
            stock_report += s
            stock_report += ","
        stock_report += "\n\n"
            
    if len(volume_alert_level2_up) > 0 or len(volume_alert_level2_down) > 0:
        stock_report += "높은 거래량알림 (90미만): \n"
        stock_report += "> 상승: "
        for s in volume_alert_level2_up:
            stock_report += s
            stock_report += ","
        stock_report += "\n> 하락: "
        for s in volume_alert_level2_down:
            stock_report += s
            stock_report += ","
        stock_report += "\n\n"
    
    return stock_report

def generate_stock_summary_report(stock_dic, nation):
    print("generate stock summary report for {} stocks, target nation = {}, wday={}, cur time = {}({}".format(len(stock_dic), nation, time.localtime().tm_wday, CURRENT_TIME2, CURRENT_TIME))
    stock_report = ""

    if nation == "ko":
        if time.localtime().tm_wday == 5:
            stock_report += generate_weekly_summary(stock_dic, nation)
        elif time.localtime().tm_wday == 6:
            pass
        else:
            stock_report += generate_daily_summary(stock_dic, nation)
    elif nation == "us":
        if time.localtime().tm_wday == 6:
            stock_report += generate_weekly_summary(stock_dic, nation)
        elif time.localtime().tm_wday == 0:
            pass
        else:
            stock_report += generate_daily_summary(stock_dic, nation)
    else:   # case 'coin'
        stock_report += generate_daily_summary(stock_dic, nation)
        if time.localtime().tm_wday == 6:
            stock_report += generate_weekly_summary(stock_dic, nation)

    return stock_report


def generate_daily_summary(stock_dic, nation):
    print("generate_daily_summary")
    if len(stock_dic) == 0:
        return

    summary = "\n===== daily summary for {} =====".format(nation)
    up_count = 0
    even_count = 0
    down_count = 0
    stockdiff_dic = {}

    for stock in stock_dic.values():
        if stock.today_data is None or stock.today_data.close == 0:
            #print("{} ticker has no data".format(stock.ticker))
            continue

        if stock.nation == nation:
            stockdiff_dic[stock.name] = round(stock.today_data.price_percent, 2)
            if stock.today_data.price_percent > 1.0:
                up_count += 1
            elif stock.today_data.price_percent < -1.0:
                down_count += 1
            else:
                even_count += 1

    summary += "\n> 상승종목 *{}*, 하락종목 *{}*, 횡보종목 *{}*".format(up_count, down_count, even_count)
    
    sdiff_dic = sorted(stockdiff_dic.items(), reverse=True,
                       key=lambda x: x[1])  # 오름차순 정렬
    top3 = list(sdiff_dic)[:3]
    bottom3 = list(sdiff_dic)[:-3:-1]
    
    summary += "\n> 상승률 상위 3종목 - "
    for item in top3:
        summary += "{}({}{}%) ".format(item[0], '+' if item[1] > 0 else '', item[1])

    summary += "\n> 상승률 하위 3종목 - "
    for item in bottom3:
        summary += "{}({}{}%) ".format(item[0], '+' if item[1] > 0 else '', item[1])
    return summary

def generate_weekly_summary(stock_dic, nation):
    print("generate_weekly_summary for *{}* nation, weekday {}".format(nation, time.localtime().tm_wday))
    if len(stock_dic) == 0:
        return

    summary = "\n===== weekly summary for {} =====".format(nation)
    up_count = 0
    even_count = 0
    down_count = 0
    stockdiff_dic = {}

    for stock in stock_dic.values():
        if stock.today_data is None:
            #print("{} ticker has no data".format(stock.ticker))
            continue

        # 5일 값변동 찾기
        price_diff = 0
        percent_diff = 0.0
        for stockstat in stock.time_series:
            if stockstat.day_range == 5:
                price_diff = stockstat.end_price - stockstat.start_price
                percent_diff = price_diff / stockstat.start_price * 100

        if stock.nation == nation:
            stockdiff_dic[stock.name] = round(percent_diff, 2)
            if percent_diff > 1:
                up_count += 1
            elif percent_diff < -1:
                down_count += 1
            else:
                even_count += 1

    sdiff_dic = sorted(stockdiff_dic.items(), reverse=True,
                       key=lambda x: x[1])  # 오름차순 정렬
    top3 = list(sdiff_dic)[:3]
    bottom3 = list(sdiff_dic)[:-4:-1]

    summary += "\n> 상승종목 *{}*, 하락종목 *{}*, 횡보종목 *{}*".format(
        up_count, down_count, even_count)

    summary += "\n> 상승률 상위 3종목 - "
    for item in top3:
        summary += "{}({}{}%) ".format(item[0], '+' if item[1] > 0 else '', item[1])

    summary += "\n> 상승률 하위 3종목 - "
    for item in bottom3:
        summary += "{}({}{}%) ".format(item[0], '+' if item[1] > 0 else '', item[1])
    #summary += "{} : {}, {} : {}, {} : {}".format(top3[0][0], top3[0][1], top3[1][0], top3[1][1], top3[2][0], top3[2][1])
    return summary



def format_ext_link(nation, stock_code):
    additional_link = ""

    if nation == 'ko':
        additional_link = '<{}|{}>'.format(
            f'https://finance.naver.com/item/main.nhn?code={stock_code}', '네이버') + f', '
        additional_link += f'> ' + '<{}|{}>'.format(
            f'http://comp.fnguide.com/SVO2/ASP/SVD_Main.asp?pGB=1&cID=&MenuYn=Y&ReportGB=&NewMenuID=11&stkGb=701&gicode=A{stock_code}', '에프엔가이드') + f', '
        additional_link += f'> ' + '<{}|{}>'.format(
            f'https://m.comp.wisereport.co.kr:44302/CompanyInfo/Summary/{stock_code}', '와이즈에프엔') + f'\n'
    elif nation == 'us':
        additional_link = '<{}|{}>'.format(
            f'https://finance.yahoo.com/quote/{stock_code}', '야후') + f', '
        additional_link += f'> ' + \
            '<{}|{}>'.format(
                f'https://finviz.com/quote.ashx?t={stock_code}', 'finviz') + f'\n'
    elif nation == 'coin':
        additional_link = '<{}|{}>'.format(
            f'https://coinmarketcap.com/ko/currencies/{stock_code}', '코인마켓캡') + f'\n'


    return additional_link


def check_alert_price(stock):
    inner_alarm_message = ""
    
    for alert_info in stock.alert_price_list:
        alert_price = alert_info[0]
        if alert_price == 0 or stock.today_data.volume == 0 or stock.prev_data.volume == 0:
            continue

        today_price = stock.today_data.close
        today_high = stock.today_data.high
        today_low = stock.today_data.low
        yesterday_price = stock.prev_data.close

        if stock.nation == 'ko':
            alert_price = int(alert_price)
        else:
            alert_price = float(alert_price)

        # https://trello.com/c/Dx9Q0IOy
        # 1. 전날 종가가 35000미만이고 오늘 종가가 35000이상이면, 35000 (돌파) (혹은 위쪽 화살표)
        # 2. 전날 종가가 35000초과이고 오늘 종가가 35000이하이면 35000 (하향돌파) (혹은 아래쪽 화살표)
        # 3. 전날/오늘 종가가 다 35000 초과인데, 장중 최저가가 35000이하면 35000 (지지)
        # 4. 전날/오늘 종가가 다 35000 미만인데, 장중 최고가가 35000이상이면 35000 (저항)
        if yesterday_price < alert_price and today_price >= alert_price:
            inner_alarm_message += f'> {stock.name} : *가격알림: `{alert_price}{alert_info[1]}` 돌파* \n'
        elif yesterday_price > alert_price and today_price <= alert_price:
            inner_alarm_message += f'> {stock.name} : *가격알림: `{alert_price}{alert_info[1]}` 하향돌파* \n'
        elif yesterday_price > alert_price and today_price > alert_price and today_low <= alert_price:
            inner_alarm_message += f'> {stock.name} : *가격알림: {alert_price}{alert_info[1]} 지지* \n'
        elif yesterday_price < alert_price and today_price < alert_price and today_high >= alert_price:
            inner_alarm_message += f'> {stock.name} : *가격알림: {alert_price}{alert_info[1]} 저항* \n'

    return inner_alarm_message