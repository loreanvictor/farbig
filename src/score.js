import comma from 'https://esm.sh/v135/comma-number@2.1.0/es2022/comma-number.mjs'

import { listen } from './dispatch.js'
import { RED, GRAY, ORANGE, BLUE, PURPLE, WHITE, GREEN } from './box/colors.js'
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

const SCOREMAP = {
  [RED]: 1,
  [BLUE]: 10,
  [ORANGE]: 1,
  [PURPLE]: 1,
  [WHITE]: 1,
  [GREEN]: 1,
  [GRAY]: 10,
}

const BASESCORE = 10

const _COLORS = Object.keys(SCOREMAP)
export const CHOSEN_COLOR = _COLORS[
  (
    Math.floor(new Date().getTime() / (1000 * 60 * 60))
  ) % _COLORS.length
]

document.getElementById('chosen').style.backgroundColor = CHOSEN_COLOR

// TODO: make this color agnostic, and calculations
//       should happen in effect of each color.
export function addScore(combo, color) {
  let C = combo * SCOREMAP[color]
  if (color === GREEN) {
    const croot = Math.sqrt(combo)
    C = Math.max(Math.floor((croot * croot * croot) / 1.4), .1)
  }

  if (color === CHOSEN_COLOR) {
    C *= 2
  }

  score += Math.floor(C * BASESCORE)
  updateScore()

  if(C > 1) {
    cueCombo(C)
  }
}

// TODO: move this to the effect of each color
export const addScoreOnPop = (minmatch) => {
  listen('pop:group', ({ group }) => {
    const M = group.length - minmatch + 1
    const combo = M > 0 ? M * M : 0.1
    addScore(combo, group[0].tag)
  })
}
