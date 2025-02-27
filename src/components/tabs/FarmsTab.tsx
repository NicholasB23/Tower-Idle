import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTrigger, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { Shovel } from 'lucide-react';
import { useGameStore } from '@/lib/store';
import { CropType, CROP_DETAILS } from '@/types/farm.types';

const CROPS: CropType[] = ['Wheat', 'Corn', 'Potato', 'Carrot'];

const CROP_COLORS: Record<CropType, string> = {
    Wheat: 'bg-yellow-200 hover:bg-yellow-300',
    Corn: 'bg-yellow-400 hover:bg-yellow-500',
    Potato: 'bg-yellow-900 hover:bg-yellow-950',
    Carrot: 'bg-orange-400 hover:bg-orange-500'
};

const CROP_HOVER_COLORS: Record<CropType, string> = {
    Wheat: 'bg-green-100 hover:bg-yellow-300',
    Corn: 'bg-green-100 hover:bg-yellow-500',
    Potato: 'bg-green-100 hover:bg-yellow-950',
    Carrot: 'bg-green-100 hover:bg-orange-500'
};

const CropInventory = () => {
    const { farm } = useGameStore();
    return (
        <div className="grid grid-cols-2 gap-4 mb-4">
            {Object.entries(farm.inventory).map(([crop, amount]) => (
                <Card key={crop}>
                    <CardContent className="p-4">
                        <div className="font-semibold capitalize">{crop}</div>
                        <div className="text-sm">Amount: {amount}</div>
                        {/* {CROP_DETAILS[crop.charAt(0).toUpperCase() + crop.slice(1) as CropType].effects.map((effect, idx) => (
                            <div key={idx} className="text-xs text-muted-foreground">
                                +{effect.value} {effect.type}
                            </div>
                        ))} */}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};


const FarmsTab = () => {
    const [isPlantMenuOpen, setIsPlantMenuOpen] = React.useState(false);
    const { farm, points, unlockFarmTile, plantCrop, harvestCrop, setPlantingMode } = useGameStore();

    const handleTileClick = (tileId: number) => {
        const tile = farm.tiles[tileId];

        if (!tile.unlocked && points >= tile.cost) {
            unlockFarmTile(tileId);
            return;
        }

        if (farm.isPlanting && farm.selectedCrop && points >= CROP_DETAILS[farm.selectedCrop].cost) {
            plantCrop(tileId, farm.selectedCrop);
            return;
        }

        if (tile.crop && tile.growthProgress === 1) {
            harvestCrop(tileId);
        }
    };

    const startPlanting = (crop: CropType) => {
        setPlantingMode(true, crop);
        setIsPlantMenuOpen(false);
    };

    const getTileClasses = (index: number) => {
        const tile = farm.tiles[index];
        if (!tile.unlocked) return 'cursor-pointer bg-gray-200';
        if (tile.crop) return `cursor-pointer ${CROP_COLORS[tile.crop]}`;
        return `cursor-pointer bg-green-100 ${farm.isPlanting && farm.selectedCrop ? CROP_HOVER_COLORS[farm.selectedCrop] : ''}`;
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Farm</h2>
                <AlertDialog open={isPlantMenuOpen}>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant={farm.isPlanting ? "default" : "outline"}
                            onClick={() => setIsPlantMenuOpen(true)}
                            className="gap-2"
                        >
                            <Shovel className="h-4 w-4" />
                            Plant
                        </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="max-w-sm">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-center">Choose a crop to plant</AlertDialogTitle>
                            <AlertDialogDescription hidden={true}>Meow</AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="grid grid-cols-2 gap-4 pt-6">
                            {CROPS.map(crop => (
                                <Button
                                    key={crop}
                                    onClick={() => startPlanting(crop)}
                                    className={`h-24 ${CROP_COLORS[crop]}`}
                                    disabled={points < CROP_DETAILS[crop].cost}
                                >
                                    <div className="text-center">
                                        <div>{crop}</div>
                                        <div className="text-sm">Cost: ${CROP_DETAILS[crop].cost}</div>
                                        {/* <div className="text-sm">ADD CROP EFFECT HERE</div> */}
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <CropInventory />
            <div className="grid grid-cols-4 gap-4">
                {farm.tiles.map((tile, index) => (
                    <Card
                        key={index}
                        className={`transition-colors ${getTileClasses(index)}`}
                        onClick={() => handleTileClick(tile.id)}
                    >
                        <CardContent className="p-4 h-24 flex flex-col items-center justify-center text-center">
                            {!tile.unlocked ? (
                                <div>
                                    <div className="font-bold">Purchase</div>
                                    <div className="text-sm">${tile.cost}</div>
                                </div>
                            ) : tile.crop ? (
                                <>
                                    <div>{tile.crop}</div>
                                    <Progress value={tile.growthProgress ? tile.growthProgress * 100 : 0} className="mt-2" />
                                </>
                            ) : (
                                'Empty'
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FarmsTab;
