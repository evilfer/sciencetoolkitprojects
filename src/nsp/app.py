import webapp2

from api.login import LoginApi
from api.projects import ProjectsApi

application = webapp2.WSGIApplication([
    ('/api/login', LoginApi),
    ('/api/projects', ProjectsApi)
], debug=True)