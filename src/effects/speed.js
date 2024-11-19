import { listen } from '../dispatch.js'
import { addScore } from '../score.js'


export const addSpeedBonus = () => {
  const HIGH_ROTATE_BONUS = 420_000
  const MIN_ANG_SPEED = 0.6

  listen('box:popped', ({ box }) => {
    if (box.angularSpeed > MIN_ANG_SPEED) {
      addScore(HIGH_ROTATE_BONUS * Math.floor(box.angularSpeed / MIN_ANG_SPEED), box.tag)
    }
  })

  const MIN_SPEED = 1

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
