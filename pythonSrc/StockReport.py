import time

from pythonSrc.Constants import *

def generate_stock_report(stock_dic, nation):
    print("generate stock report for {} stocks, target nation = {}".format(len(stock_dic), nation))
    stock_report = CRAWLING_RESULT_MSG

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
        if stock.today_data is None or stock.today_data.today_close == 0:
            print("{} ticker has no data".format(stock.ticker))
            continue

        if stock.nation == nation:
            stockdiff_dic[stock.name] = round(stock.today_data.today_price_percent, 2)
            if stock.today_data.today_price_percent > 1.0:
                up_count += 1
            elif stock.today_data.today_price_percent < -1.0:
                down_count += 1
            else:
                even_count += 1

    summary += "\n> 상승종목 *{}*, 하락종목 *{}*, 횡보종목 *{}*".format(up_count, down_count, even_count)
    
    sdiff_dic = sorted(stockdiff_dic.items(), reverse=True,
                       key=lambda x: x[1])  # 오름차순 정렬
    top3 = list(sdiff_dic)[:3]
    bottom3 = list(sdiff_dic)[-3:]
    
    summary += "상승률 상위 3종목 - "
    for item in top3:
        summary += "{}(+{}%) ".format(item[0], item[1])

    summary += "\n상승률 하위 3종목 - "
    for item in bottom3:
        summary += "{}({}%) ".format(item[0], item[1])
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
            print("{} ticker has no data".format(stock.ticker))
            continue

        # 5일 값변동 찾기
        price_diff = 0
        for stockstat in stock.time_series:
            if stockstat.day_range == 5:
                price_diff = stockstat.end_price - stockstat.start_price

        if stock.nation == nation:
            stockdiff_dic[stock.name] = round(price_diff, 2)
            if price_diff > 0:
                up_count += 1
            elif price_diff < 0:
                down_count += 1
            else:
                even_count += 1

    sdiff_dic = sorted(stockdiff_dic.items(), reverse=True,
                       key=lambda x: x[1])  # 오름차순 정렬
    top3 = list(sdiff_dic)[:3]
    bottom3 = list(sdiff_dic)[-3:]

    summary += "\n> 상승종목 *{}*, 하락종목 *{}*, 횡보종목 *{}*\n".format(
        up_count, down_count, even_count)

    summary += "상승률 상위 3종목 - "
    for item in top3:
        summary += "{}(+{}) ".format(item[0], item[1])

    summary += "\n상승률 하위 3종목 - "
    for item in bottom3:
        summary += "{}({}) ".format(item[0], item[1])
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