import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SaveManager from '../SaveManager';
import { GameState } from '@/types/game.types';

interface SettingsTabProps {
    gameState: GameState;
    onLoadSave: (save: GameState) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ gameState, onLoadSave }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <div className="space-y-4">
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold mb-4">Save Management</h3>
                        <SaveManager gameState={gameState} onLoadSave={onLoadSave} />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold mb-4">Game Settings</h3>
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full">
                                Reset Progress
                            </Button>
                            <Button variant="outline" className="w-full">
                                Toggle Sound
                            </Button>
                            <Button variant="outline" className="w-full">
                                Toggle Notifications
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SettingsTab;
