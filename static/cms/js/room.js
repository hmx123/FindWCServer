//timerid 的对象
var timerid = {};

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
    var timer_arr = [];
    $("#floors").change(function () {
        //遍历清空原来的计时id
        for(var i=0; i<timer_arr.length; i++){
            clearInterval(timer_arr[i]);
        }
        timer_arr = [];
        var blockid = $("#block").val();
        var fid=$(this).val();
        var tbody = $("tbody");
        //发送请求获取房间信息
        zlajax.post({
        'url': '/cms/roomshowapi/',
        'data': {'bid': blockid, 'fid': fid},
        'success': function (data) {
            var rooms = data.rooms;
            var room_arr=[];
            tbody.empty();
            tbody.append("<tr><th>房间编号</th><th>房间性别</th><th>房间样式</th><th>当前状态</th><th>使用时间</th><th>添加时间</th></tr>");
            for(var i=0; i<rooms.length; i++){
                //根据房间状态选择图标 0男 1女 0蹲 1马 0未使用 1使用
                if (rooms[i].gender){ var gender='女'}else{ var gender='男'}
                if (rooms[i].wctype){ var wctype="../../static/cms/images/ma.png"}else{ var wctype="../../static/cms/images/dun.png"}
                if (rooms[i].status){ var status="lcs_on"}else{ var status="lcs_off"}
                //房间的使用时间
                var use_time = rooms[i].use_time;
                if (!use_time){
                    use_time = '未使用'
                }
                var tr = $("<tr></tr>");
                tr.append("<td class='room_num'>"+rooms[i].room_num+"</td>");
                tr.append("<td>"+gender+"</td>");
                tr.append('<td class="roomstyle"><img src="'+wctype+'"></td>');
                tr.append('<td><div class="lcs_wrap"><input type="checkbox" name="check-3" value="'+ rooms[i].roomid +'" class="lcs_check lcs_tt1" autocomplete="off"><div class="lcs_switch  '+ status +' lcs_checkbox_switch"><div class="lcs_cursor"></div><div class="lcs_label lcs_label_on">ON</div><div class="lcs_label lcs_label_off">OFF</div></div></div></td>');
                tr.append("<td class='useTime'>"+ use_time +"</td>");
                tr.append("<td>"+rooms[i].addtime+"</td>");
                tbody.append(tr);
            }
            //获取当前页面的使用时间 动态+1 并显示
            var useTimes = $(".useTime");
            //获取房间的roomnum
            var roomnums = $(".room_num");
            var usetime = '';
            for(var i=0; i<useTimes.length; i++){
                var Timestr = useTimes[i];
                usetime = Timestr.innerText;
                if (usetime !== '未使用'){
                    var timer = setInterval(setTime, 1000,  Timestr);
                    timerid[roomnums[i].innerText] = timer;
                    timer_arr.push(timer);
                }

            }

        }
        });
    });

});

//时间加1函数
function strAddHandle(strtime){
  var str = strtime.split(":");
  var hour = parseInt(str[0]);
  var minute = parseInt(str[1]);
  var second = parseInt(str[2]);
  second += 1;
  if (second >= 60) {
    minute += 1;
    second = 0;
    if (minute >= 60) {
      hour += 1;
      minute = 0;
    }
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  if (second < 10) {
    second = '0' + second;
  }
  timestr = hour + ":" + minute + ":" + second;
  return timestr;
}
//设置时间函数
function setTime (Timestr) {
    var usetim = Timestr.innerText;
    //判断石头是未使用状态
    if (usetim !== '未使用') {
        usetime = strAddHandle(usetim);
        Timestr.innerText = usetime;
    }
}



$(document).ready(function(e) {
	$('input').lc_switch();
	// triggered each time a field changes status
	$('body').delegate('.lcs_check', 'lcs-statuschange', function() {
		var status = ($(this).is(':checked')) ? 1 : 0;
		var useTime = $(this).parent().parent().next();
		var roomnum = $(this).parent().parent().prev().prev().prev()[0].innerText;
		if (status){
		    //改变为使用状态并开始计时
            useTime[0].innerText = '00:00:00';
            //清空这个房间的计时
            clearInterval(timerid[roomnum]);
            var timer = setInterval(setTime, 1000,  useTime[0]);
            //把新的计时添加到计时对象中
            timerid[roomnum] = timer;
        }else{
		    //改变为未使用 并清空计时
            useTime[0].innerText = '未使用';
            clearInterval(timerid[roomnum]);
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



