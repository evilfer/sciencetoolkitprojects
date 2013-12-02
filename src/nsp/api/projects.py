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
                result_projects[project_id] = {'id': project_id, 'title': p.title, 'description': p.description, 'is_public': p.is_public}

            result = {'projects': result_projects}


        elif action == "create" or action == "update":
            is_update = action == "update"
            valid, data = self.read_project_params(is_update)
            ok = project_manager.save_project(user, data, is_update) if valid else False
            result = {'ok': ok}

        json.dump(result, self.response)


    def read_project_params(self, get_id = False):
        params = {}

        params['id'] = self.request.get("id", None) if get_id else None
        params['title'] = self.request.get("title",  "")
        params['description'] = self.request.get("description", "")
        params['is_public'] = self.request.get("is_public", "") == 'true'


        valid = (not get_id or params['id']) and params['title']

        return valid, params


