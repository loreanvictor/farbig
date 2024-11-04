import { BLUE } from '../../box/index.js'

import { addScoreOnPop, matchScore } from '../common.js'

import { BLUE_SCORE } from './common.js'
import { addFreezeEffect } from './freeze.js'
import { addFreezeSpread } from './spread.js'
import { addFrozenBonus } from './bonus.js'
import { addOrangeToGrayEffect } from './orange-to-gray.js'


export const addBlueEffect = (engine, config) => {
  addScoreOnPop(BLUE, matchScore(config.MIN_MATCH, BLUE_SCORE))
  addFreezeEffect(engine)
  addFreezeSpread(engine)
  addFrozenBonus()
  addOrangeToGrayEffect()
}
