import { addScore } from '../score.js'
import { listen } from '../dispatch.js'
import { RED } from '../box/index.js'


export const addRedEffect = () => {
  let redTimer
  let redCombo = 0

  const MAX_RED = 96
  const RED_DURATION = 3000

  const activateRed = (mul) => {
    clearTimeout(redTimer)
    redCombo = Math.min(redCombo + Math.max(mul * mul / 2, 1), MAX_RED)
    const redInd = document.getElementById('red')
    redInd.style.transition = 'none'
    redInd.style.transform = 'scaleX(1)'
    setTimeout(() => {
      redInd.style.transition = `transform ${RED_DURATION}ms`
      redInd.style.transform = 'scaleX(0)'
    }, 50)

    addScore(Math.max(2, redCombo), RED)
    redTimer = setTimeout(() => redCombo = 0, RED_DURATION)
  }

  listen('pop:box', ({ box, group }) => {
    if (box.tag === RED) {
      activateRed(group.length)
    }
  })
}
