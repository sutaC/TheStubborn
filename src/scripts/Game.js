// @ts-check

import InputHandler from "./InputHandler.js";

/**
 * @typedef {Object} Vec2d
 * @property {number} x
 * @property {number} y
 */

export default class Game {
    /**
     * @type {CanvasRenderingContext2D}
     * @readonly
     * @private
     */
    ctx;

    /**
     * @type {InputHandler}
     * @readonly
     * @private
     */
    inputHandler;

    /**
     * @typedef {Object} Scene
     * @property {number} size
     * @property {string} objectsColor
     * @property {string} backgroundColor
     */
    /**
     * @type {Scene}
     * @readonly
     * @private
     */
    scene = {
        size: 300,
        objectsColor: "#000000",
        backgroundColor: "#ffffff",
    };

    /**
     * @typedef {Object} Player
     * @property {number} x Player x position on the scene
     * @property {number} y Player y position on the scene
     * @property {number} size Player size
     * @property {Vec2d} velocity Ball valocity
     */
    /**
     * @type {Player}
     * @readonly
     * @private
     */
    player = {
        x: 0,
        y: 0,
        size: 20,
        velocity: { x: 0, y: 0 },
    };

    /**
     * @typedef {Object} Ball
     * @property {number} x Ball x position on the scene
     * @property {number} y Ball x position on the scene
     * @property {number} size Ball size
     * @property {Vec2d} velocity Ball valocity
     */
    /**
     * @type {Ball}
     * @readonly
     * @private
     */
    ball = {
        x: 0,
        y: 0,
        size: 15,
        velocity: { x: 0, y: 0.5 },
    };

    /**
     * @typedef {Object} Scoreboard
     * @property {number} score Ball x position on the scene
     * @property {number} bestScore Ball x position on the scene
     */
    /**
     * @type {Scoreboard}
     * @readonly
     * @private
     */
    scoreboard = {
        score: 0,
        bestScore: 0,
    };

    /**
     * @param {HTMLCanvasElement} canvas Game canvas element
     */
    constructor(canvas) {
        this.inputHandler = new InputHandler();
        // Setups canvas context
        this.ctx = /** @type {CanvasRenderingContext2D} */ (
            canvas.getContext("2d")
        );
        // Handles canvas resize
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Dynamic resize
        window.addEventListener(
            "resize",
            (event) => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            },
            { passive: true }
        );
        // Sets score
        this.scoreboard.bestScore = Number.parseInt(
            localStorage.getItem("bestScore") ?? "0"
        );
    }

    /**
     * Updates game state
     * @param {number} deltaTime - Delta time in ms
     * @returns {void}
     * @private
     */
    update(deltaTime) {
        // Player movement
        this.player.y = -this.scene.size / 2 + this.player.size;
        if (this.inputHandler.isHeld("ArrowRight")) {
            this.player.velocity.x += 0.01 * deltaTime;
            this.player.velocity.x = Math.min(1, this.player.velocity.x);
        } else if (this.inputHandler.isHeld("ArrowLeft")) {
            this.player.velocity.x -= 0.01 * deltaTime;
            this.player.velocity.x = Math.max(-1, this.player.velocity.x);
        }
        if (this.player.velocity.x < 0) {
            this.player.velocity.x += 0.033;
        } else if (this.player.velocity.x > 0) {
            this.player.velocity.x -= 0.033;
        }
        this.player.x += this.player.velocity.x;
        if (this.player.x >= this.scene.size / 2 - this.player.size) {
            this.player.x = this.scene.size / 2 - this.player.size - 1;
        } else if (this.player.x <= -this.scene.size / 2 + this.player.size) {
            this.player.x = -this.scene.size / 2 + this.player.size + 1;
        }
        // Ball movement
        this.ball.velocity.y -= 0.01; // Gravity
        this.ball.x += this.ball.velocity.x;
        this.ball.y += this.ball.velocity.y;
        // Objects collision
        if (
            Math.sqrt(
                (this.ball.x - this.player.x) ** 2 +
                    (this.ball.y - this.player.y) ** 2
            ) <=
            this.player.size + this.ball.size
        ) {
            // Bounces ball
            this.ball.velocity.x *= -0.33;
            this.ball.velocity.y *= -0.33;
            this.ball.velocity.x +=
                (this.ball.x - this.player.x) /
                (this.ball.size + this.player.size);
            this.ball.velocity.y +=
                (this.ball.y - this.player.y) /
                (this.ball.size + this.player.size);
            // Random quirk to ball bounce
            this.ball.velocity.x += Math.random() * this.ball.velocity.x * 0.1;
            this.ball.velocity.y += Math.random() * this.ball.velocity.y * 0.1;
            // Prevents ball collapsing
            const diffAngle = Math.atan2(
                Math.abs(this.ball.y - this.player.y),
                Math.abs(this.ball.x - this.player.x)
            );
            // [!] Condition here required becouse `Math.atan2(...)` reduces angle and ball flickers on left side
            this.ball.x =
                this.player.x +
                (this.ball.x < this.player.x ? -1 : 1) *
                    Math.cos(diffAngle) *
                    (this.ball.size + this.player.size);
            this.ball.y =
                this.player.y +
                Math.sin(diffAngle) * (this.ball.size + this.player.size);
            // Adds score
            this.scoreboard.score++;
            this.scoreboard.score %= 1000; // Rolls back at 1000
        }
        // Ball wall collision
        if (this.ball.x <= -this.scene.size / 2 + this.ball.size) {
            this.ball.x = -this.scene.size / 2 + this.ball.size + 1;
            this.ball.velocity.x *= -1;
        } else if (this.ball.x >= this.scene.size / 2 - this.ball.size) {
            this.ball.x = this.scene.size / 2 - this.ball.size - 1;
            this.ball.velocity.x *= -1;
        }
        // Game over
        if (this.ball.y <= -this.scene.size / 2 + this.ball.size) {
            // Sets score
            if (this.scoreboard.score > this.scoreboard.bestScore) {
                this.scoreboard.bestScore = this.scoreboard.score;
                localStorage.setItem(
                    "bestScore",
                    this.scoreboard.bestScore.toString()
                );
            }
            // Sets ball position
            this.scoreboard.score = 0;
            this.ball.x =
                (this.scene.size - this.ball.size) * Math.random() -
                (this.scene.size + this.ball.size) / 2;
            this.ball.y = 0;
            this.ball.velocity.x = 0;
            this.ball.velocity.y = 0.5;
        }
    }

    /**
     * Renders game scene
     * @returns {void}
     * @private
     */
    render() {
        // Clears canvas
        this.ctx.fillStyle = this.scene.objectsColor;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // Draws board
        this.ctx.fillStyle = this.scene.backgroundColor;
        this.ctx.fillRect(
            this.ctx.canvas.width / 2 - this.scene.size / 2,
            this.ctx.canvas.height / 2 - this.scene.size / 2,
            this.scene.size,
            this.scene.size
        );
        // Objects
        // Player
        this.ctx.fillStyle = this.scene.objectsColor;
        this.ctx.beginPath();
        this.ctx.arc(
            this.ctx.canvas.width / 2 + this.player.x,
            this.ctx.canvas.height / 2 + this.scene.size / 2 - this.player.size,
            this.player.size,
            0,
            2 * Math.PI
        );
        // Ball
        this.ctx.arc(
            this.ctx.canvas.width / 2 + this.ball.x,
            this.ctx.canvas.height / 2 - this.ball.y,
            this.ball.size,
            0,
            2 * Math.PI
        );
        this.ctx.closePath();
        this.ctx.fill();
        // Score
        this.ctx.font = '24px "Courier New"';
        this.ctx.fillText(
            this.scoreboard.bestScore.toString().padStart(3, "0"),
            this.ctx.canvas.width / 2 - 24,
            this.ctx.canvas.height / 2 - this.scene.size / 3
        );
        this.ctx.font = '32px "Courier New"';

        this.ctx.fillText(
            this.scoreboard.score.toString().padStart(3, "0"),
            this.ctx.canvas.width / 2 - 32,
            this.ctx.canvas.height / 2 - this.scene.size / 5
        );
    }

    /**
     * Starts game
     * @returns {Promise<void>}
     * @public
     */
    async run() {
        const treshold = 60 / 1000;
        let prevTime = 0;
        let deltaTime = 0;
        /**
         * Game loop callback function
         * @param {number} currTime - Current time
         * @returns {void}
         */
        const loop = (currTime) => {
            deltaTime = currTime - prevTime;
            if (deltaTime < treshold) {
                requestAnimationFrame(loop.bind(this));
                return;
            }
            prevTime = currTime;
            this.update(deltaTime);
            this.render();
            requestAnimationFrame(loop.bind(this));
        };
        // Starts loop
        requestAnimationFrame(loop.bind(this));
    }
}
