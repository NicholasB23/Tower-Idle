

export type CropType = 'Wheat' | 'Corn' | 'Potato' | 'Carrot';

export interface CropInventory {
    max_crops: number;
    wheat: number;
    corn: number;
    potato: number;
    carrot: number;
}

export interface FarmTile {
    id: number;
    unlocked: boolean;
    crop?: CropType;
    cost: number;
    lastHarvested?: number;
    growthProgress?: number;
}

export interface FarmState {
    tiles: FarmTile[];
    maxTiles: number;
    selectedCrop: CropType | null;
    isPlanting: boolean;
    inventory: CropInventory
}

export const CROP_DETAILS: Record<CropType, {
    growthTime: number; // in milliseconds
    cost: number;
}> = {
    Wheat: { growthTime: 30000, cost: 0 },
    Corn: { growthTime: 60000, cost: 10 },
    Potato: { growthTime: 120000, cost: 20 },
    Carrot: { growthTime: 180000, cost: 35 }
};
