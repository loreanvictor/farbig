import { BLUE } from './colors.js'


export const BOX_CONFIG = {
  SIZE: 72,
  RADIUS: 8,
  RESTITUTION: 0.5,
  FRICTION: 10,
}


export function createBox(x, y, color) {
  const box = Matter.Bodies.rectangle(
      x, y, 
      BOX_CONFIG.SIZE, BOX_CONFIG.SIZE, {
        restitution: BOX_CONFIG.RESTITUTION,
        friction: BOX_CONFIG.FRICTION,
        kind: 'box',
        tag: color,
        render: {
            fillStyle: color,
            strokeStyle: color,
            lineWidth: 0,
        },
        chamfer: {
          radius:[
            BOX_CONFIG.RADIUS,
            BOX_CONFIG.RADIUS,
            BOX_CONFIG.RADIUS,
            BOX_CONFIG.RADIUS,
          ]
        }
    }
  )

  return box
}


export function changeColor(box, color) {
  box.tag = color
  box.render.fillStyle = color
  if (!(box.plugin.frost > 0)) {
    box.render.strokeStyle = color
  }
}

export function freeze(box, time) {
  if (!box.isStatic) {
    Matter.Body.setStatic(box, true)
    box.render.strokeStyle = BLUE
  }

  box.plugin.frost = box.plugin.frost || 0
  box.plugin.frost = Math.min(box.plugin.frost + time, 7000)
  box.render.lineWidth = box.plugin.frost / 250

  if (!box.plugin.unfreezeInterval) {
    box.plugin.unfreezeInterval = setInterval(() => {
      box.plugin.frost = Math.max(box.plugin.frost - 30, 0)
      box.render.lineWidth = box.plugin.frost / 250
      if (box.plugin.frost <= 0) {
        clearInterval(box.plugin.unfreezeInterval)
        box.plugin.unfreezeInterval = undefined
        unfreeze(box)
      }
    }, 30)
  }
}


export function unfreeze(box) {
  Matter.Body.setStatic(box, false)
  box.plugin.frost = 0
  box.render.strokeStyle = box.render.fillStyle
  box.render.lineWidth = 0
}
