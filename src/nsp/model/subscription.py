


from google.appengine.ext import ndb


class Subscription(ndb.Model):

    userid = ndb.StringProperty()
    projectid = ndb.IntegerProperty()
    is_public = ndb.BooleanProperty()



