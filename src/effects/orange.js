import { listen } from '../dispatch.js'
import { random } from '../random.js'
import { CHOSEN_COLOR, addScore } from '../score.js'
import { ORANGE, BOX_CONFIG, unfreeze, changeColor } from '../box/index.js'


export const addOrangeEffect = (engine) => {
  listen('pop:group', ({ group }) => {
    if (group[0].tag === ORANGE) {
      const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
      const mult = CHOSEN_COLOR === ORANGE ? 1.4 : 1

      let converted = 0
      boxes.forEach(box => {
        const distance = group.reduce(
          (min, b) => Math.min(
            min,
            Matter.Vector.magnitude(Matter.Vector.sub(b.position, box.position))
          ), Infinity
        )
        const chance = Math.max(Math.min(group.length * group.length / 1.5, 75), 10)
        const maxdist = BOX_CONFIG.SIZE * 1.5 * mult 

        if (distance < maxdist) {
          unfreeze(box)
          if (random(0, 100) < chance) {
            changeColor(box, ORANGE)
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
