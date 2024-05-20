let letters = [];
let assembled = false;
let rotationSpeed = 0.01;
let angle = 0;
let font;
let backgroundColor = '#40403f';
let diamondColor;
let textSizeFactor = 0.1; // Factor to adjust text size based on canvas height

function preload() {
  font = loadFont('BebasNeue-Regular.ttf'); // Ensure the font file is in the same directory as your sketch
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(font); // Apply the font
  diamondColor = [color(128, 0, 128), color(255, 20, 147), color(0, 0, 255)]; // Purple, pink, blue
  
  setupLetters();
}

function setupLetters() {
  letters = [];
  let txtSize = height * textSizeFactor; // Dynamic text size based on canvas height
  textSize(txtSize);
  
  // Calculate the total width of the word
  let bounds = font.textBounds("SYNTHOGRAF", 0, 0, txtSize);
  let totalWidth = bounds.w;
  let targetX = -totalWidth / 2;
  
  // Initialize letters with alpha set to 0
  for (let char of "SYNTHOGRAF") {
    let points = font.textToPoints(char, 0, 0, txtSize, {
      sampleFactor: 0.2,
      simplifyThreshold: 0
    });

    let letter = {
      char: char,
      points: points,
      x: targetX + bounds.w / "SYNTHOGRAF".length / 2,
      y: 0,
      z: 0,
      targetX: targetX + bounds.w / "SYNTHOGRAF".length / 2,
      targetY: 0,
      targetZ: 0,
      alpha: 0 // Starting alpha value
    };
    targetX += bounds.w / "SYNTHOGRAF".length;
    letters.push(letter);
  }

  assembled = false; // Reset assembled flag
}

function draw() {
  background(backgroundColor);
  if (!assembled) {
    fadeInLetters();
  } else {
    rotateWord();
  }

  for (let letter of letters) {
    push();
    translate(letter.x, letter.y, letter.z);
    drawFlatLetter(letter.points, letter.alpha);
    pop();
  }

  // Draw the spinning diamond
  push();
  translate(0, -height / 4, 0); // Position the diamond above the word
  rotateY(angle);
  drawDiamond();
  pop();
}

function fadeInLetters() {
  let allFadedIn = true;
  for (let letter of letters) {
    letter.alpha = lerp(letter.alpha, 255, 0.05);
    
    if (letter.alpha < 254) { // Slightly less than 255 to avoid rounding issues
      allFadedIn = false;
    }
  }
  if (allFadedIn) {
    assembled = true;
  }
}

function rotateWord() {
  angle += rotationSpeed;
}

function drawFlatLetter(points, alpha) {
  noStroke();

  // Simulate chrome effect with gradient
  let c1 = color(200, 200, 200, alpha); // Light gray with alpha
  let c2 = color(50, 50, 50, alpha);    // Dark gray with alpha

  // Draw the front face
  beginShape();
  for (let i = 0; i < points.length; i++) {
    let inter = lerpColor(c1, c2, points[i].y / (height * textSizeFactor));
    fill(inter);
    vertex(points[i].x, points[i].y, 0);
  }
  endShape(CLOSE);
}

function drawDiamond() {
  let c1 = diamondColor[0];
  let c2 = diamondColor[1];
  let c3 = diamondColor[2];
  let gradient = [c1, c2, c3];
  let sizeFactor = height / 10; // Dynamic size based on canvas height

  // Define diamond vertices
  let vertices = [
    createVector(0, -sizeFactor, 0), // Top vertex
    createVector(sizeFactor, 0, sizeFactor), // Front right
    createVector(-sizeFactor, 0, sizeFactor), // Front left
    createVector(-sizeFactor, 0, -sizeFactor), // Back left
    createVector(sizeFactor, 0, -sizeFactor), // Back right
    createVector(0, sizeFactor, 0) // Bottom vertex
  ];

  // Draw diamond faces
  let faces = [
    [0, 1, 2], // Top front
    [0, 2, 3], // Top left
    [0, 3, 4], // Top back
    [0, 4, 1], // Top right
    [5, 2, 1], // Bottom front
    [5, 3, 2], // Bottom left
    [5, 4, 3], // Bottom back
    [5, 1, 4] // Bottom right
  ];

  for (let face of faces) {
    beginShape();
    let lerpFactor = face[0] / vertices.length;
    let inter = lerpColor(gradient[face[0] % gradient.length], gradient[(face[0] + 1) % gradient.length], lerpFactor);
    fill(inter);
    for (let i of face) {
      vertex(vertices[i].x, vertices[i].y, vertices[i].z);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupLetters(); // Recalculate letter positions and sizes on resize
}
