import FinanceDataReader as fdr
# from insider import StockInsider
import os



tiker_list = ['005930', '066570', '005490', '000720'] 
df_list = [fdr.DataReader(ticker, '2020-01-01') for ticker in tiker_list]

if os.path.exists("./data")==False:
  os.mkdir("./data")


length = len(df_list) 
for i in range(length):
  df_list[i].to_csv("./data/{}.csv".format(tiker_list[i]))


# https://tariat.tistory.com/955
# https://github.com/charlesdong1991/StockInsider
# https://github.com/FinanceData/FinanceDataReader
