import webapp2
import json

from nsp.logic import data_manager

from google.appengine.api import users

import json

class UploadApi(webapp2.RequestHandler):

    def post(self):
        user = users.get_current_user()

#        data = {
#                'id': self.request.get('projectid'),
#                'profileid': self.request.get('profileid')
#                }

        body = json.loads(self.request.get('body'))

        file_content = self.request.POST.multi['file'].file.read()

        result = data_manager.upload_data2(user, body, file_content)

        json.dump(result, self.response)


