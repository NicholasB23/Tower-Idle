import { CropType, CROP_DETAILS } from '@/types/farm.types'

export interface FarmStore {
    unlockFarmTile: (tileId: number) => void;
    plantCrop: (tileId: number, crop: CropType) => void;
    harvestCrop: (tileId: number) => void;
    setPlantingMode: (isPlanting: boolean, selectedCrop?: CropType | null) => void;
    updateFarmGrowth: () => void;
}

export const createFarmStore = (_get: any, set: any): FarmStore => ({
    unlockFarmTile: (tileId: number) => set((state: any) => {
        const tile = state.farm.tiles.find((t: any) => t.id === tileId);
        if (!tile || tile.unlocked || state.points < tile.cost) return state;

        return {
            points: state.points - tile.cost,
            farm: {
                ...state.farm,
                tiles: state.farm.tiles.map((t: any) =>
                    t.id === tileId ? { ...tile, unlocked: true } : t
                )
            }
        };
    }),

    plantCrop: (tileId: number, crop: CropType) => set((state: any) => ({
        points: state.points - CROP_DETAILS[crop].cost,
        farm: {
            ...state.farm,
            tiles: state.farm.tiles.map((tile: any) =>
                tile.id === tileId ? {
                    ...tile,
                    crop,
                    growthProgress: 0,
                    lastHarvested: Date.now()
                } : tile
            ),
            isPlanting: false,
            selectedCrop: null
        }
    })),

    harvestCrop: (tileId: number) => set((state: any) => {
        const tile = state.farm.tiles.find((t: any) => t.id === tileId) as { crop: CropType; };
        if (!tile?.crop) return state;

        const cropName = tile.crop.toLowerCase();

        return {
            farm: {
                ...state.farm,
                inventory: {
                    ...state.farm.inventory,
                    [cropName]: state.farm.inventory[cropName] + 1
                },
                tiles: state.farm.tiles.map((t: any) =>
                    t.id === tileId ? { ...t, crop: undefined, growthProgress: undefined } : t
                )
            }
        };
    }),

    setPlantingMode: (isPlanting: boolean, selectedCrop = null) => set((state: any) => ({
        farm: {
            ...state.farm,
            isPlanting,
            selectedCrop
        }
    })),

    updateFarmGrowth: () => set((state: any) => ({
        farm: {
            ...state.farm,
            tiles: state.farm.tiles.map((tile: any) => {
                if (!tile.crop || !tile.lastHarvested) return tile;

                const cropDetails = CROP_DETAILS[tile.crop as CropType];
                const timePassed = Date.now() - tile.lastHarvested;
                const progress = Math.min(1, timePassed / cropDetails.growthTime);

                return {
                    ...tile,
                    growthProgress: progress
                };
            })
        }
    }))
});
