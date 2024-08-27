import { listen } from '../dispatch.js'
import { CHOSEN_COLOR } from '../score.js'
import { random } from '../random.js'
import { BOX_CONFIG, WHITE, RED, BLUE, GREEN, PURPLE, GRAY, ORANGE, changeColor } from '../box/index.js'


export const addWhiteEffect = (engine) => {
  listen('pop:group', ({ group }) => {
    if (group[0].tag === WHITE) {
      const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
      const all = [RED, BLUE, GREEN, PURPLE, GRAY, ORANGE]
      const mult = CHOSEN_COLOR === WHITE ? 2 : 1
      const gmult = Math.max(Math.floor(Math.log(group.length * 1.7) / Math.log(2)), 1)

      boxes.forEach(box => {
        const distance = group.reduce(
          (m, b) => Math.min(m, Matter.Vector.magnitude(Matter.Vector.sub(box.position, b.position))),
          Infinity
        )
        if (
          box.tag !== WHITE &&
          !boxes.some(b => b.tag === box.tag && b.isStatic) &&
          distance < BOX_CONFIG.SIZE * gmult * 1.5 * mult
        ) {
          const colors = all.filter(c => c !== box.tag)
          const color = colors[random(0, colors.length - 1)]
          changeColor(box, color)
        }
      })
    }
  })
}
