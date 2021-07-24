### Architecture (refactored)
- 종목에 대한 정보를 하나의 Dictionary에 다 모아둔다.
- 각 종목에 대한 정보를 업데이트하고, 필요한 정보들을 계산하여 다른 Dictionary에 업데이트 한다.
- 2개의 Dictionary를 바탕으로 alert_message를 작성한다.

- 종목이라는 dataclass를 선언해서 써 볼 예정.



### Architecture (before)

FinanceData.py
- my_card_list : 트렐로에서 가져온 모든 카드 id의 목록을 가지고 있는 변수
- 카드 목록의 id를 바탕으로 트렐로에서 정보를 가져온다.
- csv에서 가격 및 미리 계산되었던 데이터를 가져온다.
- calc_stock_volume 함수를 부른다.


CalculateStockData.py
- calc_stock_volume 에서 csv에 데이터를 추가한다.
- alert_message를 만들어 낸다.