import webapp2
import json

from google.appengine.api import users


class LoginApi(webapp2.RequestHandler):

    def get(self):
        self.response.headers['Content-Type'] = 'application/json'
        result = None

        user = users.get_current_user()

        if user:
            result = {'login': True, 'nickname': user.nickname(), 'link': users.create_logout_url("/")}
        else:
            result = {'login': False, 'link': users.create_login_url("/")}

        json.dump(result, self.response)

