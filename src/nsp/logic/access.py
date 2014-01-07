from google.appengine.ext import ndb
from nsp.model.project import Project

import common

def filter_project_list_query(user, only_owned):
    if user:
        if only_owned:
            return Project.query(Project.ownerid == user.user_id())
        else:
            return Project.query(ndb.OR(Project.is_public == True, Project.ownerid == user.user_id()))
    else:
        if only_owned:
            return Project.query(False)
        else:
            return Project.query(Project.is_public == True)

def can_view_project(user, project):
    return project and (project.is_public or (user and project.ownerid == user.user_id()))

def can_edit_project(user, project):
    return user and project and project.ownerid == user.user_id()

def can_join_project(user, project):
    return user and project and (project.is_public or project.ownerid == user.user_id())

def can_add_data(user, project):
    return common.is_member(user, project)

def can_view_data(user, project):
    return project.is_public or common.is_member(user, project)

