from json.decoder import JSONDecodeError
import os
from datetime import timedelta, datetime

from pythonSrc.Stock import *
from pythonSrc.Constants import *
from pythonSrc.FetchStockData import fetch_and_generate_stock_csv
from pythonSrc.CalculateStockData import calc_stock_volume
from pythonSrc.StockReport import generate_stock_report

from pythonSrc.Utils import *
from pythonSrc.SlackUtils import *
from pythonSrc.TrelloUtils import *

def make_stock_dic(stock_dic):
    my_card_list = get_card_ids()

    for cardId in my_card_list:
        # cardId에 대한 정보를 trello에서 가져옴
        res = get_card_by_id(cardId)
        try:
            card_json = json.loads(res)
        except JSONDecodeError as ex:
            print("JSONDecodeError: {} is not correct card, value = {}".format(cardId, res))
        else:
            # print(card_json)

            # card desc에서 정보 파싱
            stock_name = ""
            stock_code = ""
            created_at = ""
            nation = ""
            alert_percent = "50"
            alert_prices = ""
            if 'desc' in card_json:
                if card_json['desc'] != '':
                    if 'code' in json.loads(card_json["desc"]):
                        stock_code = json.loads(card_json["desc"])['code']
                    if 'name' in json.loads(card_json["desc"]):
                        stock_name = json.loads(card_json["desc"])['name']
                    if 'created_at' in json.loads(card_json["desc"]):
                        created_at = json.loads(card_json["desc"])['created_at']
                    if 'nation' in json.loads(card_json["desc"]):
                        nation = json.loads(card_json["desc"])['nation']
                    if 'alert_percent' in json.loads(card_json["desc"]):
                        alert_percent = int(json.loads(card_json["desc"])['alert_percent'])
                    if 'alert_price' in json.loads(card_json["desc"]):
                        alert_prices = json.loads(card_json["desc"])['alert_price']
                        #alert_prices = [float(e) if e.strip().isdigit() else 0 for e in alert_prices.split(',')]
                else:
                    continue

            stock = StockInfo(name=stock_name, ticker=stock_code,
                        created_at=created_at, nation=nation,
                        alert_percent=alert_percent, alert_prices=alert_prices)

            stock_dic[stock_name] = stock


def update_all_stock_data(stock_dic):
    print("update_all_stock, cur time = {}({})".format(CURRENT_TIME2, CURRENT_TIME))
    count = 0
    update_count = 0
    report = ""
    for stock in stock_dic.values():
        print("update {} stock".format(stock.name))
        # csv 파일 매핑
        #raw_csv_file = "{}{}.csv".format(DIR, stock_code)
        #calc_csv_file = "{}{}.csv".format(CALC_DIR, stock_code)

        # csv 파일의 마지막 날짜로부터 다음 fetch start date를 가져옴
        # csv 파일이 없으면 START_DATE
        # csv 파일에 마지막 날짜가 TODAY이면 FALSE를 보내게 했음
        fetch_start_date = get_fetch_start_date(stock.raw_csv_file)
        fetch_end_date = get_fetch_end_date(stock)

        print("{} stock fetch start {}, end {}".format(stock.name, fetch_start_date, fetch_end_date))

        # 이미 fetching을 했으면 fetch_start_date가 False 이다.
        if not fetch_start_date == False:
            update_count += 1
            fetch_and_generate_stock_csv(
                stock.raw_csv_file, stock.ticker, stock.nation,
                fetch_start_date, fetch_end_date)

        if stock.nation == 'ko' and CURRENT_TIME == AUTO_CRAWLING_TIME:
            report += calc_stock_volume(stock)
        elif (stock.nation == 'us' or stock.nation == 'coin') and (CURRENT_TIME == US_CRAWLING_TIME or CURRENT_TIME == str(int(US_CRAWLING_TIME) + 1)):
            report += calc_stock_volume(stock)
        count += 1

    print("{} stock listed, {} updated".format(count, update_count))
    return report

if __name__ == "__main__":
    # 폴더가 없으면 만든다
    if os.path.exists(DIR) == False:
        os.mkdir(DIR)
    if os.path.exists(CALC_DIR) == False:
        os.mkdir(CALC_DIR)

    stock_dic = {}
    report = ""

    make_stock_dic(stock_dic)
    report += update_all_stock_data(stock_dic)

    if CURRENT_TIME == AUTO_CRAWLING_TIME: # kr
        report += generate_stock_report(stock_dic, "ko")
    else:
        report += generate_stock_report(stock_dic, "us")
        report += generate_stock_report(stock_dic, "coin")
    push_to_slack(report)