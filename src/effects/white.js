import { listen, defineEvents, dispatch } from '../dispatch.js'
import { random } from '../random.js'
import { BOX_CONFIG, WHITE, RED, BLUE, GREEN, PURPLE, GRAY, ORANGE, changeColor } from '../box/index.js'
import { isChosen, addScoreOnPop, matchScore, nextChosenColor } from './common.js'
import { addScore } from '../score.js'


defineEvents(
  'group:color-changed',
  'white:disco-time-started',
  'white:disco-time-tick',
  'white:disco-time-ended',
)

const DISCO_TIME = 1500

const addDiscoBonus = () => {
  let discoTime = 0
  let colors = []
  let bonusBase = 0
  let interval = undefined

  const discoInd = document.getElementById('white')
  const updateIndicator = () => discoInd.style.transform = `scaleX(${discoTime / DISCO_TIME})`

  listen('group:color-changed', ({ group }) => {
    clearInterval(interval)
    discoInd.style.background = WHITE
    discoTime = DISCO_TIME
    bonusBase = group.length

    updateIndicator()
    dispatch('white:disco-time-started', { time: discoTime })

    interval = setInterval(() => {
      if (discoTime > 0) {
        discoTime = Math.max(0, discoTime - 250)
        updateIndicator()
  
        if (discoTime > 0) {
          dispatch('white:disco-time-tick', { time: discoTime })
        } else {
          dispatch('white:disco-time-ended')
          clearInterval(interval)
        }
      }
    }, 250)
  })

  let discoReset = undefined
  listen('box:popped', ({ box }) => {
    if (discoTime > 0) {
      discoInd.style.transition = 'none'
      discoInd.style.background = box.tag

      clearTimeout(discoReset)
      discoReset = setTimeout(() => {
        discoInd.style.transition = 'background .7s'
        discoInd.style.background = WHITE
      }, 200)

      if (!colors.includes(box.tag)) {
        colors.push(box.tag) 
      }
    }
  })

  listen('white:disco-time-ended', () => {
    const score = bonusBase * bonusBase * colors.length * colors.length * colors.length
    colors = []
    addScore(score, WHITE)
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


export const addWhiteEffect = (engine, config) => {
  addScoreOnPop(WHITE, matchScore(config.MIN_MATCH))
  addDiscoBonus()
  addChosenSwitch()

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

      dispatch('group:color-changed', { group: toBeChanged })
    }
  })
}
