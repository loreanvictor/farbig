import { listen, dispatch, defineEvents } from '../dispatch.js'
import { addScore } from '../score.js'
import { GRAY } from '../box/index.js'
import { CHOSEN_COLOR, addScoreOnPop, matchScore, chosenBonus } from './common.js'


defineEvents(
  'gravity:turned-on',
  'gravity:turned-off',
  'gravity:off-tick',
)

export const GRAY_SCORE = 10
export const MAX_GRAV_COUNTER = 12

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

const addZeroGBonus = engine => {
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

export const addGrayEffect = (engine, config) => {
  addScoreOnPop(GRAY, matchScore(config.MIN_MATCH, GRAY_SCORE))
  addZeroGAttractEffect(engine)
  addZeroGBonus(engine)

  const indicator = document.getElementById('antigrav')
  const DEFAULT_GRAVITY = engine.gravity.scale

  let antiGravCounter = 0
  let gravRunner
  
  const turnGravityOff = (mul = 1) => {
    const mult = CHOSEN_COLOR === GRAY ? 2 : 1
    antiGravCounter = Math.min(MAX_GRAV_COUNTER, antiGravCounter + mul) * mult
    const gravCounterStep = 300
    const extended = isGravityOff(engine)

    engine.gravity.scale = 0

    dispatch('gravity:turned-off', {
      time: antiGravCounter * gravCounterStep,
      extended,
    })
  
    if (!gravRunner) {
      gravRunner = setInterval(() => {
        if (antiGravCounter > 0) {
          engine.gravity.scale = 0
          antiGravCounter--
          indicator.style.transform = `scaleX(${antiGravCounter / (MAX_GRAV_COUNTER * mult)})`

          dispatch('gravity:off-tick', { time: antiGravCounter * gravCounterStep })
        } else {
          engine.gravity.scale = DEFAULT_GRAVITY
          dispatch('gravity:turned-on')
        }
      }, gravCounterStep)
    }
  }

  listen('box:popped', ({ box, group }) => {
    if (box.tag === GRAY) {
      turnGravityOff(group.length)
    }
  })
}
