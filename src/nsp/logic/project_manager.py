
from google.appengine.ext import ndb

from nsp.model.project import Project
from nsp.model.subscription import Subscription

from nsp.logic import access

def get_project(projectid):
    key = ndb.Key(Project, projectid)
    project = key.get()

    return project

def save_project(user, data, is_update):
    if is_update:
        return update_project(user, data)
    else:
        return create_project(user, data)

def create_project(user, data):
    project = Project(ownerid=user.user_id(), title=data['title'], description=data['description'], is_public = data['is_public'], user_count=1)
    project.put()
    add_subscription(user, project, False)
    return True


def update_project(user, data):
    project = get_project(data['id'])

    if access.can_edit_project(user, project):
        project.title = data['title'];
        project.description = data['description'];
        project.is_public = data['is_public'];
        project.put()
        return True
    else:
        return False

def list_projects(user, only_owned = False):
    query = access.filter_project_list_query(user, only_owned)
    projects = query.fetch()
    return projects

def get_subscription(user, project):
    if user and project:
        query = Subscription.query(ndb.AND(Subscription.userid == user.user_id(), Subscription.projectid == project.key.id()))
        return query.get()
    else:
        return None

def add_subscription(user, project, update_user_count=True):
    if access.can_join_project(user, project) and not get_subscription(user, project):
        subscription = Subscription(userid=user.user_id(), projectid=project.key.id())
        subscription.put()

        if update_user_count:
            update_project_user_count(project)

        return True
    else:
        return False

def remove_subscription(user, project):
    subscription_keys = Subscription.query(ndb.AND(Subscription.userid == user.user_id(), Subscription.projectid == project.key.id())).fetch(keys_only=True)
    ndb.delete_multi(subscription_keys)
    update_project_user_count(project, True)

def update_project_user_count(project, put=True):
    if project:
        count = Subscription.query(Subscription.projectid==project.key.id()).count()
        project.user_count = count
        if put:
            project.put()

