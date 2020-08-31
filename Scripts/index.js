/// <reference path="matter.d.ts"/>
  
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Mouse = Matter.Mouse,
    Vector = Matter.Vector;

var engine = Engine.create();

const loadImage = (url, onSuccess, onError) => {
    const img = new Image();
    img.onload = () => {
      onSuccess(img.src);
    };
    img.onerror = onError();
    img.src = url;
};  

var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 640,
        height: 480,
        wireframes: false
    }
});

render.options.width = 640;
render.options.height = 480;

var mouse = Mouse.create(render.canvas),
mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

render.mouse = mouse;

let canon, canonBall;

loadImage("../Assets/canon.png", () => {
    canon = Bodies.rectangle(100, render.options.height - 15, 128, 100, {
        render: {
            sprite: {
                texture: "../Assets/canon.png",
                yOffset: 0.67
            }
        },
        isStatic: true,
        collisionFilter: {
            'group': -1,
            'category': 2,
            'mask': 0,
        }
    });

    World.add(engine.world, [canon]);
}, () => {});
loadImage("../Assets/canonBall.png", run, 
() => {});

let released = true;

Events.on(engine, 'tick', (event) => 
{
    if (mouseConstraint.mouse.button === 0 && released)
    {
        released = false;
        
        let _ballInstance = Bodies.circle(200, 350,
            32, {
                render: {
                    sprite: {
                        texture: "../Assets/canonBall.png",
                        yOffset: 0.1176470588
                    }
                }
            });
            
        let targetPos = Vector.create(mouseConstraint.mouse.position.x,
            mouseConstraint.mouse.position.y);
        
        if (targetPos.x < 200)
            targetPos.x = 200;

        Matter.Body.setVelocity(_ballInstance, Vector.mult(Vector.div(
            Vector.sub(targetPos, _ballInstance.position), 
            Vector.magnitude(Vector.sub(targetPos, _ballInstance.position))), 20));

        World.add(engine.world, [_ballInstance]);
    } else if (mouseConstraint.mouse.button === -1 && !released)
        released = true;
});

function run()
{
    var boxes = [Bodies.rectangle(300, render.options.height - 32, 32, 128),
    Bodies.rectangle(300, render.options.height - 64 - 128, 64, 64),
    Bodies.rectangle(400, render.options.height - 32, 32, 136),
    Bodies.rectangle(400, render.options.height - 64 - 136, 64, 64),
    Bodies.rectangle(400, render.options.height - 96 - 136 - 64, 128, 128)];

    var ground = Bodies.rectangle(0, render.options.height - 16, render.options.width * 2
        , 32, {isStatic: true});
    
    World.add(engine.world, boxes);
    World.add(engine.world, [ground]);

    Engine.run(engine);
    Render.run(render);
}