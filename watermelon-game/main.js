import { Bodies, Body, Engine, Render, Runner, World } from "matter-js";
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
            Body.setPosition(currentBody, {
                x: currentBody.position.x - 10,
                y: currentBody.position.y,
            })
            break;
        case "KeyD":
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

addFruit();