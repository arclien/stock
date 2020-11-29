import requests
import json

from Constants import *

# TRELLO
TRELLO_KEY =  os.getenv('REACT_APP_TRELLO_API_KEY') 
TRELLO_TOKEN =  os.getenv('REACT_APP_TRELLO_TOKEN')
TRELLO_API_END =  'https://api.trello.com'
TRELLO_BOARD_STUDY_ID =  os.getenv('REACT_APP_TRELLO_BOARD_STUDY_ID')

AUTH_QUERY = {
   'key': TRELLO_KEY,
   'token': TRELLO_TOKEN
}

HEADERS = {
   "Accept": "application/json"
}

def req(method, path, query = {}, data={}):
    url = TRELLO_API_END + path
    query.update(AUTH_QUERY)
    # print('HTTP Method: %s' % method)
    # print('Request URL: %s' % url)
    # print('Headers: %s' % headers)
    # print('QueryString: %s' % query)

    if method == 'GET' or  method == 'PUT':
        return requests.request(method, url, headers=HEADERS, params=query)
    else:
        return requests.post(url, headers=HEADERS, data=data)


# print("response status:\n%d" % resp.status_code)
# print("response headers:\n%s" % resp.headers)
# print("response body:\n%s" % resp.text)


def batch_req(urls):
  PATH = "/1/batch"
  resp = req('GET', PATH, urls)
  return resp.text


################ Get  board

def get_my_boards():
  PATH = "/1/members/me/boards"
  resp = req('GET', PATH)
  return resp.text



################ Get from board

def get_lists_on_board(boardId = TRELLO_BOARD_STUDY_ID, filter = 'all'):
  PATH = "/1/boards/{}/lists/{}".format(boardId, filter)
  resp = req('GET', PATH)
  return resp.text

def get_cards_on_board(boardId = TRELLO_BOARD_STUDY_ID, filter = 'all'):
  PATH = "/1/boards/{}/cards/{}".format(boardId, filter)
  resp = req('GET', PATH)
  return resp.text

def get_card_on_board_by_id(boardId = TRELLO_BOARD_STUDY_ID, cardId = ''):
  if cardId == '':
    return False
  PATH = "/1/boards/{}/cards/{}".format(boardId, cardId)
  resp = req('GET', PATH)
  return resp.text

def get_labels_on_board(boardId = TRELLO_BOARD_STUDY_ID):
  PATH = "/1/boards/{}/labels".format(boardId)
  resp = req('GET', PATH)
  return resp.text





################ Get by id

def get_list_by_id(listId):
  PATH = "/1/lists/{}".format(listId)
  resp = req('GET', PATH)
  return resp.text

def get_card_by_id(cardId):
  PATH = "/1/cards/{}".format(cardId)
  resp = req('GET', PATH)
  return resp.text

def put_card_by_id(cardId, cardData):
  PATH = "/1/cards/{}".format(cardId)
  resp = req('PUT', PATH, cardData)
  return resp.text







def get_card_ids():
  res = get_cards_on_board()
  return [o['id'] for o in json.loads(res)] 


# my_card_list = get_card_ids()

# for cardId in my_card_list:
#   res = get_card_by_id(cardId)
#   card_json = json.loads(res)
#   if card_json['due'] and card_json['due'].split("T")[0] != TODAY:
#     print(card_json['due'].split("T")[0])

#   if card_json['desc'] != '':
#     print(json.loads(card_json["desc"]))
