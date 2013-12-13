


from nsp.logic import common
from nsp.logic import access

from nsp.model.series import Series

import logging
import json

data_size = {
             'accelerometer': 3,
             'sound': 1
             }

def list_project_data(user, project):
    if access.can_view_data(user, project):
        query = Series.query(Series.projectid == project.key.id())
        return query.fetch()
    else:
        return False

def upload_data(user, request, csv):
    result = {'ok' : False}

    project = common.load_project(request, 'id')

    if access.can_edit_project(user, project):

        profile = common.get_profile(project, common.read_int(request, 'profileid', -1)) if project else None

        if profile:
            series = {}
            for sensor_input in profile.inputs:
                series[sensor_input.sensor] = []

            for line in [s.strip() for s in csv.splitlines()]:
                parts = [p.strip() for p in line.split(',')]
                if len(parts) > 2:
                    sensor = parts[1].split(':')[0]
                    if sensor in series:
                        length = 1 + data_size[sensor]

                        if len(parts) >= 2 + length:
                            try:
                                row = []
                                for i in range(length):
                                    row.append(float(parts[2 + i]))
                                series[sensor].append(row)
                            except ValueError:
                                logging.error("bad row: %s", line)

            seriesObj = Series(projectid=project.key.id(), profileid=profile.id, userid=user.user_id(), data=json.dumps(series))
            seriesObj.put();

            result['ok'] = True

    return result

