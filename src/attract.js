import { listen } from './dispatch.js'
import { BOX_CONFIG } from './box/index.js'


export const addAttractionOnHold = (engine) => {
  listen('hold', pos => {
    const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
    if (engine.gravity.scale === 0) {
      boxes.forEach(box => {
        const distance = Matter.Vector.magnitude(
          Matter.Vector.sub(pos, box.position)
        )
    
        if (distance < BOX_CONFIG.SIZE * 5) {
          const f = Matter.Vector.mult(
            Matter.Vector.normalise(
              Matter.Vector.sub(pos, box.position)
            ), 0.005
          )
  
          Matter.Body.applyForce(box, pos, f)
        }
      })
    }
  })
}
