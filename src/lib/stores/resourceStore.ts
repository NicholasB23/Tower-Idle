// src/lib/stores/resourceStore.ts
import { ResourceType, ProductionType } from '@/types/game.types'

export interface ResourceStore {
    addResource: (resource: ResourceType, amount: number) => void;
    setProductionRate: (resource: ProductionType, rate: number) => void;
    updateResources: () => void;
    hasResources: (resources: Partial<Record<ResourceType, number>>) => boolean;
    spendResources: (resources: Partial<Record<ResourceType, number>>) => boolean;
}

export const createResourceStore = (get: any, set: any): ResourceStore => ({
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
            wood: state.resources.wood + state.production.woodRate / 60, // 60fps means divide by 60 for per-second rate
            stone: state.resources.stone + state.production.stoneRate / 60,
            metal: state.resources.metal + state.production.metalRate / 60,
            carbonFiber: state.resources.carbonFiber + state.production.carbonFiberRate / 60,
            workers: state.resources.workers
        }
    })),

    hasResources: (resources: Partial<Record<ResourceType, number>>) => {
        const state = get();
        return Object.entries(resources).every(
            ([resource, amount]) => state.resources[resource as ResourceType] >= amount!
        );
    },

    spendResources: (resources: Partial<Record<ResourceType, number>>) => {
        const state = get();
        if (!get().hasResources(resources)) return false;

        set((state: any) => {
            const updatedResources = { ...state.resources };
            Object.entries(resources).forEach(([resource, amount]) => {
                updatedResources[resource as ResourceType] -= amount!;
            });
            return { resources: updatedResources };
        });

        return true;
    }
});
