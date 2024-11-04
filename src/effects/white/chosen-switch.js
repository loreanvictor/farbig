import { listen } from '../../dispatch.js'
import { WHITE } from '../../box/index.js'

import { nextChosenColor } from '../common.js'
import { createTimer } from '../util/timer.js'

import { DISCO_TIME } from './common.js'


export const addChosenSwitch = () => {
  let count = 1
  const timer = createTimer()

  listen('group:popped', ({ group }) => {
    if (group[0].tag === WHITE) {
      timer.set(DISCO_TIME)

      count++
      if (count > 3) {
        nextChosenColor()
      }
    } else {
      count = 1
    }
  })

  timer.listen(({ time }) => time === 0 && (count = 1))
}
