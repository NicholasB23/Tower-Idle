import { ResourceType, ProductionType } from '@/types/game.types'

export interface ResourceStore {
    addResource: (resource: ResourceType, amount: number) => void;
    setProductionRate: (resource: ProductionType, rate: number) => void;
    updateResources: () => void;
}

export const createResourceStore = (_get: any, set: any): ResourceStore => ({
    addResource: (resource: ResourceType, amount: number) => set((state: any) => ({
        resources: {
            ...state.resources,
            [resource]: state.resources[resource] + amount
        }
    })),

    setProductionRate: (resource: ProductionType, rate: number) => set((state: any) => ({
        production: {
            ...state.production,
            [resource]: rate
        }
    })),

    updateResources: () => set((state: any) => ({
        resources: {
            wood: state.resources.wood + state.production.woodRate,
            stone: state.resources.stone + state.production.stoneRate,
            metal: state.resources.metal + state.production.metalRate,
            workers: state.resources.workers
        }
    }))
});
