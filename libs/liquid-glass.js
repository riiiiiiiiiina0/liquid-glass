/**
 * Liquid Glass Effect - Standalone Component
 *
 * A beautiful glassmorphism effect with liquid distortion and chromatic aberration.
 * Works with any HTML element.
 *
 * @version 1.0.0
 * @license MIT
 */

/**
 * Creates a displacement map SVG for the liquid glass effect
 * @param {Object} options - Displacement options
 * @param {number} options.height - Element height
 * @param {number} options.width - Element width
 * @param {number} options.radius - Border radius
 * @param {number} options.depth - Glass depth effect
 * @returns {string} Data URL for the displacement map
 */
export const getDisplacementMap = ({ height, width, radius, depth }) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg height="${height}" width="${width}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <style>
        .mix { mix-blend-mode: screen; }
    </style>
    <defs>
        <linearGradient 
          id="Y" 
          x1="0" 
          x2="0" 
          y1="${Math.ceil((radius / height) * 15)}%" 
          y2="${Math.floor(100 - (radius / height) * 15)}%">
            <stop offset="0%" stop-color="#0F0" />
            <stop offset="100%" stop-color="#000" />
        </linearGradient>
        <linearGradient 
          id="X" 
          x1="${Math.ceil((radius / width) * 15)}%" 
          x2="${Math.floor(100 - (radius / width) * 15)}%"
          y1="0" 
          y2="0">
            <stop offset="0%" stop-color="#F00" />
            <stop offset="100%" stop-color="#000" />
        </linearGradient>
    </defs>

    <rect x="0" y="0" height="${height}" width="${width}" fill="#808080" />
    <g filter="blur(2px)">
      <rect x="0" y="0" height="${height}" width="${width}" fill="#000080" />
      <rect
          x="0"
          y="0"
          height="${height}"
          width="${width}"
          fill="url(#Y)"
          class="mix"
      />
      <rect
          x="0"
          y="0"
          height="${height}"
          width="${width}"
          fill="url(#X)"
          class="mix"
      />
      <rect
          x="${depth}"
          y="${depth}"
          height="${height - 2 * depth}"
          width="${width - 2 * depth}"
          fill="#808080"
          rx="${radius}"
          ry="${radius}"
          filter="blur(${depth}px)"
      />
    </g>
</svg>`);

/**
 * Creates a displacement filter SVG for the liquid glass effect
 * @param {Object} options - Displacement options
 * @param {number} options.height - Element height
 * @param {number} options.width - Element width
 * @param {number} options.radius - Border radius
 * @param {number} options.depth - Glass depth effect
 * @param {number} [options.strength=100] - Displacement strength
 * @param {number} [options.chromaticAberration=0] - Chromatic aberration amount
 * @returns {string} Data URL for the displacement filter
 */
export const getDisplacementFilter = ({
  height,
  width,
  radius,
  depth,
  strength = 100,
  chromaticAberration = 0,
}) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg height="${height}" width="${width}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <filter id="displace" color-interpolation-filters="sRGB">
            <feImage x="0" y="0" height="${height}" width="${width}" href="${getDisplacementMap(
    {
      height,
      width,
      radius,
      depth,
    },
  )}" result="displacementMap" />
            <feDisplacementMap
                transform-origin="center"
                in="SourceGraphic"
                in2="displacementMap"
                scale="${strength + chromaticAberration * 2}"
                xChannelSelector="R"
                yChannelSelector="G"
            />
            <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
            result="displacedR"
                    />
            <feDisplacementMap
                in="SourceGraphic"
                in2="displacementMap"
                scale="${strength + chromaticAberration}"
                xChannelSelector="R"
                yChannelSelector="G"
            />
            <feColorMatrix
            type="matrix"
            values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
            result="displacedG"
                    />
            <feDisplacementMap
                    in="SourceGraphic"
                    in2="displacementMap"
                    scale="${strength}"
                    xChannelSelector="R"
                    yChannelSelector="G"
                />
                <feColorMatrix
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 1 0 0
                        0 0 0 1 0"
                result="displacedB"
                        />
              <feBlend in="displacedR" in2="displacedG" mode="screen"/>
              <feBlend in2="displacedB" mode="screen"/>
        </filter>
    </defs>
</svg>`) +
  '#displace';

/**
 * Generates liquid glass CSS properties for a given element size and color
 * @param {Object} options - Glass options
 * @param {number} options.width - Element width in pixels
 * @param {number} options.height - Element height in pixels
 * @param {number} [options.radius=10] - Border radius
 * @param {number} [options.depth=10] - Glass depth effect
 * @param {number} [options.blur=2] - Blur amount
 * @param {number} [options.strength=100] - Displacement strength
 * @param {number} [options.chromaticAberration=0] - Chromatic aberration
 * @param {string} [options.baseColor='rgba(255, 255, 255, 0.4)'] - Base glass color
 * @returns {Object} CSS properties object
 */
export const getLiquidGlassStyles = ({
  width,
  height,
  radius = 10,
  depth = 10,
  blur = 2,
  strength = 100,
  chromaticAberration = 0,
  baseColor = 'rgba(255, 255, 255, 0.4)',
}) => {
  const filterUrl = getDisplacementFilter({
    height,
    width,
    radius,
    depth,
    strength,
    chromaticAberration,
  });

  return {
    background: baseColor,
    backdropFilter: `blur(${
      blur / 2
    }px) url('${filterUrl}') blur(${blur}px) brightness(1.1) saturate(1.5)`,
    boxShadow: 'inset 0 0 4px 0px rgba(255, 255, 255, 0.3)',
  };
};

/**
 * Applies liquid glass effect to an element
 * @param {HTMLElement} element - The element to apply effect to
 * @param {Object} [options] - Configuration options
 * @param {number} [options.radius=10] - Border radius
 * @param {number} [options.depth=8] - Glass depth effect
 * @param {number} [options.blur=3] - Blur amount
 * @param {number} [options.strength=80] - Displacement strength
 * @param {number} [options.chromaticAberration=1] - Chromatic aberration amount
 * @param {string} [options.baseColor='rgba(255, 255, 255, 0.4)'] - Base glass color
 * @param {boolean} [options.autoResize=false] - Automatically update effect on resize
 * @returns {Object} Cleanup object with methods to update or remove the effect
 */
export const applyLiquidGlass = (element, options = {}) => {
  if (!element) {
    throw new Error('Element is required');
  }

  const {
    radius = 10,
    depth = 8,
    blur = 3,
    strength = 80,
    chromaticAberration = 1,
    baseColor = 'rgba(255, 255, 255, 0.4)',
    autoResize = false,
  } = options;

  // Store original styles for cleanup
  const originalStyles = {
    background: element.style.background,
    backdropFilter: element.style.backdropFilter,
    boxShadow: element.style.boxShadow,
  };

  const applyEffect = () => {
    // Get element dimensions
    const computedStyle = window.getComputedStyle(element);
    const width = parseInt(computedStyle.width) || 200;
    const height = parseInt(computedStyle.height) || 200;

    // Generate liquid glass styles
    const glassStyles = getLiquidGlassStyles({
      width,
      height,
      radius,
      depth,
      blur,
      strength,
      chromaticAberration,
      baseColor,
    });

    // Apply styles to the element
    Object.assign(element.style, glassStyles);
  };

  // Apply initial effect
  applyEffect();

  // Setup resize observer if autoResize is enabled
  let resizeObserver = null;
  if (autoResize) {
    resizeObserver = new ResizeObserver(() => {
      applyEffect();
    });
    resizeObserver.observe(element);
  }

  // Return cleanup and update methods
  return {
    /**
     * Updates the liquid glass effect with new options
     * @param {Object} newOptions - New configuration options
     */
    update: (newOptions = {}) => {
      Object.assign(options, newOptions);
      applyEffect();
    },

    /**
     * Refreshes the effect (useful after manual resize)
     */
    refresh: () => {
      applyEffect();
    },

    /**
     * Removes the liquid glass effect and restores original styles
     */
    remove: () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      Object.assign(element.style, originalStyles);
    },
  };
};

/**
 * Creates a LiquidGlass class for managing multiple elements
 */
export class LiquidGlass {
  constructor() {
    this.instances = new Map();
  }

  /**
   * Applies liquid glass effect to an element
   * @param {HTMLElement|string} elementOrSelector - Element or CSS selector
   * @param {Object} options - Configuration options
   * @returns {Object} Cleanup object
   */
  apply(elementOrSelector, options = {}) {
    const element =
      typeof elementOrSelector === 'string'
        ? document.querySelector(elementOrSelector)
        : elementOrSelector;

    if (!element) {
      throw new Error('Element not found');
    }

    const instance = applyLiquidGlass(
      /** @type {HTMLElement} */ (element),
      options,
    );
    this.instances.set(element, instance);
    return instance;
  }

  /**
   * Removes liquid glass effect from an element
   * @param {HTMLElement|string} elementOrSelector - Element or CSS selector
   */
  remove(elementOrSelector) {
    const element =
      typeof elementOrSelector === 'string'
        ? document.querySelector(elementOrSelector)
        : elementOrSelector;

    if (!element) return;

    const instance = this.instances.get(element);
    if (instance) {
      instance.remove();
      this.instances.delete(element);
    }
  }

  /**
   * Updates liquid glass effect on an element
   * @param {HTMLElement|string} elementOrSelector - Element or CSS selector
   * @param {Object} options - New configuration options
   */
  update(elementOrSelector, options = {}) {
    const element =
      typeof elementOrSelector === 'string'
        ? document.querySelector(elementOrSelector)
        : elementOrSelector;

    if (!element) return;

    const instance = this.instances.get(element);
    if (instance) {
      instance.update(options);
    }
  }

  /**
   * Removes all liquid glass effects
   */
  removeAll() {
    this.instances.forEach((instance) => instance.remove());
    this.instances.clear();
  }
}

// Default export
export default {
  applyLiquidGlass,
  getLiquidGlassStyles,
  getDisplacementFilter,
  getDisplacementMap,
  LiquidGlass,
};
