import { listen } from '../dispatch.js'
import { CHOSEN_COLOR } from '../score.js'
import { GRAY } from '../box/index.js'


export const addGrayEffect = (engine) => {
  const indicator = document.getElementById('antigrav')

  let antiGravCounter = 0
  let gravRunner
  const maxGravCounter = 12
  const DEFAULT_GRAVITY = 0.001
  let attractColor = undefined
  
  const turnGravityOff = (mul = 1) => {
    const mult = CHOSEN_COLOR === GRAY ? 2 : 1
    antiGravCounter = Math.min(maxGravCounter, antiGravCounter + mul) * mult
    engine.gravity.scale = 0
  
    if (!gravRunner) {
      gravRunner = setInterval(() => {
        if (antiGravCounter > 0) {
          engine.gravity.scale = 0
          antiGravCounter--
          indicator.style.transform = `scaleX(${antiGravCounter / (maxGravCounter * mult)})`
        } else {
          engine.gravity.scale = DEFAULT_GRAVITY
          attractColor = undefined
          // indicator.style.borderColor = 'transparent'
        }
      }, 300)
    }
  }

  listen('pop:box', ({ box, group }) => {
    if (box.tag === GRAY) {
      turnGravityOff(group.length)
    }
  })

  listen('touch:box', box => {
    if (engine.gravity.scale === 0) {
      attractColor = box.tag
      // indicator.style.borderColor = attractColor
    }
  })

  listen('hold', pos => {
    const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
    if (engine.gravity.scale === 0) {
      boxes.forEach(box => {
        if (box.tag === attractColor) {
          const f = Matter.Vector.mult(
            Matter.Vector.normalise(
              Matter.Vector.sub(pos, box.position)
            ), 0.1
          )
  
          Matter.Body.applyForce(box, pos, f)
        }
      })
    }
  })
}
