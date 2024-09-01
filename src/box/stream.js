import { random } from '../random.js'
import { listen, dispatch } from '../dispatch.js'
import { COLORS } from './colors.js'
import { createBox, BOX_CONFIG } from './box.js'


export const createBoxStream = (engine, config) => {
  const boxes = Matter.Composite.create()

  const totalBoxes = config.rows * config.columns;
  const boxesPerColor = Math.floor(totalBoxes / COLORS.length / config.minmatch) * config.minmatch
  let remainingBoxes = totalBoxes - (boxesPerColor * COLORS.length)
  
  // Create an array with the correct number of each color
  let colorArray = COLORS.flatMap(color => Array(boxesPerColor).fill(color))
  
  // Add any remaining boxes (should be less than 4 * colors.length)
  while (remainingBoxes > 0) {
      colorArray.push(COLORS[random(0,  COLORS.length - 1)])
      remainingBoxes--
  }
  
  // Shuffle the color array
  for (let i = colorArray.length - 1; i > 0; i--) {
      const j = random(0, i + 1);
      [colorArray[i], colorArray[j]] = [colorArray[j], colorArray[i]]
  }
  
  let colorIndex = 0
  
  const createRow = (i) => {
    const initial = i < config.initialRows
    for (let j = 0; j < config.columns; j++) {
      const x = 30 + j * (BOX_CONFIG.SIZE + config.spacing)
      const y = initial ? 570 - i * (BOX_CONFIG.SIZE + config.spacing) :
        - 2 * (BOX_CONFIG.SIZE + config.spacing)
      const color = colorArray[colorIndex]
      const box = createBox(x, y, color)
      Matter.Composite.add(boxes, box)
      dispatch('create:box', { box, row: i, column: j })

      colorIndex++
    }
  }
  
  for (let i = 0; i < config.initialRows; i++) {
    createRow(i)
  }

  const minBoxes = config.pageRows * config.columns * 1.6
  let rowToCreate = config.initialRows
  let interval = setInterval(() => {
    const allBoxes = Matter.Composite.allBodies(boxes)
    if (rowToCreate < config.rows) {
      if (allBoxes.length < minBoxes) {
        createRow(rowToCreate)
        rowToCreate++
      }
    } else {
      clearInterval(interval)
    }
  }, 300)

  Matter.World.add(engine.world, boxes)
  attachStreamIndicator(config.rows * config.columns)

  return boxes
}


const attachStreamIndicator = (total) => {
  let allBoxes = total

  function updateBoxCountIndicator() {
    document.getElementById('box-count-indicator').style.transform = `scaleY(${allBoxes / total})`
  }

  listen('pop:group', ({ group }) => {
    allBoxes -= group.length
    updateBoxCountIndicator()
  })
}
