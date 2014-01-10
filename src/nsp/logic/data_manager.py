from google.appengine.ext import ndb


from nsp.logic import common
from nsp.logic import access
from nsp.maths import maths
from nsp.model.series import Series

from nsp.cache import dataupdate

import numpy as np

import logging
import json

data_size = {
             'acc': 3,
             'lacc': 3,
             'snd': 1
             }

def delete_profile_data(user, project, profileid):
    if access.can_edit_project(user, project):
        query = Series.query(ndb.AND(Series.projectid == project.key.id(), Series.profileid == profileid))
        keys = query.fetch(keys_only=True)
        ndb.delete_multi(keys)



def list_project_data(user, project):
    if access.can_view_data(user, project):
        query = Series.query(Series.projectid == project.key.id())
        return query.fetch()
    else:
        return False



def upload_data2(user, csv):
    result = {'ok' : False}

    request = None
    project = None
    profile = None

    sensorNames = {}
    series = {}
    sensorMap = {}


    for line in [s.strip() for s in csv.splitlines()]:
        if line[0:11] == '# profile: ':
            rid = line[11:]
            parts = rid.split('.')
            if len(parts) != 3:
                common.set_error(result, 'noid')
                break

            request = {'id' : parts[1], 'profileid': parts[2]}
            project = common.load_project(request, 'id')

            if not project:
                common.set_error(result, 'noproject')
                break

            if not access.can_add_data(user, project):
                common.set_error(result, 'noaccess')
                break

            profile = common.get_profile(project, common.read_int(request, 'profileid', -1))

            if not profile:
                common.set_error(result, 'noprofile')
                break

            result['ok'] = True

        elif not profile:
            common.set_error(result, 'badline')
            break

        elif line[0:10] == '# sensor: ':
            parts = line[10:].split(' ', 2)
            logging.info(parts)
            if len(parts) != 3:
                common.set_error(result, 'nosensorid')
                break
            else:
                input_id = common.str_to_int(parts[0], -1)
                # device_sensor_id = parts[1]
                sensor_name = parts[2]

                sensor_input = common.get_sensorinput(profile, input_id)
                if not sensor_input:
                    common.set_error(result, 'nosensor')
                    break

                series[input_id] = []
                sensorNames[input_id] = sensor_name
                sensorMap[input_id] = sensor_input.sensor

        else:
            parts = [p.strip() for p in line.split(',')]
            if len(parts) > 2:
                input_id = common.str_to_int(parts[0])
                if not input_id in series:
                    common.set_error(result, 'baddata')
                    break

                length = 1 + data_size[sensorMap[input_id]]

                if len(parts) >= 1 + length:
                    try:
                        row = []
                        for i in range(length):
                            row.append(float(parts[1 + i]))
                        series[input_id].append(row)
                    except ValueError:
                        logging.error("bad row: %s", line)


    if result['ok']:
        metadata = {'sensors': sensorNames}
        seriesObj = Series(projectid=project.key.id(), profileid=profile.id, userid=user.user_id(), data=json.dumps(series), metadata=json.dumps(metadata))
        seriesObj.put();
        dataupdate.data_modified(project)

    return result


def get_vectors(profile, series):
    # series.data -> {input_id -> data_array}
    # output      -> {input_id -> {transformation -> data_array}}

    vectors0 = json.loads(series.data)

    vectors = {}

    for input_id_str in vectors0:
        input_id = common.str_to_int(input_id_str, -1)
        sensor_input = common.get_sensorinput(profile, input_id)
        input_vectors = {}
        input_vectors[0] = vectors0[input_id_str]

        for t in sensor_input.transformations:
            input_vectors[t.id] = maths.transform(t.transformation, np.array(input_vectors[t.sourceid])).tolist()


        vectors[input_id_str] = input_vectors

    return vectors;













