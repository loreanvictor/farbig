import Color from 'https://esm.sh/v135/color@4.2.3/es2022/color.mjs'

import { defineEvents, dispatch } from '../dispatch.js'

export const ORANGE = '#efa73e'
export const RED = '#bb2757'
export const BLUE = '#4974be'
export const GREEN = '#52b469'
export const PURPLE = '#912e83'
export const WHITE = '#e3dbbd'
export const GRAY = '#325379'

export const COLORS = [ORANGE, RED, BLUE, GREEN, PURPLE, WHITE, GRAY]

defineEvents('box:color-changed')

export const changeColor = (box, color) => {
  const from = box.tag
  box.tag = color
  box.plugin.touched = false
  if (!(box.plugin.frost > 0)) {
    box.render.strokeStyle = color
  }

  if (!box.plugin.conversionInterval) {
    box.plugin.conversionInterval = setInterval(() => {
      const target = Color(box.tag)
      const current = Color(box.render.fillStyle)
      const targethsl = target.hsl().object()
      const currenthsl = current.hsl().object()

      const dist = Math.max(
        Math.abs(targethsl.h - currenthsl.h),
        Math.abs(targethsl.s - currenthsl.s),
        Math.abs(targethsl.l - currenthsl.l)
      )

      if (dist < 0.01) {
        clearInterval(box.plugin.conversionInterval)
        box.plugin.conversionInterval = undefined
        box.render.fillStyle = box.tag

        dispatch('box:color-changed', { box, from, to: box.tag })
      } else {
        box.render.fillStyle = current.mix(target, 0.3).hex()
      }
    }, 10)
  }
}
