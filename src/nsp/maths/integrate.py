

import numpy as np
import logging

def t(data):
    n = np.size(data, 0)

    dt = data[1:,0] - data[0:-1, 0]
    dtvalues = (data[1:, 1:] + data[0:-1, 1:])*.5
    increments = (dt * dtvalues.transpose()).transpose()

    logging.info(dt[0:5])
    result = np.zeros(np.shape(data))
    result[0, 0] = data[0, 0]
    for i in range(1, n):
        result[i, 0] = data[i, 0]
        result[i, 1:] = result[i-1, 1:] + increments[i-1]

    return result

