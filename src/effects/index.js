import { addGrayEffect } from './gray/index.js'
import { addBlueEffect } from './blue/index.js'
import { addWhiteEffect } from './white/index.js'
import { addRedEffect } from './red.js'
import { addPurpleEffect } from './purple.js'
import { addOrangeEffect } from './orange.js'
import { addGreenEffect } from './green.js'
import { addSpeedBonus } from './speed.js'


export const addColorEffects = (engine, config) => {
  addGrayEffect(engine, config)
  addRedEffect(engine, config)
  addPurpleEffect(engine, config)
  addBlueEffect(engine, config)
  addOrangeEffect(engine, config)
  addWhiteEffect(engine, config)
  addGreenEffect(engine, config)

  addSpeedBonus()
}
