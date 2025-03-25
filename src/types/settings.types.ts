export interface GameSettings {
    autoSaveInterval: number; // in seconds
    lastSaved?: number; // timestamp
    masterLevel: number;
    musicLevel: number;
    sfxLevel: number;
    soundEnabled: boolean;
    notificationsEnabled: boolean;
}

export interface INTERVERALS {
    label: string;
    value: number;
}

export const AUTO_SAVE_INTERVALS: INTERVERALS[] = [
    { label: 'Every 30 seconds', value: 30 },
    { label: 'Every minute', value: 60 },
    { label: 'Every 5 minutes', value: 300 },
    { label: 'Every 15 minutes', value: 900 },
    { label: 'Every 30 minutes', value: 1800 },
    { label: 'Disabled', value: 0 }
];
