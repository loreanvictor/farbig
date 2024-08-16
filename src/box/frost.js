import { BLUE, ORANGE, WHITE, changeColor } from './colors.js'


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

  if (box.tag === ORANGE) {
    changeColor(box, WHITE)
  }
}
