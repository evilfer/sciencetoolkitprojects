


from google.appengine.ext import ndb


class SensorInput(ndb.Model):
    id = ndb.IntegerProperty()
    sensor = ndb.StringProperty()
    rate = ndb.FloatProperty()


class DataLoggingProfile(ndb.Model):
    id = ndb.IntegerProperty()
    title = ndb.StringProperty()
    is_active = ndb.BooleanProperty()
    series_count = ndb.IntegerProperty()
    inputs = ndb.LocalStructuredProperty(SensorInput, repeated=True)








