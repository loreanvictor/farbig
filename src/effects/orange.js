import { listen } from '../dispatch.js'
import { random } from '../random.js'
import { CHOSEN_COLOR, addScore } from '../score.js'
import { ORANGE, BOX_CONFIG, unfreeze, changeColor } from '../box/index.js'


export const addOrangeEffect = (engine) => {
  listen('pop:group', ({ group }) => {
    if (group[0].tag === ORANGE) {
      const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
      const maxdist = BOX_CONFIG.SIZE * 1.5

      const touched = boxes.filter(box => {
        return group.reduce(
          (min, b) => Math.min(
            min,
            Matter.Vector.magnitude(Matter.Vector.sub(b.position, box.position))
          ), Infinity
        ) < maxdist
      })

      let converted = 0
      const chance = Math.max(Math.min(touched.length * touched.length / 3, 95), 5)

      touched.forEach(box => {
        unfreeze(box)
        if (random(0, 100) < chance) {
          changeColor(box, ORANGE)
          converted++
        }
      })

      addScore(Math.floor(converted * converted * converted / 6), ORANGE)
    }
  })
}
