
import numpy as np
import json

def serialize(array):
    return json.dumps(array.tolist())

def deserialize(string):
    return np.array(json.loads(string))

def readcvs(cvs):
    return False
