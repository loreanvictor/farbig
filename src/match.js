import { listen, dispatch } from './dispatch.js'
import { BOX_CONFIG } from './box/box.js'
import { GRAY } from './box/colors.js'


export const findMatchesOf = (boxes, startBox, maxvel = undefined) => {
  const chain = new Set([startBox])
  addKinToChain(boxes, startBox, chain, maxvel)
  
  return Array.from(chain)
}

const addKinToChain = (boxes, box, chain, maxvel = undefined) => {
  findKin(boxes, box, maxvel).forEach(kin => {
    if (!chain.has(kin)) {
      chain.add(kin)
      addKinToChain(boxes, kin, chain, maxvel)
    }
  })
}

const findKin = (boxes, box, maxvel = undefined) => {
    return boxes.filter(other => 
        other !== box &&
        other.tag === box.tag && (
          maxvel === undefined || 
          Matter.Vector.magnitude(other.velocity) < maxvel
        ) &&
        (
          Matter.Collision.collides(box, other) ||
          Matter.Vector.magnitude(Matter.Vector.sub(box.position, other.position)) < 1.3 * BOX_CONFIG.SIZE
        )
    )
}


export const findMatches = (boxes, minmatch, maxvel = undefined) => {
  const matches = []

  boxes.forEach(box => {
    if (
      (!boxes.some(b => b.tag === box.tag && b.isStatic))
      && (
        (maxvel === undefined) ||
        (Matter.Vector.magnitude(box.velocity) < maxvel && box.plugin.touched === true)
      ) && !matches.some(match => match.includes(box))
    ) {
      const match = findMatchesOf(boxes, box, maxvel)
      if (match.length >= minmatch) {
        matches.push(match)
      }
    }
  })

  return matches
}

export const addMatchOnTap = (engine) => {
  listen('tap:box', tapped => {
    const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
    const group = findMatchesOf(boxes, tapped[0])

    dispatch('match', { group, tapped: true })
  })
}

export const addAutoMatch = (engine, minmatch, maxvel) => {
  setInterval(() => {
    const boxes = Matter.Composite.allBodies(engine.world).filter(b => b.kind === 'box')
    const matches = findMatches(boxes, minmatch, maxvel)
    matches.forEach(match => dispatch('match', { group: match, tapped: false }))
  }, 200)
}
