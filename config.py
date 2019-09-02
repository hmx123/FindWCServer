import os

DEBUG = True
DB_URI = "mysql+pymysql://root:root@127.0.0.1:3306/findwc?charset=utf8"
SQLALCHEMY_DATABASE_URI = DB_URI
SQLALCHEMY_TRACK_MODIFICATIONS =False

SECRET_KEY = os.urandom(24)
CMS_USER_ID = 'abcdefgh'

MAIL_SERVER = 'smtp.126.com'
MAIL_PORT = 25
MAIL_USE_TLS = True
MAIL_DEBUG = False
# MAIL_USE_SSL
MAIL_USERNAME = "menx_mail@126.com"
MAIL_PASSWORD = "hmxmail126"
MAIL_DEFAULT_SENDER = "menx_mail@126.com"
REDIS_URL = "redis://:root@localhost:6379/0"


