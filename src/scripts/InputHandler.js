// @ts-check

export default class InputHandler {
    /**
     * @type {Set<string>} Currently held keys
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
     * Returns true if given key is currently held
     * @param {string} key Keyboard key
     * @returns {boolean} Is given key is currently held
     * @public
     */
    isHeld(key) {
        return this.held.has(key);
    }
}
