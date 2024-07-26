import { listen } from '../dispatch.js'
import { PURPLE, BOX_CONFIG, changeColor } from '../box/index.js'


export const addPurpleEffect = (engine) => {
  let purplePower = 0

  const MAX_PURPLE = 81
  const purpleInd = document.getElementById('purple')

  const powerPurple = (mul) => {
    purplePower = Math.min(MAX_PURPLE, purplePower + mul)
    purpleInd.style.transform = `scaleX(${Math.sqrt(purplePower / MAX_PURPLE)})`
  }

  const consumePurple = (box, boxes) => {
    boxes.forEach(b => {
      if (b !== box && b.tag === PURPLE) {
        const distance = Matter.Vector.magnitude(Matter.Vector.sub(b.position, box.position))
        if (distance < BOX_CONFIG.SIZE * Math.sqrt(purplePower) * 2) {
          changeColor(b, box.tag)
        }
      }
    })

    purplePower = 0
    purpleInd.style.transform = 'scaleX(0)'
  }

  listen('pop:box', ({ box, group, tapped }) => {
    if (box.tag === PURPLE) {
      powerPurple(group.length)
    } else if (tapped) {
      const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
      consumePurple(box, boxes)
    }
  })
}
