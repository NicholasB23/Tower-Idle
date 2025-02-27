import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, Save } from 'lucide-react';
import { saveManager } from '@/lib/saveManager';
import { GameState } from '@/types/game.types';

interface SaveManagerProps {
    gameState: GameState;
    onLoadSave: (save: GameState) => void;
}

const SaveManager: React.FC<SaveManagerProps> = ({ gameState, onLoadSave }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [saveStatus, setSaveStatus] = React.useState<{
        show: boolean;
        message: string;
        isError: boolean;
    }>({ show: false, message: '', isError: false });

    const showStatus = (message: string, isError = false) => {
        setSaveStatus({ show: true, message, isError });
        setTimeout(() => setSaveStatus(prev => ({ ...prev, show: false })), 3000);
    };

    const handleSave = () => {
        const success = saveManager.saveToLocal(gameState);
        showStatus(
            success ? 'Game saved successfully!' : 'Failed to save game',
            !success
        );
    };

    const handleExport = () => {
        const success = saveManager.exportSave(gameState);
        showStatus(
            success ? 'Save file exported successfully!' : 'Failed to export save file',
            !success
        );
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const importedSave = await saveManager.importSave(file);
        if (importedSave) {
            onLoadSave(importedSave);
            showStatus('Save file imported successfully!');
        } else {
            showStatus('Failed to import save file', true);
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {saveStatus.show && (
                <Alert variant={saveStatus.isError ? "destructive" : "default"}>
                    <AlertDescription>{saveStatus.message}</AlertDescription>
                </Alert>
            )}

            <div className="flex flex-wrap gap-4">
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Game
                </Button>

                <Button onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Save
                </Button>

                <div className="relative">
                    <Input
                        type="file"
                        ref={fileInputRef}
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                        id="save-file-input"
                    />
                    <Button onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import Save
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SaveManager;
