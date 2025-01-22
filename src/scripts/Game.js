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
     * @property {number} size Player size
     * @property {number} speed Player speed
     */
    /**
     * @type {Player}
     * @readonly
     * @private
     */
    player = {
        x: 0,
        size: 20,
        speed: 1,
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
        velocity: { x: 0, y: 0 },
    };

    /**
     * @param {HTMLCanvasElement} canvas Game canvas element
     */
    constructor(canvas) {
        this.inputHandler = new InputHandler();
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
    }

    /**
     * Updates game state
     * @param {number} deltaTime - Delta time in ms
     * @returns {void}
     * @private
     */
    update(deltaTime) {
        // Player
        if (this.inputHandler.isHeld("ArrowRight")) {
            this.player.x += (this.player.speed / 10) * deltaTime;
            if (this.player.x >= this.scene.size / 2 - this.player.size) {
                this.player.x = this.scene.size / 2 - this.player.size - 1;
            }
        }
        if (this.inputHandler.isHeld("ArrowLeft")) {
            this.player.x -= (this.player.speed / 10) * deltaTime;
            if (this.player.x <= -this.scene.size / 2 + this.player.size) {
                this.player.x = -this.scene.size / 2 + this.player.size + 1;
            }
        }
        // Ball
        this.ball.velocity.y -= 0.01;
        this.ball.x += this.ball.velocity.x;
        this.ball.y += this.ball.velocity.y;
        if (
            this.ball.x <= -this.scene.size / 2 + this.ball.size ||
            this.ball.x >= this.scene.size / 2 - this.ball.size
        ) {
            this.ball.velocity.x *= -1;
        }
        if (this.ball.y <= -this.scene.size / 2 + this.ball.size) {
            // TODO:
            // score = 0
            // bestScore ?< = score
            this.ball.y = 0;
            this.ball.velocity.x = 0;
            this.ball.velocity.y = 0;
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
