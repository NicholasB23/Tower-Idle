import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Volume2, Bell, Save, Trash2, Music } from 'lucide-react';
import SaveManager from '../SaveManager';
import { GameState } from '@/types/game.types';
import { useGameStore } from '@/lib/store';

interface SettingsTabProps {
    gameState: GameState;
    onLoadSave: (save: GameState) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ gameState, onLoadSave }) => {
    const {
        settings,
        updateSetting,
        toggleSound,
        toggleNotifications,
        setAutoSaveInterval,
        setMasterVolume,
        setMusicVolume,
        setSfxVolume,
        getAutoSaveIntervals,
        startNewGame
    } = useGameStore();

    const autoSaveIntervals = getAutoSaveIntervals();

    const [resetDialogOpen, setResetDialogOpen] = React.useState(false);

    const handleResetGame = () => {
        startNewGame();
        setResetDialogOpen(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <div className="space-y-6">
                <div className='xl:flex gap-4'>
                    <Card className='xl:w-1/2'>
                        <CardHeader>
                            <CardTitle>Save Management</CardTitle>
                            <CardDescription>Manage your game save files</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SaveManager gameState={gameState} onLoadSave={onLoadSave} />

                            <div className="mt-4 space-y-3">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Auto Save Interval</span>
                                        <span className="text-xs text-muted-foreground">
                                            {settings.autoSaveInterval === 0
                                                ? 'Disabled'
                                                : `Every ${settings.autoSaveInterval} seconds`}
                                        </span>
                                    </div>
                                    <Select
                                        value={settings.autoSaveInterval.toString()}
                                        onValueChange={(value) => setAutoSaveInterval(parseInt(value))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select interval" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {autoSaveIntervals.map((interval) => (
                                                <SelectItem key={interval.value} value={interval.value.toString()}>
                                                    {interval.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='xl:w-1/2'>
                        <CardHeader>
                            <CardTitle>Audio Settings</CardTitle>
                            <CardDescription>Adjust sound and music volume</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-2">
                                        <Volume2 className="h-4 w-4" />
                                        <span className="text-sm font-medium">Master Volume</span>
                                    </span>
                                    <span className="text-xs text-muted-foreground">{settings.masterLevel}%</span>
                                </div>
                                <Slider
                                    value={[settings.masterLevel]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(value) => setMasterVolume(value[0])}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-2">
                                        <Music className="h-4 w-4" />
                                        <span className="text-sm font-medium">Music Volume</span>
                                    </span>
                                    <span className="text-xs text-muted-foreground">{settings.musicLevel}%</span>
                                </div>
                                <Slider
                                    value={[settings.musicLevel]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(value) => setMusicVolume(value[0])}
                                    disabled={!settings.soundEnabled}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Sound Effects</span>
                                    <span className="text-xs text-muted-foreground">{settings.sfxLevel}%</span>
                                </div>
                                <Slider
                                    value={[settings.sfxLevel]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(value) => setSfxVolume(value[0])}
                                    disabled={!settings.soundEnabled}
                                />
                            </div>

                            <div className="pt-2">
                                <Button
                                    variant={settings.soundEnabled ? "default" : "outline"}
                                    className="w-full"
                                    onClick={toggleSound}
                                >
                                    {settings.soundEnabled ? "Sound Enabled" : "Sound Disabled"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Game Settings</CardTitle>
                        <CardDescription>General game preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            variant={settings.notificationsEnabled ? "default" : "outline"}
                            className="w-full flex items-center gap-2"
                            onClick={toggleNotifications}
                        >
                            <Bell className="h-4 w-4" />
                            {settings.notificationsEnabled ? "Notifications Enabled" : "Notifications Disabled"}
                        </Button>

                        <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full flex items-center gap-2">
                                    <Trash2 className="h-4 w-4" />
                                    Reset Progress
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Reset Game Progress</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will delete all your progress and start a new game.
                                        This action cannot be undone. Are you sure?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleResetGame}
                                        className="bg-destructive text-destructive-foreground"
                                    >
                                        Reset Game
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>

                {settings.lastSaved && (
                    <div className="text-sm text-muted-foreground text-center">
                        Last saved: {new Date(settings.lastSaved).toLocaleString()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsTab;
