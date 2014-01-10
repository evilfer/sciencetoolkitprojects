
import shards

import logging

PROJECT_DATA_NAME_TEMPLATE = "data.{:d}"

def data_modified(project):
    data_name = PROJECT_DATA_NAME_TEMPLATE.format(project.key.id())

    logging.info('increment')
    logging.info(shards.get_count(data_name))
    shards.increment(data_name)
    logging.info(shards.get_count(data_name))
