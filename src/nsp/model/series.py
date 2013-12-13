


from google.appengine.ext import ndb

class Series(ndb.Model):
    projectid = ndb.IntegerProperty()
    profileid = ndb.IntegerProperty()

    userid = ndb.StringProperty()

    data = ndb.TextProperty()





