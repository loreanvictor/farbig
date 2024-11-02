export const createIndicator = (options) => {
  const element = options.element
  const max = options.max ?? 1
  let key = 'value'
  let waiting = 0

  const transitionMap = {}
  const deferredMap = {}

  const indicator = {
    $: element
  }

  const set = (value) => {
    if (key === 'value') {
      element.style.transform = `scaleX(${Math.min(value, max) / max})`
    } else {
      element.style[key] = value
    }

    return indicator
  }

  const over = ms => {
    transitionMap[key === 'value' ? 'transform' : key] = ms
    element.style.transition = Object.keys(transitionMap).map(key => `${key} ${transitionMap[key]}ms`).join(', ')
    waiting = ms

    return indicator
  }

  const take = k => { 
    key = k

    return indicator
  }

  const done = () => {
    key = 'value'
    waiting = 0

    return indicator
  }

  const reset = () => {
    element.style.transition = ''

    return done()
  }

  const burst = (val) => over(10).set(val)

  const then = (fn) => {
    const current = key
    clearTimeout(deferredMap[key])
    deferredMap[key] = setTimeout(() => {
      take(current)
      fn()
      done()
    }, waiting)

    return done()
  }

  const wait = ms => {
    waiting = ms

    return indicator
  }

  indicator.set = set
  indicator.over = over
  indicator.burst = burst
  indicator.take = take
  indicator.done = done
  indicator.reset = reset
  indicator.then = then
  indicator.wait = wait

  return indicator
}
