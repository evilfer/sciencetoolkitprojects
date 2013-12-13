import webapp2

from api.login import LoginApi
from api.projects import ProjectsApi
from api.upload import UploadApi
from api.subscriptions import SubscriptionsApi

application = webapp2.WSGIApplication([
    ('/api/login', LoginApi),
    ('/api/projects', ProjectsApi),
    ('/api/subscriptions', SubscriptionsApi),
    ('/api/upload', UploadApi)
], debug=True)