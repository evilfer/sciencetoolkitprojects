
from google.appengine.ext import ndb


class Project(ndb.Model):

    ownerid = ndb.StringProperty()
    title = ndb.StringProperty()
    description = ndb.StringProperty()
    is_public = ndb.BooleanProperty()
    user_count = ndb.IntegerProperty()




