// @ts-check

export default class InputHandler {
    /**
     * @type {Set<string>} Currently held actions
     * @readonly
     * @private
     */
    held = new Set();

    constructor() {
        window.addEventListener("keydown", this.handleKeyboard.bind(this), {
            passive: true,
        });
        window.addEventListener("keyup", this.handleKeyboard.bind(this), {
            passive: true,
        });
        window.addEventListener("touchstart", this.handleTouch.bind(this), {
            passive: true,
        });
        window.addEventListener("touchend", this.handleTouch.bind(this), {
            passive: true,
        });
    }

    /**
     * Handles keyboard actions
     * @param {KeyboardEvent} event
     * @returns {void}
     * @private
     */
    handleKeyboard(event) {
        switch (event.type) {
            case "keydown":
                this.held.add(event.key);
                break;
            case "keyup":
                this.held.delete(event.key);
                break;
        }
    }

    /**
     * Handles touch actions
     * @param {TouchEvent} event
     * @returns {void}
     * @private
     */
    handleTouch(event) {
        switch (event.type) {
            case "touchstart":
                const touch = event.touches.item(0);
                if (touch === null) return;
                const key =
                    touch.clientX < window.innerWidth / 2
                        ? "ArrowLeft"
                        : "ArrowRight";
                this.held.add(key);
                break;
            case "touchend":
                this.held.delete("ArrowLeft");
                this.held.delete("ArrowRight");
                break;
        }
    }

    /**
     * Returns true if given action is currently active
     * @param {string} key Action key
     * @returns {boolean} Is given action is currently active
     * @public
     */
    isHeld(key) {
        return this.held.has(key);
    }
}
