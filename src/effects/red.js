import { addScore } from '../score.js'
import { listen } from '../dispatch.js'
import { RED } from '../box/index.js'
import { addScoreOnPop, matchScore, chosenBonus } from './common.js'


export const addRedEffect = (_, config) => {
  addScoreOnPop(RED, matchScore(config.MIN_MATCH))

  let redTimer
  let redCombo = 0

  const MAX_RED = 8192
  const RED_DURATION = 3750
  const RED_SCORE_STEPS = 7

  const activateRed = (mul) => {
    redCombo = Math.min(redCombo + Math.floor(Math.max(mul * mul, 8) * chosenBonus(RED) * chosenBonus(RED)), MAX_RED)
    const redInd = document.getElementById('red')
    redInd.style.transition = 'none'
    redInd.style.transform = 'scaleX(1)'
    setTimeout(() => {
      redInd.style.transition = `transform ${RED_DURATION}ms`
      redInd.style.transform = 'scaleX(0)'
    }, 50)

    const scoreCoeff = (Math.floor((redTimer / RED_DURATION) * RED_SCORE_STEPS) + 1) / RED_SCORE_STEPS
    addScore(Math.max(2, Math.floor(redCombo * scoreCoeff * 1.5)), RED)
    redTimer = RED_DURATION
  }

  setInterval(() => {
    if (redTimer > 0) {
      redTimer -= 10
    } else {
      redTimer = 0
      redCombo = 0
    }
  }, 10)

  listen('box:popped', ({ box, group }) => {
    if (box.tag === RED) {
      activateRed(group.length)
    }
  })
}
