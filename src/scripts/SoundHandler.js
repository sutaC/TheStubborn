// @ts-check

export default class SoundHandler {
    /**
     * @type {Map<string, HTMLAudioElement>}
     * @readonly
     * @private
     */
    sounds = new Map();

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
        this.sounds.set(name, sound);
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
        const sound = this.sounds.get(name);
        if (sound === undefined) {
            console.error(`Tried to play sound '${name}' and it was not found`);
            return;
        }
        sound.pause();
        sound.currentTime = 0;
        try {
            sound.play();
        } catch (error) {
            console.error(`Failed to play sound '${name}'.\n`, error);
        }
    }
}
