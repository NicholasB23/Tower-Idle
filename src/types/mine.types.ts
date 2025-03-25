// src/types/mine.types.ts
export interface PickaxeState {
    level: number;
    power: number;
    cost: number;
}

export type ResourceYield = {
    type: 'stone' | 'metal' | 'wood' | 'carbonFiber';
    amount: number;
}

export enum RockType {
    NORMAL = 'normal',
    HARD = 'hard',
    GRANITE = 'granite',
    CRYSTAL = 'crystal',
    GEODE = 'geode',
    METEORITE = 'meteorite',
    CARBON = 'carbon'
}

export interface RockTypeConfig {
    type: RockType;
    name: string;
    health: number;
    color: string;
    fillColor: string;
    resources: ResourceYield[];
    minTowerHeight: number; // Height at which this rock type starts appearing
}

export interface YieldUpgrade {
    id: number;
    name: string;
    description: string;
    cost: number;
    multiplier: number;
}

export interface MiningState {
    pickaxe: PickaxeState;
    yieldMultiplier: number;
    upgrades: {
        yield: YieldUpgrade[];
        purchased: number[];
    };
}

export const YIELD_UPGRADES: YieldUpgrade[] = [
    {
        id: 1,
        name: "Basic Extraction",
        description: "Improves resource extraction techniques",
        cost: 150,
        multiplier: 1.25
    },
    {
        id: 2,
        name: "Efficient Mining",
        description: "More efficient resource collection",
        cost: 500,
        multiplier: 1.5
    },
    {
        id: 3,
        name: "Advanced Techniques",
        description: "Advanced mining techniques for better yields",
        cost: 1500,
        multiplier: 1.75
    },
    {
        id: 4,
        name: "Resource Maximizer",
        description: "Maximize resource extraction from every rock",
        cost: 5000,
        multiplier: 2.0
    },
    {
        id: 5,
        name: "Crystal Resonance",
        description: "Enhance crystal value through resonance techniques",
        cost: 15000,
        multiplier: 2.5
    }
];


export const ROCK_TYPES: Record<RockType, RockTypeConfig> = {
    [RockType.NORMAL]: {
        type: RockType.NORMAL,
        name: 'Stone',
        health: 5,
        color: 'black',
        fillColor: 'gray',
        resources: [
            { type: 'stone', amount: 2 }
        ],
        minTowerHeight: 0
    },
    [RockType.HARD]: {
        type: RockType.HARD,
        name: 'Hard Rock',
        health: 10,
        color: 'black',
        fillColor: '#555555',
        resources: [
            { type: 'stone', amount: 4 }
        ],
        minTowerHeight: 0
    },
    [RockType.GRANITE]: {
        type: RockType.GRANITE,
        name: 'Granite',
        health: 15,
        color: 'black',
        fillColor: '#7E6D5A',
        resources: [
            { type: 'stone', amount: 6 },
            { type: 'metal', amount: 1 }
        ],
        minTowerHeight: 500
    },
    [RockType.CRYSTAL]: {
        type: RockType.CRYSTAL,
        name: 'Crystal',
        health: 2,
        color: '#4A6F8A',
        fillColor: '#8ACDEB',
        resources: [
            { type: 'stone', amount: 4 },
            { type: 'metal', amount: 2 }
        ],
        minTowerHeight: 0
    },
    [RockType.GEODE]: {
        type: RockType.GEODE,
        name: 'Geode',
        health: 12,
        color: '#333333',
        fillColor: '#6B4F7E',
        resources: [
            { type: 'stone', amount: 3 },
            { type: 'metal', amount: 3 }
        ],
        minTowerHeight: 1000
    },
    [RockType.METEORITE]: {
        type: RockType.METEORITE,
        name: 'Meteorite',
        health: 25,
        color: 'black',
        fillColor: '#2C2C54',
        resources: [
            { type: 'stone', amount: 8 },
            { type: 'metal', amount: 5 }
        ],
        minTowerHeight: 5000
    },
    [RockType.CARBON]: {
        type: RockType.CARBON,
        name: 'Carbon Deposit',
        health: 20,
        color: '#111111',
        fillColor: '#0D0D0D',
        resources: [
            { type: 'stone', amount: 4 },
            { type: 'carbonFiber', amount: 2 }
        ],
        minTowerHeight: 10000
    }
};

export interface RockState {
    level: number;
    resource: string;
}

export const PICKAXE_UPGRADES: PickaxeState[] = [
    { level: 1, power: 1, cost: 0 },
    { level: 2, power: 2, cost: 100 },
    { level: 3, power: 3, cost: 250 },
    { level: 4, power: 5, cost: 500 },
    { level: 5, power: 8, cost: 1000 },
    { level: 6, power: 12, cost: 2000 },
    { level: 7, power: 18, cost: 4000 },
    { level: 8, power: 25, cost: 8000 },
    { level: 9, power: 35, cost: 15000 },
    { level: 10, power: 50, cost: 25000 },
];
