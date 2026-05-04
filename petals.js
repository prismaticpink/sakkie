const FRAMERATE = 1000 / 30;
const UNTIL_NEXT_MIN = 1000;
const UNTIL_NEXT_MAX = 3000;
const PETAL_MIN_GRAVITY = 1;
const PETAL_MAX_GRAVITY = 3;
const PETAL_MIN_SPEED = -3;
const PETAL_MAX_SPEED = 3;
const PETAL_SPAWN_MARGIN = 10;
const MAX_NUMBER_OF_PETALS = 50;

var PETALS = { };
var UNTIL_NEXT_PETAL = 0;

// ###############
// # MATHEMATICS #
// ###############

/**
 * Generates a random integer between `min` and `max`
 */
function randomIntBetween(min, max) {
  return min + Math.floor(Math.random() * (max - min));
};

/**
 * Generates a random string with a determined length
 */
function randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

/**
 * Converts a pixel measurement into an integer
 */
function fromPixels(s) {
  return parseInt(s.substring(0, s.length - 2));
}

/**
 * Converts an integer to a pixel measurement
 */
function toPixels(x) {
  return Math.floor(x) + "px";
}

/**
 * Counts the number of elements in an object
 */
function sizeOf(object) {
  var count = 0;

  for (var [k, v] of Object.entries(object))
    count++;

  return count;
}

// ###############
// # PETAL LOGIC #
// ###############

/**
 * Add a certain number of pixels to `top` style
 */
function addPixelsToTop(element, diff) {
  const top = fromPixels(element.style.top); 
  element.style.top = toPixels(top + diff);
  return element;
}

/**
 * Add a certain number of pixels to `left` style
 */
function addPixelsToLeft(element, diff) {
  const left = fromPixels(element.style.left); 
  element.style.left = toPixels(left + diff);
  return element;
}

/**
 * Create a new petal element
 */
const createNewPetal = () => {
  let petal = document.createElement("img");

  // TODO prevents petals from expanding the scroll view

  petal.id = "petal-" + randomString(10);
  petal.src = "petal.png";
  petal.gravity = randomIntBetween(PETAL_MIN_GRAVITY, PETAL_MAX_GRAVITY);
  petal.speed = randomIntBetween(PETAL_MIN_SPEED, PETAL_MAX_SPEED);
  petal.style.position = "absolute";
  petal.style.pointerEvents = "none";
  petal.style.overflow = "hidden";
  petal.style.top = "-10px";
  petal.style.left = toPixels(randomIntBetween(
    PETAL_SPAWN_MARGIN,
    window.innerWidth - PETAL_SPAWN_MARGIN
  ));

  document.body.appendChild(petal);

  return petal;
};

/**
 * updates petal position per frame
 */
const updatePetal = (petal) => {
  petal = addPixelsToTop(petal, petal.gravity);
  petal = addPixelsToLeft(petal, petal.speed);
  return petal;
};

/**
 * checks if a petal element is visible on screen
 */
const withinScreen = (petal) => {
  if (fromPixels(petal.style.top) > window.innerHeight)
    return false;
  if (fromPixels(petal.style.left) > window.innerWidth)
    return false;
  if (fromPixels(petal.style.left) < -30)
    return false;

  return true;
};

// ##################
// # MAIN FUNCTIONS #
// ##################

const setupPetals = () => {
  PETALS = { };
  UNTIL_NEXT_PETAL = 0;
  updatePetals();
};

const updatePetals = () => {
  // adding new petals if the time has come
  if (UNTIL_NEXT_PETAL <= 0) {
    if (sizeOf(PETALS) < MAX_NUMBER_OF_PETALS) {
      let newPetal = createNewPetal();
      PETALS[newPetal.id] = newPetal;
    }

    UNTIL_NEXT_PETAL = randomIntBetween(UNTIL_NEXT_MIN, UNTIL_NEXT_MAX);
  } else {
    UNTIL_NEXT_PETAL -= FRAMERATE;
  }

  // updating petals
  let nextPetals = { };

  for (var [petalId, petal] of Object.entries(PETALS)) {
    petal = updatePetal(petal);

    if (withinScreen(petal)) {
      nextPetals[petal.id] = petal;
    } else {
      petal.remove();
    }
  }

  PETALS = nextPetals;
};

setupPetals();
setInterval(updatePetals, FRAMERATE);

