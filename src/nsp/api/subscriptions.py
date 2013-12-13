import webapp2
import json

from google.appengine.api import users

from nsp.logic import common, subscription_manager

class SubscriptionsApi(webapp2.RequestHandler):

    def get(self):
        data = self.request.GET
        self.process_request("get", data)

    def post(self):
        data = json.loads(self.request.body)
        self.process_request("post", data)


    def process_request(self, method, data):
        self.response.headers['Content-Type'] = 'application/json'
        result = None

        user = users.get_current_user()

        action = data['action']
        project = common.load_project(data, 'id')

        if project:
            if action == "join":
                ok = subscription_manager.add_subscription(user, project)
                result = {'ok': ok, 'im_member': ok}
            elif action == "leave":
                subscription_manager.remove_subscription(user, project)
                result = {'ok': True, 'im_member': False}
            elif action == "addprofile" or action == "removeprofile":
                profileid = common.read_int(data, 'profileid', -1)
                if action == "addprofile":
                    ok, installed = subscription_manager.add_profile(user, project, profileid)
                else:
                    ok, installed = subscription_manager.remove_profile(user, project, profileid)
                result = {'ok': ok, 'profileid': profileid, 'installed': installed}


        json.dump(result, self.response)

