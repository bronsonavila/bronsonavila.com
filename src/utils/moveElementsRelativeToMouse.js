const defaultConfig = {
  additionalTransformValues: '',
  containerSelector: '.movable-container',
  intensityDivisor: 32,
};

/**
 * Moves a target element's position in relation to the position of the mouse cursor on
 * hover. The center of the element will move in the direction of the cursor. As the
 * cursor approaches the center of the element, the movement will be more subtle; whereas
 * the movement will be more pronounced as the cursor approaches the edges of the element.
 *
 * Derived from: https://css-tricks.com/animate-a-container-on-mouse-over-using-perspective-and-transform/
 *
 * @param {Object} [config] - A configuration object that accepts the properties below.
 * @param {String} [config.additionalTransformValues] - Any `transform` values to be applied in addition to `translate`.
 * @param {String} [config.containerSelector=.movable-container] - The CSS selector for the target element's container.
 * @param {Integer} [config.intensityDivisor=32] - A positive integer that controls the intensity of the animation.
 */
const moveElementsRelativeToMouse = config => {
  // Set configuration values (overwriting any default parameters with passed in values):
  const {
    additionalTransformValues,
    containerSelector,
    intensityDivisor,
  } = Object.assign({}, defaultConfig, config);

  // Select the containers of all elements that will be subject to movement:
  const containers = [...document.querySelectorAll(containerSelector)];

  containers.forEach(container => {
    const target = container.childNodes[0]; // The `container` should have only 1 child.

    // Set mouse event handlers:
    target.onmouseenter = event => update(event);
    target.onmouseleave = () => (target.style = '');
    target.onmousemove = event => {
      if (isTimeToUpdate()) {
        update(event);
      }
    };

    // Set throttle for more performant animation. Note that the child target must have
    // a `transition: transform` property and duration to ensure smooth animation:
    let counter = 0;
    const updateRate = 10;
    const isTimeToUpdate = () => counter++ % updateRate === 0;

    // Track the position of the mouse cursor in relation to the target element:
    const mouse = {
      x: 0,
      y: 0,
      /**
       * Sets the value of the mouse's `x,y` coordinates relative to the target element.
       *
       * The mouse's `x,y` coordinates will be `0,0` when the mouse cursor is positioned
       * in the center of the target element. The `x` value will increase as the cursor
       * moves RIGHT, and will decrease as the cursor moves LEFT. The `y` value will
       * increase as the cursor moves UP, and will decrease as the cursor moves DOWN.
       *
       * @param {MouseEvent} event - A `mouseenter` or `mousemove` event.
       */
      updatePosition: event => {
        mouse.x = event.pageX - target.offsetLeft - Math.floor(target.offsetWidth / 2);
        mouse.y =
          (event.pageY - target.offsetTop) * -1 +
          (window.scrollY +
            target.getBoundingClientRect().top +
            Math.floor(target.offsetHeight / 2) -
            target.offsetTop);
      },
    };

    /**
     * Updates the `mouse` object's `x,y` coordinates, and updates the target element's
     * `translate` values relative to the new `x,y` mouse coordinates.
     *
     * The `intensityDivisor` must be a positive value. Lower divisor values produce high
     * `translate` values, while higher divisor values produce low `translate` values.
     *
     * @param {MouseEvent} event - A `mouseenter` or `mousemove` event.
     */
    const update = event => {
      mouse.updatePosition(event);
      updateTransformStyle(
        (mouse.x / intensityDivisor).toFixed(2),
        (mouse.y / intensityDivisor).toFixed(2) * -1
      );
    };

    /**
     * Updates the target element's `translate` values based on new `x,y` parameters.
     *
     * @param {Integer} x - The new `x` coordinate.
     * @param {Integer} y - The new `y` coordinate.
     */
    const updateTransformStyle = (x, y) => {
      target.style.transform = `${additionalTransformValues} translate(${x}px, ${y}px)`;
    };
  });
};

export default moveElementsRelativeToMouse;
