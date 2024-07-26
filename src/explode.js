import { listen } from './dispatch.js'
import {
  BOX_CONFIG,
  RED, GRAY, ORANGE, BLUE, PURPLE, WHITE, GREEN,
  changeColor, freeze, unfreeze
} from './box/index.js'
import { addScore, CHOSEN_COLOR } from './score.js'
import { random } from './random.js'

// TODO: make effects event-driven as well

let antiGravCounter = 0
let gravRunner
const maxGravCounter = 12
const DEFAULT_GRAVITY = 0.001

const turnGravityOff = (engine, mul = 1) => {
  const mult = CHOSEN_COLOR === GRAY ? 2 : 1
  antiGravCounter = Math.min(maxGravCounter, antiGravCounter + mul) * mult
  engine.gravity.scale = 0

  if (!gravRunner) {
    gravRunner = setInterval(() => {
      if (antiGravCounter > 0) {
        engine.gravity.scale = 0
        antiGravCounter--
        document.getElementById('antigrav').style.transform = `scaleX(${antiGravCounter / (maxGravCounter * mult)})`
      } else {
        engine.gravity.scale = DEFAULT_GRAVITY
      }
    }, 300)
  }
}

let redTimer
let redCombo = 0
const MAX_RED = 64
const RED_DURATION = 2500
const activateRed = (mul) => {
  clearTimeout(redTimer)
  redCombo = Math.min(redCombo + mul, MAX_RED)
  const redInd = document.getElementById('red')
  redInd.style.transition = 'none'
  redInd.style.transform = 'scaleX(1)'
  setTimeout(() => {
    redInd.style.transition = `transform ${RED_DURATION}ms`
    redInd.style.transform = 'scaleX(0)'
  }, 50)
  setTimeout(() => addScore(Math.max(2, redCombo), RED), 100)
  redTimer = setTimeout(() => redCombo = 0, RED_DURATION)
}

let purplePower = 0
const MAX_PURPLE = 81
const purpleInd = document.getElementById('purple')

const powerPurple = (mul) => {
  purplePower = Math.min(MAX_PURPLE, purplePower + mul)
  purpleInd.style.transform = `scaleX(${Math.sqrt(purplePower / MAX_PURPLE)})`
}

const consumePurple = (box, boxes) => {
  boxes.forEach(b => {
    if (b !== box && b.tag === PURPLE) {
      const distance = Matter.Vector.magnitude(Matter.Vector.sub(b.position, box.position))
      if (distance < BOX_CONFIG.SIZE * Math.sqrt(purplePower) * 2) {
        changeColor(b, box.tag)
      }
    }
  })

  purplePower = 0
  purpleInd.style.transform = 'scaleX(0)'
}


export function explode(engine, box, multiplier = 1, tapped = false) {
  const gmult = CHOSEN_COLOR === GRAY ? 2 : 1
  const force = box.tag === RED ? 50 : box.tag === GRAY ? -30 * gmult : 20

  const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
  boxes.forEach(b => {
    if (b !== box) {
      const d = Matter.Vector.sub(b.position, box.position)
      const dl = Matter.Vector.magnitude(d)
      const f = Matter.Vector.mult(Matter.Vector.div(d, dl * dl), force)
      Matter.Body.applyForce(b, box.position, f)
    }
  })

  if (box.tag === RED) {
    activateRed(multiplier)
  }

  if (box.tag === BLUE) {
    const mult = CHOSEN_COLOR === BLUE ? 2 : 1
    setTimeout(() => {
      boxes.forEach(b => {
        const distance = Matter.Vector.magnitude(Matter.Vector.sub(b.position, box.position))
        if (distance < BOX_CONFIG.SIZE * 1.5) {
          freeze(b, 2000 * multiplier * mult)
        }
      })
    }, 10)
  }

  if (box.tag === GRAY) {
    turnGravityOff(engine, multiplier)
  }

  if (box.tag === ORANGE) {
    const mult = CHOSEN_COLOR === ORANGE ? 1.2 : 1
    setTimeout(() => {
      let converted = 0
      boxes.forEach(b => {
        const distance = Matter.Vector.magnitude(Matter.Vector.sub(b.position, box.position))
        const chance = Math.max(Math.min(multiplier * multiplier * multiplier / 3, 80), 25)
        if (distance < BOX_CONFIG.SIZE * 1.5 * mult) {
          unfreeze(b)
          if (random(0, 100) < chance) {
            changeColor(b, ORANGE)
            converted++
          }
        }
      })

      if (converted > 0) {
        addScore(converted, ORANGE)
      }
    }, 10)
  }

  if (box.tag === PURPLE) {
    const mult = CHOSEN_COLOR === PURPLE ? 2 : 1
    powerPurple(multiplier * mult)
  } else if (tapped) {
    consumePurple(box, boxes)
  }

  if (box.tag === WHITE) {
    const colors = [RED, BLUE, GREEN, PURPLE, GRAY, ORANGE]
    const mult = CHOSEN_COLOR === WHITE ? 1.5 : 1
    setTimeout(() => {
      boxes.forEach(b => {
        const distance = Matter.Vector.magnitude(Matter.Vector.sub(b.position, box.position))
        if (
          b.tag !== WHITE &&
          !boxes.some(box => box.tag === b.tag && box.isStatic) &&
          distance < BOX_CONFIG.SIZE * Math.max(multiplier / 2, 1) * 1.2 * mult
        ) {
          const color = colors[random(0, colors.length - 1)]
          changeColor(b, color)
        }
      })
    }, 200)
  }
}


export const addExplodeOnPop = engine => {
  listen('pop:box', ({ box, group, tapped }) => {
    explode(engine, box, group.length, tapped)
  })
}
