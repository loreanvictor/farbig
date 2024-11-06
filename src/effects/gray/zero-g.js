import { listen, observe, dispatch, defineEvents } from '../../dispatch.js'
import { GRAY } from '../../box/index.js'

import { chosenBonus } from '../common.js'
import { createTimer } from '../util/timer.js'
import { createIndicator } from '../util/indicator.js'


defineEvents(
  'gravity:turned-on',
  'gravity:turned-off',
  'gravity:off-tick',
)

export const isGravityOff = (engine) => engine.gravity.scale === 0

export const addZeroGEffect = (engine) => {
  const vaccumCombo = observe('vaccum:combo-changed', ({ combo }) => Math.min(combo / 500_000 + 1, 2), 1)

  const DEFAULT_GRAVITY = engine.gravity.scale
  const NO_GRAV_STEPS = 300
  const MAX_NO_GRAV_TIME = 12 * NO_GRAV_STEPS * chosenBonus(GRAY) * vaccumCombo.get()

  const timer = createTimer(NO_GRAV_STEPS)
  const indicator = createIndicator({
    element: document.getElementById('antigrav'),
    max: MAX_NO_GRAV_TIME
  })
  
  const turnGravityOff = (mul = 1) => {
    timer.set(Math.min(MAX_NO_GRAV_TIME, timer.get() + mul * NO_GRAV_STEPS * chosenBonus(GRAY)) * vaccumCombo.get())
    const extended = isGravityOff(engine)

    engine.gravity.scale = 0

    dispatch('gravity:turned-off', {
      time: timer.get(),
      extended,
    })
  }

  timer.listen(({ time }) => {
    indicator.set(time)

    if (time === 0) {
      engine.gravity.scale = DEFAULT_GRAVITY
      dispatch('gravity:turned-on')
    } else {
      engine.gravity.scale = 0
      dispatch('gravity:off-tick', { time: timer.get() })
    }
  })

  listen('group:popped', ({ group }) => {
    if (group[0].tag === GRAY) {
      turnGravityOff(Math.floor(group.length * group.length / 1.3))
    }
  })
}
