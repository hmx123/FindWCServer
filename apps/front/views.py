# coding=utf-8


from flask import Blueprint, jsonify
from utils import restful, zlcache
from apps.cms.models import Room, Floor

bp = Blueprint('front', __name__, url_prefix='/front')




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
        rooms = Room.query.filter_by(fid=floor.id, gender=gender).order_by(Room.room_num).all()
        seats = []
        for room in rooms:
            if room.status == 1:
                # 获取房间编号 使用时的时间戳
                timestamp = int(zlcache.get(room.room_num))
                now_tamp = int(time.time())
                time_diff = now_tamp - timestamp
                m, s = divmod(time_diff, 60)
                h, m = divmod(m, 60)
                timestr = "%02d:%02d:%02d" % (h, m, s)
                seats.append({
                    'type': room.wctype, 'human': room.status, 'timet': timestr
                })
            else:
                seats.append({
                    'type': room.wctype, 'human': room.status
                })
        dic = {
            'floor': floor_num, 'seats': seats
        }
        data.append(dic)
    return jsonify(data)

# 返回json数据


