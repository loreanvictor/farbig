import { listen, dispatch, defineEvents } from '../dispatch.js'
import { addScore } from '../score.js'
import { GRAY } from '../box/index.js'
import { createTimer } from './util/timer.js'
import { createIndicator } from './util/indicator.js'
import { addScoreOnPop, matchScore, chosenBonus } from './common.js'


defineEvents(
  'gravity:turned-on',
  'gravity:turned-off',
  'gravity:off-tick',
)

export const GRAY_SCORE = 10

const isGravityOff = engine => engine.gravity.scale === 0

const addZeroGAttractEffect = engine => {
  let attractColor = undefined

  listen('box:touched', box => {
    if (isGravityOff(engine)) {
      attractColor = box.tag
    }
  })

  listen('cursor:hold', pos => {
    const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
    if (isGravityOff(engine)) {
      boxes.forEach(box => {
        if (box.tag === attractColor) {
          const f = Matter.Vector.mult(
            Matter.Vector.normalise(
              Matter.Vector.sub(pos, box.position)
            ), 0.2
          )
  
          Matter.Body.applyForce(box, pos, f)
        }
      })
    }
  })

  listen('gravity:turned-on', () => attractColor = undefined)
}

const addZeroGBonus = () => {
  const minGravTime = 1000

  let vaccumCombo = 0
  let lastRun = 0
  let gravOff = false
  let gravOffTime = 0
  let colors = []

  listen('gravity:turned-off', () => {
    lastRun = 0
    colors = []
    gravOff = true
  })

  listen('gravity:off-tick', ({ time }) => gravOffTime = time)

  listen('score:added', ({ added, color }) => {
    if (gravOff && color !== GRAY) {
      const timecoeff = Math.min(1, 1 / (1 + Math.exp(-10 * (gravOffTime / minGravTime - 0.75))))
      lastRun += added * timecoeff
      if (!colors.includes(color)) {
        colors.push(color)
      }
    }
  })

  listen('gravity:turned-on', () => {
    gravOff = false
    vaccumCombo = Math.sqrt(vaccumCombo * vaccumCombo + lastRun * lastRun * colors.length)
  })

  listen('group:popped', ({ group }) => {
    if (group[0].tag === GRAY) {
      addScore(Math.floor(group.length * vaccumCombo / 128) * chosenBonus(GRAY), GRAY)
    }
  })
}

const addZeroGEffect = (engine) => {
  const DEFAULT_GRAVITY = engine.gravity.scale
  const NO_GRAV_STEPS = 300
  const MAX_NO_GRAV_TIME = 12 * NO_GRAV_STEPS * chosenBonus(GRAY)

  const timer = createTimer(NO_GRAV_STEPS)
  const indicator = createIndicator({
    element: document.getElementById('antigrav'),
    max: MAX_NO_GRAV_TIME
  })
  
  const turnGravityOff = (mul = 1) => {
    timer.set(Math.min(MAX_NO_GRAV_TIME, timer.get() + mul * NO_GRAV_STEPS * chosenBonus(GRAY)))
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
      turnGravityOff(Math.floor(group.length * group.length / 2))
    }
  })
}

export const addGrayEffect = (engine, config) => {
  addScoreOnPop(GRAY, matchScore(config.MIN_MATCH, GRAY_SCORE))
  addZeroGAttractEffect(engine)
  addZeroGBonus(engine)
  addZeroGEffect(engine)
}
