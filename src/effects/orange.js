import { listen } from '../dispatch.js'
import { random } from '../random.js'
import { CHOSEN_COLOR, addScore } from '../score.js'
import { ORANGE, BOX_CONFIG, unfreeze, changeColor } from '../box/index.js'


export const addOrangeEffect = (engine) => {
  listen('pop:box', ({ box, group }) => {
    if (box.tag === ORANGE) {
      const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
      const mult = CHOSEN_COLOR === ORANGE ? 1.2 : 1

      let converted = 0
      boxes.forEach(b => {
        const distance = Matter.Vector.magnitude(Matter.Vector.sub(b.position, box.position))
        const chance = Math.max(Math.min(group.length * group.length * group.length / 3, 80), 25)
        const maxdist = BOX_CONFIG.SIZE * 1.5 * mult 

        if (distance < maxdist) {
          unfreeze(b)
          if (random(0, 100) < chance) {
            changeColor(b, ORANGE)
            converted++
          }
        }
      })

      if (converted > 0) {
        addScore(converted, ORANGE)
      }
    }
  })
}
