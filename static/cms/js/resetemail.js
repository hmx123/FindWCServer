$(function () {
    $("#captcha-btn").click(function (event) {
        event.preventDefault();
        var email = $("input[name='email']").val();
        if(!email){
            zlalert.alertInfoToast('请输入邮箱');
        }
        zlajax.get({
           'url': '/cms/email_captcha/',
            'data': {'email':email},
            'success': function (data) {
                if(data['code'] == 200){
                    zlalert.alertSuccessToast('邮件已发送成功！请注意查收！');
                }else{
                    zlalert.alertInfo(data['message']);
                }
            },
            'fail':function (error) {
                zlalert.alertNetworkError();
            }
        });
    });
});


$(function () {
    $("#submit").click(function (event) {
        event.preventDefault();
        var emailE = $("input[name='email']");
        var captcheE = $("input[name='captcha']");

        var email = emailE.val();
        var captcha = captcheE.val();
        if (!email) {
            zlalert.alertInfo('邮箱不能为空');
        }
         if (!captcha) {
            zlalert.alertInfo('验证码不能为空');
        }

        zlajax.post({
            'url': '/cms/resetemail/',
            'data': {'email': email, 'captcha': captcha},
            'success': function (data) {
                if (data['code'] == 200) {
                    emailE.val("");
                    captcheE.val("");
                    zlalert.alertSuccessToast('恭喜！邮箱修改成功');
                } else {
                    zlalert.alertInfo(data['message']);
                }
            },
            'fail': function (error) {
                zlalert.alertNetworkError();
            }
        });
    });
});

$(function () {
    $("#blockaddsubmit").click(function (event) {
        event.preventDefault();
        var nameE = $("input[name='name']");
        var addressE = $("input[name='address']");
        var floor_sumE = $("input[name='floor_sum']");
        var infoE = $("input[name='info']");

        var name = nameE.val();
        var address = addressE.val();
        var floor_sum = floor_sumE.val();
        var info = infoE.val();
        zlajax.post({
            'url': '/cms/block_add/',
            'data': {'name': name, 'address': address, 'floor_sum': floor_sum, 'info': info},
            'success': function (data) {
                if (data['code'] == 200) {
                    nameE.val("");
                    addressE.val("");
                    floor_sumE.val("");
                    infoE.val("");
                    zlalert.alertSuccessToast('恭喜！添加大楼成功');
                } else {
                    zlalert.alertInfo(data['message']);
                }
            },
            'fail': function (error) {
                zlalert.alertNetworkError();
            }
        });
    });
});
//动态添加大楼楼层二级联动
function floornum(value) {
    $("#floors").empty();
    $("#floors").append("<option value>请选择楼层</option>");
    zlajax.post({
        'url': '/cms/floor_sum/',
        'data': {'blockid': value},
        'success': function (data) {
            var floor_sum = parseInt(data.floor_sum);
            var floor_had = data.floor_had;
            var floor_arr=[];
            var target = "";
            for (var i=1;i<=floor_sum;i++){
                //判断楼层是否添加过了
                target = true;
                for (var j=0; j<floor_had.length; j++){
                    if (floor_had[j] == i){
                        target = false;
                        break;
                    }
                }
                if (target){
                    floor_arr.push("<option value="+i+">"+i+"楼</option>");
                }else {
                    floor_arr.push("<option value="+i+" disabled=\"disabled\" >"+i+"楼</option>");
                }
            };
            var floor_str = floor_arr.join();
            $("#floors").append(floor_str);
        }
    })
}
//楼层提交
$(function () {
    $("#flooraddsubmit").click(function (event) {
        event.preventDefault();
        var bidE = $("select[name='bid']");
        var floor_numE = $("select[name='floor_num']");
        //var boynumE = $("select[name='boynum']");
        //var girlnumE = $("select[name='girlnum']");

        var bid = bidE.val();
        var floor_num = floor_numE.val();
        //var boynum = boynumE.val();
        //var girlnum = girlnumE.val();
        zlajax.post({
            'url': '/cms/floor_add/',
            // 'data': {'bid': bid, 'floor_num': floor_num, 'boynum': boynum, 'girlnum': girlnum},
            'data': {'bid': bid, 'floor_num': floor_num},
            'success': function (data) {
                if (data['code'] == 200) {
                    zlalert.alertSuccessToast('恭喜！添加楼层成功');
                    setTimeout(function () {
                        window.location.href="/cms/floor_show/";
                    },1000)

                } else {
                    zlalert.alertInfo(data['message']);
                }
            },
            'fail': function (error) {
                zlalert.alertNetworkError();
            }
        });
    });
});

//新增房间
function addroom() {
    console.log(111111111);
    $("#addroombgc").css("display","block");
    $("#addroom").css("display","block");

}


