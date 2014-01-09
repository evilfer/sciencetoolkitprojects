

import modulus
import integrate
import logging

transformations = {
                   'modulus': modulus.t,
                   'integrate': integrate.t
                   }

def register(name, t):
    transformations[name] = t


def transform(transformation, vector):
    result = transformations[transformation](vector)
    return result
