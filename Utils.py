import os
import csv
import time
from datetime import timedelta, datetime, date
from pytz import timezone

DATE_FORMAT = "%Y-%m-%d"
TODAY = datetime.now(timezone('Asia/Seoul')).strftime(DATE_FORMAT)

# populate all date between two dates
def daterange(start_date, end_date):
  for n in range(int((end_date - start_date).days)+1):
      yield start_date + timedelta(n)

# check today data has been appended
def has_already_appended_today(raw_csv_file):
  has_today_appended = False
  if os.path.exists(raw_csv_file):
    with open(raw_csv_file, "r") as f:
      reader = csv.reader(f)
      for content in enumerate(reader):
        if content[1][0] == TODAY:
          has_today_appended = True
          break
  
  return has_today_appended

def get_increase_percent(origin, target):
  return round(100 - origin/target*100,2)
