import { GameState, ProductionState, ResourceState } from '@/types/game.types'
import { FarmState } from '@/types/farm.types'
import { TowerState, TowerAge, calculateResourceCost } from '@/types/tower.types';
import { PICKAXE_UPGRADES } from '@/types/mine.types';
import { GameSettings } from '@/types/settings.types';

const initialHeight = 990;

const INITIAL_TOWER_STATE: TowerState = {
    height: initialHeight,
    maxHeight: 100000, // Maximum tower height
    floors: [],
    maxFloors: 100,
    currentAge: TowerAge.STONE,
    buildCost: calculateResourceCost(initialHeight),
    buildProgress: 0,
    isBuilding: false
};

const INITIAL_RESOURCE_STATE: ResourceState = {
    wood: 100,
    stone: 100,
    metal: 0,
    carbonFiber: 0,
    workers: 0
};

const INITIAL_PRODUCTION_STATE: ProductionState = {
    woodRate: 0.01,
    stoneRate: 0.01,
    metalRate: 0,
    carbonFiberRate: 0
};

const INITIAL_FARM_STATE: FarmState = {
    tiles: Array(16).fill(null).map((_, index) => ({
        id: index,
        unlocked: index === 0,
        cost: 100 * (index + 1)
    })),
    maxTiles: 16,
    selectedCrop: null,
    isPlanting: false,
    inventory: {
        max_crops: 20,
        wheat: 0,
        corn: 0,
        potato: 0,
        carrot: 0
    }
};

const INITIAL_SETTINGS_STATE: GameSettings = {
    autoSaveInterval: 60, // in seconds
    masterLevel: 100,
    musicLevel: 50,
    sfxLevel: 50,
    soundEnabled: true,
    notificationsEnabled: true
}

export const INITIAL_STATE: GameState = {
    points: 0,
    clickPower: 1,
    autoClickPower: 0,
    multipliers: [],
    tower: INITIAL_TOWER_STATE,
    resources: INITIAL_RESOURCE_STATE,
    production: INITIAL_PRODUCTION_STATE,
    farm: INITIAL_FARM_STATE,
    pickaxe: PICKAXE_UPGRADES[0],
    miningUpgrades: {
        yieldMultiplier: 1,
        purchased: []
    },
    settings: INITIAL_SETTINGS_STATE
};
