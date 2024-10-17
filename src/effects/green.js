import { addScoreOnPop, CHOSEN_COLOR, BASE_SCORE } from './common.js'
import { GREEN } from '../box/index.js'


export const addGreenEffect = () => {
  const score = CHOSEN_COLOR === GREEN ? BASE_SCORE * 2 : BASE_SCORE

  addScoreOnPop(GREEN, (count) =>
    Math.max(
      Math.floor(
        (count * count * count) / 1.4
      ) * score, 1
    )
  )
}
