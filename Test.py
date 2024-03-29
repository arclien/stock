from pythonSrc.StockReport import *
from FinanceData import *
from pythonSrc.Stock import *
from pythonSrc.Constants import *
from pythonSrc.Utils import *
from pythonSrc.SlackUtils import *
from pythonSrc.CalculateStockData import calc_stock_volume


def test_stock_volume_calculate():
    global CRAWLING_RESULT_MSG
    stock1 = StockInfo(name="삼성전자", ticker="005930",
                       created_at="2020-11-20", nation="ko",
                       alert_percent=50, alert_prices="71000(진바닥),72000(지지1),73000(지지2),74000(지지3),80000,85000")

    CRAWLING_RESULT_MSG += calc_stock_volume(stock1)

    CRAWLING_RESULT_MSG += '====================================================='

    print(CRAWLING_RESULT_MSG)


def test_push_to_slack():
    push_to_slack("test")


def make_stock_dic_from_csv():
    stock_dic = {}
    with open("{}stock_list.csv".format(DIR), "r", encoding='UTF-8') as csvfile:
        for content in list(csv.reader(csvfile)):
            stock = StockInfo(name=content[0], ticker=content[1],
                              created_at=content[2], nation=content[3],
                              alert_percent=int(content[4]), alert_prices=content[5])
            stock_dic[content[0]] = stock
    return stock_dic


def test_new_stock_report():
    stock_dic = make_stock_dic_from_csv()
    report = ""

    # update_all_stock_data(stock_dic)
    generate_stock_alert_message(stock_dic)
    report += generate_new_stock_report(stock_dic, "ko")
    report += generate_stock_summary_report(stock_dic, "ko")

    print(report)


def test_stock_report():
    stock_dic = {}

    stock1 = StockInfo(name="삼성전자", ticker="005930",
                       created_at="2020-11-20", nation="ko",
                       alert_percent=50, alert_prices="78000,80000,85000")

    stock2 = StockInfo(name="케이엠더블유", ticker="032500",
                       created_at="2020-10-12", nation="ko",
                       alert_percent=50, alert_prices="49000,50000,55000,60000")

    stock3 = StockInfo(name="텔라닥", ticker="TDOC",
                       created_at="2019-05-06", nation="us",
                       alert_percent=50, alert_prices="90, 100, 110, 120")

    stock4 = StockInfo(name="모더나", ticker="MRNA",
                       created_at="2020-01-12", nation="us",
                       alert_percent=50, alert_prices="10,20,30,40,50,60,70")

    stock_dic['삼성전자'] = stock1
    stock_dic['케이엠더블유'] = stock2
    stock_dic['텔라닥'] = stock3
    stock_dic['모더나'] = stock4

    # update_all_stock_data(stock_dic)
    report = generate_stock_alert_message(stock_dic)
    report += generate_stock_summary_report(stock_dic, "us")

    print(report)


def test_coin_update_and_report():
    stock_dic = {}
    stock1 = StockInfo(name="비트코인", ticker="BTC",
                       created_at="2020-11-20", nation="coin",
                       alert_percent=50, alert_prices="45000(과거지지선1), 44000(과거지지선2)")

    stock2 = StockInfo(name="SOL", ticker="SOL",
                       created_at="2020-10-12", nation="coin",
                       alert_percent=50, alert_prices="")

    stock3 = StockInfo(name="AAVE", ticker="AAVE",
                       created_at="2019-05-06", nation="coin",
                       alert_percent=50, alert_prices="")

    stock4 = StockInfo(name="폴카닷", ticker="DOT",
                       created_at="2020-01-12", nation="coin",
                       alert_percent=50, alert_prices="")

    stock5 = StockInfo(name="STRK", ticker="STRK",
                       created_at="2020-11-20", nation="coin",
                       alert_percent=50, alert_prices="45000, 44000")

    stock_dic['비트코인'] = stock1
    stock_dic['SOL'] = stock2
    stock_dic['AAVE'] = stock3
    stock_dic['DOT'] = stock4
    stock_dic['STRK'] = stock5

    # update_all_stock_data(stock_dic)
    report = generate_stock_alert_message(stock_dic)
    report += generate_stock_summary_report(stock_dic, "us")

    print(report)


def test_save_stock_list():
    stock_dic = {}

    stock1 = StockInfo(name="삼성전자", ticker="005930",
                       created_at="2020-11-20", nation="ko",
                       alert_percent=50, alert_prices="78000(1차목표),80000,85000")

    stock2 = StockInfo(name="케이엠더블유", ticker="032500",
                       created_at="2020-10-12", nation="ko",
                       alert_percent=50, alert_prices="49000,50000,55000,60000")

    stock3 = StockInfo(name="텔라닥", ticker="TDOC",
                       created_at="2019-05-06", nation="us",
                       alert_percent=50, alert_prices="90, 100(올까?), 110, 120")

    stock4 = StockInfo(name="모더나", ticker="MRNA",
                       created_at="2020-01-12", nation="us",
                       alert_percent=50, alert_prices="10,20,30,40,50,60,70")

    stock5 = StockInfo(name="비트코인", ticker="BTC",
                       created_at="2020-11-20", nation="coin",
                       alert_percent=50, alert_prices="45000(과거지지선1), 44000(과거지지선2)")

    stock6 = StockInfo(name="SOL", ticker="SOL",
                       created_at="2020-10-12", nation="coin",
                       alert_percent=50, alert_prices="")

    stock_dic['삼성전자'] = stock1
    stock_dic['케이엠더블유'] = stock2
    stock_dic['텔라닥'] = stock3
    stock_dic['모더나'] = stock4
    stock_dic['비트코인'] = stock5
    stock_dic['SOL'] = stock6

    save_stock_list(stock_dic)

    with open('stock_list.json', 'r') as json_file:
        print(json.load(json_file))


def test_csv_integrity_check():
    stock_dic = make_stock_dic_from_csv()

    for stock in stock_dic.values():
        if not os.path.exists(stock.raw_csv_file):
            print("{} stock has not csv file".format(stock.name))
            continue

        print("start {}({}) stock csv integrity check".format(stock.name, stock.ticker))
        comp_date = datetime.strptime(START_DATE, DATE_FORMAT)
        with open(stock.raw_csv_file, "r") as f:
            reader = csv.reader(f)
            error_count = 0
            first_error_date = ""
            for content in list(reader):
                if not content or not content[0] == comp_date.strftime(DATE_FORMAT):
                    #print("- {} date is not exist".format(comp_date))
                    if error_count == 0:
                        first_error_date = comp_date
                    error_count += 1

                    while 1:
                        comp_date = comp_date + timedelta(days=1)
                        if content[0] == comp_date.strftime(DATE_FORMAT):
                            break
                        else:
                            error_count += 1

                comp_date = comp_date + timedelta(days=1)

            # 가장 최근 데이터가 있는지 확인
            diff_days = (datetime.strptime(TODAY, DATE_FORMAT) - comp_date)
            if diff_days.days > 0:
                if error_count == 0:
                    first_error_date = comp_date
                error_count += diff_days.days + 1

            if error_count > 0:
                print(" - error count = {}, first_error = {}".format(error_count, first_error_date))
    # print(report)


# 테스트할 함수를 여기에서 수정한다.
if __name__ == "__main__":
    # test_coin_update_and_report()
    test_csv_integrity_check()
    # test_stock_volume_calculate()
