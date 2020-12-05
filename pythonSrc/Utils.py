import os
import csv
from datetime import timedelta

from pythonSrc.Constants import *

# populate all date between two dates
def daterange(start_date, end_date):
  for n in range(int((end_date - start_date).days)+1):
      yield start_date + timedelta(n)

# check today data has been appended
def has_already_appended_today(raw_csv_file, nation):
  has_today_appended = False
  if os.path.exists(raw_csv_file):
    with open(raw_csv_file, "r") as f:
      reader = csv.reader(f)
      for content in enumerate(reader):
        if nation == 'ko':
          if content[1][0] == TODAY:
            has_today_appended = True
            break
        elif nation == 'us':
          if content[1][0] == (datetime.strptime(TODAY, DATE_FORMAT) - timedelta(days=1)).strftime(DATE_FORMAT):
            has_today_appended = True
            break
  
  return has_today_appended

def get_increase_percent(origin, target):
  return round(100 - origin/target*100,2)
