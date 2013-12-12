import webapp2
import json

class UploadApi(webapp2.RequestHandler):

    def post(self):
        file_content = self.request.POST.multi['file'].file.read()
        result = {'ok': True}
        json.dump(result, self.response)


