

import modulus
import integrate
import gety
import removecc

transformations = {
                   'modulus': modulus.t,
                   'integrate': integrate.t,
                   'gety': gety.t,
                   'removecc': removecc.t
                   }



def transform(transformation, vector):
    result = transformations[transformation](vector)
    return result
