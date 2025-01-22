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
        this.ctx.beginPath();
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Hello World!", 16, 16);
        this.ctx.closePath();
    }

    /**
     * Starts game
     * @returns {void}
     * @public
     */
    run() {
        this.update(0);
        this.render();
    }
}
