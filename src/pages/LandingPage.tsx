import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Upload, Sparkles } from 'lucide-react';
import LandingTower from '@/components/LandingTower';
import { saveManager } from '@/lib/saveManager';
import { useGameStore } from '@/lib/store';

const LandingPage = () => {
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const hasSavedGame = localStorage.getItem('tower-game-save') !== null;
    const lastSaveTime = saveManager.getLastSaveTime();
    const formattedTime = lastSaveTime ? lastSaveTime.toLocaleString() : 'Never';
    const navigate = useNavigate();
    const { loadFromFile, startNewGame } = useGameStore();

    const handleNewGame = () => {
        startNewGame();
        navigate('/play');
    };

    const handleContinue = () => {
        navigate('/play');
    };

    const handleImportClick = () => {
        setIsImporting(true);
        fileInputRef.current?.click();
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const importedSave = await saveManager.importSave(file);
        if (importedSave) {
            loadFromFile(importedSave);
            navigate('/play');
        } else {
            alert('Failed to import save file');
        }

        setIsImporting(false);
        if (event.target) {
            event.target.value = '';
        }
    };

    return (
        <LandingTower>
            <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4">

                <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-blue-300 shadow-2xl">

                    <CardTitle className='text-6xl font-bold text-center my-8'>
                        <span className="text-rose-600">T</span>ower
                        <span className="text-rose-600">I</span>dle
                    </CardTitle>

                    <CardDescription className="text-center max-w-md text-lg mb-8">
                        Build the tallest tower in the world! Mine resources, grow crops,
                        and manage workers to create a magnificent skyscraper.
                    </CardDescription>

                    <CardContent className="p-6 space-y-4">
                        <Button
                            className="w-full gap-2 bg-gradient-to-r from-blue-500 to-indigo-600
                            hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg"
                            onClick={handleNewGame}
                            size="lg"
                        >
                            <Play className="h-5 w-5" />
                            New Game
                        </Button>


                        <Button
                            disabled={!hasSavedGame}
                            variant="outline"
                            className="w-full gap-2"
                            onClick={handleContinue}
                            size="lg"
                        >
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                            Continue {hasSavedGame ? formattedTime : ''}
                        </Button>


                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            onClick={handleImportClick}
                            size="lg"
                            disabled={isImporting}
                        >
                            <Upload className="h-5 w-5" />
                            Import Save
                        </Button>

                        <Input
                            type="file"
                            ref={fileInputRef}
                            accept=".json"
                            onChange={handleImport}
                            className="hidden"
                        />
                    </CardContent>
                </Card>


                <p className="absolute text-sm text-blue-200 bottom-1">
                    © 2024 Tower Idle - All Rights Reserved
                </p>
            </div>
        </LandingTower>
    );
};

export default LandingPage;
