import { FarmState } from "./farm.types";
import { TowerState } from "./tower.types";
import { PickaxeState } from "./mine.types";

export interface GameState {
    points: number;
    clickPower: number;
    autoClickPower: number;
    multipliers: Multiplier[];
    tower: TowerState;
    resources: ResourceState;
    production: ProductionState;
    farm: FarmState;
    pickaxe: PickaxeState;
    miningUpgrades: {
        yieldMultiplier: number;
        purchased: number[];
    };
}

export interface Multiplier {
    id: number;
    name: string;
    cost: number;
    power: number;
    owned: number;
}

export interface ResourceState {
    wood: number;
    stone: number;
    metal: number;
    workers: number;
}

export interface ProductionState {
    woodRate: number;
    stoneRate: number;
    metalRate: number;
}

export type ResourceType = keyof ResourceState;
export type ProductionType = keyof ProductionState;
