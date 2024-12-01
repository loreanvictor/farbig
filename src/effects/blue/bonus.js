import { listen } from '../../dispatch.js'
import { addScore } from '../../score.js'
import { isFrozen, BLUE } from '../../box/index.js'

import { chosenBonus } from '../common.js'


export const addFrozenBonus = () => {
  listen('group:popped', ({ group }) => {
    const frozen = group.filter(b => isFrozen(b)).length

    if (frozen > 0) {
      addScore(Math.floor(frozen * frozen * frozen / 2.3 * chosenBonus(BLUE) * chosenBonus(BLUE)), BLUE)
    }
  })
}
