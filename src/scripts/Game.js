// @ts-check

export default class Game {
    /**
     * @type {CanvasRenderingContext2D}
     * @readonly
     * @private
     */
    ctx;

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
     * @property {number} position Player x position on the scene
     * @property {number} size Player size
     */
    /**
     * @type {Player}
     * @readonly
     * @private
     */
    player = {
        position: 0,
        size: 25,
    };

    /**
     * @param {HTMLCanvasElement} canvas Game canvas element
     */
    constructor(canvas) {
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
        //
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
        this.ctx.fillStyle = this.scene.objectsColor;
        this.ctx.beginPath();
        this.ctx.arc(
            this.ctx.canvas.width / 2 + this.player.position,
            this.ctx.canvas.height / 2 + this.scene.size / 2 - this.player.size,
            this.player.size,
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
        function loop(currTime) {
            deltaTime = currTime - prevTime;
            if (deltaTime < treshold) {
                requestAnimationFrame(loop.bind(this));
                return;
            }
            prevTime = currTime;
            this.update(deltaTime);
            this.render();
            requestAnimationFrame(loop.bind(this));
        }
        // Starts loop
        requestAnimationFrame(loop.bind(this));
    }
}
