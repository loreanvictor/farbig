import { listen } from '../dispatch.js'
import { CHOSEN_COLOR, addScore } from '../score.js'
import { GRAY } from '../box/index.js'

// TODO: make the chosen gray effect scale based on score
//       acquired during zero-g instead of popping big groups.
//       an alternative would be to simply make all colors behave
//       as if they are special (except for their score) during zero-g.
// TODO: gray potentiallyy needs rebalancing as well, as it is probably overperforming.

export const addGrayEffect = (engine) => {
  const indicator = document.getElementById('antigrav')

  let antiGravCounter = 0
  let gravRunner
  const maxGravCounter = 12
  const DEFAULT_GRAVITY = 0.001
  let attractColor = undefined
  let vaccumCombo = 0
  
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
        }
      }, 300)
    }
  }

  listen('pop:box', ({ box, group }) => {
    if (box.tag === GRAY) {
      turnGravityOff(group.length)
    }
  })

  listen('pop:group', ({ group }) => {
    if (engine.gravity.scale === 0) {
      vaccumCombo += Math.floor(Math.max(0, (group.length * group.length) - 64) / 32)
    }

    if (group[0].tag === GRAY) {
      addScore(vaccumCombo * group.length, GRAY)
    }
  })

  listen('touch:box', box => {
    if (engine.gravity.scale === 0) {
      attractColor = box.tag
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
            ), 0.2
          )
  
          Matter.Body.applyForce(box, pos, f)
        }
      })
    }
  })
}
