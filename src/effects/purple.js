import { listen } from '../dispatch.js'
import { CHOSEN_COLOR } from '../score.js'
import { random } from '../random.js'
import { PURPLE, BOX_CONFIG, changeColor } from '../box/index.js'


export const addPurpleEffect = (engine) => {
  let purplePower = 0

  const REPURPLE_CHANCE = CHOSEN_COLOR === PURPLE ? 70 : 30
  const MAX_PURPLE = 9
  const purpleInd = document.getElementById('purple')
  let turnedPurple = 0

  const powerPurple = (mul) => {
    purplePower = Math.min(MAX_PURPLE, purplePower + mul * mul)
    purpleInd.style.transform = `scaleX(${purplePower / MAX_PURPLE})`
  }

  const consumePurple = (group, boxes) => {
    const mult = CHOSEN_COLOR === PURPLE ? 8 : 2
    const range = BOX_CONFIG.SIZE * purplePower * mult * group.length
    const targetColor = group[0].tag

    boxes.forEach(box => {
      if (box.tag === PURPLE) {
        const distance = group.reduce(
          (m, b) => Math.min(m, Matter.Vector.magnitude(Matter.Vector.sub(box.position, b.position))),
          Infinity
        )

        if (distance < range) {
          changeColor(box, targetColor)
          turnedPurple++
        }
      }
    })

    purplePower = 0
    purpleInd.style.transform = 'scaleX(0)'
  }

  listen('create:box', ({ box }) => {
    if (turnedPurple > 0) {
      if (random(0, 100) < REPURPLE_CHANCE) {
        changeColor(box, PURPLE)
      }

      turnedPurple--
    }
  })

  listen('pop:group', ({ group, tapped }) => {
    if (group[0].tag === PURPLE) {
      powerPurple(group.length)
    } else if (tapped) {
      const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
      consumePurple(group, boxes)
    }
  })
}
