

from nsp.model.project import Project
from nsp.model.subscription import Subscription
from nsp.model.profile import DataLoggingProfile
from nsp.model.profile import SensorInput
from nsp.model.profile import Transformation
from nsp.cache import dataupdate

import access, common, subscription_manager, data_manager


def view_project(user, data):
    project = common.load_project(data, 'id')
    if access.can_view_project(user, project):
        return project
    else:
        return None


def create_project(user, data):
    if 'metadata' in data:
        project = Project(ownerid=user.user_id(), user_count=1, is_public=False, profiles=[])
        _metadata2project(data['metadata'], project)
        project.put()
        subscription_manager.add_subscription(user, project, False)
        return True, project.key.id()
    else:
        return False, 0


def update_project(user, data):
    project = common.load_project(data, 'id')

    if access.can_edit_project(user, project) and 'metadata' in data:
        _metadata2project(data['metadata'], project)
        update_project_user_count(project, False)
        project.put()
        return True
    else:
        return False

def change_visibility(user, data):
    project = common.load_project(data, 'id')
    if access.can_edit_project(user, project) and 'is_public' in data:
        project.is_public = common.read_bool(data, 'is_public', False)
        update_project_user_count(project, False)
        project.put()
        return True, project.is_public
    else:
        return False, False


def save_input(user, data):
    project = common.load_project(data, 'id')
    if access.can_edit_project(user, project) and 'input' in data:
        profileId = common.read_int(data, 'profileid', -1)
        if profileId < 0:
            return False

        profile = common.get_profile(project, profileId)
        if not profile:
            return False

        input_data = data['input']
        input_id = common.read_int(input_data, 'id', -1)

        if input_id < 0:
            return False

        input_to_update = common.get_sensorinput(profile, input_id)

        if not input_to_update:
            input_to_update = SensorInput(id = input_id, transformations = [])
            profile.inputs.append(input_to_update)

        input_to_update.sensor = input_data.get('sensor', '')
        input_to_update.rate = common.read_float(input_data, 'rate', 10)

        project.put()
        return True

    else:
        return False

def delete_input(user, data):
    project = common.load_project(data, 'id')
    if access.can_edit_project(user, project):
        profile_id = common.read_int(data, 'profileid', -1)
        if profile_id < 0:
            return False

        profile = common.get_profile(project, profile_id)
        if not profile:
            return False

        input_id = common.read_int(data, 'inputid', -1)

        if input_id < 0:
            return False

        for idx, profile_input in enumerate(profile.inputs):
            if profile_input.id == input_id:
                del profile.inputs[idx]
                project.put()
                return True

    return False


def set_profile_title(user, data):
    project = common.load_project(data, 'id')
    if access.can_edit_project(user, project):
        profileId = common.read_int(data, 'profileid', -1)

        if profileId < 0:
            return False

        profile_to_update = common.get_profile(project, profileId)

        if not profile_to_update:
            profile_to_update = DataLoggingProfile(id = profileId, is_active = False, series_count = 0)
            project.profiles.append(profile_to_update)
        elif profile_to_update.is_active:
            return False

        if profile_to_update:
            profile_to_update.title = data.get('title', '')
            project.put()
            return True
        else:
            return False

    else:
        return False


def delete_profile(user, data):
    project = common.load_project(data, 'id')
    if access.can_edit_project(user, project):
        profileid = common.read_int(data, 'profileid', -1)

        if profileid < 0:
            return False

        for idx, profile in enumerate(project.profiles):
            if profile.id == profileid:
                del project.profiles[idx]
                project.put()
                data_manager.delete_profile_data(user, project, profileid)
                return True

        return False


def change_profile_visibility(user, data):
    project = common.load_project(data, 'id')
    if access.can_edit_project(user, project) and 'profile_id' in data:
        profileId = common.read_int(data, 'profile_id', -1)
        active = common.read_bool(data, 'is_active', False)

        for profile in project.profiles:
            if profile.id == profileId:
                profile.is_active = active
                project.put()
                return True

    return False

def save_transformations(user, data):
    project = common.load_project(data, 'id')
    if not access.can_edit_project(user, project):
        return False

    profile_id = common.read_int(data, 'profileid', -1)
    profile = common.get_profile(project, profile_id)
    if not profile:
        return False

    input_id = common.read_int(data, 'inputid', -1)
    sensor_input = common.get_sensorinput(profile, input_id)
    if not sensor_input:
        return False

    sensor_input.transformations = []
    nts = data.get('transformations', [])
    for nt in nts:
        t_id = common.read_int(nt, 'id', -1)
        sourceid = common.read_int(nt, 'sourceid', -1)
        name = nt.get('display_name', '')
        transformation = nt.get('transformation', '')
        sensor_input.transformations.append(Transformation(id=t_id, sourceid=sourceid, transformation=transformation, display_name=name))

    project.put()

    dataupdate.data_modified(project)


    return True





def _metadata2project(metadata, project):
    project.title = metadata.get('title', '')
    project.description = metadata.get('description', '')




def list_projects(user, only_owned=False):
    query = access.filter_project_list_query(user, only_owned)
    projects = query.fetch()
    return projects





def update_project_user_count(project, put=True):
    if project:
        count = Subscription.query(Subscription.projectid == project.key.id()).count()
        project.user_count = count
        if put:
            project.put()

