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


cardId = '5fc1e176bcca5807d04d087c'
res = get_card_by_id(cardId)
card_json = json.loads(res)
# print(card_json)

stock_name = ""
stock_code = ""
created_at = ""
nation = ""
due_date = ""
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


if 'due' in card_json:
  if card_json['due']:
    due_date = card_json['due'].split("T")[0]


if not due_date:
  fetch_start_date = START_DATE
  due_date = TODAY
  # 첫 크롤링은 무조건 데이터를 fetch하기 때문에 due date를 업데이트
  put_card_by_id(cardId, {'due': (datetime.strptime(due_date, DATE_FORMAT) - timedelta(days=1)).strftime(DATE_FORMAT)})
else:
  fetch_start_date = datetime.strptime(due_date, DATE_FORMAT)
  due_date = (datetime.strptime(due_date, DATE_FORMAT) + timedelta(days=1)).strftime(DATE_FORMAT)
  if nation == 'ko':
    fetch_start_date = due_date
  elif nation == 'us':
    fetch_start_date = fetch_start_date
    # 미국 주식은 항상 하루 늦게 가져오기 때문에, fetch_start_date = (미국장은 오늘 기준(12월2일)으로 due_date(어제날짜))(12월1일)

###### END 각 종목에 대해 데이터 가져올 날짜 정의


###### START 시작 날짜를 바탕으로 각 종목을 fetch 및 각 종목 csv 파일에 데이터 업데이트
raw_csv_file = "{}/{}.csv".format(DIR, stock_code)
calc_csv_file = "{}/{}.csv".format(CALC_DIR, stock_code)

fetch_and_generate_stock_csv(raw_csv_file, stock_code, fetch_start_date, nation)

if CURRENT_TIME == AUTO_CRAWLING_TIME:
  put_card_by_id(cardId, {'due': due_date})

if CURRENT_TIME == AUTO_CRAWLING_TIME:
  CRAWLING_RESULT_MSG += calc_stock_volume(raw_csv_file, calc_csv_file, stock_code, stock_name)
