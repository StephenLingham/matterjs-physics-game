let engine = Matter.Engine.create();

let render = Matter.Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    background: "#00ccff"
  }
});

render.canvas.width = window.innerWidth;
render.canvas.height = window.innerHeight;

let platform = Matter.Bodies.rectangle(1000, 500, 190, 20, { 
  isStatic: true,
  render: {
    fillStyle: "#000000"
  }
});

let stack = Matter.Composites.stack(920, 300, 4, 4, 0, 0, function(x, y) {
    return Matter.Bodies.rectangle(x, y, 40, 40, {
      render: {
        sprite: {
          texture: "crate.png",
          xScale: 0.08,
          yScale: 0.08
        }
      }
    })
});

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    render: {visible: false}
  }
});
render.mouse = mouse;

const slingPosX = 400;
const slingPosY = 300;

let ball = createBall();

function createBall() {
  return Matter.Bodies.circle(slingPosX, slingPosY, 20, {
    render: {
      sprite: {
        texture: "basketball.svg",
        xScale: 0.3,
        yScale: 0.3
      }
    }
  });
}

let sling = Matter.Constraint.create({ 
    pointA: { 
      x: slingPosX, 
      y: slingPosY 
    }, 
    bodyB: ball, 
    stiffness: 0.05
});

let firing = false;
Matter.Events.on(mouseConstraint,'enddrag', function(e) {
  if(e.body === ball) {
    firing = true;
  }
});

Matter.Events.on(engine,'afterUpdate', function() {
  if (firing && Math.abs(ball.position.x - slingPosX) < 20 && Math.abs(ball.position.y - slingPosY) < 20) {
      ball = createBall();
      Matter.World.add(engine.world, ball);
      sling.bodyB = ball;
      firing = false;
  }
});

Matter.World.add(
  engine.world, 
  [
    mouseConstraint, 
    platform,
    stack,
    ball,
    sling]);

Matter.Engine.run(engine);
Matter.Render.run(render);
