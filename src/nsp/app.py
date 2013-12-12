import webapp2

from api.login import LoginApi
from api.projects import ProjectsApi
from api.upload import UploadApi

application = webapp2.WSGIApplication([
    ('/api/login', LoginApi),
    ('/api/projects', ProjectsApi),
    ('/api/upload', UploadApi)
], debug=True)