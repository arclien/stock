import FinanceDataReader as fdr
import csv

from Constants import *
from Utils import *

# 종목코드 & fetch_start_date 를 바탕으로 stock 정보 fetch 후  raw_csv_file에 append
def fetch_and_generate_stock_csv(raw_csv_file, stock_code, fetch_start_date, nation):
  # fetch_start_date 기준으로 stock_code(종목코드)에 대한 데이터를 불러옴
  if nation == 'ko':
    df_list = fdr.DataReader(stock_code, fetch_start_date)
  elif nation == 'us':
    df_list = fdr.DataReader(stock_code, fetch_start_date, (datetime.strptime(TODAY, DATE_FORMAT) - timedelta(days=1)).strftime(DATE_FORMAT))

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
          writer.writerow([fetch_start_date, 0,0,0,0,0,0])
        # fetch 된 데이터가 있으면 해당 내용 append
        else:
          for item in df_list.reset_index().values.tolist():
            item[0] = item[0].strftime(DATE_FORMAT)
            writer.writerow(item)
  
  ###### END 시작 날짜를 바탕으로 각 종목을 fetch 및 각 종목 csv 파일에 데이터 업데이트
