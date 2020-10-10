import constants
import FinanceDataReader as fdr
import os
import csv
import time
from datetime import timedelta, datetime, date

__DIR__ = "./public/data/"
STOCK_LIST = "stock_list.csv"
START_DATE = "2015-01-02"
DATE_FORMAT = "%Y-%m-%d"

# 폴더가 없으면 만든다
if os.path.exists(__DIR__) == False:
  os.mkdir(__DIR__)

f = open(__DIR__ + STOCK_LIST, "r", encoding="utf-8", newline="")
rdr = csv.reader(f)

# stock_list csv를 새롭게 업데이트 하기 위한 list
new_stock_list = [["code","name","nation","user_id","created_at","updated_at","tag_list"]]
# 오늘 날짜로 updated_at 갱신하기 위해 오늘 날짜를 string 형태로 갖고있다
today = date.today().strftime(DATE_FORMAT)

# stock_list(종목 리스트 및 해당 종목 페치 정보, 태그 정보).csv
for i, line in enumerate(rdr):
  # 첫 줄(head) skip
  if i == 0:
    continue

  ###### START 각 종목에 대해 데이터 가져올 날짜 정의

  # 처음 추가된 종목은 created_at(line[4]) 정보가 없다.
  if not line[4]:
    start_date = START_DATE
    # created_at, updated_at을 오늘 날짜로 업데이트
    line[4] = line[5] = today
    new_stock_list.append(line)
  
  # 이전에 추가된 종목은, 처음 추가 될때 created_at을 업데이트 해주며, updated_at + 1에 해당하는 날짜를 받는다
  else:
    start_date = (datetime.strptime(line[5], DATE_FORMAT) + timedelta(days=1)).strftime(DATE_FORMAT)
    # updated_at을 오늘 날짜로 업데이트
    line[5] = today
    new_stock_list.append(line)
  
  ###### END 각 종목에 대해 데이터 가져올 날짜 정의

  ###### START 시작 날짜를 바탕으로 각 종목을 fetch 및 각 종목 csv 파일에 데이터 업데이트

  # start_date 기준으로 line[0](종목코드)에 대한 데이터를 불러옴
  df_list = fdr.DataReader(line[0], start_date)
  csv_file = "{}/{}.csv".format(__DIR__, line[0])
  
  # csv 파일 저장 로직
  if start_date == START_DATE:
    # 종목 코드에 해당하는 csv 파일 생성
    df_list.to_csv(csv_file)
  else:
    # 기존 csv 파일에 append 하기
    with open(csv_file, "a") as csvfile:
      for item in df_list.reset_index().values.tolist():
        item[0] = item[0].strftime(DATE_FORMAT)
        writer = csv.writer(csvfile)
        writer.writerow(item)
  
  ###### END 시작 날짜를 바탕으로 각 종목을 fetch 및 각 종목 csv 파일에 데이터 업데이트
f.close()

# stock_list csv를 새롭게 업데이트
with open(__DIR__ + STOCK_LIST, "w", encoding="utf-8", newline="") as file_write: 
  for item in new_stock_list:
    writer = csv.writer(file_write)
    writer.writerow(item)