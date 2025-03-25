// src/lib/stores/towerStore.ts
import { FloorType, Floor, TowerAge, calculateResourceCost, getAgeForHeight, ResourceCost } from '@/types/tower.types'

export interface TowerStore {
    addFloor: (type: FloorType) => void;
    upgradeFloor: (floorId: number, upgradeId: number) => void;
    calculateFloorIncome: () => number;
    getCurrentTowerCost: () => ResourceCost;
    startBuildingTower: () => void;
    updateBuildProgress: () => void;
    canBuildTower: () => boolean;
}

// Helper function to determine base income for different floor types
function getBaseIncomeForType(type: FloorType): number {
    switch (type) {
        case FloorType.RESIDENTIAL:
            return 5
        case FloorType.COMMERCIAL:
            return 10
        case FloorType.SPECIAL:
            return 25
        default:
            return 1
    }
}

export const createTowerStore = (get: any, set: any): TowerStore => ({
    addFloor: (type: FloorType) => set((state: any) => {
        const newFloor: Floor = {
            id: state.tower.floors.length,
            level: 1,
            type,
            income: getBaseIncomeForType(type),
            upgrades: []
        }

        return {
            tower: {
                ...state.tower,
                floors: [...state.tower.floors, newFloor]
            }
        }
    }),

    upgradeFloor: (floorId: number, upgradeId: number) => set((state: any) => ({
        tower: {
            ...state.tower,
            floors: state.tower.floors.map((floor: Floor) => {
                if (floor.id !== floorId) return floor;
                return {
                    ...floor,
                    upgrades: floor.upgrades.map(upgrade =>
                        upgrade.id !== upgradeId ? upgrade : { ...upgrade, applied: true }
                    )
                }
            })
        }
    })),

    calculateFloorIncome: () => {
        const state = get();
        return state.tower.floors.reduce((total: number, floor: Floor) => {
            const baseIncome = floor.income;
            const upgradeMultiplier = floor.upgrades
                .filter((u: any) => u.applied)
                .reduce((mult: number, u: any) => mult * u.multiplier, 1);
            return total + (baseIncome * upgradeMultiplier);
        }, 0);
    },

    getCurrentTowerCost: () => {
        const state = get();
        const { height } = state.tower;

        // Use the helper function from tower.types.ts
        return calculateResourceCost(height);
    },

    canBuildTower: () => {
        const state = get();
        const { resources } = state;
        const cost = calculateResourceCost(state.tower.height);
        // Check if player has enough resources
        return (
            resources.stone >= cost.stone
            && resources.metal >= cost.metal
            && resources.carbonFiber >= cost.carbonFiber
        )
    },

    startBuildingTower: () => set((state: any) => {
        if (!get().canBuildTower()) return state;

        const cost = calculateResourceCost(state.tower.height);

        // Deduct resources
        return {
            resources: {
                ...state.resources,
                stone: state.resources.stone - cost.stone,
                metal: state.resources.metal - cost.metal,
                carbonFiber: state.resources.carbonFiber - cost.carbonFiber
            },
            tower: {
                ...state.tower,
                isBuilding: true,
                buildProgress: 0,
                buildCost: cost
            }
        };
    }),

    updateBuildProgress: () => set((state: any) => {
        if (!state.tower.isBuilding) return state;

        // Update progress by 1 percent per tick
        const newProgress = state.tower.buildProgress + 1;

        // If building is complete
        if (newProgress >= 100) {
            // Increase height by 1 unit and check age transition
            const newHeight = state.tower.height + 1;
            const currentAge = getAgeForHeight(newHeight);

            // Calculate new costs for next build
            const buildCost = calculateResourceCost(newHeight);

            return {
                tower: {
                    ...state.tower,
                    height: newHeight,
                    currentAge,
                    isBuilding: false,
                    buildProgress: 0,
                    buildCost
                }
            };
        }

        // Just update progress
        return {
            tower: {
                ...state.tower,
                buildProgress: newProgress
            }
        };
    })
});
