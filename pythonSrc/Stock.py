from dataclasses import dataclass

@dataclass
class Stock:
    ticker: str
    name: str
    created_at: str
    nation: str
    alert_percent: int = 50
    alert_price_list: str = ""