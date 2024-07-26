import { listen, dispatch } from './dispatch.js'


const popGroup = (engine, boxes, minmatch, group, tapped = false) => {
  group.forEach(box => {
    Matter.World.remove(engine.world, box)
    Matter.Composite.remove(boxes, box)
    dispatch('pop:box', { box, group, tapped })
  })
  
  if (group.length > 0) {
    dispatch('pop:group', { group, tapped })
    checkClean(boxes, minmatch)
  }
}


const checkClean = (boxes, minmatch) => {
  const map = {}
  Matter.Composite.allBodies(boxes).forEach(box => {
    map[box.tag] ??= 0
    map[box.tag]++
  })
  
  const max = Math.max(...Object.values(map))
  
  if (max < minmatch) {
    dispatch('game-over')
  }
}


export const addPopOnMatch = (engine, boxes, minmatch) => {
  listen('match', ({ group, tapped }) => {
    popGroup(engine, boxes, minmatch, group, tapped)
  })
}
