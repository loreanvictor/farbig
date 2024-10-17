import { listen } from '../dispatch.js'
import { addScore } from '../score.js'
import { BLUE, BOX_CONFIG, freeze, isFrozen } from '../box/index.js'
import { CHOSEN_COLOR, addScoreOnPop, matchScore, chosenBonus } from './common.js'


const BLUE_SCORE = 100

export const addBlueEffect = (engine, config) => {
  addScoreOnPop(BLUE, matchScore(config.MIN_MATCH, BLUE_SCORE))

  const freezables = box => {
    const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')

    return boxes.filter(b => {
      return b.tag !== BLUE && 
        Matter.Vector.magnitude(Matter.Vector.sub(b.position, box.position)) < BOX_CONFIG.SIZE * 1.2
    })
  }

  listen('pop:box', ({ box, group }) => {
    if (box.tag === BLUE) {
      freezables(box).forEach(b => {
        freeze(b, 2500 * group.length)
      })
    }
  })

  listen('pop:group', ({ group }) => {
    if (group.some(box => isFrozen(box))) {
      addScore(group.length * group.length * chosenBonus(BLUE), BLUE)
    }
  })

  if (CHOSEN_COLOR === BLUE) {
    listen('freeze:box', ({ box, refreeze }) => {
      if (!refreeze) {
        setTimeout(() => {
          freezables(box).forEach(b => {
            if (!isFrozen(b) && b.tag === box.tag) {
              freeze(b, box.plugin.frost * .9)
            }
          })
        }, 60)
      }
    })
  }
}
