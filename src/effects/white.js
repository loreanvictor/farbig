import { listen, defineEvents, dispatch } from '../dispatch.js'
import { random } from '../random.js'
import { BOX_CONFIG, WHITE, RED, BLUE, GREEN, PURPLE, GRAY, ORANGE, changeColor } from '../box/index.js'
import { addScore } from '../score.js'
import { isChosen, addScoreOnPop, matchScore, nextChosenColor } from './common.js'
import { createTimer } from './util/timer.js'
import { createIndicator } from './util/indicator.js'


defineEvents('white:color-changed')

const DISCO_TIME = 1250

const addDiscoBonus = () => {
  let colorMap = {}
  let bonusBase = 0

  const timer = createTimer(250)
  const indicator = createIndicator({ element: document.getElementById('white'), max: DISCO_TIME })

  listen('white:color-changed', ({ group }) => {
    indicator.take('background').set(WHITE).done()
    timer.set(DISCO_TIME)
    bonusBase = Math.max(bonusBase, group.length)
  })

  timer.listen(({ time }) => {
    indicator.set(time)
    if (time === 0) {
      const count = Object.keys(colorMap).length
      const bonus = Object.values(colorMap).reduce((total, each) => total + each * each, 0)
      const score = Math.floor(bonusBase * bonus * bonus * count / 4)
      colorMap = {}
      addScore(score, WHITE)
    }
  })

  listen('group:popped', ({ group }) => {
    if (timer.get() > 0) {
      const color = group[0].tag
      colorMap[color] = Math.max(colorMap[color] || 0, group.length)

      indicator.take('background').burst(color).wait(100).then(() => {
        indicator.over(500).set(WHITE)
      })
    }
  })
}


const addChosenSwitch = () => {
  let count = 1
  const timer = createTimer()

  listen('group:popped', ({ group }) => {
    if (group[0].tag === WHITE) {
      timer.set(DISCO_TIME)

      count++
      if (count > 3) {
        nextChosenColor()
      }
    } else {
      count = 1
    }
  })

  timer.listen(({ time }) => time === 0 && (count = 1))
}


const addColorChangeEffect = (engine) => {
  listen('group:popped', ({ group }) => {
    if (group[0].tag === WHITE) {
      const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
      const all = [RED, BLUE, GREEN, PURPLE, GRAY, ORANGE]
      const mult =  isChosen(WHITE) ? 2 : 1
      const gmult = Math.max(Math.floor(Math.log(group.length * 1.7) / Math.log(2)), 1)

      const toBeChanged = []
      boxes.forEach(box => {
        const distance = group.reduce(
          (m, b) => Math.min(m, Matter.Vector.magnitude(Matter.Vector.sub(box.position, b.position))),
          Infinity
        )
        if (
          box.tag !== WHITE &&
          !box.isStatic &&
          distance < BOX_CONFIG.SIZE * gmult * 1.5 * mult
        ) {
          toBeChanged.push(box)
        }
      })

      toBeChanged.forEach(box => {
          const colors = all.filter(c => c !== box.tag)
          all.forEach(color => {
            if (!toBeChanged.some(b => b.tag === color)) {
              colors.push(color)
              colors.push(color)
              colors.push(color)
            }
          })

          const color = colors[random(0, colors.length - 1)]
          changeColor(box, color)
      })

      dispatch('white:color-changed', { group: toBeChanged })
    }
  })
}


export const addWhiteEffect = (engine, config) => {
  addScoreOnPop(WHITE, matchScore(config.MIN_MATCH))
  addDiscoBonus()
  addChosenSwitch()
  addColorChangeEffect(engine)
}
