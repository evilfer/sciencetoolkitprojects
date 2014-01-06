import webapp2
import json

from google.appengine.api import users

from nsp.logic import project_manager, data_manager, subscription_manager, common

class ProjectsApi(webapp2.RequestHandler):

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

        if action == "get":
            project = project_manager.view_project(user, data)
            if project:
                result = {'ok': True, 'project': self.project2dict(user, project, True, data.get('getdata', False))}
            else:
                result = {'ok': False}

        if action == "list":
            only_owned = data.get('filter', '') == 'owned'
            projects = project_manager.list_projects(user, only_owned)
            result_projects = {}
            for project in projects:
                result_projects[project.key.id()] = self.project2dict(user, project)

            result = {'projects': result_projects}

        elif action == "create":
            ok, projectid = project_manager.create_project(user, data)
            result = {'ok': ok, 'id': projectid}
        elif action == "update":
            ok = project_manager.update_project(user, data)
            result = {'ok': ok}
        elif action == "changevisibility":
            ok, is_public = project_manager.change_visibility(user, data)
            result = {'ok': ok, 'is_public': is_public}
        elif action == 'submitprofile':
            ok = project_manager.update_profiles(user, data)
            result = {'ok': ok}
        elif action == "changeprofilevisibility":
            ok = project_manager.change_profile_visibility(user, data)
            result = {'ok': ok}
        elif action == "join" or action == "leave":
            project = project_manager.view_project(user, data)

            if not project:
                ok = False
            elif action == "join":
                ok = subscription_manager.add_subscription(user, project)
            else:
                subscription_manager.remove_subscription(user, project)
                ok = True

            result = {'ok': ok}

        json.dump(result, self.response)


    def project2dict(self, user, project, detailed=False, loaddata=False):
        subscription = common.get_subscription(user, project)
        im_member = bool(subscription)

        result_project = {
                          'id': project.key.id(),
                          'title': project.title,
                          'description': project.description,
                          'is_public': project.is_public,
                          'user_count': project.user_count,
                          'im_member': im_member,
                          'im_owner': user and user.user_id() == project.ownerid
                          }

        if detailed:
            result_project['profiles'] = []
            for profile in project.profiles:
                result_profile = {
                                  'id': profile.id,
                                  'is_active': profile.is_active,
                                  'title': profile.title,
                                  'installed': im_member and profile.id in subscription.profiles,
                                  'inputs': []
                                  }
                for profile_input in profile.inputs:
                    result_input = {
                                    'id': profile_input.id,
                                    'sensor': profile_input.sensor,
                                    'rate': profile_input.rate,
                                    'transformations': []
                                    }
                    for transformation in profile_input.transformations:
                        result_transformation = {
                                                 'id': transformation.id,
                                                 'sourceid': transformation.sourceid,
                                                 'transformation': transformation.transformation,
                                                 'is_displayed': transformation.is_displayed,
                                                 'display_name': transformation.display_name
                                                 }
                        result_input['transformations'].append(result_transformation)

                    result_profile['inputs'].append(result_input)

                result_project['profiles'].append(result_profile)

            if loaddata:
                result_series = {}
                series_list = data_manager.list_project_data(user, project)
                if series_list:
                    for series in series_list:
                        if not series.profileid in result_series:
                            result_series[series.profileid] = []
                        vectors = json.loads(series.data)
                        result_series[series.profileid].append({'userid': series.userid, 'data': vectors})

                result_project['series'] = result_series

        return result_project







