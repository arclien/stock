import time

from pythonSrc.Constants import *

def generate_stock_report(stock_dic, nation):
    stock_report = CRAWLING_RESULT_MSG

    if time.localtime().tm_wday == 5 and nation == "ko":
        stock_report += generate_weekly_summary(stock_dic, nation)
    elif time.localtime().tm_wday == 6 and nation == "us":
        stock_report += generate_weekly_summary(stock_dic, nation)
    else:
        stock_report += generate_daily_summary(stock_dic, nation)
    
    return stock_report


def generate_daily_summary(stock_dic, nation):
    summary = "\n===== daily summary ====="
    up_count = 0
    even_count = 0
    down_count = 0

    for stock in stock_dic.values():
        if stock.today_data is None:
            print("{} ticker has no data".format(stock.ticker))
            continue

        if stock.nation == nation:
            if stock.today_data.today_price_percent > 1.0:
                up_count += 1
            elif stock.today_data.today_price_percent < -1.0:
                down_count += 1
            else:
                even_count += 1

    summary += "\n> 상승종목 {}, 하락종목 {}, 횡보종목 {}".format(up_count, down_count, even_count)
    return summary

def generate_weekly_summary(stock_dic, nation):
    summary = "\n===== weekly summary ====="
    up_count = 0
    even_count = 0
    down_count = 0

    for stock in stock_dic.values():
        if stock.today_data is None:
            print("{} ticker has no data".format(stock.ticker))
            continue

        if stock.nation == nation:
            if stock.today_data.today_price_percent > 1.0:
                up_count += 1
            elif stock.today_data.today_price_percent < -1.0:
                down_count += 1
            else:
                even_count += 1

    summary += "\n> 상승종목 {}, 하락종목 {}, 횡보종목 {}".format(up_count, down_count, even_count)
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

    return additional_link
