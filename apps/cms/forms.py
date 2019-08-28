from flask import g
from wtforms import Form, StringField, IntegerField
from wtforms.validators import InputRequired, EqualTo, Email, Length, ValidationError

from utils import zlcache


class LoginForm(Form):
    password = StringField(validators=[InputRequired(message='请输入密码')])
    username = StringField(validators=[InputRequired(message='请输入用户名')])
    remember = IntegerField()

class ResetpwdForm(Form):
    oldpwd = StringField(validators=[InputRequired(message='请输入旧密码')])
    newpwd = StringField(validators=[InputRequired(message='请输入密码')])
    newpwd2 = StringField(validators=[EqualTo('newpwd', message='两次密码不一致'), InputRequired(message='请再次输入新密码')])

class ResetEmailForm(Form):
    email = StringField(validators=[InputRequired('请输入新邮箱'),Email(message='请输入正确的邮箱')])
    captcha = StringField(validators=[InputRequired('请输入验证码'),Length(min=6, max=6, message='请输入正确的邮箱验证码')])

    # 自定义验证
    def validate_captcha(self, field):
        captcha = field.data
        email = self.email.data
        captcha_cache = zlcache.get(email)
        if not captcha_cache or captcha.lower() != captcha_cache.lower():
            raise ValidationError('邮箱验证码错误！')
    def validate_email(self, field):
        email = field.data
        user = g.cms_user
        if user.email == email:
            raise ValidationError('不能修改为当前使用的邮箱！')


