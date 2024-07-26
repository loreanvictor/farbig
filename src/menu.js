const menu = document.getElementById('menu')
const help = document.getElementById('help')
const menuBtn = document.getElementById('menu-btn')
const helpBtn = document.getElementById('help-btn')

export const showMenu = () => menu.style.display = 'flex'
export const hideMenu = () => menu.style.display = 'none'
export const showHelp = () => help.style.display = 'flex'
export const hideHelp = () => help.style.display = 'none'

export const menuVisible = () => menu.style.display === 'flex'
export const helpVisible = () => help.style.display === 'flex'

menuBtn.addEventListener('click', () => {
  if (helpVisible()) {
    hideHelp()
    menuBtn.textContent = 'Close'
  } else if (menuVisible()) {
    hideMenu()
    menuBtn.textContent = 'Menu'
  } else {
    showMenu()
    menuBtn.textContent = 'Close'
  }
})

helpBtn.addEventListener('click', () => {
  showHelp()
  menuBtn.textContent = 'Back'
})

document.getElementById('help-chosen').style.backgroundColor = 
  document.getElementById('chosen').style.backgroundColor