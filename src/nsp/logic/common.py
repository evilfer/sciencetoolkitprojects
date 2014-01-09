
from nsp.model.project import Project
from nsp.model.subscription import Subscription
import logging

from google.appengine.ext import ndb

def str_to_int(str_value, default_value = 0):
    try:
        return int(str_value)
    except ValueError:
        return default_value

def read_float(data, key, default_value=.0):
    try:
        return float(data.get(key, default_value))
    except ValueError:
        return default_value

def read_int(data, key, default_value=0):
    return str_to_int(data.get(key, default_value), default_value)

def read_bool(data, key, default_value=False):
    try:
        v = data.get(key, default_value)
        if v == 'false':
            return False
        else:
            return bool(v)
    except ValueError:
        return default_value


def load_project_id(projectid):
    key = ndb.Key(Project, projectid)
    project = key.get()

    return project

def load_project(data, key):
    projectid = read_int(data, key, -1)
    logging.info(projectid)
    return load_project_id(projectid) if projectid >=0 else None

def get_profile(project, profileid):
    for profile in project.profiles:
        if profile.id == profileid:
            return profile

    return None

def get_sensorinput(profile, sensorinputid):
    for sensor_input in profile.inputs:
        if sensor_input.id == sensorinputid:
            return sensor_input

    return None

def get_subscription(user, project):
    if user and project:
        query = Subscription.query(ndb.AND(Subscription.userid == user.user_id(), Subscription.projectid == project.key.id()))
        return query.get()
    else:
        return None

def is_member(user, project):
    return bool(get_subscription(user, project))


def set_error(result, error, ok_key='ok', error_key='reason'):
    result[error_key] = error
    result[ok_key] = False

