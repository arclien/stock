import FinanceDataReader as fdr
import csv

from pythonSrc.Constants import *
from pythonSrc.Utils import *

# 종목코드 & fetch_start_date 를 바탕으로 stock 정보 fetch 후  raw_csv_file에 append
def fetch_and_generate_stock_csv(raw_csv_file, stock_code, nation, fetch_start_date, fetch_end_date):
  try:
    # fetch_start_date 기준으로 stock_code(종목코드)에 대한 데이터를 불러옴
    if nation == 'coin':
      stock_code = stock_code + "/USD"
    df_list = fdr.DataReader(stock_code, fetch_start_date, fetch_end_date)
  except ValueError as ex:
    print("ValueError: {}, {} is not correct ticker".format(stock_code, nation))
    print("  => " + str(ex))
  except KeyError as ex:
    print("KeyError: {}, {} is not correct ticker".format(stock_code, nation))
    print("  => " + str(ex))
  else:  
    with open(raw_csv_file, "a") as csvfile:
      writer = csv.writer(csvfile)
      # csv 파일 저장 로직

      for single_date in daterange(datetime.strptime(fetch_start_date, DATE_FORMAT), datetime.strptime(fetch_end_date, DATE_FORMAT)):
        _today = single_date.strftime(DATE_FORMAT)
        
        has_data = False
        for item in df_list.reset_index().values.tolist():
          item[0] = item[0].strftime(DATE_FORMAT)
          if item[0] == _today:
            if nation == 'ko':
              # date, open, hight, low, close, volume, change
              writer.writerow(item)
            elif nation == 'us':
              # date, close, open, high, low, volume, change
              writer.writerow([item[0], item[2], item[3], item[4], item[1], item[5], item[6]])
            elif nation == 'coin':
              # date, close, open, high, low, volume, change
              writer.writerow([item[0], item[2], item[3], item[4], item[1], item[5], item[6]])
            has_data = True
            break
        if has_data == False:
          writer.writerow([_today, 0,0,0,0,0,0])