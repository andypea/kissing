var Matter = require('matter-js')

var circleSize = 1;
var kisses = 0;
var maxKisses = 0;
var red = "#C44D58"
var grey = "#C4C4C4"

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events,
    Composite = Matter.Composite,
    Common = Matter.Common;

// create an engine
var engine = Engine.create();

engine.world.gravity.y = 0;

// create a renderer
var render = Render.create({
  element: document.getElementById("canvasDiv"),
  engine: engine,
  options: {
    wireframes: false,
    background: "#fff"
  }
});

var centerCircle = Bodies.circle(400, 300, 80, {
  render: {
    lineWidth: 0.5,
    fillStyle: red,
    strokeStyle: Common.shadeColor(red, -20),
  },
  isStatic: true
});

var mouseConstraint = MouseConstraint.create(engine, {
  element: render.canvas
});

Events.on(mouseConstraint, "mousedown", function(event) {
  var circle = Bodies.circle(event.mouse.absolute.x, event.mouse.absolute.y, 80 * circleSize, {
    render: {
      lineWidth: 0.5,
      fillStyle: grey,
      strokeStyle: Common.shadeColor(grey, -20),
    }
  });
  var constraint = Constraint.create({
    pointA: { x: 400, y: 300 },
    bodyB: circle,
    pointB: { x: 0, y:0 },
    length: 1,
    stiffness: 0.01,
    render: {
      visible: false
    }
  });
  World.add(engine.world, [circle, constraint]);
});

Events.on(engine, "collisionActive", function(event) {
  kisses = 0; 
  for (i=0; i < event.pairs.length; i++) {
    if (event.pairs[i].bodyA.id === centerCircle.id || event.pairs[i].bodyB.id === centerCircle.id) {
      kisses++;
    }
  }
  if (kisses > maxKisses) {
    maxKisses = kisses;
  }
  document.getElementById("kisses").innerHTML= kisses;    
  document.getElementById("maxKisses").innerHTML= maxKisses;    
});

document.getElementById("circleSize").onchange = function() {
  circleSize = document.getElementById("circleSize").value;
};

document.getElementById("clearButton").onclick = function() {
  World.clear(engine.world);
  World.add(engine.world, centerCircle);
  kisses = 0;
  maxKisses = 0;
  document.getElementById("kisses").innerHTML= kisses;    
  document.getElementById("maxKisses").innerHTML= maxKisses;    
};

// add all of the bodies to the world
World.add(engine.world, [centerCircle, mouseConstraint]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
