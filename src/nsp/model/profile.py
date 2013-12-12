


from google.appengine.ext import ndb


class Transformation(ndb.Model):
    id = ndb.IntegerProperty();
    sourceid = ndb.IntegerProperty();
    transformation = ndb.StringProperty();
    is_displayed = ndb.BooleanProperty();
    display_name = ndb.StringProperty()


class SensorInput(ndb.Model):
    id = ndb.IntegerProperty()
    sensor = ndb.StringProperty()
    rate = ndb.FloatProperty()
    transformations = ndb.LocalStructuredProperty(Transformation, repeated=True)


class DataLoggingProfile(ndb.Model):
    id = ndb.IntegerProperty()
    title = ndb.StringProperty()
    is_active = ndb.BooleanProperty()
    series_count = ndb.IntegerProperty()
    inputs = ndb.LocalStructuredProperty(SensorInput, repeated=True)








