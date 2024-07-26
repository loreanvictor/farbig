import { listen } from '../dispatch.js'
import { CHOSEN_COLOR } from '../score.js'
import { GRAY } from '../box/index.js'


export const addGrayEffect = (engine) => {
  let antiGravCounter = 0
  let gravRunner
  const maxGravCounter = 12
  const DEFAULT_GRAVITY = 0.001
  
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
        }
      }, 300)
    }
  }

  listen('pop:box', ({ box, group }) => {
    if (box.tag === GRAY) {
      turnGravityOff(group.length)
    }
  })
}
