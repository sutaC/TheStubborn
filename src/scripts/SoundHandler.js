// @ts-check

export default class SoundHandler {
    /**
     * @type {Map<string, {sound: HTMLAudioElement, counter: number}>}
     * @readonly
     * @private
     */
    sounds = new Map();

    /**
     * Limit of simultaneous single sound plays (>=0)
     * @type {number}
     * @public
     */
    soundsLimit = 3;

    /**
     * Adds sound to handler
     * @param {string} src src to fetch sound
     * @param {string} name sounds name
     * @returns {void}
     * @public
     */
    addSound(src, name) {
        let sound;
        try {
            sound = new Audio(src);
        } catch (error) {
            console.error(`Could not load sound '${name}'\n`, error);
            return;
        }
        sound.autoplay = true;
        this.sounds.set(name, { sound, counter: 0 });
    }

    /**
     * Deletes sound from handler
     * @param {string} name sounds name
     * @returns {void}
     * @public
     */
    deleteSound(name) {
        this.sounds.delete(name);
    }

    /**
     * Deletes all songs from handler
     * @returns {void}
     * @public
     */
    clearSounds() {
        this.sounds.clear();
    }

    /**
     * Plays song
     * @param {string} name songs name
     * @returns {void}
     * @public
     */
    playSound(name) {
        const soundObj = this.sounds.get(name);
        if (soundObj === undefined) {
            console.error(`Tried to play sound '${name}' and it was not found`);
            return;
        }
        if (soundObj.counter >= this.soundsLimit) {
            return;
        }
        const cpSound = /** @type {HTMLAudioElement} */ (
            soundObj.sound.cloneNode()
        );
        soundObj.counter++;
        cpSound.addEventListener(
            "ended",
            (event) => {
                soundObj.counter--;
            },
            { once: true, passive: true }
        );
        cpSound.play().catch((error) => {
            console.error(`Failed to play sound '${name}'.\n`, error);
        });
    }
}
