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


# 테스트할 함수를 여기에서 수정한다.
if __name__ == "__main__":
    test_stock_volume_calculate()