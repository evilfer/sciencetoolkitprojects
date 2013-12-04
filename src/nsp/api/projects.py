import webapp2
import json
import simplejson

from google.appengine.api import users

from nsp.logic import project_manager

class ProjectsApi(webapp2.RequestHandler):

    def get(self):
        data = self.request.GET
        self.process_request("get", data)

    def post(self):
        data = simplejson.loads(self.request.body)
        self.process_request("post", data)


    def process_request(self, method, data):
        self.response.headers['Content-Type'] = 'application/json'
        result = None

        user = users.get_current_user()

        action = data['action']

        if action == "get":
            project = project_manager.view_project(user, data)
            if project:
                result = {'ok': True, 'project': self.project2dict(user, project, True)}
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
            ok, projectid = project_manager.create_project(user, data['project']) if data['project'] else False
            result = {'ok': ok, 'id': projectid}
        elif action == "update":
            ok = project_manager.update_project(user, data['project']) if data['project'] and data['project']['id'] else False
            result = {'ok': ok}
        elif action == "join" or action == "leave":
            project = project_manager.view_project(user, data)

            if not project:
                ok = False
            elif action == "join":
                ok = project_manager.add_subscription(user, project)
            else:
                project_manager.remove_subscription(user, project)
                ok = True

            result = {'ok': ok}

        json.dump(result, self.response)


    def project2dict(self, user, project, detailed=False):
        result_project = {
                          'id': project.key.id(),
                          'title': project.title,
                          'description': project.description,
                          'is_public': project.is_public,
                          'user_count': project.user_count,
                          'im_member': bool(project_manager.get_subscription(user, project)),
                          'im_owner': user and user.user_id() == project.ownerid
                          }

        if detailed:
            result_project['profiles'] = []
            for profile in project.profiles:
                result_profile = {'id': profile.id, 'title': profile.title, 'inputs': []}
                for profile_input in profile.inputs:
                    result_input = {'id': profile_input.id, 'sensor': profile_input.sensor, 'rate': profile_input.rate}
                    result_profile['inputs'].append(result_input)

                result_project['profiles'].append(result_profile)

        return result_project







