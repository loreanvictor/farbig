import { listen } from '../dispatch.js'
import { COLORS } from '../box/index.js'
import { addScore } from '../score.js'


export const CHOSEN_COLOR = COLORS[
  (
    Math.floor(new Date().getTime() / (1000 * 60 * 60))
  ) % COLORS.length
]

document.getElementById('chosen').style.backgroundColor = CHOSEN_COLOR


export const BASE_SCORE = 10


export const chosenBonus = color => color === CHOSEN_COLOR ? 2 : 1


export const matchScore = (minmatch, base = BASE_SCORE) => (count, color) => {
  const M = count - minmatch + 1

  return (M > 0 ? M * M * base : 1) * chosenBonus(color)
}


export const addScoreOnPop = (color, calc) => {
  listen('pop:group', ({ group }) => {
    if (group[0].tag === color) {
      addScore(calc(group.length, color), color)
    }
  })
}
