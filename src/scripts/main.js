// @ts-check
import Game from "./Game.js";

const canvas = /** @type {HTMLCanvasElement} */ (
    document.getElementById("gameCanvas")
);

const game = new Game(canvas);

game.run();
