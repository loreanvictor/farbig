import { listen } from '../dispatch.js'
import { random } from '../random.js'
import { addScore } from '../score.js'
import { ORANGE, BOX_CONFIG, unfreeze, changeColor } from '../box/index.js'
import { addScoreOnPop, matchScore, chosenBonus } from './common.js'


const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export const addOrangeEffect = (engine, config) => {
  addScoreOnPop(ORANGE, matchScore(config.MIN_MATCH))

  listen('pop:group', async ({ group }) => {
    if (group[0].tag === ORANGE) {
      const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
      const maxdist = BOX_CONFIG.SIZE * 1.5

      const touched = boxes.filter(box => {
        return box.tag !== ORANGE && group.reduce(
          (min, b) => Math.min(
            min,
            Matter.Vector.magnitude(Matter.Vector.sub(b.position, box.position))
          ), Infinity
        ) < maxdist
      })

      const converted = []
      const chance = Math.min(touched.length * touched.length / 3.8, 80)

      touched.forEach(box => {
        unfreeze(box)
        if (random(0, 100) < chance) {
          converted.push(box)
        }
      })

      const sorted = converted.sort((a, b) => b.position.y - a.position.y)

      for (let i = 0; i < sorted.length; i++) {
        await sleep(40)
        changeColor(sorted[i], ORANGE)
        addScore(converted.length * converted.length * chosenBonus(ORANGE), ORANGE)
      }
    }
  })
}
