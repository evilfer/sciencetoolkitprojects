


from google.appengine.ext import ndb


class SensorInput(ndb.Model):
    sensor = ndb.StringProperty()
    rate = ndb.FloatProperty()


class DataLoggingProfile(ndb.Model):
    title = ndb.StringProperty()
    inputs = ndb.LocalStructuredProperty(SensorInput, repeated=True)







