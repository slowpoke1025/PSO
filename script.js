const WEIGHT = 3
const C1 = 1
const C2 = 2
const VMAX = 20;
const NODE_NUM = 30;
let WIDTH = document.documentElement.scrollWidth
let HEIGHT = document.documentElement.scrollHeight
let NODE_WIDTH = getComputedStyle(document.documentElement).getPropertyValue("--node-width").replace("px", "")
let FOOD_WIDTH = getComputedStyle(document.documentElement).getPropertyValue("--food-width").replace("px", "")


const TARGET = {
    x: 0,
    y: 0
}
const BEST = { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER }

let ok = true
class Node {

    static bestX = BEST.x
    static bestY = BEST.y
    static nodeNum = 0;

    constructor(x = 50, y = 50, color = "#ffde00") {
        this.node = document.createElement("div");
        this.node.classList.add("node")
        this.x = random(NODE_WIDTH / 2, WIDTH - NODE_WIDTH / 2);
        this.y = random(NODE_WIDTH / 2, HEIGHT - NODE_WIDTH / 2);
        this.bestX = this.x;
        this.bestY = this.y;
        this.vX = random(1, 10) * (random(0, 1) ? -1 : 1);
        this.vY = random(1, 10) * (random(0, 1) ? -1 : 1);
        this.color = randomRGB();
        document.body.append(this.node)
        ++this.constructor.nodeNum
    }

    set color(value) {
        this.node.style.backgroundColor = value;
    }

    set x(value) {
        this._x = value
        this.node.style.left = `${value}px`
    }
    get x() {
        return this._x;
    }
    set y(value) {
        this._y = value
        this.node.style.top = `${value}px`
    }
    get y() {
        return this._y;
    }
    update() {

        this.fitness()
        // this.x = Math.min(Math.max(NODE_WIDTH / 2, this.x + this.vX), WIDTH - NODE_WIDTH / 2)
        // this.y = Math.min(Math.max(NODE_WIDTH / 2, this.y + this.vY), WIDTH - NODE_WIDTH / 2)
        this.x = this.x + this.vX
        this.y = this.y + this.vY
        if (distance(TARGET.x, this.x) < distance(TARGET.x, this.bestX))
            this.bestX = this.x

        if (distance(TARGET.y, this.y) < distance(TARGET.y, this.bestY))
            this.bestY = this.y

    }
    fitness() {
        const deltaX = WEIGHT * this.vX + C1 * Math.random() * (this.bestX - this.x) + C2 * Math.random() * (Node.bestX - this.x)
        const deltaY = WEIGHT * this.vY + C1 * Math.random() * (this.bestY - this.y) + C2 * Math.random() * (Node.bestY - this.y)

        this.vX = deltaX >= 0 ? Math.min(deltaX, VMAX) : Math.max(deltaX, -VMAX)
        this.vY = deltaY >= 0 ? Math.min(deltaY, VMAX) : Math.max(deltaY, -VMAX)
    }

}




window.addEventListener("resize", e => {
    WIDTH = document.documentElement.scrollWidth
    HEIGHT = document.documentElement.scrollHeight
})

window.addEventListener("mousemove", e => {
    TARGET.x = e.pageX;
    TARGET.y = e.pageY;
})

window.addEventListener("click", e => {
    Nodes.forEach(n => {
        n.x = random(-(WIDTH - NODE_WIDTH / 2) * 0.5, (WIDTH - NODE_WIDTH / 2) * 1.5);
        n.y = random(-(HEIGHT - NODE_WIDTH / 2) * 0.5, (HEIGHT - NODE_WIDTH / 2) * 1.5);
        n.vX = random(-10, 10)
        n.vY = random(-10, 10)
        n.bestX = n.x
        n.bestY = n.y
    })
    Node.bestX = Number.MAX_SAFE_INTEGER;
    Node.bestY = Number.MAX_SAFE_INTEGER;

})

// document.addEventListener("keydown", e => {
//     ok = true
// })

function distance(d1, d2) {
    return Math.abs(d1 - d2)
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomRGB() {
    return `rgba(${random(0, 255)},${random(0, 255)},${random(0, 255)},0.9)`
}

function move() {



    for (const node of Nodes) {
        node.update()

        // if (ok && collision(node, TARGET)) {
        //     setTimeout(() => {
        //         food.remove()
        //         generateFood()
        //         ok = true
        //     }, 1500)
        //     ok = false;
        // }
    }
    updateGlobal()



    requestAnimationFrame(move)

}

let food;
const Nodes = []

for (let i = 0; i < NODE_NUM; ++i) {
    Nodes.push(new Node())
}
// generateFood()
updateGlobal()
move()

function updateGlobal() {
    for (let node of Nodes) {

        if (distance(TARGET.x, node.x) < distance(TARGET.x, Node.bestX)) {
            Node.bestX = node.bestX
        }
        if (distance(TARGET.y, node.y) < distance(TARGET.y, Node.bestY)) {
            Node.bestY = node.bestY
        }
    }

}

function collision(N, F) {
    return !(N.x + NODE_WIDTH / 2 < F.x - FOOD_WIDTH / 2 ||
        N.x - NODE_WIDTH / 2 > F.x + FOOD_WIDTH / 2 ||
        N.y + NODE_WIDTH / 2 < F.y - FOOD_WIDTH / 2 ||
        N.y - NODE_WIDTH / 2 > F.y + FOOD_WIDTH / 2)
}

function generateFood() {
    food = document.createElement("div")
    food.classList.add("food")
    TARGET.x = random(NODE_WIDTH / 2, WIDTH - NODE_WIDTH / 2)
    TARGET.y = random(NODE_WIDTH / 2, HEIGHT - NODE_WIDTH / 2)

    food.style.left = TARGET.x + "px"
    food.style.top = TARGET.y + "px"
    document.body.append(food)
}