import Phaser from "phaser";

export const gameConfig = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    backgroundColor: '#87ceeb',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x: 0 },
            debug: false
        }
    },
    scene: null // We'll add our scene later
};
