export const BOX_CONFIG = {
  SIZE: 72,
  RADIUS: 8,
  RESTITUTION: 0.9,
  FRICTION: 0,
}

export function createBox(x, y, color) {
  const box = Matter.Bodies.rectangle(
      x, y, 
      BOX_CONFIG.SIZE, BOX_CONFIG.SIZE, {
        restitution: BOX_CONFIG.RESTITUTION,
        friction: BOX_CONFIG.FRICTION,
        kind: 'box',
        tag: color,
        render: {
            fillStyle: color,
            strokeStyle: color,
            lineWidth: 0,
        },
        chamfer: {
          radius:[
            BOX_CONFIG.RADIUS,
            BOX_CONFIG.RADIUS,
            BOX_CONFIG.RADIUS,
            BOX_CONFIG.RADIUS,
          ]
        }
    }
  )

  return box
}
