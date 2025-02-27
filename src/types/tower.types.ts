export interface TowerState {
    height: number;
    maxHeight: number;
    heightPerMinute: number;
    floors: Floor[];
    maxFloors: number;
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
