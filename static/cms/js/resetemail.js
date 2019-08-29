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
