import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";
import {FRUITS_BASE} from "./fruits";


const engine = Engine.create();
const render = Render.create({
    engine,
    element: document.body, // 게임을 그릴 위치
    options: {
        wireframes: false,
        background: "#F7F4C8",
        width: 620,
        height: 850,
    }
});

const world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic : true, // 왼쪽벽 고정 
    render: {fillStyle: "#E6B143"}
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic : true, // 왼쪽벽 고정 
    render: {fillStyle: "#E6B143"}
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic : true, // 왼쪽벽 고정 
    render: {fillStyle: "#E6B143"}
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
    name: "topLine",
    isStatic: true,
    isSensor: true, // 걸리지 않고 떨어지도록 
    render: {fillStyle: "E6B143"}
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;

function addFruit() {
    const index = Math.floor(Math.random() * 5);
    const fruit = FRUITS_BASE[index];

    const body = Bodies.circle(300, 50, fruit.radius, {
        index: index,
        isSleeping: true, // 준비중상태
        render: {
            sprite: {texture: `${fruit.name}.png`}
        },
        restitution: 0.3, // 통통튀기기
    });

    currentBody = body;
    currentFruit = fruit;

    World.add(world, body);
}

window.onkeydown = (event) => {
    if (disableAction) { // 과일이 떨어지는 동안 버튼을 조작할 수 없도록 
        return;
    }

    switch(event.code) {
        case "KeyA":
            if (currentBody.position.x - currentFruit.radius > 30)
                Body.setPosition(currentBody, {
                    x: currentBody.position.x - 10,
                    y: currentBody.position.y,
                })
            break;
        case "KeyD":
            if (currentBody.position.x + currentFruit.radius < 590)
                Body.setPosition(currentBody, {
                    x: currentBody.position.x + 10,
                    y: currentBody.position.y,
                })
            break;
        case "KeyS":
            currentBody.isSleeping = false;
            disableAction = true;

            setTimeout(() => {
                addFruit();
                disableAction = false;
            }, 1500);
            break;
    }
}

Events.on(engine, "collisionStart", (event) => { // 충돌이 시작될 때 이벤트 추가 
    event.pairs.forEach((collision) => {
        if (collision.bodyA.index === collision.bodyB.index) { // 같은 과일끼리 부딪히면 
            const index = collision.bodyA.index;

            if (index === FRUITS_BASE.length - 1) { // 가장 마지막 과일일 때
                return;
            }

            World.remove(world, [collision.bodyA, collision.bodyB]); // 기존 두 과일 없애기

            const newFruit = FRUITS_BASE[index + 1];

            const newBody = Bodies.circle(
                collision.collision.supports[0].x,
                collision.collision.supports[0].y,
                newFruit.radius,
                {
                    render: { sprite: {texture: `${newFruit.name}.png`}},
                    index: index + 1,
                }
            );

            World.add(world, newBody);
        }

        if (
            !disableAction &&
            (collision.bodyA.name === 'topLine' || collision.bodyB.name === 'topLine')) {
            alert('Game over');
        }
    });
});

addFruit();