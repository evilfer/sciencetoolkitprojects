
import shards

import json
import zlib
import base64

from nsp.logic import common, data_manager

from google.appengine.api import memcache

import logging

PROJECT_DATA_NAME_TEMPLATE = "data.{:d}"
PROJECT_DATA_CACHE_TEMPLATE = "cache-data.{:d}"

def load_project_data(user, project):
    data_name = PROJECT_DATA_NAME_TEMPLATE.format(project.key.id())
    data_cache = PROJECT_DATA_CACHE_TEMPLATE.format(project.key.id())
    data_in_cache = memcache.get(data_cache)

    version_counter = shards.get_count(data_name)

    logging.info('lpd: {:d} {:d}'.format(version_counter, data_in_cache['v'] if data_in_cache else -1))

    if not data_in_cache or not data_in_cache['v'] == version_counter:
        logging.info('lps: calculating')
        d0 = load_fresh_data(user, project)
        d1 = json.dumps(d0)
        d2 = zlib.compress(d1, 9)
        d3 = base64.encodestring(d2)
        logging.info("compression: {:d} {:d}".format(len(d1), len(d3)))

        memcache.set(data_cache, {'v': version_counter, 'd': d3}, time=86400)
        return d3
    else:
        logging.info('lps: from cache')
        return data_in_cache['d']




def load_fresh_data(user, project):
    result_series = {}
    series_list = data_manager.list_project_data(user, project)
    if series_list:
        for series in series_list:
            if not series.profileid in result_series:
                result_series[series.profileid] = []
            profile = common.get_profile(project, series.profileid)
            vectors = data_manager.get_vectors(profile, series)
            result_series[series.profileid].append({'id': series.key.id(), 'userid': series.userid, 'data': vectors, 'metadata': json.loads(series.metadata)})

    return result_series
