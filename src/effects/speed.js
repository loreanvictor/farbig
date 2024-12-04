import { listen } from '../dispatch.js'
import { addScore } from '../score.js'


export const addSpeedBonus = () => {
  const HIGH_ROTATE_BONUS = 420_000
  const MIN_ANG_SPEED = 0.1
  const EXP_ANG_SPEED = 0.4

  listen('box:popped', ({ box }) => {
    if (box.angularSpeed > MIN_ANG_SPEED) {
      const factor = Math.floor(box.angularSpeed / EXP_ANG_SPEED)
      addScore(HIGH_ROTATE_BONUS * factor * factor, box.tag)
    }
  })

  const MIN_SPEED = 3

  listen('group:popped', ({ group }) => {
    const accumulative = Math.sqrt(
      group.reduce(
        (total, box) => 
          box.speed > MIN_SPEED ? total + box.speed * box.speed : total
      , 0)
    )

    addScore(Math.floor(accumulative * group.length * 100, group[0].tag))
  })
}
