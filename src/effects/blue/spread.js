import { listen } from '../../dispatch.js'
import { freeze, isFrozen, BLUE } from '../../box/index.js'

import { isChosen } from '../common.js'

import { freezables } from './common.js'


export const addFreezeSpread = (engine) => {
  const FROST_SPREAD_FALLOFF = isChosen(BLUE) ? .95 : .45

  listen('box:freezed', ({ box, refreeze }) => {
    if (!refreeze) {
      setTimeout(() => {
        freezables(engine, box).forEach(b => {
          if (!isFrozen(b) && b.tag === box.tag) {
            freeze(b, box.plugin.frost * FROST_SPREAD_FALLOFF)
          }
        })
      }, 60)
    }
  })
}
