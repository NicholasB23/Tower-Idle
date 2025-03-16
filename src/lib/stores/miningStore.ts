import { PICKAXE_UPGRADES, YIELD_UPGRADES, YieldUpgrade } from '@/types/mine.types';

export interface MiningStore {
    upgradePickaxe: () => void;
    canUpgradePickaxe: () => boolean;
    getNextPickaxeUpgrade: () => { level: number; power: number; cost: number } | null;

    // New functions for yield upgrades
    purchaseYieldUpgrade: (upgradeId: number) => void;
    canPurchaseYieldUpgrade: (upgradeId: number) => boolean;
    getAvailableYieldUpgrades: () => YieldUpgrade[];
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
    },

    purchaseYieldUpgrade: (upgradeId: number) => set((state: any) => {
        // Find the upgrade
        const upgrade = YIELD_UPGRADES.find(u => u.id === upgradeId);

        // Check if it exists and can be purchased
        if (!upgrade || state.points < upgrade.cost || state.miningUpgrades?.purchased.includes(upgradeId)) {
            return state;
        }

        // Calculate new yield multiplier
        const newMultiplier = state.miningUpgrades?.yieldMultiplier
            ? state.miningUpgrades.yieldMultiplier * upgrade.multiplier
            : upgrade.multiplier;

        // Update state
        return {
            points: state.points - upgrade.cost,
            miningUpgrades: {
                ...state.miningUpgrades || { yieldMultiplier: 1, purchased: [] },
                yieldMultiplier: newMultiplier,
                purchased: [...(state.miningUpgrades?.purchased || []), upgradeId]
            }
        };
    }),

    canPurchaseYieldUpgrade: (upgradeId: number) => {
        const state = get();
        const upgrade = YIELD_UPGRADES.find(u => u.id === upgradeId);

        return !!upgrade &&
            state.points >= upgrade.cost &&
            !(state.miningUpgrades?.purchased || []).includes(upgradeId);
    },

    getAvailableYieldUpgrades: () => {
        const state = get();
        const purchasedUpgrades = state.miningUpgrades?.purchased || [];

        // Filter out purchased upgrades and sort by cost
        return YIELD_UPGRADES
            .filter(upgrade => !purchasedUpgrades.includes(upgrade.id))
            .sort((a, b) => a.cost - b.cost);
    }
});
