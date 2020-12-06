import os
import csv
from datetime import timedelta

from pythonSrc.Constants import *

# populate all date between two dates
def daterange(start_date, end_date):
  for n in range(int((end_date - start_date).days)+1):
      yield start_date + timedelta(n)

# 해당 종목에 대한 csv 파일이 있으면 (마지막 날짜+1)을 가져오고( 이미 오늘 날짜가 있으면 FALSE 리턴 ), 아니면 START_DATE
def get_fetch_start_date(raw_csv_file):
  fetch_start_date = START_DATE
  if os.path.exists(raw_csv_file):
    with open(raw_csv_file, "r") as f:
      # reader = csv.reader(f)
      for content in reversed(list(csv.reader(f))):
        if content[0] == TODAY:
          fetch_start_date = False
          break
        else:
          fetch_start_date = (datetime.strptime(content[0], DATE_FORMAT) + timedelta(days=1)).strftime(DATE_FORMAT)
          break
    return fetch_start_date
  else:
    return fetch_start_date        


# KO 처음( csv 파일 없으면 )
# 	4시이면
# 		Fetch :2015-01-02 - Today
# 	4시가 아니면
# 		Fetch : 2015-01-02 - (Today -1)

# KO ( csv 파일 있으면 )
# 	4시이면
# 		Fetch : (마지막 날짜 + 1) - Today
# 	4시가 아니면
# 		Fetch : (마지막 날짜 + 1 ) - (Today -1)

# US 처음( csv 파일 없으면 )
# 	아침 9 시 이면
# 		Fetch :2015-01-02 - (Today - 1)
# 	아침 9 시가 아니면
# 		Fetch : 2015-01-02 - (Today -1)

# US ( csv 파일 있으면 )
# 	아침 9 시 이면
# 		Fetch : (마지막 날짜 + 1) - (Today - 1)
# 	아침 9 시가 아니면
# 		Fetch : (마지막 날짜 + 1 ) - (Today -1)
def get_fetch_end_date(nation):
  prev_date = (datetime.strptime(TODAY, DATE_FORMAT) - timedelta(days=1)).strftime(DATE_FORMAT)
  if nation == 'ko':
    if CURRENT_TIME == AUTO_CRAWLING_TIME:
      return TODAY
    else:
      return prev_date
  elif nation == 'us':
    if CURRENT_TIME == US_CRAWLING_TIME:
      return prev_date
    else:
      return prev_date


def get_increase_percent(origin, target):
  return round(100 - origin/target*100,2)
