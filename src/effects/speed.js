import { listen } from '../dispatch.js'
import { addScore } from '../score.js'


export const addSpeedBonus = () => {
  listen('group:popped', ({ group }) => {
    const MIN_SPEED = 1
    const accumulative = Math.sqrt(
      group.reduce(
        (total, box) => 
          box.speed > MIN_SPEED ? total + box.speed * box.speed : total
      , 0)
    )

    addScore(Math.floor(accumulative * group.length * 1000, group[0].tag))
  })
}
