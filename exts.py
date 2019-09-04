# coding=utf-8
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_redis import FlaskRedis

db = SQLAlchemy()
mail = Mail()
redis_store = FlaskRedis()
