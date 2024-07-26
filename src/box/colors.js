export const ORANGE = '#efa73e'
export const RED = '#bb2757'
export const BLUE = '#4974be'
export const GREEN = '#52b469'
export const PURPLE = '#912e83'
export const WHITE = '#e3dbbd'
export const GRAY = '#325379'

export const COLORS = [ORANGE, RED, BLUE, GREEN, PURPLE, WHITE, GRAY]

export const changeColor = (box, color) => {
  box.tag = color
  box.render.fillStyle = color
  if (!(box.plugin.frost > 0)) {
    box.render.strokeStyle = color
  }
}
