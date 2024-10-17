import { addGrayEffect } from './gray.js'
import { addRedEffect } from './red.js'
import { addPurpleEffect } from './purple.js'
import { addBlueEffect } from './blue.js'
import { addOrangeEffect } from './orange.js'
import { addWhiteEffect } from './white.js'
import { addGreenEffect } from './green.js'


export const addColorEffects = (engine, config) => {
  addGrayEffect(engine, config)
  addRedEffect(engine, config)
  addPurpleEffect(engine, config)
  addBlueEffect(engine, config)
  addOrangeEffect(engine, config)
  addWhiteEffect(engine, config)
  addGreenEffect(engine, config)
}
