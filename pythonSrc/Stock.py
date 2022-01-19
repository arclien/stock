import re
import json
from dataclasses import dataclass, field

from pythonSrc.Constants import *
#from Constants import *

def is_number(str):
    try:
        temp = float(str.strip())
        return True
    except ValueError:
        return False

@dataclass
class StockStatistics:
    # 특정 day_range안에서의 min/max/avg를 계산한 값을 넣어두는 데이터 클래스
    day_range: int
    max_price: float #= field(init=False)
    average_price: float #= field(init=False)    
    min_price: float #= field(init=False)
    max_volume: int #= field(init=False)    
    average_volume: float #= field(init=False)    
    min_volume: int #= field(init=False)
    adjust_average_volume: float #= field(init=False)
    start_price: float
    end_price: float
@dataclass
class StockData:
    open: float
    close: float
    volume: int
    high: float
    low: float
    price_percent: float = field(init=False)

    def __post_init__(self):
        self.price_percent = 0 if self.open <= 0 else (self.close - self.open) / self.open * 100

@dataclass
class StockInfo:
    ticker: str
    name: str
    created_at: str
    nation: str
    alert_percent: int = 50
    alert_prices: str = ""
    alert_price_list: list = field(init=False)
    raw_csv_file: str = field(init=False)
    calc_csv_file: str = field(init=False)
    today_data: StockData = field(init=False)
    prev_data: StockData = field(init=False)
    time_series: list = field(init=False)

    def __post_init__(self):
        #self.alert_price_list = self.alert_prices.split(',')
        split = re.findall("(\d+\.*\d*)+\s*(\([^)]*\))*", self.alert_prices)
        self.alert_price_list = [(float(elem[0].strip()), elem[1]) for index, elem in enumerate(split) if is_number(elem[0])] 
        #self.alert_price_list = [float(e) if e.strip().isdigit() else 0 for e in self.alert_prices.split(',')]
        self.raw_csv_file = "{}{}.csv".format(DIR, self.ticker)
        self.calc_csv_file = "{}{}.csv".format(CALC_DIR, self.ticker)
        self.today_data = StockData(0, 0, 0, 0, 0)
        self.prev_data = StockData(0, 0, 0, 0, 0)
        self.time_series = []

    def toDictObject(self):
        obj_fields = {}
        obj_fields["ticker"] = self.ticker
        obj_fields["name"] = self.name
        obj_fields["created_at"] = self.created_at
        obj_fields["nation"] = self.nation
        obj_fields["alert_percent"] = self.alert_percent
        obj_fields["alert_prices"] = self.alert_prices
        return obj_fields

    def fromDictObject(self, dictObj):
        self.ticker = dictObj["ticker"] 
        self.name = dictObj["name"]
        self.created_at = dictObj["created_at"]
        self.nation = dictObj["nation"]
        self.alert_percent = dictObj["alert_percent"]
        self.alert_prices = dictObj["alert_prices"]

def save_stock_list(stock_dic):
    print("save stock list, count={}".format(len(stock_dic)))

    stock_dic_for_json = {}
    for stock_name, stock_info in stock_dic.items():
        stock_dic_for_json[stock_name] = stock_info.toDictObject()


    with open('stock_list.json', 'w') as json_file:
        json.dump(stock_dic_for_json, json_file, indent=4)

if __name__ == "__main__":
    stock1 = StockInfo(name="삼성전자", ticker="005930",
                created_at="2020-11-20", nation="ko",
                alert_percent=50, alert_prices="78000,80000,85000")
