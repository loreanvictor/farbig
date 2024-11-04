import { listen } from '../../dispatch.js'
import { BLUE, freeze } from '../../box/index.js'

import { freezables } from './common.js'


export const addFreezeEffect = (engine) => {
  listen('box:popped', ({ box, group }) => {
    if (box.tag === BLUE) {
      freezables(engine, box).forEach(b => {
        freeze(b, 2500 * group.length)
      })
    }
  })
}
