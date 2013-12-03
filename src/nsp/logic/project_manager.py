
from google.appengine.ext import ndb

from nsp.model.project import Project
from nsp.model.subscription import Subscription
from nsp.model.profile import DataLoggingProfile
from nsp.model.profile import SensorInput

from nsp.logic import access

def get_project(projectid):
    key = ndb.Key(Project, projectid)
    project = key.get()

    return project

def create_project(user, data):
    project = Project(ownerid=user.user_id(), user_count=1)
    _data2project(data, project)
    project.put()

    add_subscription(user, project, False)

    return True


def update_project(user, data):
    project = get_project(data['id'])

    if access.can_edit_project(user, project):
        _data2project(data, project)
        update_project_user_count(project, False)
        project.put()
        return True
    else:
        return False

def _data2project(data, project):
    project.title = data['title']
    project.description = data.get('description', '')
    project.is_public = data.get('is_public', False)

    profiles = []

    profiles_data = data.get('profiles', [])
    for profile_key in profiles_data:
        profile_data = profiles_data[profile_key]
        inputs = []
        inputs_data = profile_data.get('inputs', [])
        for input_key in inputs_data:
            input_data = inputs_data[input_key]
            title = input_data.get('sensor', '')
            rate = _read_float(input_data, 'rate')
            inputs.append(SensorInput(sensor=title, rate=rate))

        title = profile_data.get('title', '')
        profiles.append(DataLoggingProfile(title=title, inputs=inputs))


    project.profiles = profiles

def _read_float(data, key, default_value=.0):
    try:
        return float(data.get(key, default_value))
    except ValueError:
        return default_value

def list_projects(user, only_owned=False):
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
        count = Subscription.query(Subscription.projectid == project.key.id()).count()
        project.user_count = count
        if put:
            project.put()

