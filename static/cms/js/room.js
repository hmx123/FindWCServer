//动态添加大楼楼层二级联动
function floornum(value) {
    $("#floors").empty();
    $("#floors").append("<option value>请选择楼层</option>");
    zlajax.post({
        'url': '/cms/floor_had/',
        'data': {'blockid': value},
        'success': function (data) {
            var floor_sum = data.floor_had;
            var floor_arr=[];
            for (var i=0;i<floor_sum.length;i++){
                floor_arr.push("<option value="+floor_sum[i][1]+">"+floor_sum[i][0]+"楼</option>");
            }
            var floor_str = floor_arr.join();
            $("#floors").append(floor_str);
        }
    })
}
//房间显示三级联动
$(document).ready(function(){
    $("#floors").change(function () {
        var blockid = $("#block").val();
        var fid=$(this).val();
        //发送请求获取房间信息
        zlajax.post({
        'url': '/cms/roomshowapi/',
        'data': {'bid': blockid, 'fid': fid},
        'success': function (data) {
            var rooms = data.rooms;
            var room_arr=[];
            var tbody = $("tbody");
            tbody.empty();
            tbody.append("<tr><th>房间编号</th><th>房间性别</th><th>房间样式</th><th>当前状态</th><th>使用时间</th><th>添加时间</th></tr>");
            for(var i=0; i<rooms.length; i++){
                //根据房间状态选择图标 0男 1女 0蹲 1马 0未使用 1使用
                if (rooms[i].gender){ var gender='女'}else{ var gender='男'}
                if (rooms[i].wctype){ var wctype="../../static/cms/images/ma.png"}else{ var wctype="../../static/cms/images/dun.png"}
                if (rooms[i].status){ var status="lcs_on"}else{ var status="lcs_off"}
                var tr = $("<tr></tr>");
                tr.append("<td>"+rooms[i].room_num+"</td>");
                tr.append("<td>"+gender+"</td>");
                tr.append('<td class="roomstyle"><img src="'+wctype+'"></td>');
                tr.append('<td><div class="lcs_wrap"><input type="checkbox" name="check-3" value="'+ rooms[i].roomid +'" class="lcs_check lcs_tt1" autocomplete="off"><div class="lcs_switch  '+ status +' lcs_checkbox_switch"><div class="lcs_cursor"></div><div class="lcs_label lcs_label_on">ON</div><div class="lcs_label lcs_label_off">OFF</div></div></div></td>');
                tr.append("<td>00:00:00</td>");
                tr.append("<td>"+rooms[i].addtime+"</td>");
                tbody.append(tr);
            }
        }
    })
    });
});


$(document).ready(function(e) {
	$('input').lc_switch();
	// triggered each time a field changes status
	$('body').delegate('.lcs_check', 'lcs-statuschange', function() {
		var status = ($(this).is(':checked')) ? 1 : 0;
		if (status){

        }
		//发送请求更改房间状态
        var roomid = $(this).val();
		zlajax.post({
            'url': '/cms/changestatu/',
            'data': {'roomid': roomid, 'status': status},
            'success': function (data) {

            },
            'fail': function () {
                zlalert.alertNetworkError();
            }
        })
	});
});

