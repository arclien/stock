import os
from datetime import timedelta, datetime, date
from pytz import timezone

DIR = "./public/data/"
CALC_DIR = "./public/data/calculate/"
STOCK_LIST = "stock_list.csv"
STOCK_LIST_HEADER = ["code","name","nation","user_id","created_at","updated_at","tag_list"]
START_DATE = "2015-01-02"
AUTO_CRAWLING_TIME = "16"
US_CRAWLING_TIME = "07"
VOLUME_CALC_LENGTH = [180,90,60,30]
DATE_FORMAT = "%Y-%m-%d"
# stock_list csv를 새롭게 업데이트 하기 위한 list
new_stock_list = [STOCK_LIST_HEADER]
# 오늘 날짜로 updated_at 갱신하기 위해 오늘 날짜를 string 형태로 갖고있다
TODAY = datetime.now(timezone('Asia/Seoul')).strftime(DATE_FORMAT)
# 16시에 git action으로 자동으로 크롤링이 돌 때에만, stock_list.csv update_at을 올려주기 위해.
# 그 외의 시간에 updated_at을 업데이트 하면, 오후 4시에 장이 마감 후 데이터 받을 수 없는 경우가 생긴다.( updated_at이 TODAY가 아닐 경우에만 stock data fetch 하기 떄문)
CURRENT_TIME = datetime.now(timezone('Asia/Seoul')).strftime("%H")

CRAWLING_RESULT_MSG = f'{datetime.now()}\n크롤러 결과============================================\n\n'

# 슬랙 생성
SLACK_TOKEN =  os.getenv('SLACK_BOT_TOKEN')
SLACK_CHANNEL = 'noti_stock_volume_calculate'
SLACK_SENDER_NAME = 'StockCrawler'