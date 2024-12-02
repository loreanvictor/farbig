import { listen, observe, dispatch, defineEvents } from '../../dispatch.js'
import { addScore } from '../../score.js'
import { GRAY } from '../../box/index.js'

import { chosenBonus } from '../common.js'


defineEvents('vaccum:combo-changed')

export const addZeroGBonus = () => {
  const minGravTime = 1000

  let vaccumCombo = 0
  let lastRun = 0
  let gravOff = false
  let colors = []

  const gravOffTime = observe('gravity:off-tick', ({ time }) => time)

  listen('gravity:turned-off', () => {
    lastRun = 0
    colors = []
    gravOff = true
  })

  listen('score:added', ({ added, color }) => {
    if (gravOff && color !== GRAY) {
      const timecoeff = Math.min(1, 1 / (1 + Math.exp(-10 * (gravOffTime.get() / minGravTime - 0.75))))
      lastRun += added * timecoeff
      if (!colors.includes(color)) {
        colors.push(color)
      }
    }
  })

  listen('gravity:turned-on', () => {
    gravOff = false
    vaccumCombo = Math.sqrt(vaccumCombo * vaccumCombo + lastRun * lastRun * colors.length * colors.length)
    dispatch('vaccum:combo-changed', { combo: vaccumCombo })
  })

  listen('group:popped', ({ group }) => {
    if (group[0].tag === GRAY) {
      addScore(Math.floor(group.length * vaccumCombo / 4096) * chosenBonus(GRAY), GRAY)
    }
  })
}