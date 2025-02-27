import { FloorType, Floor } from '@/types/tower.types'

export interface TowerStore {
    addFloor: (type: FloorType) => void;
    upgradeFloor: (floorId: number, upgradeId: number) => void;
    updateTowerHeight: () => void;
    calculateFloorIncome: () => number;
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
                height: state.tower.height + 10,
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

    updateTowerHeight: () => set((state: any) => ({
        tower: {
            ...state.tower,
            height: state.tower.height + state.tower.heightPerMinute / 6000
        }
    })),

    calculateFloorIncome: () => {
        const state = get();
        return state.tower.floors.reduce((total: number, floor: Floor) => {
            const baseIncome = floor.income;
            const upgradeMultiplier = floor.upgrades
                .filter(u => u.applied)
                .reduce((mult, u) => mult * u.multiplier, 1);
            return total + (baseIncome * upgradeMultiplier);
        }, 0);
    }
});
