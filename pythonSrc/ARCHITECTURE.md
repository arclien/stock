### Architecture (refactored)
- 종목에 대한 정보를 하나의 Dictionary에 다 모아둔다.
- 각 종목에 대한 정보를 업데이트하고, 필요한 정보들을 계산하여 다른 Dictionary에 업데이트 한다.
- 2개의 Dictionary를 바탕으로 alert_message를 작성한다.
- 종목이라는 dataclass를 선언해서 써 볼 예정.

### Architecture (before)

FinanceData.py
- my_card_list : 트렐로에서 가져온 모든 카드 id의 목록을 가지고 있는 변수
- 카드 목록의 id를 바탕으로 트렐로에서 정보를 가져온다.
- fetch_and_generate_stock_csv를 호출
- calc_stock_volume 함수를 부른다.


CalculateStockData.py
- calc_stock_volume 에서 csv에 계산된 데이터를 추가한다. (차후 사용할 수도 있어서)
- alert_message를 만들어 낸다.

FetchStockData.py
- raw csv에 가격데이터를 갱신한다.


### TODO
- _여기다가 쓰면 안될 것 같지만_
- FinanceDataReader에서 전체 종목 리스팅이 가능하다.
- 이걸로 장 overview를 만들어봐야겠다.