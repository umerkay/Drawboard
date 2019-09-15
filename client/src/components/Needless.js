import React, { Component } from 'react';

// const PI = Math.PI;
// const HALF_PI = Math.PI / 2;
const TWO_PI = Math.PI * 2;

// const min = Math.min;
// const max = Math.max;
// const abs = Math.abs;
const sqrt = Math.sqrt;
const sin = Math.sin;
const cos = Math.cos;
// const tan = Math.tan;
// const asin = Math.asin;
// const acos = Math.acos;
const atan = Math.atan;

export function dist(x1, y1, x2, y2) {
    return sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

export function distSq(x1, y1, x2, y2) {
    return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
}

const floor = Math.floor;

export function random(to, from, int) {
    if (to instanceof Array) return to[floor(random(to.length))]
    if (from != null) {
        if (int) {
            return floor(Math.random() * (to - from)) + (from);
        } else {
            return Math.random() * (to - from) + (from);
        }
    } else if (to != null) {
        if (int) {
            return floor(Math.random() * (to));
        } else {
            return random() * (to);
        }
    } else {
        return Math.random();
    }
}

export class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        if (vector instanceof Vector) {
            this.x += vector.x;
            this.y += vector.y;
        } else {
            this.x += vector;
            this.y += vector;
        }
        return this;
    }

    sub(vector) {
        if (vector instanceof Vector) {
            this.x -= vector.x;
            this.y -= vector.y;
        } else {
            this.x -= vector;
            this.y -= vector;
        }
        return this;
    }

    mult(vector) {
        if (vector instanceof Vector) {
            this.x *= vector.x;
            this.y *= vector.y;
        } else {
            this.x *= vector;
            this.y *= vector;
        }
        return this
    }

    div(vector) {
        if (vector instanceof Vector) {
            this.x /= vector.x;
            this.y /= vector.y;
        } else {
            this.x /= vector;
            this.y /= vector;
        }
        return this;
    }

    mag() {
        return sqrt(this.x * this.x + this.y * this.y);
    }

    array() {
        return [this.x, this.y]
    }

    magSq() {
        return this.x * this.x + this.y * this.y;
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    normalize() {
        this.div(this.mag());
        return this;
    }

    setMag(num) {
        this.normalize().mult(num);
        return this;
    }

    limit(num) {
        const mag = this.mag();
        if (mag > num) {
            this.div(mag).mult(num);
        }
        return this;
    }

    angle() {
        return atan(this.y / this.x);
    }

    dot(v2) {
        return this.x * v2.x + this.y * v2.y;
    }

    getPerp() {
        return new Vector(-this.y, this.x);
    }

    set(x, y) {
        this.x = x; this.y = y;
    }

    rotate(angle) {
        const COS = cos(angle);
        const SIN = sin(angle);
        this.x = (this.x * COS - this.y * SIN);
        this.y = (this.x * SIN + this.y * COS);
        return this;
    }

    static random2D() {
        const vector = new Vector(random(), random());
        vector.normalize();
        return vector;
    }
    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }
    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }
    static mult(v1, n) {
        return new Vector(v1.x * n, v1.y * n);
    }
    static div(v1, n) {
        return new Vector(v1.x / n, v1.y / n);
    }
    static normalize(v1) {
        return v1.copy().normalize();
    }
    static setMag(v1, n) {
        return v1.copy().setMag(n);
    }
    static dist(v1, v2) {
        return sqrt((v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y));
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static areEqual(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y;
    }
}

export class Sketch extends Component {

    mouse = {
        position: new Vector(0, 0),
        lastPosition: new Vector(0, 0),
        downPos: new Vector(0, 0),
        down: false,
        button: -1,
        isDown: () => {
            return this.mouse.button === 0;
        }
    }

    canvases = []

    componentDidMount() {

        const {
            width = 400,
            height = width,
            frameRate = 30,
            autoplay = true,
            // push = true
        } = this.props;
        //own mouse object literal with values relative to self

        this._paused = !autoplay;

        this.width = width; this.height = height;
        this.frameRate(frameRate);

        this.ctxs = []; this.currentCtx = null;

        if (!(this.container instanceof HTMLDivElement)) throw new Error('Needed HTMLDivElement');

        this.container.style.display = "inline-block";

        if (this.width === "inherit") {
            this.width = this.container.clientWidth;
        } else {
            this.container.style.width = this.width + "px";
        }

        if (this.height === "inherit") {
            this.height = this.container.clientHeight;
        } else {
            this.container.style.height = this.height + "px";
        }

        //bind name for accessing
        // this.name = this.container.id || "sketch-" + (Sketches.all.length);
        // this.mouse.name = this.name;

        //mouse events for every sketch
        this.container.addEventListener("mousemove", (evt) => {
            this.mouse.lastPosition = this.mouse.position.copy();
            let rect = this.container.getBoundingClientRect();
            this.mouse.position.x = Math.floor((evt.clientX - rect.left));
            this.mouse.position.y = Math.floor((evt.clientY - rect.top));
        });
        this.container.addEventListener("mousedown", (evt) => {
            this.mouse.button = evt.button;
            this.mouse.downPos.set(this.mouse.position.x, this.mouse.position.y);
        });
        this.container.addEventListener("mouseup", (evt) => {
            this.mouse.button = -1;
        });
        this.container.addEventListener("touchstart", (evt) => {
            this.mouse.button = 0;
            this.mouse.downPos.set(this.mouse.position.x, this.mouse.position.y);
        });
        this.container.addEventListener("touchend", (evt) => {
            this.mouse.button = -1;
            this.container.dispatchEvent(new MouseEvent('mouseup'));
        });
        this.container.addEventListener("touchmove", (e) => {
            e.preventDefault();
            e.stopPropagation();
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.container.dispatchEvent(mouseEvent);
        }, false);

        this.canvases.forEach(canvas => {
            //set width height
            canvas.width = this.width;
            canvas.height = this.height;
            //set canvas methods
            canvas.onselectstart = () => false;

            canvas.style.position = 'absolute';

            let ctx = canvas.getContext("2d");
            this.canvases.push(canvas);
            // this.layers++;
            this.ctxs.push(ctx);
            this.currentCtx = ctx;
        });

        //default rectangle draw mode
        this.rectMode("CENTER");
        // this.ctxs.forEach(ctx => ctx.scale(scaleX, scaleY));
        this.colorMode(0);

        this.init(this.props.init).loop(this.props.loop);
        for (let key in this.props.events) {
            this.on(key, this.props.events[key]);
        }
        this.update();
    }

    update = () => {
        if (!this._paused) {
            this._loop_main();
        }
        requestAnimationFrame(this.update);
    }

    render() {
        this.layers = this.props.layers || 1;
        const canvases = [];
        for (let i = 0; i < this.layers; i++) {
            canvases.push((<canvas ref={el => this.canvases[i] = el} key={i}></canvas>));
        }
        return (
            <div ref={el => this.container = el} style={this.props.style} className='full fullWidth'>
                {canvases}
            </div>
        )
    }



    init(f) {
        this._init = f || this._init;
        if (f) {
            f.bind(this)(this);
        }
        return this;
    }

    setLoop(f) {
        if (typeof f != "function") throw new Error("setLoop requires function as first parameter, got " + typeof f);
        return this._loop = f;
    }

    loop(f) {
        this._loop = f || this._loop;

        this._fpsInterval = 1000 / this.fps;
        this._then = Date.now();
        this._frameCount = 0;

        return this;
    }

    _loop_main() {
        const now = Date.now();
        this._elapsed = now - this._then;

        if (this._elapsed > this._fpsInterval) {

            this._frames++;
            if (this._t0 !== Math.floor(performance.now() / 1000)) {
                this._frames_last = this._frames;
                this._frames = 0;
                this._t0 = Math.floor(performance.now() / 1000);
            }
            this._then = now - (this._elapsed % this._fpsInterval);
            this._frameCount++;


            this.ctxs.forEach(ctx => ctx.save());
            if (this._loop instanceof Function)
                this._loop(this);
            this.ctxs.forEach(ctx => ctx.restore());

        }
    }

    stopLoop(duration) {
        this._paused = true;
        if (typeof duration == "number") setTimeout(sketch => sketch.doLoop(), duration, this);
    }

    doLoop() {
        this._paused = false;
    }

    //#region

    setLayer = (layer) => {
        this.currentCtx = this.ctxs[layer];
    }

    loopCount = () => {
        return this._frameCount;
    }

    ctx = () => {
        return this.currentCtx;
    }

    frameRate = (fps) => {
        if (fps) this.fps = fps;
        else return this._frames_last;
    }

    clearAll = () => {
        this.ctxs.forEach(ctx => ctx.clearRect(0, 0, this.width, this.height));
    }

    clear = () => {
        this.currentCtx.clearRect(0, 0, this.width, this.height);
    }

    background = (r, g, b, a) => {
        if (r instanceof HTMLImageElement) {
            this.rectMode("CORNER");
            this.image(r, 0, 0, this.width, this.height);
            return;
        }
        this.save();
        this.fill(r, g, b, a);
        this.noStroke();
        this.rectMode("CENTER");
        this.rect(this.width / 2, this.height / 2, this.width, this.height);
        this.restore();
    }

    rect = (x, y, w, h) => {

        let ctx = this.currentCtx;
        if (this.currentCtx.doFill !== false)
            ctx.fillRect(x - w * this.offset, y - h * this.offset, w, h);
        if (this.currentCtx.doStroke !== false)
            ctx.strokeRect(x - w * this.offset, y - h * this.offset, w, h);
    }

    line = (x1, y1, x2, y2) => {
        this.currentCtx.beginPath();
        this.currentCtx.moveTo(x1, y1);
        this.currentCtx.lineTo(x2, y2);
        this.currentCtx.stroke();
    }

    rectMode = (mode) => {
        switch (mode) {
            case "CENTER":
                this.offset = 1 / 2;
                break;
            case "CORNER":
                this.offset = 0;
                break;
            default:
                this.offset = 0;
        }
    }

    stroke = (r, g, b, a) => {
        if ((r === null || r === undefined) && r !== 0) return this.noStroke();
        this._set("strokeStyle", r, g, b, a);
        this.currentCtx.doStroke = true;
    }

    fill = (r, g, b, a) => {
        if ((r === null || r === undefined) && r !== 0) return this.noFill();
        this._set("fillStyle", r, g, b, a);
        this.currentCtx.doFill = true;
    }

    _set = (property, r, g, b, a) => {
        if (typeof r === 'string') this.currentCtx[property] = r;
        else if (typeof r === 'number') {
            if (this._colormode === 'hsl')
                this.currentCtx[property] = `${this._colormode}a(${r}, ${typeof b == 'number' ? g : r}%, ${typeof b == 'number' ? b : r}%, ${typeof a == 'number' ? a : ((typeof g == 'number' && typeof b != 'number') ? g : 1)})`;
            else
                this.currentCtx[property] = `${this._colormode}a(${r}, ${typeof b == 'number' ? g : r}, ${typeof b == 'number' ? b : r}, ${typeof a == 'number' ? a : ((typeof g == 'number' && typeof b != 'number') ? g : 1)})`;
        }
        else if (typeof r === 'object') {
            if (r.mode === 'hsl')
                this.currentCtx[property] = `hsla(${r.h}, ${r.s}, ${r.l}, ${r.a})`;
            else
                this.currentCtx[property] = `rgba(${r.r}, ${r.g}, ${r.b}, ${r.a})`;
        }
    }

    colorMode = (mode) => {
        if (mode === 0 || mode === "rgb") this._colormode = "rgb";
        else if (mode === 1 || mode === "hsl") this._colormode = "hsl";
    }

    strokeWeight = (weight) => {
        this.currentCtx.lineWidth = weight;
        this.currentCtx.doStroke = true;
    }

    noStroke = () => {
        this.currentCtx.doStroke = false;
    }

    noFill = () => {
        this.currentCtx.doFill = false;
    }

    loadImage = (src) => {
        let img = new Image();
        img.onload = () => {

        };
        img.src = src;
        return img;
    }

    image = (img, x, y, w, h) => {
        if (w !== null && h !== null) {
            this.currentCtx.drawImage(img, x, y, w, h);
        } else {
            this.currentCtx.drawImage(img, x, y);
        }
    }

    ellipse = (x, y, w, h = w) => {
        this.currentCtx.beginPath();
        this.currentCtx.ellipse(x, y, w, h, 0, 0, TWO_PI);
        if (this.currentCtx.doFill !== false) {
            this.currentCtx.fill();
        }
        if (this.currentCtx.doStroke !== false) {
            this.currentCtx.stroke();
        }
        this.currentCtx.closePath();
    }

    circle = (x, y, r) => {
        this.currentCtx.beginPath();
        this.currentCtx.ellipse(x, y, r, r, 0, 0, TWO_PI);
        if (this.currentCtx.doFill !== false) {
            this.currentCtx.fill();
        }
        if (this.currentCtx.doStroke !== false) {
            this.currentCtx.stroke();
        }
        this.currentCtx.closePath();
    }

    arc = (x, y, w, s, e) => {
        this.currentCtx.beginPath();
        this.currentCtx.arc(x, y, w / 2, s, e);
        if (this.currentCtx.doFill !== false) {
            this.currentCtx.fill();
        }
        if (this.currentCtx.doStroke !== false) {
            this.currentCtx.stroke();
        }
        this.currentCtx.closePath();
    }

    text = (string, x, y) => {
        this.currentCtx.textAlign = "center";
        this.currentCtx.font = "bold 15px Arial";
        this.currentCtx.fillText(string, x, y + 15 / 3);
    }

    save = () => {
        this.currentCtx.save();
    }

    restore = () => {
        this.currentCtx.restore();
    }

    translate = (x, y) => {
        this.currentCtx.translate(x, y);
    }

    rotate = (angle) => {
        this.currentCtx.rotate(angle);
    }

    scale = (x, y = x) => {
        this.currentCtx.scale(x, y);
    }
    //#endregion

    on(event, f) {
        if (typeof f === "function") {
            this.container.addEventListener(event, (e) => {
                e.preventDefault();
                e.stopPropagation();

                f.bind(this)(this, e);
            });
        } else {
            throw new Error("Function required by method. Got " + typeof f);
        }
        return this;
    }

    that = () => {
        return this;
    }

    drawPoints = (points) => {
        const ctx = this.currentCtx;
        if (points.length === 1) {
            ctx.fillStyle = ctx.strokeStyle;
            this.noStroke();
            return this.circle(points[0][0], points[0][1], ctx.lineWidth / 2);
        } else if (points.length === 0) return;
        ctx.beginPath();
        // ctx.setLineDash([5, 15]);
        ctx.moveTo(points[0][0], points[0][1]);
        if (points.length < 3) {
            for (let point of points) {
                ctx.lineTo(point[0], point[1]);
            }
            ctx.stroke();
            return
        }
        let i;
        // draw a bunch of quadratics, using the average of two points as the control point
        for (i = 1; i < points.length - 2; i++) {
            var c = (points[i][0] + points[i + 1][0]) / 2,
                d = (points[i][1] + points[i + 1][1]) / 2;
            ctx.quadraticCurveTo(points[i][0], points[i][1], c, d);
        }
        ctx.quadraticCurveTo(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
        ctx.stroke();
        ctx.closePath();
    }
}