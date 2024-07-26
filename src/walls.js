export const WALL_CONFIG = {
  THICKNESS: 10_000,
  MARGIN: 10,
}

export const createWalls = (engine, config) => {
  const wallOptions = { isStatic: true, render: { fillStyle: 'transparent' } }
  const ground = Matter.Bodies.rectangle(
    0, config.height - WALL_CONFIG.MARGIN + WALL_CONFIG.THICKNESS / 2, 
    WALL_CONFIG.THICKNESS, WALL_CONFIG.THICKNESS, wallOptions
  )
  const leftWall = Matter.Bodies.rectangle(
    WALL_CONFIG.MARGIN - WALL_CONFIG.THICKNESS / 2, 0,
    WALL_CONFIG.THICKNESS, WALL_CONFIG.THICKNESS, wallOptions
  )
  const rightWall = Matter.Bodies.rectangle(
    config.width - WALL_CONFIG.MARGIN + WALL_CONFIG.THICKNESS / 2, 0, 
    WALL_CONFIG.THICKNESS, WALL_CONFIG.THICKNESS, wallOptions
  )
  
  Matter.World.add(engine.world, [ground, leftWall, rightWall])
}
