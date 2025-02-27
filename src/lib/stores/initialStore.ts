import { GameState, ProductionState, ResourceState } from '@/types/game.types'
import { FarmState } from '@/types/farm.types'
import { TowerState } from '@/types/tower.types';


const INITIAL_TOWER_STATE: TowerState = {
    height: 600,
    maxHeight: 1000,
    heightPerMinute: 10,
    floors: [],
    maxFloors: 100
}

const INITIAL_RESOURCE_STATE: ResourceState = {
    wood: 0,
    stone: 0,
    metal: 0,
    workers: 0
}

const INITIAL_PRODUCTION_STATE: ProductionState = {
    woodRate: 0,
    stoneRate: 0,
    metalRate: 0
}

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


export const INITIAL_STATE: GameState = {
    points: 0,
    clickPower: 1,
    autoClickPower: 0,
    multipliers: [],
    tower: INITIAL_TOWER_STATE,
    resources: INITIAL_RESOURCE_STATE,
    production: INITIAL_PRODUCTION_STATE,
    farm: INITIAL_FARM_STATE
};
