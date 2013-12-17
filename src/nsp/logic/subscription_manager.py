from google.appengine.ext import ndb


import access, common, project_manager

from nsp.model.subscription import Subscription

def add_subscription(user, project, update_user_count=True):
    if access.can_join_project(user, project) and not common.is_member(user, project):
        subscription = Subscription(userid=user.user_id(), projectid=project.key.id())
        subscription.put()

        if update_user_count:
            project_manager.update_project_user_count(project)

        return True
    else:
        return False

def remove_subscription(user, project):
    subscription_keys = Subscription.query(ndb.AND(Subscription.userid == user.user_id(), Subscription.projectid == project.key.id())).fetch(keys_only=True)
    ndb.delete_multi(subscription_keys)
    project_manager.update_project_user_count(project, True)


def add_profile(user, project, profileid):
    subscription = common.get_subscription(user, project)
    if subscription:
        if not profileid in subscription.profiles:
            subscription.profiles.append(profileid)
            subscription.put()
        return True, True
    else:
        return False, False

def remove_profile(user, project, profileid):
    subscription = common.get_subscription(user, project)
    if subscription:
        subscription.profiles = [x for x in subscription.profiles if x != profileid]
        subscription.put()
        return True, False
    else:
        return False, False

def user_subscriptions(user):
    return Subscription.query(Subscription.userid == user.user_id()).fetch()

