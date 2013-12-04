


from google.appengine.ext import ndb


class SensorInput(ndb.Model):
    id = ndb.IntegerProperty()
    sensor = ndb.StringProperty()
    rate = ndb.FloatProperty()


class DataLoggingProfile(ndb.Model):
    id = ndb.IntegerProperty()
    title = ndb.StringProperty()
    inputs = ndb.LocalStructuredProperty(SensorInput, repeated=True)







