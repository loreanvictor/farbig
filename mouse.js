import { findMatchesOf } from './match.js'
import { BOX_CONFIG } from './box.js'


const addPopOnClick = (mouse, engine, pop) => {
  let cltimer
  let downpos
  Matter.Events.on(mouse, 'mousedown', event => {
    downpos = event.mouse.position
    cltimer = setTimeout(() => cltimer = undefined, 200)
  })
  
  Matter.Events.on(mouse, 'mouseup', (event) => {
    if (cltimer) {
      cltimer = undefined
      if (Matter.Vector.magnitude(Matter.Vector.sub(downpos, event.mouse.position)) < 5) {
        const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
        const targets = Matter.Query.point(boxes, event.mouse.position)
        if (targets.length > 0) {
          const group = findMatchesOf(boxes, targets[0])
          pop(group)
        }        
      }
    }
  })
}

const addAttractionOnPress = (mouse, engine) => {
  let attract = false

  Matter.Events.on(mouse, 'mousedown', () => attract = true)

  Matter.Events.on(mouse, 'mousemove', event => {
    if (attract) {
      const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
      boxes.forEach(box => {
        const distance = Matter.Vector.magnitude(
          Matter.Vector.sub(event.mouse.position, box.position)
        )

        if (engine.gravity.scale === 0 || distance < 1.2 * BOX_CONFIG.SIZE) {
          const f = Matter.Vector.mult(
            Matter.Vector.normalise(
              Matter.Vector.sub(event.mouse.position, box.position)
            ), 0.01
          )
    
          Matter.Body.applyForce(box, event.mouse.position, f)
        }
      })
    }
  })

  Matter.Events.on(mouse, 'mouseup', () => attract = false)
}


const addFadeOnHover = (mouse, engine) => {
  let hovered = []
  
  Matter.Events.on(mouse, 'mousemove', (event) => {
    const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
    const targets = Matter.Query.point(boxes, event.mouse.position)
    hovered.forEach(b => {
      b.render.opacity = 1
    })
    hovered = []
    if (targets.length > 0) {
      hovered = findMatchesOf(boxes, targets[0])
    }
    hovered.forEach(b => {
      b.render.opacity = 0.85
    })
  })
}


export const createMouse = (engine, render, pop) => {
  const mouse = Matter.MouseConstraint.create(engine, {
    element: render.canvas,
    constraint: {
        render: {
            visible: false
        },
        stiffness: 0.2
    }
  })
  
  addPopOnClick(mouse, engine, pop)
  // addFadeOnHover(mouse, engine)
  addAttractionOnPress(mouse, engine)

  return mouse
}
