from dataclasses import dataclass, field
from pythonSrc import Constants

@dataclass
class Stock:
    ticker: str
    name: str
    created_at: str
    nation: str
    alert_percent: int = 50
    alert_prices: str = ""
    alert_price_list: list = field(init=False)
    raw_csv_file: str = field(init=False)
    calc_csv_file: str = field(init=False)

    def __post_init__(self):
        self.alert_price_list = self.alert_prices.split(',')
        self.raw_csv_file = "{}{}.csv".format(DIR, self.ticker),
        self.calc_csv_file = "{}{}.csv".format(CALC_DIR, self.ticker)



@dataclass
class StockStatistics:
    day_range: int
    average_price: float = field(inti=False)
    max_price: float = field(inti=False)
    min_price: float = field(inti=False)
    average_volume: float = field(inti=False)
    max_volume:int = field(inti=False)
    min_price:int = field(inti=False)
@dataclass
class StockData:
    today_close: float
    today_volume: int
    today_price_percent: float = field(inti=False)
    today_volume_percent: float = field(inti=False)
