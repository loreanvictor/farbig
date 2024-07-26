export const dispatch = (name, details) => {
  const event = new CustomEvent(name, { detail: details, bubbles: true })
  document.dispatchEvent(event)
}


export const listen = (name, callback) => {
  const listener = event => callback(event.detail)
  document.addEventListener(name, listener)

  return () => document.removeEventListener(name, listener)
}
