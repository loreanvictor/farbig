import { addGrayEffect } from './gray.js'
import { addRedEffect } from './red.js'
import { addPurpleEffect } from './purple.js'
import { addBlueEffect } from './blue.js'
import { addOrangeEffect } from './orange.js'
import { addWhiteEffect } from './white.js'


export const addColorEffects = (engine) => {
  addGrayEffect(engine)
  addRedEffect(engine)
  addPurpleEffect(engine)
  addBlueEffect(engine)
  addOrangeEffect(engine)
  addWhiteEffect(engine)
}
