import R from 'ramda'

export const objPick = (sub,parent) =>
                  R.pick(R.keys(sub), parent)