import { listen, defineEvents, dispatch } from '../dispatch.js'
import { random } from '../random.js'
import { BOX_CONFIG, WHITE, RED, BLUE, GREEN, PURPLE, GRAY, ORANGE, changeColor } from '../box/index.js'
import { addScore } from '../score.js'
import { isChosen, addScoreOnPop, matchScore, nextChosenColor } from './common.js'
import { createTimer } from './util/timer.js'


defineEvents('white:color-changed')

const DISCO_TIME = 1500

const addDiscoBonus = () => {
  let colors = []
  let bonusBase = 0

  const timer = createTimer(250)

  const discoInd = document.getElementById('white')
  const updateIndicator = () => discoInd.style.transform = `scaleX(${timer.get() / DISCO_TIME})`

  listen('white:color-changed', ({ group }) => {
    discoInd.style.background = WHITE
    timer.set(DISCO_TIME)
    bonusBase = group.length

    updateIndicator()
  })

  timer.listen(({ time }) => {
    updateIndicator()
    if (time === 0) {
      const score = bonusBase * bonusBase * colors.length * colors.length * colors.length
      colors = []
      addScore(score, WHITE)
    }
  })

  const reset = createTimer()
  listen('box:popped', ({ box }) => {
    if (timer.get() > 0) {
      discoInd.style.transition = 'none'
      discoInd.style.background = box.tag

      reset.set(200)

      if (!colors.includes(box.tag)) {
        colors.push(box.tag) 
      }
    }
  })

  reset.listen(({ time }) => {
    if (time === 0) {
      discoInd.style.transition = 'background .7s'
      discoInd.style.background = WHITE
    }
  })
}


const addChosenSwitch = () => {
  let count = 1
  let timer = undefined

  listen('group:popped', ({ group }) => {
    if (group[0].tag === WHITE) {
      clearTimeout(timer)
      timer = setTimeout(() => count = 1, DISCO_TIME)

      count++
      if (count > 3) {
        nextChosenColor()
      }
    }
  })
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
