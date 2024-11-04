import { BLUE, BOX_CONFIG } from '../../box/index.js'


export const BLUE_SCORE = 100

export const freezables = (engine, box) => {
  const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')

  return boxes.filter(b => {
    return b.tag !== BLUE && 
      Matter.Vector.magnitude(Matter.Vector.sub(b.position, box.position)) < BOX_CONFIG.SIZE * 1.2
  })
}
