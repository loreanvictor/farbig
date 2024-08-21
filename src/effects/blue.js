import { listen } from '../dispatch.js'
import { CHOSEN_COLOR } from '../score.js'
import { BLUE, BOX_CONFIG, freeze } from '../box/index.js'


export const addBlueEffect = (engine) => {
  listen('pop:box', ({ box, group }) => {
    if (box.tag === BLUE) {
      const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
      const mult = CHOSEN_COLOR === BLUE ? 1.5 : 1

      boxes.forEach(b => {
        if (b.tag !== BLUE) {
          const distance = Matter.Vector.magnitude(Matter.Vector.sub(b.position, box.position))
          if (distance < BOX_CONFIG.SIZE * 1.2 * mult) {
            freeze(b, 2500 * group.length * mult)
          }
        }
      })
    }
  })
}
