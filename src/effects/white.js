import { listen } from '../dispatch.js'
import { CHOSEN_COLOR } from '../score.js'
import { random } from '../random.js'
import { BOX_CONFIG, WHITE, RED, BLUE, GREEN, PURPLE, GRAY, ORANGE, changeColor } from '../box/index.js'


export const addWhiteEffect = (engine) => {
  listen('pop:box', ({ box, group }) => {
    if (box.tag === WHITE) {
      const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
      const all = [RED, BLUE, GREEN, PURPLE, GRAY, ORANGE]
      const mult = CHOSEN_COLOR === WHITE ? 2 : 1

      boxes.forEach(b => {
        const distance = Matter.Vector.magnitude(Matter.Vector.sub(b.position, box.position))
        if (
          b.tag !== WHITE &&
          !boxes.some(box => box.tag === b.tag && box.isStatic) &&
          distance < BOX_CONFIG.SIZE * Math.max(group.length / 2, 1) * 1.2 * mult
        ) {
          const colors = all.filter(c => c !== b.tag)
          const color = colors[random(0, colors.length - 1)]
          changeColor(b, color)
        }
      })
    }
  })
}
