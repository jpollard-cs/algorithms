// Example of using priority queues for event-driven simulation
// initialization is quadratic, but collision detection after that will take N lg N time

import { MaxPriorityQueue } from '../lib/heaps';

const Particle = {
    init: function(id, canvasWidth, canvasHeight, rx, ry, vx, vy, radius, mass, color) {
        this.id = id; // identity
        this.rx = rx; // x position
        this.ry = ry; // y position
        this.vx = vx; // x velocity
        this.vy = vy; // y velocity
        this.radius = radius; // radius
        this.mass = mass; // mass
        this.count = 0; // number of collisions
        this.color = color;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // TODO: numbers might need to be between and 1 then might need to project to get to work
        // rx     = StdRandom.uniform(0.0, 1.0);
        // ry     = StdRandom.uniform(0.0, 1.0);
        // vx     = StdRandom.uniform(-0.005, 0.005);
        // vy     = StdRandom.uniform(-0.005, 0.005);

        //Random position on the canvas
        this.rx = Math.random() * canvasWidth;
        this.ry = Math.random() * canvasHeight;

        //Lets add random velocity to each particle
        this.vx = Math.random() * 20 - 10;
        this.vy = Math.random() * 20 - 10;

        //Random colors
        const r = Math.random()*255>>5; // let's get closer to the blue/green spectrum
        const g = Math.random()*255>>0;
        const b = Math.random()*255>>0;
        this.color = "rgba("+r+", "+g+", "+b+", 0.5)";

        //Random size
        this.radius = Math.random()*20+20;
        this.mass = Math.random()*20+20;
    },
    move: function(dt) {
        // if ((this.rx + this.vx * dt < this.radius) || (this.rx + this.vx * dt > 1.0 - this.radius)) { this.vx = -this.vy; }
        // if ((this.ry + this.vy * dt < this.radius) || (this.ry + this.vy * dt > 1.0 - this.radius)) { this.vy = -this.vy; }
        this.rx += this.vx * dt;
        this.ry += this.vy * dt;
    },
    draw: function(ctx) {
        ctx.beginPath();

        //Time for some colors
        const gradient = ctx.createRadialGradient(this.rx, this.ry, 0, this.rx, this.ry, this.radius);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.4, this.color);
        gradient.addColorStop(1, "black");

        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
        ctx.fill();
    },
    /**
     * Returns the amount of time for this particle to collide with the specified
     * particle, assuming no interening collisions.
     * @param that {particle}
     * @returns {number}
     */
    timeToHit: function(that) {
        if (this.id === that.id) { return Infinity; }
        const dx    = that.rx - this.rx, dy = that.ry - this.ry;
        const dvx   = that.vx - this.vx, dvy = that.vy - this.vy;
        const dvdr  = dx*dvx + dy*dvy;
        if( dvdr > 0) { return Infinity; }
        const dvdv  = dvx*dvx + dvy*dvy;
        const drdr  = dx*dx + dy*dy;
        const sigma = this.radius + that.radius;
        const d     = (dvdr * dvdr) - dvdv * (drdr - sigma * sigma);
        // if (drdr < sigma*sigma) Console.log("overlapping particles");
        if (d < 0) return Infinity;
        return -(dvdr + Math.sqrt(d)) / dvdv;
    },
    timeToHitVerticalWall: function() {
        if      (this.vx > 0) { return (this.canvasWidth - this.rx - this.radius) / this.vx; }
        else if (this.vx < 0) { return (this.radius - this.rx) / this.vx; }
        else                  { return Infinity; }
    },
    timeToHitHorizontalWall: function() {
        if      (this.vy > 0) { return (this.canvasHeight - this.ry - this.radius) / this.vy; }
        else if (this.vy < 0) { return (this.radius - this.ry) / this.vy; }
        else                  { return Infinity; }
    },
    /**
     * Updates the velocities of this particle and the specified particle according
     * to the laws of elastic collision. Assumes that the particles are colliding
     * at this instant.
     *
     * @param that {particle}
     */
    bounceOff: function(that) {
        const dx   = that.rx - this.rx;
        const dy   = that.ry - this.ry;
        const dvx  = that.vx - this.vx;
        const dvy  = that.vy - this.vy;
        const dvdr = dx * dvx + dy * dvy;
        const dist = this.radius + that.radius;   // distance between particle centers at collison

        // magnitude of normal force
        const magnitude = 2 * this.mass * that.mass * dvdr / ((this.mass + that.mass) * dist);

        // normal force, and in x and y directions
        const fx = magnitude * dx / dist;
        const fy = magnitude * dy / dist;

        // update velocities according to normal force
        this.vx += fx / this.mass;
        this.vy += fy / this.mass;
        that.vx -= fx / that.mass;
        that.vy -= fy / that.mass;

        // update collision counts
        this.count++;
        that.count++;
    },
    bounceOffVerticalWall: function() {
        this.vx = -this.vx;
        this.count++;
    },
    bounceOffHorizontalWall: function() {
        this.vy = -this.vy;
        this.count++;
    },
    kineticEnergy: function() {
        return 0.5 * this.mass * (this.vx * this.vx + this.vy * this.vy);
    }
};


const Event = {
    /**
     * @param t {number} - Time
     * @param a {particle} - Particle A
     * @param b {particle} - Particle B
     */
    init: function(t, a, b) {
        this.time = t;
        this.a    = a;
        this.b    = b;
        if (this.a != null) { this.countA = this.a.count; }
        else                { this.countA = -1; }
        if (this.b != null) { this.countB = this.b.count; }
        else                { this.countB = -1; }
    },
    isValid: function() {
        // has any collision occurred between when event was created and now?
        if (this.a != null && this.a.count != this.countA) { return false; }
        if (this.b != null && this.b.count != this.countB) { return false; }
        return true;
    }
};

function greaterThan(eventA, eventB) {
    // since we're going to use a Max Priority Queue we'll simply flip this
    // since we want to find the event that will happen the soonest
    // so instead of eventA.time - eventB.time we switch it around
    // so that the MaxPq should work as a MinPq
    return (eventB.time - eventA.time) > 0;
}

const CollisionSystem = {
    init: function(particles, canvasWidth, canvasHeight, hz = 0.5) {
        this.particles = particles;
        this.t = 0; // simulation clock time
        this.hz = hz; // number of redraws per clock tick;
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    },
    predict: function(a, limit) {
        if (a == null) { return; }
        for (let i = 0; i < this.particles.length; i++) {
            const dt = a.timeToHit(this.particles[i]);
            if (this.t + dt <= limit) {
                const event = Object.create(Event);
                event.init(this.t + dt, a, this.particles[i]);
                this.pq.insert(event);
            }
        }

        const dtX = a.timeToHitVerticalWall();
        const dtY = a.timeToHitHorizontalWall();
        if (this.t + dtX <= limit) {
            const verticalWallEvent = Object.create(Event);
            verticalWallEvent.init(this.t + dtX, a, null);
            this.pq.insert(verticalWallEvent);
        }
        if (this.t + dtY <= limit) {
            const horizontalWallEvent  = Object.create(Event);
            horizontalWallEvent.init(this.t + dtY, null, a);
            this.pq.insert(horizontalWallEvent);
        }
    },
    simulate: function(limit = 60) {
        this.t = 0;
        this.pq = Object.create(MaxPriorityQueue);
        this.pq.init(greaterThan);
        for (let i = 0; i < this.particles.length; i++) {
            this.predict(this.particles[i], limit);
        }
        const initEvent = Object.create(Event);
        initEvent.init(0, null, null);
        this.pq.insert(initEvent);

        while(!this.pq.isEmpty()) {
            const nextEvent = this.pq.delMax(); // next event (really deleting min)
            if (!nextEvent.isValid()) { continue; }
            const a = nextEvent.a;
            const b = nextEvent.b;
            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i].move(nextEvent.time - this.t);
            }
            this.t = nextEvent.time;
            // process event
            if      (a != null && b != null) { a.bounceOff(b); }              // particle-particle collision
            else if (a != null && b == null) { a.bounceOffVerticalWall(); }   // particle-wall collision
            else if (a == null && b != null) { b.bounceOffHorizontalWall(); } // particle-wall collision
            else if (a == null && b == null) { this.redraw(limit); }               // redraw event

            // update the priority queue with new collisions involving a or b
            this.predict(a, limit);
            this.predict(b, limit);
        }
    },
    redraw: function(limit) {
        this.ctx.globalCompositeOperation = "source-over";
        //Lets reduce the opacity of the BG paint to give the final touch
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        //Lets blend the particle with the BG
        this.ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw(this.ctx);
        }

        if (this.t < limit) {
            const redrawEvent = Object.create(Event);
            redrawEvent.init(this.t + 1.0 / this.hz, null, null);
            this.pq.insert(redrawEvent);
        }
    }
};

const balls = [];
for(let i = 0; i < 50; i++) {
    const ball = Object.create(Particle);
    ball.init(i, 500, 500);
    balls.push(ball);
}

const collisionSystem = Object.create(CollisionSystem);
collisionSystem.init(balls, 500, 500);
collisionSystem.simulate();

/*
All you need now is some HTML that looks like:
 <!DOCTYPE html>
 <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>Awesome</title>
    </head>
    <body>
        <canvas id="canvas" width="500" height="500"></canvas>
    </body>
 </html>
 */