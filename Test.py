from pythonSrc.StockReport import generate_stock_report
from pythonSrc.Stock import *
from pythonSrc.Constants import *
from pythonSrc.Utils import *
from pythonSrc.SlackUtils import *
from pythonSrc.CalculateStockData import calc_stock_volume

def test_stock_volume_calculate():
    global CRAWLING_RESULT_MSG
    STOCK_CODE = '005930'
    ALERT_PERCENT = 30
    ALERT_PRICE_LIST = [80000.0, 85000.0,  86000.0, 87000.0, 88000.0, 90000.0]

    CRAWLING_RESULT_MSG += calc_stock_volume(
        "{}{}.csv".format(DIR, STOCK_CODE),
        "{}{}.csv".format(CALC_DIR, STOCK_CODE),
        STOCK_CODE,
        'TEST_STOCK_NAME',
        'ko',
        ALERT_PERCENT,
        ALERT_PRICE_LIST
    )

    CRAWLING_RESULT_MSG += '====================================================='

    print(CRAWLING_RESULT_MSG)

def test_push_to_slack():
    push_to_slack("test")


def test_stock_report():
    stock_dic = {}

    stock1 = Stock(name="삼성전자", ticker="005930",
                created_at="2020-11-20", nation="ko",
                alert_percent=50, alert_price_list="78000,80000,85000")

    stock2 = Stock(name="케이엠더블유", ticker="032500",
                created_at="2020-10-12", nation="ko",
                alert_percent=50, alert_price_list="49000,50000,55000,60000")

    stock3 = Stock(name="텔라닥", ticker="TDOC",
                created_at="2019-05-06", nation="us",
                alert_percent=50, alert_price_list="90, 100, 110, 120")

    stock4 = Stock(name="모더나", ticker="MRNA",
                created_at="2020-01-12", nation="us",
                alert_percent=50, alert_price_list="10,20,30,40,50,60,70")

    stock_dic['삼성전자'] = stock1
    stock_dic['케이엠더블유'] = stock2
    stock_dic['텔라닥'] = stock3
    stock_dic['모더나'] = stock4

    old_report = ""
    for stock in stock_dic.values():
        raw_csv_file = "{}{}.csv".format(DIR, stock.ticker)
        calc_csv_file = "{}{}.csv".format(CALC_DIR, stock.ticker)
        old_report += calc_stock_volume(raw_csv_file, calc_csv_file,
                                        stock.ticker, stock.name, stock.nation,
                                        stock.alert_percent, stock.alert_price_list.split(','))

    report = generate_stock_report(stock_dic, "ko")

    print(old_report)
    print("\n -------------------------- \n")    
    print(report)
    

# 테스트할 함수를 여기에서 수정한다.
if __name__ == "__main__":
    test_stock_report()