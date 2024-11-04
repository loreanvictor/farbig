import { listen } from '../../dispatch.js'
import { ORANGE, GRAY, changeColor } from '../../box/index.js'


export const addOrangeToGrayEffect = () => {
  listen('box:unfreezed', ({ box }) => {
    if (box.tag === ORANGE) {
      changeColor(box, GRAY)
    }
  })
}
