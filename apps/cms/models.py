from exts import db
from datetime import datetime


class CMSUser(db.Model):
    __tablename__ = 'cms_user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50),nullable=True)
    password = db.Column(db.String(100),nullable=True)
    email = db.Column(db.String(50), nullable=True)
    join_time = db.Column(db.DATETIME, default=datetime.now)


