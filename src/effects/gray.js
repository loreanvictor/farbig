import { listen, dispatch } from '../dispatch.js'
import { addScore } from '../score.js'
import { GRAY } from '../box/index.js'
import { CHOSEN_COLOR, addScoreOnPop, matchScore, chosenBonus } from './common.js'


export const GRAY_SCORE = 10
export const MAX_GRAV_COUNTER = 12

const isGravityOff = engine => engine.gravity.scale === 0

const addZeroGAttractEffect = engine => {
  let attractColor = undefined

  listen('touch:box', box => {
    if (isGravityOff(engine)) {
      attractColor = box.tag
    }
  })

  listen('hold', pos => {
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

  listen('gravity:on', () => attractColor = undefined)
}

const addZeroGBonus = engine => {
  let vaccumCombo = 0
  let lastRun = 0

  listen('gravity:on', () => {
    vaccumCombo = Math.sqrt(vaccumCombo * vaccumCombo + lastRun * lastRun)
    lastRun = 0
  })

  listen('score:add', ({ added, color }) => {
    if (color !== GRAY) {
      lastRun += added
    }
  })

  listen('pop:group', ({ group }) => {
    if (group[0].tag === GRAY) {
      addScore(Math.floor(group.length * vaccumCombo / 96) * chosenBonus(GRAY), GRAY)
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

    dispatch('gravity:off', {
      time: antiGravCounter * gravCounterStep,
      extended,
    })
  
    if (!gravRunner) {
      gravRunner = setInterval(() => {
        if (antiGravCounter > 0) {
          engine.gravity.scale = 0
          antiGravCounter--
          indicator.style.transform = `scaleX(${antiGravCounter / (MAX_GRAV_COUNTER * mult)})`
        } else {
          engine.gravity.scale = DEFAULT_GRAVITY
          dispatch('gravity:on')
        }
      }, gravCounterStep)
    }
  }

  listen('pop:box', ({ box, group }) => {
    if (box.tag === GRAY) {
      turnGravityOff(group.length)
    }
  })
}
