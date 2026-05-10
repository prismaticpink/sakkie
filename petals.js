const FRAMERATE = 1000 / 30;
const UNTIL_NEXT_MIN = 1000;
const UNTIL_NEXT_MAX = 3000;
const PETAL_MIN_GRAVITY = 1;
const PETAL_MAX_GRAVITY = 3;
const PETAL_MIN_SPEED = -3;
const PETAL_MAX_SPEED = 3;
const PETAL_SPAWN_MARGIN = 10;
const MAX_NUMBER_OF_PETALS = 50;
const CONTAINER_ID = "petal-container";

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
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';

  for (var i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));

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
function createNewPetal() {
  var petal = document.createElement("img");

  petal.id = "petal-" + randomString(10);
  petal.src = "petal.png";
  petal.gravity = randomIntBetween(PETAL_MIN_GRAVITY, PETAL_MAX_GRAVITY);
  petal.speed = randomIntBetween(PETAL_MIN_SPEED, PETAL_MAX_SPEED);
  petal.style.position = "absolute";
  petal.style.top = "-10px";
  petal.style.left = toPixels(randomIntBetween(
    PETAL_SPAWN_MARGIN,
    window.innerWidth - PETAL_SPAWN_MARGIN
  ));

  document.getElementById(CONTAINER_ID).appendChild(petal);

  return petal;
}

/**
 * updates petal position per frame
 */
function updatePetal(petal) {
  petal = addPixelsToTop(petal, petal.gravity);
  petal = addPixelsToLeft(petal, petal.speed);
  return petal;
}

/**
 * checks if a petal element is visible on screen
 */
function withinScreen(petal) {
  if (fromPixels(petal.style.top) > window.innerHeight)
    return false;
  if (fromPixels(petal.style.left) > window.innerWidth)
    return false;
  if (fromPixels(petal.style.left) < -30)
    return false;

  return true;
}

// ##################
// # MAIN FUNCTIONS #
// ##################

function setupPetals() {
  PETALS = { };
  UNTIL_NEXT_PETAL = 0;
  var container = document.createElement("div");

  container.id = CONTAINER_ID;
  container.style.position = "absolute";
  container.style.pointerEvents = "none";
  container.style.overflow = "hidden";
  container.style.margin = "0";
  container.style.left = "0";
  container.style.right = "0";
  container.style.width = "inherit";
  container.style.height = "inherit";

  document.body.appendChild(container);
  updatePetals();
}

function updatePetals() {
  // adding new petals if the time has come
  if (UNTIL_NEXT_PETAL <= 0) {
    if (sizeOf(PETALS) < MAX_NUMBER_OF_PETALS) {
      var newPetal = createNewPetal();
      PETALS[newPetal.id] = newPetal;
    }

    UNTIL_NEXT_PETAL = randomIntBetween(UNTIL_NEXT_MIN, UNTIL_NEXT_MAX);
  } else {
    UNTIL_NEXT_PETAL -= FRAMERATE;
  }

  // updating petals
  var nextPetals = { };

  for (var [petalId, petal] of Object.entries(PETALS)) {
    petal = updatePetal(petal);

    if (withinScreen(petal)) {
      nextPetals[petal.id] = petal;
    } else {
      petal.remove();
    }
  }

  PETALS = nextPetals;
}

setupPetals();
setInterval(updatePetals, FRAMERATE);

