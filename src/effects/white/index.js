import { WHITE } from '../../box/index.js'

import { addScoreOnPop, matchScore } from '../common.js'

import { addDiscoBonus } from './bonus.js'
import { addChosenSwitch } from './chosen-switch.js'
import { addColorChangeEffect } from './color-change.js'


export const addWhiteEffect = (engine, config) => {
  addScoreOnPop(WHITE, matchScore(config.MIN_MATCH))
  addDiscoBonus()
  addChosenSwitch()
  addColorChangeEffect(engine)
}
