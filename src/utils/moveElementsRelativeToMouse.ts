class Mouse {
  x: number
  y: number

  constructor() {
    this.x = 0
    this.y = 0
  }

  /**
   * Updates the mouse's `x,y` coordinates based on cursor's position relative to the target.
   * `x` increases with rightward movement and decreases leftward; `y` increases upward and decreases downward.
   * Coordinates are `0,0` at the target center.
   */
  updatePosition(event: MouseEvent, target: HTMLElement) {
    this.x = event.pageX - target.offsetLeft - Math.floor(target.offsetWidth / 2)
    this.y =
      (event.pageY - target.offsetTop) * -1 +
      (window.scrollY + target.getBoundingClientRect().top + Math.floor(target.offsetHeight / 2) - target.offsetTop)
  }
}

type Config = {
  additionalTransformValues: string // Additional `transform` values to apply alongside `translate`.
  containerSelector: string // CSS selector for the target element's container.
  movementFactor: number // Lower values increase mouse movement intensity; higher values decrease it.
}

// Variables

let counter = 0

const defaultConfig: Config = {
  additionalTransformValues: '',
  containerSelector: '.movable-container',
  movementFactor: 32
}

// Functions

const isTimeToUpdate = () => counter++ % 10 === 0 // Update every 10 frames.

const update = (event: MouseEvent, target: HTMLElement, mouse: Mouse, config: Config) => {
  const { additionalTransformValues, movementFactor } = config
  const x = mouse.x / movementFactor
  const y = (mouse.y / movementFactor) * -1

  mouse.updatePosition(event, target)

  target.style.transform = `${additionalTransformValues} translate(${x}px, ${y}px)`
}

const handleMouseMove = (event: MouseEvent, target: HTMLElement, mouse: Mouse, config: Config) => {
  if (isTimeToUpdate()) {
    update(event, target, mouse, config)
  }
}

const setEventHandlers = (target: HTMLElement, mouse: Mouse, config: Config) => {
  target.onmouseenter = (event: MouseEvent) => handleMouseMove(event, target, mouse, config)
  target.onmouseleave = () => (target.style.cssText = '')
  target.onmousemove = (event: MouseEvent) => handleMouseMove(event, target, mouse, config)
}

/**
 * On cursor hover, adjusts target's position with subtler movement near its center and pronounced movement near edges.
 * Inspired by: https://css-tricks.com/animate-a-container-on-mouse-over-using-perspective-and-transform/
 */
const moveElementsRelativeToMouse = (userConfig: Partial<Config> = {}) => {
  const config: Config = { ...defaultConfig, ...userConfig }
  const { containerSelector, movementFactor } = config
  const containers = Array.from(document.querySelectorAll(containerSelector))

  if (movementFactor <= 0) {
    throw new Error('The movementFactor must be a positive number.')
  }

  containers.forEach(container => {
    const target = container.childNodes[0] as HTMLElement // The `container` should only contain 1 child.
    const mouse = new Mouse()

    setEventHandlers(target, mouse, config)
  })
}

export default moveElementsRelativeToMouse
