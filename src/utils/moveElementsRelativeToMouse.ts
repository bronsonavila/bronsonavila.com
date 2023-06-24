type Mouse = {
  x: number
  y: number
  updatePosition(event: MouseEvent): void
}

type Config = {
  additionalTransformValues: string // Additional `transform` values to apply alongside `translate`.
  containerSelector: string // CSS selector for the target element's container.
  movementFactor: number // Lower values increase mouse movement intensity; higher values decrease it.
}

const defaultConfig: Config = {
  additionalTransformValues: '',
  containerSelector: '.movable-container',
  movementFactor: 32
}

/**
 * Adjusts a target element's position based on the position of the mouse cursor on hover.
 * The center of the element moves in the cursor's direction.
 * The movement is subtle when the cursor approaches the center of the element; it becomes more pronounced as the cursor nears the edges.
 *
 * Derived from: https://css-tricks.com/animate-a-container-on-mouse-over-using-perspective-and-transform/
 */
const moveElementsRelativeToMouse = (userConfig: Partial<Config> = {}): void => {
  const config: Config = { ...defaultConfig, ...userConfig }
  const containers = [...document.querySelectorAll(config.containerSelector)]

  if (config.movementFactor <= 0) {
    throw new Error('The movementFactor must be a positive number.')
  }

  containers.forEach(container => {
    let counter = 0

    const target = container.childNodes[0] as HTMLElement // The container should have only 1 child.

    // Tracks the position of the mouse cursor relative to the target element.
    const mouse: Mouse = {
      x: 0,
      y: 0,
      updatePosition(event: MouseEvent) {
        // x,y coordinates are 0,0 at target center. x increases with rightward movement, decreases leftward. y increases upward, decreases downward.
        this.x = event.pageX - target.offsetLeft - Math.floor(target.offsetWidth / 2)
        this.y =
          (event.pageY - target.offsetTop) * -1 +
          (window.scrollY + target.getBoundingClientRect().top + Math.floor(target.offsetHeight / 2) - target.offsetTop)
      }
    }

    const update = (event: MouseEvent): void => {
      const x = mouse.x / config.movementFactor
      const y = (mouse.y / config.movementFactor) * -1

      mouse.updatePosition(event)

      target.style.transform = `${config.additionalTransformValues} translate(${x}px, ${y}px)`
    }

    target.onmouseenter = update

    target.onmouseleave = () => (target.style.cssText = '')

    target.onmousemove = (event: MouseEvent) => {
      const isTimeToUpdate = counter++ % 10 === 0 // Throttle for more performant animation.

      if (isTimeToUpdate) update(event)
    }
  })
}

export default moveElementsRelativeToMouse
