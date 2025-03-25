import { GameSettings, AUTO_SAVE_INTERVALS } from '@/types/settings.types';

export interface SettingsStore {
    updateSetting: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void;
    toggleSound: () => void;
    toggleNotifications: () => void;
    setAutoSaveInterval: (interval: number) => void;
    setMasterVolume: (level: number) => void;
    setMusicVolume: (level: number) => void;
    setSfxVolume: (level: number) => void;
    getSettings: () => GameSettings;
    getAutoSaveIntervals: () => typeof AUTO_SAVE_INTERVALS;
    resetSettings: () => void;
}

const DEFAULT_SETTINGS: GameSettings = {
    autoSaveInterval: 60, // Default: every minute
    masterLevel: 100,
    musicLevel: 50,
    sfxLevel: 50,
    soundEnabled: true,
    notificationsEnabled: true
};

export const createSettingsStore = (get: any, set: any): SettingsStore => ({
    updateSetting: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => set((state: any) => ({
        settings: {
            ...state.settings,
            [key]: value
        }
    })),

    toggleSound: () => set((state: any) => ({
        settings: {
            ...state.settings,
            soundEnabled: !state.settings.soundEnabled
        }
    })),

    toggleNotifications: () => set((state: any) => ({
        settings: {
            ...state.settings,
            notificationsEnabled: !state.settings.notificationsEnabled
        }
    })),

    setAutoSaveInterval: (interval: number) => set((state: any) => ({
        settings: {
            ...state.settings,
            autoSaveInterval: interval
        }
    })),

    setMasterVolume: (level: number) => set((state: any) => ({
        settings: {
            ...state.settings,
            masterLevel: Math.max(0, Math.min(100, level))
        }
    })),

    setMusicVolume: (level: number) => set((state: any) => ({
        settings: {
            ...state.settings,
            musicLevel: Math.max(0, Math.min(100, level))
        }
    })),

    setSfxVolume: (level: number) => set((state: any) => ({
        settings: {
            ...state.settings,
            sfxLevel: Math.max(0, Math.min(100, level))
        }
    })),

    getSettings: () => get().settings,

    getAutoSaveIntervals: () => AUTO_SAVE_INTERVALS,

    resetSettings: () => set((state: any) => ({
        settings: DEFAULT_SETTINGS
    }))
});
