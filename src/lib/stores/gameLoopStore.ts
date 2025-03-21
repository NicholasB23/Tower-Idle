import { createFarmStore } from './farmStore'
import { createTowerStore } from './towerStore'
import { createResourceStore } from './resourceStore'

export interface GameLoopStore {
    tick: () => void;
    startGameLoop: () => void;
    stopGameLoop: () => void;
}

export const createGameLoopStore = (get: any, set: any) => {
    let gameLoopInterval: number;
    let autoSaveInterval: number;

    return {
        tick: () => {
            const towerStore = createTowerStore(get, set);
            const farmStore = createFarmStore(get, set);
            const resourceStore = createResourceStore(get, set);

            // Update all game systems
            towerStore.updateTowerHeight();
            farmStore.updateFarmGrowth();
            resourceStore.updateResources();

            // Calculate income
            const floorIncome = towerStore.calculateFloorIncome();

            // Update points
            set((state: any) => ({
                points: state.points + floorIncome + state.autoClickPower
            }));
        },

        startGameLoop: () => {
            if (typeof window === 'undefined') return;

            // Game loop - 60fps
            gameLoopInterval = setInterval(() => {
                get().tick();
            }, 1000 / 60) as unknown as number;

            // Auto-save every minute
            autoSaveInterval = setInterval(() => {
                get().save();
            }, 60000) as unknown as number;
        },

        stopGameLoop: () => {
            clearInterval(gameLoopInterval);
            clearInterval(autoSaveInterval);
        }
    };
};
