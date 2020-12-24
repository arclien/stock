from pythonSrc.Constants import *
from pythonSrc.Utils import *
from pythonSrc.CalculateStockData import calc_stock_volume

STOCK_CODE = '005930'
ALERT_PRICE = 30

CRAWLING_RESULT_MSG += calc_stock_volume(
  "{}{}.csv".format(DIR, STOCK_CODE),
  "{}{}.csv".format(CALC_DIR, STOCK_CODE),
  STOCK_CODE, 
  'TEST_STOCK_NAME', 
  'ko', 
  ALERT_PRICE,
)

CRAWLING_RESULT_MSG += '====================================================='

print(CRAWLING_RESULT_MSG)