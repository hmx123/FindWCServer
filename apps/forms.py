from wtforms import Form

class BaseForm(Form):
    def get_error(self):
        message = self.error.popitem()[1][0]
        return message
