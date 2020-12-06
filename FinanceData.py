import os
from datetime import timedelta, datetime
from slacker import Slacker

from pythonSrc.Constants import *
from pythonSrc.StockList import *
from pythonSrc.Utils import *
from pythonSrc.FetchStockData import fetch_and_generate_stock_csv
from pythonSrc.CalculateStockData import calc_stock_volume

# 폴더가 없으면 만든다
if os.path.exists(DIR) == False:
  os.mkdir(DIR)
if os.path.exists(CALC_DIR) == False:
  os.mkdir(CALC_DIR)


my_card_list = get_card_ids()

for cardId in my_card_list:
 
  # cardId에 대한 정보를 trello에서 가져옴
  res = get_card_by_id(cardId)
  card_json = json.loads(res)
  # print(card_json)

  # card desc에서 정보 파싱
  stock_name = ""
  stock_code = ""
  created_at = ""
  nation = ""
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
    else:
      continue

  
  # csv 파일 매핑
  raw_csv_file = "{}{}.csv".format(DIR, stock_code)
  calc_csv_file = "{}{}.csv".format(CALC_DIR, stock_code)

  # csv 파일의 마지막 날짜로부터 다음 fetch start date를 가져옴
  # csv 파일이 없으면 START_DATE
  # csv 파일에 마지막 날짜가 TODAY이면 FALSE를 보내게 했음
  fetch_start_date = get_fetch_start_date(raw_csv_file)
  fetch_end_date = get_fetch_end_date(nation)

  # 이미 fetching을 했으면 fetch_start_date가 False 이다.
  if not fetch_start_date == False:
    fetch_and_generate_stock_csv(raw_csv_file, stock_code, fetch_start_date, fetch_end_date)
  
  if nation == 'ko':
    if CURRENT_TIME == AUTO_CRAWLING_TIME:
      CRAWLING_RESULT_MSG += calc_stock_volume(raw_csv_file, calc_csv_file, stock_code, stock_name)
  elif nation == 'us':
    if CURRENT_TIME == US_CRAWLING_TIME:
      CRAWLING_RESULT_MSG += calc_stock_volume(raw_csv_file, calc_csv_file, stock_code, stock_name)


slack = Slacker(token=SLACK_TOKEN)

CRAWLING_RESULT_MSG += '====================================================='
if CURRENT_TIME == AUTO_CRAWLING_TIME or CURRENT_TIME == US_CRAWLING_TIME:
  slack.chat.post_message(
    channel=SLACK_CHANNEL, 
    username=SLACK_SENDER_NAME,
    text=CRAWLING_RESULT_MSG
  )
  