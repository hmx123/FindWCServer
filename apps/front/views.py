# coding=utf-8
from flask import Blueprint, jsonify

from apps.cms.models import Room, Floor

bp = Blueprint('front', __name__, url_prefix='/front')




@bp.route('/')
def index():
    gender = 0
    data = []
    floors = Floor.query.order_by(Floor.bid).order_by(Floor.floor_num).all()
    for floor in floors:
        floor_num = floor.floor_num
        rooms = Room.query.filter_by(fid=floor.id, gender=gender).order_by(Room.room_num).all()
        seats = []
        for room in rooms:
            seats.append({
                'type': room.wctype, 'human': room.status
            })
        dic = {
            'floor': floor_num, 'seats': seats
        }
        data.append(dic)
    return jsonify(data)

# 返回json数据


