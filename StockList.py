from datetime import timedelta, datetime, date
from pytz import timezone
import requests
import json

DATE_FORMAT = "%Y-%m-%d"

TODAY = datetime.now(timezone('Asia/Seoul')).strftime(DATE_FORMAT)

# TRELLO


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

    if method == 'GET':
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

# print(json.dumps(json.loads(get_card_by_id("5f926d587501427b0145742c")), sort_keys=True, indent=4, separators=(",", ": ")))