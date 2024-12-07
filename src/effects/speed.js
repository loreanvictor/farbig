import { listen } from '../dispatch.js'
import { addScore } from '../score.js'


export const addSpeedBonus = () => {
  const HIGH_ROTATE_BONUS = 240_000
  const MIN_ANG_SPEED = 0.1
  const EXP_ANG_SPEED = 0.8

  listen('box:popped', ({ box }) => {
    if (box.angularSpeed > MIN_ANG_SPEED) {
      const factor = Math.floor(box.angularSpeed / EXP_ANG_SPEED)
      addScore(HIGH_ROTATE_BONUS * factor * factor, box.tag)
    }
  })
}
