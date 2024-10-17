import comma from 'https://esm.sh/v135/comma-number@2.1.0/es2022/comma-number.mjs'

import { dispatch } from './dispatch.js'
import { seed } from './random.js'


const dayRecordKey = `highScore-${seed}`
const dayRecord = parseInt(localStorage.getItem(dayRecordKey) ?? 0)
const personalBest = parseInt(localStorage.getItem('highScore') ?? 0)
let personalBestToast = false
let dayRecordToast = false
let score = 0
document.getElementById('tscore').textContent = `${comma(dayRecord)}`
document.getElementById('record').textContent = `${comma(personalBest)}`

function updateScore() {
  document.getElementById('score-val').textContent = `${comma(score)}`
  document.getElementById('fscore').textContent = `${comma(score)}`

  if (score > personalBest) {
    localStorage.setItem('highScore', `${score}`)
    document.getElementById('record').textContent = `${comma(score)}`

    if (!personalBestToast) {
      setTimeout(() => showCombo('New Personal Best!'), 500)
      personalBestToast = true
      dayRecordToast = true
    }
  }

  if (score > dayRecord) {
    localStorage.setItem(dayRecordKey, `${score}`)
    document.getElementById('tscore').textContent = `${comma(score)}`

    if (!dayRecordToast) {
      setTimeout(() => showCombo('New Record!'), 500)
      dayRecordToast = true
    }
  }
}

let cued = 0
let to = undefined
function cueCombo(combo) {
  cued += combo
  clearTimeout(to)
  to = setTimeout(() => {
    showCombo(`${cued}X`)
    cued = 0
  })
}

function showCombo(msg) {
  const comboMarker = document.createElement('div')
  comboMarker.classList.add('combo')
  comboMarker.textContent = msg
  const x = Math.random() * 20 - 10
  comboMarker.style.transform = `translateX(${x}rem)`
  document.getElementById('game-container').appendChild(comboMarker)
  setTimeout(() => {
    comboMarker.classList.add('fading')
    comboMarker.style.transform = `
      translateX(${x}rem)
      translateY(-15rem)
      scale(3)
    `
  }, 50)
  comboMarker.addEventListener('transitionend', () => comboMarker.remove())
}


export function addScore(added, color) {
  score += added
  updateScore()

  dispatch('score:add', { added, score, color })

  if(added > 10) {
    cueCombo(added)
  }
}
