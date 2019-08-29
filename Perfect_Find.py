from flask import Flask
from apps.cms import bp as cms_bp
from apps.front import bp as front_bp
from apps.common import bp as common_bp
import config
from exts import db, mail, redis_store
from flask_wtf import CSRFProtect



def create_app():
    app = Flask(__name__)
    app.config.from_object(config)
    # 注册蓝本
    app.register_blueprint(cms_bp)
    app.register_blueprint(front_bp)
    app.register_blueprint(common_bp)
    db.init_app(app)
    mail.init_app(app)
    redis_store.init_app(app)
    CSRFProtect(app)
    return app

if __name__ == '__main__':
    app = create_app()
    app.run()

