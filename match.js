import { BOX_CONFIG } from './box.js'
import { GRAY } from './colors.js'


export function findMatchesOf(boxes, startBox, maxvel = undefined) {
  const chain = new Set([startBox])
  addKinToChain(boxes, startBox, chain, maxvel)
  
  return Array.from(chain)
}

function addKinToChain(boxes, box, chain, maxvel = undefined) {
  findKin(boxes, box, maxvel).forEach(kin => {
    if (!chain.has(kin)) {
      chain.add(kin)
      addKinToChain(boxes, kin, chain, maxvel)
    }
  })
}

function findKin(boxes, box, maxvel = undefined) {
    return boxes.filter(other => 
        other !== box &&
        other.tag === box.tag && (
          maxvel === undefined || 
          Matter.Vector.magnitude(other.velocity) < maxvel
        ) &&
        (
          Matter.Collision.collides(box, other) ||
          Matter.Vector.magnitude(Matter.Vector.sub(box.position, other.position)) < 1.2 * BOX_CONFIG.SIZE
        )
    )
}


export function findMatches(boxes, minmatch, maxvel = undefined) {
  const matches = []

  boxes.forEach(box => {    
    if (
      (!boxes.some(b => b.tag === box.tag && b.isStatic))
      && (
        (maxvel === undefined) ||
        (Matter.Vector.magnitude(box.velocity) < maxvel && box.tag !== GRAY)
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