import { GameState } from "./game.types";

export interface GameScene extends Phaser.Scene {
    updateGameState?: (points: number) => void;
    gameState?: GameState;
}
