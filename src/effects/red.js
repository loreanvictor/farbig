import { addScore } from '../score.js'
import { listen } from '../dispatch.js'
import { RED } from '../box/index.js'


export const addRedEffect = () => {
  let redTimer
  let redCombo = 0

  const MAX_RED = 1024
  const RED_DURATION = 3000

  const activateRed = (mul) => {
    redCombo = Math.min(redCombo + Math.floor(Math.max(mul * mul, 1)), MAX_RED)
    const redInd = document.getElementById('red')
    redInd.style.transition = 'none'
    redInd.style.transform = 'scaleX(1)'
    setTimeout(() => {
      redInd.style.transition = `transform ${RED_DURATION}ms`
      redInd.style.transform = 'scaleX(0)'
    }, 50)

    const scoreCoeff = (Math.floor((redTimer / RED_DURATION) * 5) + 1) / 5
    addScore(Math.max(2, Math.floor(redCombo * scoreCoeff)), RED)
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

  listen('pop:box', ({ box, group }) => {
    if (box.tag === RED) {
      activateRed(group.length)
    }
  })
}
