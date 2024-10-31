import { listen, dispatch, defineEvents } from '../dispatch.js'
import { COLORS } from '../box/index.js'
import { addScore } from '../score.js'


defineEvents('chosen-color:changed')

let chosenOffset = 0
const choose = () => COLORS[
  (
    (Math.floor(new Date().getTime() / (1000 * 60 * 60))) + chosenOffset
  ) % COLORS.length
]

let chosenColor = choose()
const render = () => document.getElementById('chosen').style.backgroundColor = chosenColor
render()

export const nextChosenColor = () => {
  const prev = chosenColor
  chosenOffset++
  chosenColor = choose()

  render()
  dispatch('chosen-color:changed', { prev, offset: chosenOffset, color: chosenColor })
}

export const BASE_SCORE = 10

export const isChosen = (color) => color === chosenColor
export const chosenBonus = color => isChosen(color) ? 2 : 1

export const matchScore = (minmatch, base = BASE_SCORE) => (count, color) => {
  const M = count - minmatch + 1

  return (M > 0 ? M * M * base : 1) * chosenBonus(color)
}


export const addScoreOnPop = (color, calc) => {
  listen('group:popped', ({ group }) => {
    if (group[0].tag === color) {
      addScore(calc(group.length, color), color)
    }
  })
}
