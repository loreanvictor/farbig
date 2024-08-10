import { listen } from '../dispatch.js'
import { CHOSEN_COLOR } from '../score.js'
import { GRAY, BOX_CONFIG } from '../box/index.js'


export const addGrayEffect = (engine) => {
  let antiGravCounter = 0
  let gravRunner
  const maxGravCounter = 12
  const DEFAULT_GRAVITY = 0.001
  let attractColors = []
  
  const turnGravityOff = (mul = 1) => {
    const mult = CHOSEN_COLOR === GRAY ? 2 : 1
    antiGravCounter = Math.min(maxGravCounter, antiGravCounter + mul) * mult
    engine.gravity.scale = 0
  
    if (!gravRunner) {
      gravRunner = setInterval(() => {
        if (antiGravCounter > 0) {
          engine.gravity.scale = 0
          antiGravCounter--
          document.getElementById('antigrav').style.transform = `scaleX(${antiGravCounter / (maxGravCounter * mult)})`
        } else {
          engine.gravity.scale = DEFAULT_GRAVITY
          attractColors = []
        }
      }, 300)
    }
  }

  listen('pop:box', ({ box, group }) => {
    if (box.tag === GRAY) {
      turnGravityOff(group.length)
      const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')

      boxes.forEach(b => {
        if (b.tag !== GRAY && !attractColors.includes(b.tag)) {
          const dist = Matter.Vector.magnitude(Matter.Vector.sub(b.position, box.position))
          if (dist < BOX_CONFIG.SIZE * 1.2) {
            attractColors.push(b.tag)
          }
        }
      })
    }
  })

  listen('hold', pos => {
    const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
    if (engine.gravity.scale === 0) {
      boxes.forEach(box => {
        if (attractColors.includes(box.tag)) {
          const f = Matter.Vector.mult(
            Matter.Vector.normalise(
              Matter.Vector.sub(pos, box.position)
            ), 0.01
          )
  
          Matter.Body.applyForce(box, pos, f)
        }
      })
    }
  })
}
