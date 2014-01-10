

import numpy as np

def t(data):
    av = data[:, 1].sum() / np.size(data, 0)

    if av == 0:
        return data

    result = np.zeros(np.shape(data))
    result[:, 0] = data[:, 0]
    result[:, 1] = data[:, 1] - av

    return result;

