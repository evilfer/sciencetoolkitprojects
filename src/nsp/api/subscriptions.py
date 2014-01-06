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

        if action == "test":
            result = {'test': True, 'youare': user.email() if user else False}

        if action == "myprofiles":
            if user:
                subscriptions = subscription_manager.user_subscriptions(user)
                result = {'ok': True, 'projects': {}}
                for subscription in subscriptions:
                    if subscription.profiles and len(subscription.profiles) > 0:
                        project = common.load_project_id(subscription.projectid)
                        result['projects'][subscription.projectid] = {}
                        for profileid in subscription.profiles:
                            profile = common.get_profile(project, profileid)
                            if profile:
                                result['projects'][subscription.projectid][profileid] = self.profile_to_dict(profile)
            else:
                result = {'ok': False}

        if action == "join":
            ok = project and subscription_manager.add_subscription(user, project)
            result = {'ok': ok, 'im_member': ok}

        elif action == "leave":
            if project:
                subscription_manager.remove_subscription(user, project)
                result = {'ok': True, 'im_member': False}
            else:
                result = {'ok': False, 'im_member': False}

        elif action == "addprofile" or action == "removeprofile":
            if project:
                profileid = common.read_int(data, 'profileid', -1)
                if action == "addprofile":
                    ok, installed = subscription_manager.add_profile(user, project, profileid)
                else:
                    ok, installed = subscription_manager.remove_profile(user, project, profileid)
            else:
                ok = False
                profileid = -1
                installed = False

            result = {'ok': ok, 'profileid': profileid, 'installed': installed}


        json.dump(result, self.response)

    def profile_to_dict(self, profile):
        profile_result = {'id': profile.id, 'title': profile.title, 'series_count': profile.series_count, 'inputs': {}}
        for profile_input in profile.inputs:
            profile_result['inputs'][profile_input.id] = {'id': profile_input.id, 'sensor': profile_input.sensor, 'rate': profile_input.rate}
        return profile_result
