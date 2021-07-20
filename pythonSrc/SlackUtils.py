from slacker import Slacker
from pythonSrc.Constants import *

slack = Slacker(token=SLACK_TOKEN)

def push_to_slack(msg):
    slack.chat.post_message(
        channel=SLACK_CHANNEL,
        username=SLACK_SENDER_NAME,
        text=CRAWLING_RESULT_MSG
    )
