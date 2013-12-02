
from google.appengine.ext import ndb

from nsp.model.project import Project

from nsp.logic import access

def save_project(user, data, is_update):
    if is_update:
        return update_project(user, data)
    else:
        return create_project(user, data)

def create_project(user, data):
    project = Project(ownerid=user.user_id(), title=data['title'], description=data['description'], is_public = data['is_public'])
    project.put()
    return True


def update_project(user, data):
    key = ndb.Key(Project, int(data['id']))
    project = key.get()
    project.title = data['title'];
    project.description = data['description'];
    project.is_public = data['is_public'];
    project.put()
    return True

def list_projects(user, only_owned = False):
    query = access.filter_project_list_query(user, only_owned)
    projects = query.fetch()
    return projects
