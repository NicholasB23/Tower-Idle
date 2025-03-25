import { createFarmStore } from './farmStore'
import { createTowerStore } from './towerStore'
import { createResourceStore } from './resourceStore'
import { toast } from '@/hooks/use-toast'

export interface GameLoopStore {
    tick: () => void;
    startGameLoop: () => void;
    stopGameLoop: () => void;
    setupAutoSave: () => void;
}

export const createGameLoopStore = (get: any, set: any) => {
    let gameLoopInterval: number;
    let autoSaveInterval: number;

    const setupAutoSave = () => {
        // Clear any existing auto-save interval
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval);
        }

        const { settings } = get();

        // Only set up auto-save if the interval is greater than 0
        if (settings.autoSaveInterval > 0) {
            autoSaveInterval = setInterval(() => {
                get().save();

                // Show toast notification
                toast({
                    title: "Game Saved",
                    description: "Your progress has been saved automatically",
                    variant: "default",
                    duration: 3000,
                    className: "bg-green-600 text-white border-green-700",
                });

                // Update last saved timestamp
                set((state: any) => ({
                    settings: {
                        ...state.settings,
                        lastSaved: Date.now()
                    }
                }));
            }, settings.autoSaveInterval * 1000) as unknown as number;
        }
    };

    return {
        tick: () => {
            const towerStore = createTowerStore(get, set);
            const farmStore = createFarmStore(get, set);
            const resourceStore = createResourceStore(get, set);

            // Update all game systems
            if (get().tower.isBuilding) {
                towerStore.updateBuildProgress();
            }

            farmStore.updateFarmGrowth();
            resourceStore.updateResources();

            // Calculate income
            const floorIncome = towerStore.calculateFloorIncome();

            // Update points
            set((state: any) => ({
                points: state.points + floorIncome / 60 + state.autoClickPower / 60 // Divide by 60 for per-second rate at 60fps
            }));
        },

        startGameLoop: () => {
            if (typeof window === 'undefined') return;

            // Game loop - 60fps
            gameLoopInterval = setInterval(() => {
                get().tick();
            }, 1000 / 60) as unknown as number;

            // Set up auto-save based on current settings
            setupAutoSave();
        },

        stopGameLoop: () => {
            clearInterval(gameLoopInterval);
            clearInterval(autoSaveInterval);
        },

        setupAutoSave
    };
};
