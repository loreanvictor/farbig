import { GRAY } from '../../box/index.js'

import { addScoreOnPop, matchScore } from '../common.js'

import { GRAY_SCORE } from './common.js'
import { addZeroGAttractEffect } from './attract.js'
import { addZeroGBonus } from './bonus.js'
import { addZeroGEffect } from './zero-g.js'


export const addGrayEffect = (engine, config) => {
  addScoreOnPop(GRAY, matchScore(config.MIN_MATCH, GRAY_SCORE))
  addZeroGAttractEffect(engine)
  addZeroGBonus(engine)
  addZeroGEffect(engine)
}
