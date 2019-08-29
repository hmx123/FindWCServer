from exts import db
from datetime import datetime
from werkzeug.security import generate_password_hash,check_password_hash


class CMSUser(db.Model):
    __tablename__ = 'cms_user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50),nullable=True)
    _password = db.Column(db.String(100),nullable=True)
    email = db.Column(db.String(50), nullable=True)
    join_time = db.Column(db.DATETIME, default=datetime.now)

    def __init__(self, username, password, email):
        self.username = username
        self.password = password
        self.email = email

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, rew_password):
        self._password = generate_password_hash(rew_password)

    def check_password(self, rew_password):
        result = check_password_hash(self.password, rew_password)
        return result

# 大楼
class Block(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(64), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    addtime = db.Column(db.DATETIME, default=datetime.now)
    info = db.Column(db.String(255))
    floor_sum = db.Column(db.Integer)

# 楼层
class Floor(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    bid = db.Column(db.Integer, nullable=True)
    floor_num = db.Column(db.Integer, nullable=True)
    boy_num = db.Column(db.Integer, default=0)
    girl_num = db.Column(db.Integer, default=0)
    addtime = db.Column(db.DATETIME, default=datetime.now)

    def block(self):
        block = Block.query.get(self.bid)
        return block

# 单个房间
class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fid = db.Column(db.Integer)
    bid = db.Column(db.Integer)
    room_num = db.Column(db.String(50))
    gender = db.Column(db.Integer, default=0)
    status = db.Column(db.Integer, default=0)
    addtime = db.Column(db.DATETIME, default=datetime.now)

    def block(self):
        block = Block.query.get(self.bid)
        return block

    def floor(self):
        floo = Floor.query.get(self.fid)
        return floo

