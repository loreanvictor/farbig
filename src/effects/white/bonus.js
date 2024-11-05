import { listen } from '../../dispatch.js'
import { addScore } from '../../score.js'
import { WHITE } from '../../box/index.js'

import { createTimer } from '../util/timer.js'
import { createIndicator } from '../util/indicator.js'

import { DISCO_TIME } from './common.js'


export const addDiscoBonus = () => {
  let colorMap = {}
  let bonusBase = 0

  const timer = createTimer(250)
  const indicator = createIndicator({ element: document.getElementById('white'), max: DISCO_TIME })

  listen('white:color-changed', ({ group }) => {
    indicator.take('background').set(WHITE).done()
    timer.set(DISCO_TIME)
    bonusBase = Math.max(bonusBase, group.length)
  })

  timer.listen(({ time }) => {
    indicator.set(time)
    if (time === 0) {
      const count = Object.keys(colorMap).length
      const bonus = Object.values(colorMap).reduce((total, each) => total + each * each, 0)
      const score = Math.floor(bonusBase / 4 * bonus * count * count * count)

      colorMap = {}
      addScore(score, WHITE)
    }
  })

  listen('group:popped', ({ group }) => {
    if (timer.get() > 0) {
      const color = group[0].tag
      colorMap[color] = Math.max(colorMap[color] || 0, group.length)

      indicator.take('background').burst(color).wait(100).then(() => {
        indicator.over(500).set(WHITE)
      })
    }
  })
}
