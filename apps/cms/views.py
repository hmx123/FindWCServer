import random

from flask import Blueprint, views, render_template, request, session, jsonify, g
from flask import url_for, redirect
from flask_mail import Message

from apps.cms.decorators import login_required
from exts import db, mail
from utils import restful, zlcache
from .forms import LoginForm, ResetpwdForm, ResetEmailForm, BlockForm
from .models import CMSUser, Block, Floor
import config

bp = Blueprint('cms', __name__, url_prefix='/cms')


@bp.route('/')
@login_required
def index():
    return render_template('cms/cms_index.html')

class LoginView(views.MethodView):
    def get(self, message=None):
        return render_template('cms/cms_login.html', message=message)

    def post(self):
        form = LoginForm(request.form)
        if form.validate():
            username = form.username.data
            password = form.password.data
            remember = form.remember.data
            user = CMSUser.query.filter_by(username=username).first()
            if user and user.check_password(password):
                session[config.CMS_USER_ID] = user.id
                if remember:
                    session.permanent = True  # 设置31天过期
                return redirect(url_for('cms.index'))
            else:
                return self.get(message='用户名或密码错误')
        else:
            message = form.errors.popitem()[1][0]
            return self.get(message=message)

# 注销功能
@bp.route('/logout/')
@login_required
def logout():
    del session[config.CMS_USER_ID]
    return redirect(url_for('cms.login'))

# 个人信息
@bp.route('/profile/')
@login_required
def profile():
    return render_template('cms/cms_profile.html')

# 修改密码
class ResetPwdView(views.MethodView):
    decorators = [login_required]
    def get(self):
        return render_template('cms/cms_resetpwd.html')
    def post(self):
        form = ResetpwdForm(request.form)
        if form.validate():
            oldpwd = form.oldpwd.data
            newpwd = form.newpwd.data
            user = g.cms_user
            if user.check_password(oldpwd):
                user.password = newpwd
                db.session.commit()
                return restful.success()
            else:
                return restful.params_error("旧密码错误")
        else:
            return restful.params_error(form.errors.popitem()[1][0])

#修改邮箱
class ResetEmail(views.MethodView):
    decorators = [login_required]
    def get(self):
        return render_template('cms/reset_mail.html')
    def post(self):
        form = ResetEmailForm(request.form)
        if form.validate():
            email = form.email.data
            g.cms_user.email = email
            db.session.commit()
            return restful.success()
        else:
            return restful.params_error(form.errors.popitem()[1][0])

@bp.route('/email_captcha/')
def email_captcha():
    email = request.args.get('email')
    if not email:
        return restful.params_error('请输入要修改的邮箱')

    # 随机取六位作为验证码
    captcha = str(random.randint(000000, 999999))

    # 给这个邮箱发送邮件验证码
    message = Message(subject='修改邮件发送', recipients=[email, ], body='你的验证码是：%s' % captcha)
    try:
        mail.send(message)
    except:
        return restful.server_error()
    zlcache.set(email, captcha)
    print('设置验证码')
    print(captcha)
    return restful.success()

# 大楼展示
@bp.route('/block_show/')
@login_required
def block_show():
    blocks = Block.query.all()
    return render_template('cms/cms_block_show.html', blocks=blocks)

# 新增大楼信息
class BlockAdd(views.MethodView):
    decorators = [login_required]
    def get(self):
        return render_template('cms/cms_block_add.html')
    def post(self):
        form = BlockForm(request.form)
        if form.validate():
            name = form.name.data
            address = form.address.data
            floor_sum = form.floor_sum.data
            info = form.info.data
            blocks = Block(name=name, address=address, floor_sum=floor_sum, info=info)
            db.session.add(blocks)
            db.session.commit()
            return restful.success()
        else:
            return restful.params_error(form.errors.popitem()[1][0])

# 楼层展示
@bp.route('/floor_show/')
def floor_show():
    floors = Floor.query.all()
    return render_template('cms/cms_floor_show.html', floors=floors)

class FloorAdd(views.MethodView):
    decorators = [login_required]
    def get(self):
        return render_template('cms/cms_floor_add.html')
    def post(self):
        pass



bp.add_url_rule('/login/', view_func=LoginView.as_view('login'))
bp.add_url_rule('/resetpwd/', view_func=ResetPwdView.as_view('resetpwd'), strict_slashes=False)
bp.add_url_rule('/resetemail/', view_func=ResetEmail.as_view('resetemail'))
bp.add_url_rule('/block_add/', view_func=BlockAdd.as_view('block_add'))
bp.add_url_rule('/floor_add/', view_func=FloorAdd.as_view('floor_add'))
