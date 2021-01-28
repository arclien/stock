from pythonSrc.Constants import *
from pythonSrc.Utils import *
from pythonSrc.CalculateStockData import calc_stock_volume

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
