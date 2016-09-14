var myCanvas = null;
var kinect2 = null;

// drawHand variables
var start = 30;
var target = 100;
var diameter = start;
var light = 255;
var dark = 100;
var hueValue = light;
var lerpAmt = 0.3;
var state = 'ascending';

function setup() {
	myCanvas = createCanvas(500,500);
	background(0);
	noStroke();

	kinect2 = new p5.Kinect2();
	kinect2.makeConnection();
	kinect2.startTrackedBodies(bodyTracked);
  //kinect2.startBodies(allBodies);
}

function draw() {

}

function allBodies(bodies) {
  console.log(bodies);
}

function bodyTracked(body) {
  console.log(body);
  background(0, 20);

  kinect2.getJoints(drawJoint); 
  kinect2.getHands(drawHands);
}

// Draw skeleton
function drawJoint(joint) {
  fill(100);
  ellipse(joint.depthX * myCanvas.width, joint.depthY * myCanvas.height, 15, 15);
  
  fill(200);
  ellipse(joint.depthX * myCanvas.width, joint.depthY * myCanvas.height, 3, 3);
}

// Draw hands
function drawHands(hands) {
	
	//check if hands are touching 
  if ( (Math.abs(hands.leftHand.depthX - hands.rightHand.depthX) < 0.01) && (Math.abs(hands.leftHand.depthY - hands.rightHand.depthY) < 0.01)) {
  	hands.leftHandState = 'clapping';
  	hands.rightHandState = 'clapping';
  }

  // draw hand states
  updateHandState(hands.leftHandState, hands.leftHand);
  updateHandState(hands.rightHandState, hands.rightHand);
}

function updateHandState(handState, hand) {
  switch (handState) {
    case 'closed':
      drawHand(hand, 1, 255);
    break;

    case 'open':
      drawHand(hand, 0, 255);
    break;

    case 'lasso':
      drawHand(hand, 0, 255);
    break;

    // Created new state for clapping
    case 'clapping':
    	drawHand(hand, 1, 'red');
	}
}

function drawHand(hand, handState, color) {
 
  if (handState === 1) {
    state = 'ascending';
  }
  
  if (handState === 0 ) {
    state = 'descending';
  }
  
  if (state == 'ascending') {
    diameter = lerp(diameter, target, lerpAmt);
    hueValue = lerp(hueValue, dark, lerpAmt);
  }
  
  if (state == 'descending') {
    diameter = lerp(diameter, start, lerpAmt);
    hueValue = lerp(hueValue, light, lerpAmt);
  }
  
  fill(color);
  ellipse(hand.depthX * myCanvas.width, hand.depthY * myCanvas.height, diameter, diameter);  
}