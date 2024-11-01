import { addScore } from '../score.js'
import { listen } from '../dispatch.js'
import { RED } from '../box/index.js'
import { createTimer } from './util/timer.js'
import { addScoreOnPop, matchScore, chosenBonus } from './common.js'


const addRedTimerEffect = () => {
  let redCombo = 0

  const MAX_RED = 8192
  const RED_DURATION = 3500
  const RED_SCORE_STEPS = 7

  const timer = createTimer()

  const activateRed = (mul) => {
    redCombo = Math.min(redCombo + Math.floor(Math.max(mul * mul, 8) * chosenBonus(RED) * chosenBonus(RED)), MAX_RED)
    const redInd = document.getElementById('red')
    redInd.style.transition = 'none'
    redInd.style.transform = 'scaleX(1)'
    setTimeout(() => {
      redInd.style.transition = `transform ${RED_DURATION}ms`
      redInd.style.transform = 'scaleX(0)'
    }, 50)

    const scoreCoeff = (Math.floor((timer.get() / RED_DURATION) * RED_SCORE_STEPS) + 1) / RED_SCORE_STEPS
    addScore(Math.max(2, Math.floor(redCombo * scoreCoeff * 2)), RED)
    timer.set(RED_DURATION)
  }

  timer.listen(({ time }) => time === 0 && (redCombo = 0))

  listen('box:popped', ({ box, group }) => {
    if (box.tag === RED) {
      activateRed(group.length)
    }
  })
}


export const addRedEffect = (_, config) => {
  addScoreOnPop(RED, matchScore(config.MIN_MATCH))
  addRedTimerEffect()
}
