

from nsp.model.project import Project
from nsp.model.subscription import Subscription
from nsp.model.profile import DataLoggingProfile
from nsp.model.profile import SensorInput
from nsp.model.profile import Transformation

import access, common, subscription_manager


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

def update_profiles(user, data):
    project = common.load_project(data, 'id')
    if access.can_edit_project(user, project) and 'profile' in data:
        profile_data = data['profile']
        profileId = common.read_int(profile_data, 'id', -1)


        if profileId < 0:
            return False

        profile_to_update = common.get_profile(project, profileId)

        if not profile_to_update:
            profile_to_update = DataLoggingProfile(id = profileId, is_active = False, series_count = 0)
            project.profiles.append(profile_to_update)
        elif profile_to_update.is_active:
            return False

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

def _data2profile(profile_data, profile):
    profile.title = profile_data.get('title', '')
    profile.inputs = []
    for input_data in profile_data.get('inputs', []):
        input_id = common.read_int(input_data, 'id', 0)
        sensor = input_data.get('sensor', '')
        rate = common.read_float(input_data, 'rate')
        sensor_input = SensorInput(id=input_id, sensor=sensor, rate=rate, transformations=[])
        for transformation_data in input_data.get('transformations', []):
            t_id = common.read_int(transformation_data, 'id', 0);
            source_id = common.read_int(transformation_data, 'sourceid', 0);
            t_code = transformation_data.get('transformation', '')
            is_displayed = common.read_bool(transformation_data, 'is_displayed')
            display_name = transformation_data.get('display_name', '')
            transformation = Transformation(id=t_id, source_id=source_id, transformation=t_code, is_displayed=is_displayed, display_name=display_name)

            sensor_input.transformations.append(transformation)

        profile.inputs.append(sensor_input)



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

