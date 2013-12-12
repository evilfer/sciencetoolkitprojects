
from google.appengine.ext import ndb

from nsp.model.project import Project
from nsp.model.subscription import Subscription
from nsp.model.profile import DataLoggingProfile
from nsp.model.profile import SensorInput
from nsp.model.profile import Transformation

from nsp.logic import access

def _get_project(projectid):
    key = ndb.Key(Project, projectid)
    project = key.get()

    return project

def view_project(user, data):
    project = _get_project(_read_int(data, 'id', 0))
    if access.can_view_project(user, project):
        return project
    else:
        return None


def create_project(user, data):
    if 'metadata' in data:
        project = Project(ownerid=user.user_id(), user_count=1, is_public=False, profiles=[])
        _metadata2project(data['metadata'], project)
        project.put()
        add_subscription(user, project, False)
        return True, project.key.id()
    else:
        return False, 0


def update_project(user, data):
    project = _get_project(_read_int(data, 'id', 0))

    if access.can_edit_project(user, project) and 'metadata' in data:
        _metadata2project(data['metadata'], project)
        update_project_user_count(project, False)
        project.put()
        return True
    else:
        return False

def change_visibility(user, data):
    project = _get_project(_read_int(data, 'id', 0))
    if access.can_edit_project(user, project) and 'is_public' in data:
        project.is_public = _read_bool(data, 'is_public', False)
        update_project_user_count(project, False)
        project.put()
        return True, project.is_public
    else:
        return False, False

def update_profiles(user, data):
    project = _get_project(_read_int(data, 'id', 0))
    if access.can_edit_project(user, project) and 'profile' in data:
        profile_data = data['profile']
        profileId = _read_int(profile_data, 'id', -1)

        profile_to_update = None

        if profileId < 0:
            return False

        for profile in project.profiles:
            if profile.id == profileId:
                if profile.is_active:
                    return False
                else :
                    profile_to_update = profile
                    break

        if not profile_to_update:
            profile_to_update = DataLoggingProfile(id = profileId, is_active = False, series_count = 0)
            project.profiles.append(profile_to_update)


        if profile_to_update:
            print profile_data
            _data2profile(profile_data, profile_to_update)
            print profile_to_update
            print project
            project.put()
            return True
        else:
            return False

    else:
        return False

def change_profile_visibility(user, data):
    project = _get_project(_read_int(data, 'id', 0))
    if access.can_edit_project(user, project) and 'profile_id' in data:
        profileId = _read_int(data, 'profile_id', -1)
        active = _read_bool(data, 'is_active', False)

        for profile in project.profiles:
            if profile.id == profileId:
                profile.is_active = active
                project.put()
                return True

    return False

def _data2profile(profile_data, profile):
    profile.title = profile_data.get('title', '')
    profile.inputs = []
    for input_data in profile_data.get('inputs', []):
        input_id = _read_int(input_data, 'id', 0)
        sensor = input_data.get('sensor', '')
        rate = _read_float(input_data, 'rate')
        sensor_input = SensorInput(id=input_id, sensor=sensor, rate=rate, transformations=[])
        for transformation_data in input_data.get('transformations', []):
            t_id = _read_int(transformation_data, 'id', 0);
            source_id = _read_int(transformation_data, 'sourceid', 0);
            t_code = transformation_data.get('transformation', '')
            is_displayed = _read_bool(transformation_data, 'is_displayed')
            display_name = transformation_data.get('display_name', '')
            transformation = Transformation(id=t_id, source_id=source_id, transformation=t_code, is_displayed=is_displayed, display_name=display_name)

            sensor_input.transformations.append(transformation)

        profile.inputs.append(sensor_input)



def _metadata2project(metadata, project):
    project.title = metadata.get('title', '')
    project.description = metadata.get('description', '')


def _read_float(data, key, default_value=.0):
    try:
        return float(data.get(key, default_value))
    except ValueError:
        return default_value

def _read_int(data, key, default_value=0):
    try:
        return int(data.get(key, default_value))
    except ValueError:
        return default_value

def _read_bool(data, key, default_value=False):
    try:
        return bool(data.get(key, default_value))
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

