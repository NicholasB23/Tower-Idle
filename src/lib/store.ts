// src/lib/store.ts
import { create } from 'zustand'
import { createFarmStore, FarmStore } from './stores/farmStore'
import { createTowerStore, TowerStore } from './stores/towerStore'
import { createResourceStore, ResourceStore } from './stores/resourceStore'
import { createGameLoopStore, GameLoopStore } from './stores/gameLoopStore'
import { createMiningStore, MiningStore } from './stores/miningStore'
import { createSettingsStore, SettingsStore } from './stores/settingsStore'
import { saveManager } from './saveManager'
import { INITIAL_STATE } from './stores/initialStore'
import { GameState } from '@/types/game.types'
import { TowerState } from '@/types/tower.types'
import { FarmState } from '@/types/farm.types'

export interface SaveActions {
    save: () => void;
    load: () => void;
    loadFromFile: (saveFile: GameState) => void;
    startNewGame: () => void;
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
    SettingsStore &
    SaveActions &
    BasicActions;

export const useGameStore = create<GameStore>((set, get) => ({
    ...INITIAL_STATE,
    ...createFarmStore(get, set),
    ...createTowerStore(get, set),
    ...createResourceStore(get, set),
    ...createGameLoopStore(get, set),
    ...createMiningStore(get, set),
    ...createSettingsStore(get, set),

    // Save management
    save: () => {
        const state = get();
        saveManager.saveToLocal(state);
    },

    // Load from local browser storage
    load: () => {
        const savedState = saveManager.loadFromLocal();
        if (savedState) {
            set(savedState);
        }
    },

    // Load save file from upload
    loadFromFile: (saveFile: GameState) => {
        if (saveFile) {
            // Stop the existing game loop before loading new state
            get().stopGameLoop();

            // Set the new state
            set(saveFile);

            // Restart game loop with new state
            get().startGameLoop();
        }
    },

    // New method for starting a fresh game
    startNewGame: () => {
        // Stop any existing game loop
        get().stopGameLoop();

        // Reset to initial state, making sure to create deep copies of objects to prevent reference issues
        set({
            // Basic properties
            points: INITIAL_STATE.points,
            clickPower: INITIAL_STATE.clickPower,
            autoClickPower: INITIAL_STATE.autoClickPower,
            multipliers: [...INITIAL_STATE.multipliers],

            // Tower state (deep copy)
            tower: {
                ...INITIAL_STATE.tower,
                floors: [...INITIAL_STATE.tower.floors]
            } as TowerState,

            // Resources (deep copy)
            resources: {
                ...INITIAL_STATE.resources
            },

            // Production rates (deep copy)
            production: {
                ...INITIAL_STATE.production
            },

            // Farm state (deep copy with proper initialization)
            farm: {
                ...INITIAL_STATE.farm,
                tiles: INITIAL_STATE.farm.tiles.map(tile => ({ ...tile })),
                inventory: { ...INITIAL_STATE.farm.inventory }
            } as FarmState,

            // Mining state (deep copy)
            pickaxe: { ...INITIAL_STATE.pickaxe },
            miningUpgrades: {
                yieldMultiplier: INITIAL_STATE.miningUpgrades.yieldMultiplier,
                purchased: [...INITIAL_STATE.miningUpgrades.purchased]
            },

            // Settings (preserve current settings or reset to default if specified)
            settings: { ...INITIAL_STATE.settings }
        });

        // Start a fresh game loop
        get().startGameLoop();

        // Save the initial state to localStorage
        get().save();
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
