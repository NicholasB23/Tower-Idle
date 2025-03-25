import { GameState } from "@/types/game.types";
import { TowerState } from "@/types/tower.types";

const SAVE_KEY = 'tower-game-save';

interface SaveState extends GameState {
    tower: TowerState;
    resources: {
        wood: number;
        stone: number;
        metal: number;
        workers: number;
    };
    production: {
        woodRate: number;
        stoneRate: number;
        metalRate: number;
    };
    lastSavedAt?: number;
}

export const saveManager = {
    saveToLocal: (gameState: SaveState) => {
        try {
            const saveData = JSON.stringify({
                ...gameState,
                lastSavedAt: Date.now() // Add the current timestamp
            });
            localStorage.setItem(SAVE_KEY, saveData);
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    },

    getLastSaveTime: (): Date | null => {
        try {
            const saveData = localStorage.getItem(SAVE_KEY);
            if (!saveData) return null;

            const parsedData = JSON.parse(saveData) as SaveState;
            return parsedData.lastSavedAt ? new Date(parsedData.lastSavedAt) : null;
        } catch (error) {
            console.error('Failed to get last save time:', error);
            return null;
        }
    },

    loadFromLocal: (): SaveState | null => {
        try {
            const saveData = localStorage.getItem(SAVE_KEY);
            if (!saveData) return null;
            return JSON.parse(saveData) as SaveState;
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    },

    exportSave: (gameState: SaveState) => {
        try {
            const saveData = JSON.stringify(gameState, null, 2);
            const blob = new Blob([saveData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tower-game-save-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.error('Failed to export save:', error);
            return false;
        }
    },

    importSave: async (file: File): Promise<SaveState | null> => {
        try {
            const text = await file.text();
            const gameState = JSON.parse(text) as SaveState;
            console.log(gameState)

            if (!saveManager.validateSave(gameState)) {
                throw new Error('Invalid save file format');
            }

            return gameState;
        } catch (error) {
            console.error('Failed to import save:', error);
            return null;
        }
    },

    validateSave: (data: any): data is SaveState => {
        if (!data || typeof data !== 'object') return false;

        // Check for required properties
        const requiredProps = ['points', 'clickPower', 'autoClickPower', 'tower', 'resources', 'production'];
        if (!requiredProps.every(prop => prop in data)) return false;

        // Validate tower structure
        if (!data.tower || typeof data.tower !== 'object') return false;
        if (!('height' in data.tower && 'floors' in data.tower && 'maxFloors' in data.tower)) return false;

        // Validate resources
        if (!data.resources || typeof data.resources !== 'object') return false;
        const resourceProps = ['wood', 'stone', 'metal', 'workers'];
        if (!resourceProps.every(prop => typeof data.resources[prop] === 'number')) return false;

        // Validate production rates
        if (!data.production || typeof data.production !== 'object') return false;
        const productionProps = ['woodRate', 'stoneRate', 'metalRate'];
        if (!productionProps.every(prop => typeof data.production[prop] === 'number')) return false;

        return true;
    }
};
