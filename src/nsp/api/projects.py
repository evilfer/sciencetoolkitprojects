import webapp2
import json

from google.appengine.api import users

from nsp.logic import project_manager

class ProjectsApi(webapp2.RequestHandler):

    def get(self):
        self.process_request("get")

    def post(self):
        self.process_request("post")


    def process_request(self, method):
        self.response.headers['Content-Type'] = 'application/json'
        result = None

        user = users.get_current_user()

        action = self.request.get("action", "")

        if action == "list":
            only_owned = self.request.get("filter", None) == 'owned'
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
                                               'im_owner': user and user.user_id() == p.ownerid
                                               }

            result = {'projects': result_projects}


        elif action == "create" or action == "update":
            is_update = action == "update"
            valid, data = self.read_project_params(is_update)
            ok = project_manager.save_project(user, data, is_update) if valid else False
            result = {'ok': ok}
        elif action == "join" or action == "leave":
            projectid = self.read_project_id()
            project = project_manager.get_project(projectid)


            if action == "join":
                result = {'ok': project_manager.add_subscription(user, project)}
            else:
                project_manager.remove_subscription(user, project)
                result = {'ok': True}

        json.dump(result, self.response)


    def read_project_params(self, get_id=False):
        params = {}

        params['id'] = self.read_project_id() if get_id else None
        params['title'] = self.request.get("title", "")
        params['description'] = self.request.get("description", "")
        params['is_public'] = self.request.get("is_public", "") == 'true'


        valid = (not get_id or params['id']) and params['title']

        return valid, params

    def read_project_id(self):
        return int(self.request.get("id", None))


