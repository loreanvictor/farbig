import { listen } from './dispatch.js'
import { RED, GRAY, BLUE, GREEN, WHITE, PURPLE, ORANGE } from './box/index.js'


const EXPLOSION_FORCE = {
  [RED]: 50,
  [GRAY]: -20,
  [ORANGE]: 5,
  [BLUE]: -10,
  [PURPLE]: 5,
  [WHITE]: 5,
  [GREEN]: 20
}

export function explode(engine, box) {
  const force = EXPLOSION_FORCE[box.tag]

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
  listen('box:popped', ({ box, tapped }) => {
    explode(engine, box, tapped)
  })
}
