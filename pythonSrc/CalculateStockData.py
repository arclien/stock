import pandas as pd
import math
import os
import csv

from pythonSrc.Constants import *
from pythonSrc.Utils import *

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

  