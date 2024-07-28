import { listen } from './dispatch.js'
import { RED, GRAY } from './box/index.js'
import { CHOSEN_COLOR } from './score.js'


export function explode(engine, box, tapped = false) {
  const gmult = CHOSEN_COLOR === GRAY ? 3 : 1
  const force = box.tag === RED ? 50 : box.tag === GRAY ? -20 * gmult : 20

  const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
  boxes.forEach(b => {
    if (b !== box) {
      const d = Matter.Vector.sub(b.position, box.position)
      const dl = Matter.Vector.magnitude(d)
      const f = Matter.Vector.mult(Matter.Vector.div(d, dl * dl), force)
      Matter.Body.applyForce(b, box.position, f)
    }
  })
}

export const addExplodeOnPop = engine => {
  listen('pop:box', ({ box, tapped }) => {
    explode(engine, box, tapped)
  })
}
