export const createTimer = (tick = 10) => {
  let value = 0
  let interval = undefined

  const listeners = []

  const set = val => {
    value = val
    listeners.forEach(fn => fn({ time: value }))

    clearInterval(interval)
    interval = setInterval(() => {
      value = Math.max(0, value - tick)
      listeners.forEach(fn => fn({ time: value }))

      if (value === 0) {
        clearInterval(interval)
      }
    }, tick)
  }

  const get = () => value
  const listen = (fn) => {
    listeners.push(fn)

    return () => { listeners.splice(list.indexOf(fn), 1) }
  }

  return { set, get, listen }
}
