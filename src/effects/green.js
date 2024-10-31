import { addScoreOnPop, isChosen, BASE_SCORE } from './common.js'
import { GREEN } from '../box/index.js'


export const addGreenEffect = () => {
  const score = isChosen(GREEN) ? BASE_SCORE * 2 : BASE_SCORE

  addScoreOnPop(GREEN, (count) =>
    Math.max(
      Math.floor(
        (count * count * count) / 1.35
      ) * score, 1
    )
  )
}
