import { listen } from '../dispatch.js'
import { random } from '../random.js'
import { PURPLE, BOX_CONFIG, changeColor } from '../box/index.js'
import { isChosen, addScoreOnPop, matchScore } from './common.js'
import { createIndicator } from './util/indicator.js'


export const addPurpleEffect = (engine, config) => {
  addScoreOnPop(PURPLE, matchScore(config.MIN_MATCH))

  let purplePower = 0

  const REPURPLE_CHANCE = isChosen(PURPLE) ? 85 : 30
  const MAX_PURPLE = 9
  const indicator = createIndicator({
    element: document.getElementById('purple'),
    max: MAX_PURPLE
  })

  let turnedPurple = 0

  const powerPurple = (mul) => {
    purplePower = Math.min(MAX_PURPLE, purplePower + mul * mul)
    indicator.over(100).set(purplePower).take('background').over(0).set(PURPLE).done()
  }

  const consumePurple = (group, boxes) => {
    const mult = isChosen(PURPLE) ? 12 : 2
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

    indicator
      .take('background').over(100).set(targetColor)
      .take('value').over(purplePower * 100).set(0)

    purplePower = 0
  }

  listen('box:created', ({ box }) => {
    if (turnedPurple > 0) {
      if (random(0, 100) < REPURPLE_CHANCE) {
        changeColor(box, PURPLE)
      }

      turnedPurple--
    }
  })

  listen('group:popped', ({ group, tapped }) => {
    if (group[0].tag === PURPLE) {
      powerPurple(group.length)
    } else if (tapped) {
      const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
      consumePurple(group, boxes)
    }
  })
}
