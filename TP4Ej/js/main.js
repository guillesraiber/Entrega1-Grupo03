import { GameController } from "./GameController.js";

const game = new GameController();

document.querySelector(".btn-restart").addEventListener("click", () => {
    game.restart();
});