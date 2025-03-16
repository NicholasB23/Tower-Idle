import { PICKAXE_UPGRADES } from '@/types/mine.types';

export interface MiningStore {
    upgradePickaxe: () => void;
    canUpgradePickaxe: () => boolean;
    getNextPickaxeUpgrade: () => { level: number; power: number; cost: number } | null;
}

export const createMiningStore = (get: any, set: any): MiningStore => ({
    upgradePickaxe: () => set((state: any) => {
        const currentPickaxe = state.pickaxe;
        const nextLevel = currentPickaxe.level + 1;
        const nextPickaxe = PICKAXE_UPGRADES.find(p => p.level === nextLevel);

        if (!nextPickaxe || state.points < nextPickaxe.cost) {
            return state;
        }

        return {
            points: state.points - nextPickaxe.cost,
            pickaxe: nextPickaxe
        };
    }),

    canUpgradePickaxe: () => {
        const state = get();
        const currentPickaxe = state.pickaxe;
        const nextPickaxe = PICKAXE_UPGRADES.find(p => p.level === currentPickaxe.level + 1);

        return !!nextPickaxe && state.points >= nextPickaxe.cost;
    },

    getNextPickaxeUpgrade: () => {
        const state = get();
        const currentPickaxe = state.pickaxe;
        return PICKAXE_UPGRADES.find(p => p.level === currentPickaxe.level + 1) || null;
    }
});
