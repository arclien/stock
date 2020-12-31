import pandas as pd
import math
import os
import csv

from pythonSrc.Constants import *
from pythonSrc.Utils import *

def calc_stock_volume(raw_csv_file, calc_csv_file, stock_code, stock_name, nation, alert_percent):
  if os.path.exists(raw_csv_file):
    
    # 새로운 종목의 경우 파일 만들고, headaer 생성
    if os.path.exists(calc_csv_file) == False:
      set_csv_header(calc_csv_file)

    row_count = get_csv_row_count(raw_csv_file)
    # 공휴일을 제외하고 VOLUME_CALC_LENGTH일 의 데이터를 가져오기 위해 csv에서 2배수로 데이터를 읽는다.
    df = pd.read_csv(
                  raw_csv_file, 
                  names=["Date","Open","High","Low","Close","Volume","Change"], 
                  skiprows = row_count - VOLUME_CALC_LENGTH[0]*2
                )
    
    # 마지막 날짜(오늘)에 대한 데이터를 캐싱해둠
    df_today = df.tail(1)
    df_today_volume = df_today.iloc[0]['Volume']
    df_today_price = df_today.iloc[0]['Close']
    
    # 오늘 날짜를 제외( 평균에서 오늘 값을 제외하기 위해서 )
    df = df[:-1]
    
    # 주식시장이 열리지 않는 날은 값이 0 이므로, 해당 값이 있을 경우 drop 하고, VOLUME_CALC_LENGTH 만큼의 최신 데이터를 가져온다.
    # 데이터 자체가, 열리지 않는 날의 값을 모두 0으로 갖고있게 되므로, 평균 계산시 영향을 끼치게 된다.
    df = df[~(df[["Open","High","Low","Close","Volume"]] == 0).any(axis=1)]

    # 전날 데이터와 비교를 위해서 캐싱( 오늘이 월요일이면, 지난주 금요일로( 0의 날짜를 모두 제거 했기 때문 ))
    df_prev_day = df.tail(1)
    
    calculated_row = ([TODAY])
    alarm_message = ""
    
    for day in VOLUME_CALC_LENGTH:
      df = df.tail(day)
      alarm_message += calculate(day, df, calculated_row, df_today_volume, df_today_price, alert_percent)


    # 파일에 데이터 추가
    with open(calc_csv_file, "a") as csvfile:
      writer = csv.writer(csvfile)
      writer.writerow(calculated_row)


    if alarm_message:
      main_link = f'> ' + '<{}|{}>'.format(f'https://arclien.github.io/stock/code/{stock_code}',f'{stock_name}:{stock_code}') + f'\n'
      additional_link = get_link_by_nation(nation, stock_code)
      diff_symbol = "+" if df_today_price > df_prev_day.iloc[0]["Close"] else "-"
      return f'{main_link}' + f'> `{TODAY} 거래량: {df_today_volume} / 가격: {df_today_price} ({diff_symbol}{get_diff_percent(df_prev_day.iloc[0]["Close"], df_today_price)}%)`\n' + alarm_message +  f'> {additional_link}\n\n'
    else:
      return alarm_message

  
# 새로운 종목의 경우, 새로운 csv 파일 생성 후 header 추가
def set_csv_header(csv_file):
  with open(csv_file, "a") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(STOCK_CALC_LIST_HEADER)

# csv 파일을 가져와서 총 length를 계산
def get_csv_row_count(csv_file):
  with open(csv_file, "r") as f:
    reader = csv.reader(f)
    return len(list(reader))

def calculate(day, df, calculated_row, df_today_volume, df_today_price, alert_percent):
  inner_alarm_message = ""
  _max_price = math.ceil(df.describe().loc['max']['Close'])
  _max_volume = math.ceil(df.describe().loc['max']['Volume'])
  _mean_volume = math.ceil(df.describe().loc['mean']['Volume'])
  calculated_row.append(_max_volume)
  calculated_row.append(math.ceil(df.describe().loc['min']['Volume']))
  calculated_row.append(_mean_volume)
  
  # dataframe 정렬 by volume
  df_sorted = df.sort_values(['Volume'],ascending=True)
  # volume 기준 상/하위 5% row 지움
  df_sorted.drop(df_sorted.tail( math.ceil(len(df) * 0.05) ).index,  inplace = True)
  df_sorted.drop(df_sorted.head( math.ceil(len(df) * 0.05) ).index,  inplace = True)
  # adjusted_mean
  _adjusted_mean = math.ceil(df_sorted.describe().loc['mean']['Volume'])
  calculated_row.append(_adjusted_mean)

  
  # 최근 3일 평균을 구해야 하는데, volume이 있는 날( 주식시장 개장일 )만 평균 3일 체크
  if not df_today_volume == 0:
    diff_percent = get_diff_percent(_mean_volume, df_today_volume)
    diff_text = "가" if df_today_volume > _mean_volume else "감소"
    if diff_percent >= alert_percent:
      inner_alarm_message += f'> {day}일 평균 대비 {diff_percent}% {diff_text} / '
    
    diff_percent = get_diff_percent(_adjusted_mean, df_today_volume)
    diff_text = "증가" if df_today_volume > _adjusted_mean else "감소"
    if diff_percent >= alert_percent:
      if inner_alarm_message != "":
        inner_alarm_message += f'조정 평균 대비 {diff_percent}% {diff_text} / '
      else:
        inner_alarm_message += f'> {day}일 조정 평균 대비 {diff_percent}% {diff_text} / '
      
    if df_today_volume > _max_volume:
      if inner_alarm_message != "":
        inner_alarm_message += f'최대 거래량 갱신 {df_today_volume}'
      else:
        inner_alarm_message += f'> {day}일 최대 거래량 갱신 {df_today_volume}'

    if inner_alarm_message:
      inner_alarm_message += '\n'


  if df_today_price > _max_price:
    diff_percent = get_diff_percent(_max_price, df_today_price)
    inner_alarm_message += f'> {day}일 최대 가격 {diff_percent}% 갱신 {_max_price} => {df_today_price} \n'
  
  return inner_alarm_message

def get_link_by_nation(nation, stock_code):
  additional_link = ""
  
  if nation == 'ko':
    additional_link = '<{}|{}>'.format(f'https://finance.naver.com/item/main.nhn?code={stock_code}','네이버') + f'\n'
    additional_link += f'> ' +'<{}|{}>'.format(f'http://comp.fnguide.com/SVO2/ASP/SVD_Main.asp?pGB=1&cID=&MenuYn=Y&ReportGB=&NewMenuID=11&stkGb=701&gicode=A{stock_code}','에프엔가이드') + f'\n'
    additional_link += f'> ' +'<{}|{}>'.format(f'https://m.comp.wisereport.co.kr:44302/CompanyInfo/Summary/{stock_code}','와이즈에프엔') + f'\n'
  elif nation == 'us':
    additional_link = '<{}|{}>'.format(f'https://finance.yahoo.com/quote/{stock_code}','야후') + f'\n'
    additional_link += f'> ' +'<{}|{}>'.format(f'https://finviz.com/quote.ashx?t={stock_code}','finviz') + f'\n'
  
  return additional_link
