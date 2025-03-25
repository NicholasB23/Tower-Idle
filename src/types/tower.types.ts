export interface TowerState {
    height: number;
    maxHeight: number;
    floors: Floor[];
    maxFloors: number;
    currentAge: TowerAge;
    buildCost: ResourceCost;
    buildProgress: number;
    isBuilding: boolean;
}

export interface ResourceCost {
    stone: number;
    metal: number;
    carbonFiber: number;
}

export enum TowerAge {
    STONE = 'STONE',
    METAL = 'METAL',
    CARBON = 'CARBON'
}

export interface Floor {
    id: number;
    level: number;
    type: FloorType;
    income: number;
    upgrades: FloorUpgrade[];
}

export enum FloorType {
    RESIDENTIAL = 'RESIDENTIAL',
    COMMERCIAL = 'COMMERCIAL',
    SPECIAL = 'SPECIAL'
}

export interface FloorUpgrade {
    id: number;
    name: string;
    cost: number;
    multiplier: number;
    applied: boolean;
}

// Age configuration
export const AGE_CONFIG = {
    [TowerAge.STONE]: {
        name: "Stone Age",
        heightRange: [0, 1000],
        primaryResource: "stone" as const,
        baseResourceCost: {
            stone: 10,
            metal: 0,
            carbonFiber: 0
        }
    },
    [TowerAge.METAL]: {
        name: "Steel Age",
        heightRange: [1001, 10000],
        primaryResource: "metal" as const,
        baseResourceCost: {
            stone: 15,
            metal: 5,
            carbonFiber: 0
        }
    },
    [TowerAge.CARBON]: {
        name: "Space Age",
        heightRange: [10001, 100000],
        primaryResource: "carbonFiber" as const,
        baseResourceCost: {
            stone: 20,
            metal: 15,
            carbonFiber: 5
        }
    }
};

// Helper functions
export function getAgeForHeight(height: number): TowerAge {
    if (height <= 1000) return TowerAge.STONE;
    if (height <= 10000) return TowerAge.METAL;
    return TowerAge.CARBON;
}

// Calculate resource cost based on height and age
export function calculateResourceCost(height: number): ResourceCost {
    const age = getAgeForHeight(height);
    const ageConfig = AGE_CONFIG[age];

    // Calculate difficulty multiplier based on height within the age
    // Difficulty resets on age change and increases every 10 height units
    const heightInAge = height - ageConfig.heightRange[0];
    const difficultyMultiplier = 1 + Math.floor(heightInAge / 10) * 0.1;

    return {
        stone: Math.ceil(ageConfig.baseResourceCost.stone * difficultyMultiplier),
        metal: Math.ceil(ageConfig.baseResourceCost.metal * difficultyMultiplier),
        carbonFiber: Math.ceil(ageConfig.baseResourceCost.carbonFiber * difficultyMultiplier)
    };
}
