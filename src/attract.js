import { listen } from './dispatch.js'


export const addAttractionOnHold = (engine) => {
  listen('hold', pos => {
    const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
    boxes.forEach(box => {
      const distance = Matter.Vector.magnitude(
        Matter.Vector.sub(pos, box.position)
      )
  
      const f = Matter.Vector.mult(
        Matter.Vector.normalise(
          Matter.Vector.sub(pos, box.position)
        ), 0.005
      )

      Matter.Body.applyForce(box, pos, f)
    })
  })
}
