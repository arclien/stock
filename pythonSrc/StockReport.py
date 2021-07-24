
from pythonSrc.Constants import *

def generate_stock_report(stock_dic, nation):
    stock_report = CRAWLING_RESULT_MSG

    for stock in stock_dic.values():
        if stock.nation == nation:
            stock_report += stock.name

    return stock_report

def get_link_by_nation(nation, stock_code):
    additional_link = ""

    if nation == 'ko':
        additional_link = '<{}|{}>'.format(
            f'https://finance.naver.com/item/main.nhn?code={stock_code}', '네이버') + f'\n'
        additional_link += f'> ' + '<{}|{}>'.format(
            f'http://comp.fnguide.com/SVO2/ASP/SVD_Main.asp?pGB=1&cID=&MenuYn=Y&ReportGB=&NewMenuID=11&stkGb=701&gicode=A{stock_code}', '에프엔가이드') + f'\n'
        additional_link += f'> ' + '<{}|{}>'.format(
            f'https://m.comp.wisereport.co.kr:44302/CompanyInfo/Summary/{stock_code}', '와이즈에프엔') + f'\n'
    elif nation == 'us':
        additional_link = '<{}|{}>'.format(
            f'https://finance.yahoo.com/quote/{stock_code}', '야후') + f'\n'
        additional_link += f'> ' + \
            '<{}|{}>'.format(
                f'https://finviz.com/quote.ashx?t={stock_code}', 'finviz') + f'\n'

    return additional_link
