const DEFINED = []

/**
 * utilities for dispatching and listening to global events.
 */

/**
 * 
 * define a set of event names as valid global events.
 * events that are dispatched or listened to will be checked against
 * this name to more easily debug errors relating to event names.
 * 
 * @param {string[]} names
 */
export const defineEvents = (...names) => {
  names.forEach(name => DEFINED.push(name))
}


/**
 * 
 * dispatch a global given event with given details, notifying
 * all listeners of that event.
 * 
 * @param {string} name 
 * @param {object} details 
 * @throws if the event name is not defined
 */
export const dispatch = (name, details) => {
  if (!DEFINED.includes(name)) {
    throw new Error(`Can't dispatch undefined event: ${name}`)
  }

  const event = new CustomEvent(name, { detail: details, bubbles: true })
  document.dispatchEvent(event)
}


/**
 * 
 * listen to a given global event, calling the given callback
 * whenever the event is dispatched.
 * 
 * @param {string} name 
 * @param {(details: object) => any} callback
 * @returns a callback to remove the listener
 * @throws if the event name is not defined.
 */
export const listen = (name, callback) => {
  if (!DEFINED.includes(name)) {
    throw new Error(`Can't listen to undefined event: ${name}`)
  }

  const listener = event => callback(event.detail)
  document.addEventListener(name, listener)

  return () => document.removeEventListener(name, listener)
}

/**
 * 
 * retreive a value constantly from a global event.
 * 
 * @param {string} name 
 * @param {(details: object) => any} selector 
 * @param {any} initial 
 * @returns {{() => void, get: () => any}}
 */
export const observe = (name, selector, initial = 0) => {
  let last = initial

  const cleanup = listen(name, details => last = selector(details))
  cleanup.get = () => last

  return cleanup
}
