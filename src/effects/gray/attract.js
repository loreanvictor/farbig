import { observe, listen } from '../../dispatch.js'

import { isGravityOff } from './zero-g.js'


export const addZeroGAttractEffect = engine => {
  let attractColor = undefined
  const vaccumCombo = observe('vaccum:combo-changed', ({ combo }) => Math.min(combo / 1_000_000 + 1, 1.5), 1)

  listen('box:touched', box => {
    if (isGravityOff(engine)) {
      attractColor = box.tag
    }
  })

  listen('cursor:hold', pos => {
    const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
    if (isGravityOff(engine)) {
      boxes.forEach(box => {
        if (box.tag === attractColor) {
          const f = Matter.Vector.mult(
            Matter.Vector.normalise(
              Matter.Vector.sub(pos, box.position)
            ), 0.2 * vaccumCombo.get()
          )
  
          Matter.Body.applyForce(box, pos, f)
        }
      })
    }
  })

  listen('gravity:turned-on', () => attractColor = undefined)
}
