from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask.ext.redis import FlaskRedis

db = SQLAlchemy()
mail = Mail()
redis_store = FlaskRedis()
