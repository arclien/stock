import constants
import FinanceDataReader as fdr
# from insider import StockInsider
import os


__DIR__ = "./public/data";

stock_list = constants.STOCK_LIST
df_list = [fdr.DataReader(ticker, '2015-01-01') for ticker in stock_list]

if os.path.exists(__DIR__)==False:
  os.mkdir(__DIR__)

length = len(df_list) 
for i in range(length):
  df_list[i].to_csv("{}/{}.csv".format(__DIR__, stock_list[i]))
  # print(df_list[i])


# https://tariat.tistory.com/955
# https://github.com/charlesdong1991/StockInsider
# https://github.com/FinanceData/FinanceDataReader
# https://github.com/sw-yx/gh-action-data-scraping