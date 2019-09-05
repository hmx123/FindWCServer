# coding=utf-8
from flask import Blueprint, jsonify, request

from apps.cms.models import Room, Floor

bp = Blueprint('front', __name__, url_prefix='/front')


'''
[
      {
        "floor": "01",
         "seats": [
           { "type": 1, "human": 1, "timet": "00:59:00" }, { "type": 1, "human": 0 }, { "type": 1, "human": 0 }, { "type": 1, "human": 1, "timet": "00:01:54" }
           ]
      },
      {
        "floor": "02",
        "seats": [
          { "type": 1, "human": 0 }, { "type": 1, "human": 0 }, { "type": 1, "human": 0 }, { "type": 1, "human": 1, "timet": "00:14:32"}
        ]
      }
]
'''

@bp.route('/')
def index():
    gender = request.args.get('gender')
    if gender == 'boy':
        sex = 0
    elif gender == 'girl':
        sex = 1
    else:
        return
    data = []
    floors = Floor.query.order_by(Floor.bid).order_by(Floor.floor_num).all()
    for floor in floors:
        floor_num = floor.floor_num
        floor_num = '%02d' % floor_num
        rooms = Room.query.filter_by(fid=floor.id, gender=sex).all()
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


