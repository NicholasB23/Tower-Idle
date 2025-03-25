import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Landmark, Settings } from 'lucide-react';
import WorkersTab from '@/components/tabs/WorkersTab';
import FarmsTab from '@/components/tabs/FarmsTab';
import MinesTab from '@/components/tabs/MinesTab';
import SettingsTab from '@/components/tabs/SettingsTab';
import ResourceBar from '@/components/ResourceBar'; // Import the ResourceBar component
import { useGameStore } from '@/lib/store';
import TowerDisplay from '@/components/TowerDisplay';

const Game = () => {
    const [activeTab, setActiveTab] = React.useState('workers');
    const {
        loadFromFile,
        load: loadSave
    } = useGameStore();

    // Load saved game on component mount
    React.useEffect(() => {
        loadSave();
    }, [loadSave]);


    return (
        <div className="container mx-auto p-4 h-screen">
            <div className="grid grid-cols-3 gap-4 h-full">
                {/* Left panel - Tower and Game */}
                <div className="col-span-1 space-y-4">
                    <TowerDisplay />
                </div>

                {/* Right panel - Tabs */}
                <div className="col-span-2 space-y-4">
                    {/* Resource Bar */}
                    <ResourceBar />

                    <div className="flex justify-between">
                        <div className="flex gap-2">
                            <Button
                                variant={activeTab === 'workers' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('workers')}
                            >
                                <Building className="mr-2" />
                                Workers
                            </Button>
                            <Button
                                variant={activeTab === 'farms' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('farms')}
                            >
                                <Landmark className="mr-2" />
                                Farms
                            </Button>
                            <Button
                                variant={activeTab === 'mines' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('mines')}
                            >
                                <Building className="mr-2" />
                                Mines
                            </Button>
                        </div>
                        <Button
                            variant={activeTab === 'settings' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('settings')}
                            size="icon"
                        >
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>

                    <Card className="h-[calc(100%-150px)]"> {/* Adjust height to account for ResourceBar */}
                        <CardContent className="p-6 h-full">
                            {activeTab === 'workers' && <WorkersTab />}
                            {activeTab === 'farms' && <FarmsTab />}
                            {activeTab === 'mines' && <MinesTab />}
                            {activeTab === 'settings' && (
                                <SettingsTab
                                    gameState={useGameStore.getState()}
                                    onLoadSave={loadFromFile}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Game;
