import re
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
        self.today_data = StockData(0, 0, 0)
        self.prev_data = StockData(0, 0, 0)
        self.time_series = []


if __name__ == "__main__":
    stock1 = StockInfo(name="삼성전자", ticker="005930",
                created_at="2020-11-20", nation="ko",
                alert_percent=50, alert_prices="78000,80000,85000")
