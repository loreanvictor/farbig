import { defineEvents, dispatch } from '../dispatch.js'
import { BLUE } from './colors.js'


defineEvents(
  'box:freezed',
  'box:unfreezed',
)

export function freeze(box, time) {
  if (time < 200) {
    return
  }

  if (!box.isStatic) {
    Matter.Body.setStatic(box, true)
    box.render.strokeStyle = BLUE
  }

  const refreeze = isFrozen(box)

  box.plugin.frost = box.plugin.frost || 0
  box.plugin.frost = Math.min(box.plugin.frost + time, 7000)
  box.render.lineWidth = box.plugin.frost / 250

  dispatch('box:freezed', { box, refreeze })

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

export function isFrozen(box) {
  return box.plugin.frost > 0
}

export function unfreeze(box) {
  if (isFrozen(box) || box.isStatic) {
    dispatch('box:unfreezed', { box })
  }

  Matter.Body.setStatic(box, false)
  box.plugin.frost = 0
  box.render.strokeStyle = box.render.fillStyle
  box.render.lineWidth = 0
}
