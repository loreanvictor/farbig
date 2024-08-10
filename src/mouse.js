import { dispatch } from './dispatch.js'


const addBoxTouchListener = (mouse, engine) => {
  Matter.Events.on(mouse, 'startdrag', event => {
    if (event.body.kind === 'box') {
      if (engine.gravity.scale > 0) {
        event.body.plugin.touched = true
      }
      dispatch('touch:box', event.body)
    }
  })
}

const addBoxTapListener = (mouse, engine) => {
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
          dispatch('tap:box', targets)
        }
      }
    }
  })
}

const addHoldListener = (mouse) => {
  let holdpos = undefined
  let holding = false

  Matter.Events.on(mouse, 'mousedown', (event) => { 
    holding = true
    holdpos = event.mouse.position
  })
  Matter.Events.on(mouse, 'mousemove', (event) => { holdpos = event.mouse.position })
  Matter.Events.on(mouse, 'mouseup', () => {
    holding = false
    holdpos = undefined
  })

  setInterval(() => {
    holding && dispatch('hold', holdpos)
  }, 1000 / 60)
}

export const createMouse = (engine, render) => {
  const mouse = Matter.MouseConstraint.create(engine, {
    element: render.canvas,
    constraint: {
        render: {
            visible: false
        },
        stiffness: 0.2
    }
  })
  
  addBoxTapListener(mouse, engine)
  addBoxTouchListener(mouse, engine)
  addHoldListener(mouse)

  Matter.World.add(engine.world, mouse)
}
