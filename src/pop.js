import { defineEvents, listen, dispatch } from './dispatch.js'


defineEvents(
  'box:popped',
  'group:popped',
  'game:over',
)


const popGroup = (engine, boxes, minmatch, group, tapped = false) => {
  group.forEach(box => {
    Matter.World.remove(engine.world, box)
    Matter.Composite.remove(boxes, box)
    dispatch('box:popped', { box, group, tapped })
  })
  
  if (group.length > 0) {
    dispatch('group:popped', { group, tapped })
    checkClean(engine, minmatch)
  }
}


const checkClean = (engine, minmatch) => {
  const map = {}
  const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
  boxes.forEach(box => {
    map[box.tag] ??= 0
    map[box.tag]++
  })
  
  const max = Math.max(...Object.values(map))
  
  if (max < minmatch) {
    dispatch('game:over')
  }
}


export const addPopOnMatch = (engine, boxes, minmatch) => {
  listen('group:matched', ({ group, tapped }) => {
    popGroup(engine, boxes, minmatch, group, tapped)
  })
}
