// src/lib/store.ts
import { create } from 'zustand'
import { createFarmStore, FarmStore } from './stores/farmStore'
import { createTowerStore, TowerStore } from './stores/towerStore'
import { createResourceStore, ResourceStore } from './stores/resourceStore'
import { createGameLoopStore, GameLoopStore } from './stores/gameLoopStore'
import { createMiningStore, MiningStore } from './stores/miningStore'
import { saveManager } from './saveManager'
import { INITIAL_STATE } from './stores/initialStore'
import { GameState } from '@/types/game.types'


export interface SaveActions {
    save: () => void;
    load: () => void;
    loadFromFile: (saveFile: GameState) => void;
}

export interface BasicActions {
    addPoints: (amount: number) => void;
    spendPoints: (amount: number) => void;
}

export type GameStore = GameState &
    FarmStore &
    TowerStore &
    ResourceStore &
    GameLoopStore &
    MiningStore &
    SaveActions &
    BasicActions;

export const useGameStore = create<GameStore>((set, get) => ({
    ...INITIAL_STATE,
    ...createFarmStore(get, set),
    ...createTowerStore(get, set),
    ...createResourceStore(get, set),
    ...createGameLoopStore(get, set),
    ...createMiningStore(get, set),

    // Save management remains in the main store
    save: () => {
        const state = get();
        saveManager.saveToLocal(state);
    },

    // Load the local browser storage save
    load: () => {
        const savedState = saveManager.loadFromLocal();
        if (savedState) {
            set(savedState);
        }
    },

    // Load save file from upload
    loadFromFile: (saveFile: any) => {
        if (saveFile) {
            set(saveFile);
        }
    },

    // Basic actions that don't fit in other stores
    addPoints: (amount: number) => set((state: any) => ({
        points: state.points + amount
    })),

    spendPoints: (amount: number) => set((state: any) => ({
        points: state.points - amount
    }))
}));

// Start the game loop when the store is created
useGameStore.getState().startGameLoop();
