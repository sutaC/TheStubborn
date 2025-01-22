// @ts-check

export default class Game {
    /**
     * @type {CanvasRenderingContext2D}
     * @readonly
     * @private
     */
    ctx;

    /**
     * @param {HTMLCanvasElement} canvas - Game canvas element
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
        // Clears
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // Draws
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Hello World!", 16, 16);
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
