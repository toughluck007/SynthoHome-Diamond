let angle = 0;
let backgroundColor = '#40403f';
let diamondColors;
let colorIndex = 0;
let colorLerp = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  diamondColors = [
    [color(0, 0, 255), color(128, 0, 128), color(255, 20, 147)], // Blue, purple, pink
    [color(128, 0, 128), color(255, 20, 147), color(0, 0, 255)], // Purple, pink, blue
    [color(255, 20, 147), color(0, 0, 255), color(128, 0, 128)]  // Pink, blue, purple
  ];
}

function draw() {
  background(backgroundColor);
  
  // Update the gradient colors
  updateGradientColors();
  
  // Draw the spinning diamond
  push();
  translate(0, 0, 0); // Center the diamond
  rotateY(angle);
  drawDiamond();
  pop();

  // Update the rotation angle
  angle += 0.01;
}

function updateGradientColors() {
  // Update the lerp factor
  colorLerp += 0.01;
  if (colorLerp > 1) {
    colorLerp = 0;
    colorIndex = (colorIndex + 1) % diamondColors.length;
  }
}

function drawDiamond() {
  let c1 = lerpColor(diamondColors[colorIndex][0], diamondColors[(colorIndex + 1) % diamondColors.length][0], colorLerp);
  let c2 = lerpColor(diamondColors[colorIndex][1], diamondColors[(colorIndex + 1) % diamondColors.length][1], colorLerp);
  let c3 = lerpColor(diamondColors[colorIndex][2], diamondColors[(colorIndex + 1) % diamondColors.length][2], colorLerp);
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
}
