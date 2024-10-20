const DEFINED = []


export const defineEvents = (...names) => {
  names.forEach(name => DEFINED.push(name))
}


export const dispatch = (name, details) => {
  if (!DEFINED.includes(name)) {
    throw new Error(`Can't dispatch undefined event: ${name}`)
  }

  const event = new CustomEvent(name, { detail: details, bubbles: true })
  document.dispatchEvent(event)
}


export const listen = (name, callback) => {
  if (!DEFINED.includes(name)) {
    throw new Error(`Can't listen to undefined event: ${name}`)
  }

  const listener = event => callback(event.detail)
  document.addEventListener(name, listener)

  return () => document.removeEventListener(name, listener)
}
