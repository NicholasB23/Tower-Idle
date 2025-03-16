export interface PickaxeState {
    level: number;
    power: number;
    cost: number;
}

export type ResourceYield = {
    type: 'stone' | 'metal' | 'wood'; // Adding wood for potential future expansion
    min: number;
    max: number;
}

export enum RockType {
    NORMAL = 'normal',
    HARD = 'hard',
    GRANITE = 'granite',
    CRYSTAL = 'crystal',
    GEODE = 'geode',
    METEORITE = 'meteorite'
}

export interface RockTypeConfig {
    type: RockType;
    name: string;
    health: number;
    color: string;
    fillColor: string;
    resources: ResourceYield[];
}

export const ROCK_TYPES: Record<RockType, RockTypeConfig> = {
    [RockType.NORMAL]: {
        type: RockType.NORMAL,
        name: 'Stone',
        health: 5,
        color: 'black',
        fillColor: 'gray',
        resources: [
            { type: 'stone', min: 1, max: 3 }
        ]
    },
    [RockType.HARD]: {
        type: RockType.HARD,
        name: 'Hard Rock',
        health: 10,
        color: 'black',
        fillColor: '#555555',
        resources: [
            { type: 'stone', min: 3, max: 5 }
        ]
    },
    [RockType.GRANITE]: {
        type: RockType.GRANITE,
        name: 'Granite',
        health: 15,
        color: 'black',
        fillColor: '#7E6D5A',
        resources: [
            { type: 'stone', min: 4, max: 8 },
            { type: 'metal', min: 0, max: 1 }
        ]
    },
    [RockType.CRYSTAL]: {
        type: RockType.CRYSTAL,
        name: 'Crystal',
        health: 2,
        color: '#4A6F8A',
        fillColor: '#8ACDEB',
        resources: [
            { type: 'stone', min: 3, max: 6 },
            { type: 'metal', min: 1, max: 2 }
        ]
    },
    [RockType.GEODE]: {
        type: RockType.GEODE,
        name: 'Geode',
        health: 12,
        color: '#333333',
        fillColor: '#6B4F7E',
        resources: [
            { type: 'stone', min: 2, max: 4 },
            { type: 'metal', min: 2, max: 4 }
        ]
    },
    [RockType.METEORITE]: {
        type: RockType.METEORITE,
        name: 'Meteorite',
        health: 25,
        color: 'black',
        fillColor: '#2C2C54',
        resources: [
            { type: 'stone', min: 5, max: 10 },
            { type: 'metal', min: 3, max: 8 }
        ]
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
