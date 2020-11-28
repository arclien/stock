import os
from datetime import timedelta, datetime
from slacker import Slacker

from Constants import *
from StockList import *
from Utils import *
from FetchStockData import fetch_and_generate_stock_csv
from CalculateStockData import calc_stock_volume

# 폴더가 없으면 만든다
if os.path.exists(DIR) == False:
  os.mkdir(DIR)
if os.path.exists(CALC_DIR) == False:
  os.mkdir(CALC_DIR)


my_card_list = get_card_ids()

for cardId in my_card_list:
  res = get_card_by_id(cardId)
  card_json = json.loads(res)
  
  stock_name = ""
  stock_code = ""
  created_at = ""
  nation = ""
  last_fetched_date = ""

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

  if card_json['due']:
    last_fetched_date = card_json['due'].split("T")[0]
  else:
    continue
 
  # 처음 추가된 종목은 due date(last_fetched_date) 정보가 없다.
  if not created_at:
    fetch_start_date = START_DATE
    if CURRENT_TIME == AUTO_CRAWLING_TIME:
      # created_at, updated_at을 오늘 날짜로 업데이트
      created_at = last_fetched_date = TODAY
    else:
      created_at = TODAY
   

  # 이전에 추가된 종목은, 처음 추가 될때 created_at을 업데이트 해주며, updated_at + 1에 해당하는 날짜를 받는다
  else:
    if not last_fetched_date:
      if nation == 'ko':
        fetch_start_date = TODAY
      elif nation == 'us':
        fetch_start_date = (datetime.strptime(TODAY, DATE_FORMAT)  - timedelta(days=1)).strftime(DATE_FORMAT)
    else:
      if nation == 'ko':
        fetch_start_date = (datetime.strptime(last_fetched_date, DATE_FORMAT) + timedelta(days=1)).strftime(DATE_FORMAT)
      elif nation == 'us':
        fetch_start_date = datetime.strptime(last_fetched_date, DATE_FORMAT)

    if CURRENT_TIME == AUTO_CRAWLING_TIME:
      # updated_at을 오늘 날짜로 업데이트
      last_fetched_date = TODAY
    
  ###### END 각 종목에 대해 데이터 가져올 날짜 정의


  ###### START 시작 날짜를 바탕으로 각 종목을 fetch 및 각 종목 csv 파일에 데이터 업데이트
  raw_csv_file = "{}/{}.csv".format(DIR, stock_code)
  calc_csv_file = "{}/{}.csv".format(CALC_DIR, stock_code)
  # 이미 한번 오늘 날짜에 해당하는 데이터를 추가했으면(crawled) 해당 csv 파일은 업데이트 하지 않는다 
  if has_already_appended_today(raw_csv_file) == True:
    continue
  # 이미 한번 오늘 날짜에 해당하는 데이터를 추가했으면(crawled) 해당 csv 파일은 업데이트 하지 않는다   

  fetch_and_generate_stock_csv(raw_csv_file, stock_code, fetch_start_date)


  if CURRENT_TIME == AUTO_CRAWLING_TIME:
    CRAWLING_RESULT_MSG += calc_stock_volume(raw_csv_file, calc_csv_file, stock_code, stock_name)



slack = Slacker(token=SLACK_TOKEN)

CRAWLING_RESULT_MSG += '====================================================='
if CURRENT_TIME == AUTO_CRAWLING_TIME:
  slack.chat.post_message(
            channel=SLACK_CHANNEL, 
            username=SLACK_SENDER_NAME,
            text=CRAWLING_RESULT_MSG
          )