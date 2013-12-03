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

        if action == "list":
            only_owned = data['filter'] == 'owned'
            projects = project_manager.list_projects(user, only_owned)
            result_projects = {}
            for p in projects:
                project_id = p.key.id()
                result_projects[project_id] = {
                                               'id': project_id,
                                               'title': p.title,
                                               'description': p.description,
                                               'is_public': p.is_public,
                                               'user_count': p.user_count,
                                               'im_member': bool(project_manager.get_subscription(user, p)),
                                               'im_owner': user and user.user_id() == p.ownerid,
                                               'profiles': []
                                               }

            result = {'projects': result_projects}

        elif action == "create":
            ok = project_manager.create_project(user, data['project']) if data['project'] else False
            result = {'ok': ok}
        elif action == "update":
            ok = project_manager.update_project(user, data['project']) if data['project'] and data['project']['id'] else False
            result = {'ok': ok}
        elif action == "join" or action == "leave":
            projectid = self.read_project_id()
            project = project_manager.get_project(projectid)

            if not project:
                ok = False
            elif action == "join":
                ok = project_manager.add_subscription(user, project)
            else:
                project_manager.remove_subscription(user, project)
                ok = True

            result = {'ok': ok}

        json.dump(result, self.response)





