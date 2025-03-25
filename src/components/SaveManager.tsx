import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Upload, Save } from 'lucide-react';
import { saveManager } from '@/lib/saveManager';
import { GameState } from '@/types/game.types';
import { useToast } from '@/hooks/use-toast';

interface SaveManagerProps {
    gameState: GameState;
    onLoadSave: (save: GameState) => void;
}

const SaveManager: React.FC<SaveManagerProps> = ({ gameState, onLoadSave }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleSave = () => {
        const success = saveManager.saveToLocal(gameState);
        if (success) {
            toast({
                title: "Game Saved",
                description: "Your progress has been saved successfully!",
                variant: "default",
                className: "bg-green-600 text-white border-green-700"
            });
        } else {
            toast({
                title: "Save Failed",
                description: "There was an error saving your game progress.",
                variant: "destructive",
                className: "bg-red-600 text-white border-green-700"
            });
        }
    };

    const handleExport = () => {
        const success = saveManager.exportSave(gameState);
        if (success) {
            toast({
                title: "Export Successful",
                description: "Your save file has been exported to your downloads.",
                variant: "default",
                className: "bg-green-600 text-white border-green-700"
            });
        } else {
            toast({
                title: "Export Failed",
                description: "There was an error exporting your save file.",
                variant: "destructive",
                className: "bg-red-600 text-white border-green-700"
            });
        }
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const importedSave = await saveManager.importSave(file);
        if (importedSave) {
            onLoadSave(importedSave);
            toast({
                title: "Import Successful",
                description: "Your save file has been imported and loaded.",
                variant: "default",
                className: "bg-green-600 text-white border-green-700"
            });
        } else {
            toast({
                title: "Import Failed",
                description: "There was an error importing your save file. It may be corrupted or invalid.",
                variant: "destructive",
                className: "bg-red-600 text-white border-green-700"
            });
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                <Button onClick={handleSave} className='w-full'>
                    <Save className="mr-2 h-4 w-4" />
                    Save Game
                </Button>

                <Button onClick={handleExport} className='min-w-fit w-full xl:w-[calc(50%-8px)] '>
                    <Download className="mr-2 h-4 w-4" />
                    Export Save
                </Button>

                <Input
                    type="file"
                    ref={fileInputRef}
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    id="save-file-input"
                />
                <Button onClick={() => fileInputRef.current?.click()} className='min-w-fit w-full xl:w-[calc(50%-8px)]'>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Save
                </Button>
            </div>
        </div>
    );
};

export default SaveManager;
