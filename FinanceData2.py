import FinanceDataReader as fdr
import pandas as pd
import numpy as np
import math
import os
import csv
import time
from datetime import timedelta, datetime, date
from pytz import timezone
from slacker import Slacker

from StockList import *
from Utils import *

__DIR__ = "./public/data/"
__CALC_DIR__ = "./public/data/calculate/"
STOCK_LIST = "stock_list.csv"
STOCK_LIST_HEADER = ["code","name","nation","user_id","created_at","updated_at","tag_list"]
START_DATE = "2015-01-02"
AUTO_CRAWLING_TIME = "22"
VOLUME_CALC_LENGTH = [180,90,60,30]
VOLUME_ALARM_PERCENT_THRESHOLD = 10
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
slack = Slacker(token=SLACK_TOKEN)


# 종목코드 & fetch_start_date 를 바탕으로 stock 정보 fetch 후  raw_csv_file에 append
def fetch_and_generate_stock_csv(raw_csv_file, stock_code, fetch_start_date):
  # fetch_start_date 기준으로 stock_code(종목코드)에 대한 데이터를 불러옴
  df_list = fdr.DataReader(stock_code, fetch_start_date)

  if not CURRENT_TIME == AUTO_CRAWLING_TIME:
    df_list = df_list[:-1]
    
  with open(raw_csv_file, "a") as csvfile:
    writer = csv.writer(csvfile)
    # csv 파일 저장 로직
    if fetch_start_date == START_DATE:
      # 종목 코드에 해당하는 csv 파일 생성

      # TODO n^2 퍼포먼스. 개선하기
      for single_date in daterange(datetime.strptime(START_DATE, DATE_FORMAT), datetime.strptime(TODAY, DATE_FORMAT)):
        _today = single_date.strftime(DATE_FORMAT)
        if not CURRENT_TIME == AUTO_CRAWLING_TIME:
          if _today == TODAY:
            continue
       
        has_data = False
        for item in df_list.reset_index().values.tolist():
          item[0] = item[0].strftime(DATE_FORMAT)
          if item[0] == _today:
            writer.writerow(item)
            has_data = True
            break
        if has_data == False:
          writer.writerow([_today, 0,0,0,0,0,0])
      
    else:
      if CURRENT_TIME == AUTO_CRAWLING_TIME:
        # 기존 csv 파일에 append 하기
        # 공휴일 등으로 주식시장 데이터가 없을 경우, 해당 날짜에 대한 row를 강제로 csv에 추가
        if len(df_list) == 0:
          writer.writerow([TODAY, 0,0,0,0,0,0])
        # fetch 된 데이터가 있으면 해당 내용 append
        else:
          for item in df_list.reset_index().values.tolist():
            item[0] = item[0].strftime(DATE_FORMAT)
            writer.writerow(item)
  
  ###### END 시작 날짜를 바탕으로 각 종목을 fetch 및 각 종목 csv 파일에 데이터 업데이트

def calc_stock_volume(raw_csv_file, calc_csv_file, stock_code, stock_name):
  if os.path.exists(raw_csv_file):
    
    # 새로운 종목의 경우 파일 만들고, headaer 생성
    if os.path.exists(calc_csv_file) == False:
      temp_row = ['date','max_180','min_180','mean_180','adjusted_mean_180','max_90','min_90','mean_90','adjusted_mean_90','max_60','min_60','mean_60','adjusted_mean_60','max_30','min_30','mean_30','adjusted_mean_30']
      with open(calc_csv_file, "a") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(temp_row)
    
    temp_row=[]

    with open(raw_csv_file, "r") as f:
      reader = csv.reader(f)
      data = list(reader)
      row_count = len(data)
    # 공휴일을 제외하고 VOLUME_CALC_LENGTH일 의 데이터를 가져오기 위해 csv에서 2배수로 데이터를 읽는다.
    df = pd.read_csv(raw_csv_file, names=["Date","Open","High","Low","Close","Volume","Change"], skiprows = row_count - VOLUME_CALC_LENGTH[0]*2)
    df_today = df.tail(1)
    df_today_volume = df_today.iloc[0]['Volume']
    df_today_price = df_today.iloc[0]['Close']
    # 오늘 날짜를 제외
    df = df[:-1]
    
    # 주식시장이 열리지 않는 날은 값이 0 이므로, 해당 값이 있을 경우 drop 하고, VOLUME_CALC_LENGTH 만큼의 최신 데이터를 가져온다.
    df = df[~(df[["Open","High","Low","Close","Volume"]] == 0).any(axis=1)]
    df_prev_day = df.tail(1)
    
    temp_row = ([TODAY])
  
    alarm_message = ""
    for day in VOLUME_CALC_LENGTH:
      df = df.tail(day)
      
      _max_price = math.ceil(df.describe().loc['max']['Close'])
      _max_volume = math.ceil(df.describe().loc['max']['Volume'])
      _mean_volume = math.ceil(df.describe().loc['mean']['Volume'])
      temp_row.append(_max_volume)
      temp_row.append(math.ceil(df.describe().loc['min']['Volume']))
      temp_row.append(_mean_volume)
      
      df_len = len(df)
      # dataframe 정렬 by volume
      df_sorted = df.sort_values(['Volume'],ascending=True)
      # volume 기준 상/하위 5% row 지움
      df_sorted.drop(df_sorted.tail( math.ceil(df_len * 0.05) ).index,  inplace = True)
      df_sorted.drop(df_sorted.head( math.ceil(df_len * 0.05) ).index,  inplace = True)
      # adjusted_mean
      _adjusted_mean = math.ceil(df_sorted.describe().loc['mean']['Volume'])
      temp_row.append(_adjusted_mean)

      
      # 최근 3일 평균을 구해야 하는데, volume이 있는 날( 주식시장 개장일 )만 평균 3일 체크
      if not df_today_volume == 0:
        if df_today_volume > _mean_volume:
          increase_percent = get_increase_percent(_mean_volume, df_today_volume)
          if increase_percent >= VOLUME_ALARM_PERCENT_THRESHOLD:
            alarm_message += f'> {day}일         평균 거래량 {_mean_volume} < 오늘 거래량 {df_today_volume} ({increase_percent}% 증가)\n'
        if df_today_volume > _adjusted_mean:
          increase_percent = get_increase_percent(_adjusted_mean, df_today_volume)
          if increase_percent >= VOLUME_ALARM_PERCENT_THRESHOLD:
            alarm_message += f'> {day}일 조정 평균 거래량 {_adjusted_mean} < 오늘 거래량 {df_today_volume} ({increase_percent}% 증가)\n'

      if df_today_volume > _max_volume:
        alarm_message += f'> {day}일 최대 거래량 갱신 {_max_volume} ===> {df_today_volume} \n'

      if df_today_price > _max_price:
        alarm_message += f'> {day}일 최대 가격 갱신 {_max_price} ===> {df_today_price} \n'
      

    # 파일에 데이터 추가
    with open(calc_csv_file, "a") as csvfile:
      writer = csv.writer(csvfile)
      writer.writerow(temp_row)


    if alarm_message:
      main_link = f'> ' + '<{}|{}>'.format(f'https://arclien.github.io/stock/code/{stock_code}',f'{stock_name}:{stock_code}') + f'\n'
      additional_link = '<{}|{}>'.format(f'https://finance.naver.com/item/main.nhn?code={stock_code}','네이버') + f'\n'
      additional_link += f'> ' +'<{}|{}>'.format(f'http://comp.fnguide.com/SVO2/ASP/SVD_Main.asp?pGB=1&cID=&MenuYn=Y&ReportGB=&NewMenuID=11&stkGb=701&gicode=A{stock_code}','에프엔가이드') + f'\n'
      additional_link += f'> ' +'<{}|{}>'.format(f'https://m.comp.wisereport.co.kr:44302/CompanyInfo/Summary/{stock_code}','와이즈에프엔') + f'\n'

      return f'{main_link}' + alarm_message + f'> `{TODAY} 거래량: {df_today_volume} / 가격: {df_today_price} ({get_increase_percent(df_prev_day.iloc[0]["Close"], df_today_price)}%)`\n' + f'> {additional_link}\n\n'
    else:
      return alarm_message

  

# 폴더가 없으면 만든다
if os.path.exists(__DIR__) == False:
  os.mkdir(__DIR__)
if os.path.exists(__CALC_DIR__) == False:
  os.mkdir(__CALC_DIR__)





my_card_list = get_card_ids()

for cardId in my_card_list:
  res = get_card_by_id(cardId)
  card_json = json.loads(res)
  
  stock_code = ""
  created_at = ""
  nation = ""
  last_fetched_date = ""

  if card_json['desc'] != '':
    if 'code' in json.loads(card_json["desc"]):
      stock_code = json.loads(card_json["desc"])['code']
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
  raw_csv_file = "{}/{}.csv".format(__DIR__, stock_code)
  calc_csv_file = "{}/{}.csv".format(__CALC_DIR__, stock_code)
  # 이미 한번 오늘 날짜에 해당하는 데이터를 추가했으면(crawled) 해당 csv 파일은 업데이트 하지 않는다 
  if has_already_appended_today(raw_csv_file) == True:
    continue
  # 이미 한번 오늘 날짜에 해당하는 데이터를 추가했으면(crawled) 해당 csv 파일은 업데이트 하지 않는다   

  fetch_and_generate_stock_csv(raw_csv_file, stock_code, fetch_start_date)
