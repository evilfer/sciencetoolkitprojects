
from google.appengine.ext import ndb

from nsp.model.profile import DataLoggingProfile

class Project(ndb.Model):

    ownerid = ndb.StringProperty()
    title = ndb.StringProperty()
    description = ndb.StringProperty()
    is_public = ndb.BooleanProperty()
    user_count = ndb.IntegerProperty()

    profiles = ndb.LocalStructuredProperty(DataLoggingProfile, repeated=True)






