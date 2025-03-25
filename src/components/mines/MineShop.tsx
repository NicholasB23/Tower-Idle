// src/components/mines/MineShop.tsx
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Pickaxe, ShoppingCart } from 'lucide-react';
import { useGameStore } from '@/lib/store';
import { PICKAXE_UPGRADES } from '@/types/mine.types';
import MineYieldUpgrades from './MineYieldUpgrade';

const MineShop = () => {
    const [open, setOpen] = useState(false);
    const { pickaxe, upgradePickaxe, canUpgradePickaxe, points } = useGameStore();

    // Find the next pickaxe upgrade
    const nextPickaxe = PICKAXE_UPGRADES.find(p => p.level === pickaxe.level + 1);

    const handleUpgrade = () => {
        upgradePickaxe();
        // Keep the dialog open to allow multiple purchases
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Shop
                </Button>
            </SheetTrigger>

            <SheetContent className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="text-center">Mine Shop</SheetTitle>
                </SheetHeader>

                <div className="grid gap-4 py-4">
                    <h3 className="font-semibold text-lg mb-2">Upgrades</h3>

                    <Card className={!canUpgradePickaxe() ? "opacity-70" : ""}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Pickaxe className="h-6 w-6" />
                                    <div>
                                        <h4 className="font-semibold">Pickaxe Upgrade</h4>
                                        <p className="text-sm text-accent-foreground">
                                            Level {pickaxe.level} → {nextPickaxe?.level || 'MAX'}
                                        </p>
                                        {nextPickaxe && (
                                            <p className="text-xs text-green-700">
                                                +{nextPickaxe.power - pickaxe.power} damage
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="text-right">
                                    {nextPickaxe ? (
                                        <>
                                            <div className="text-sm font-medium mb-1">
                                                Cost: {nextPickaxe.cost} coins
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={handleUpgrade}
                                                disabled={!canUpgradePickaxe()}
                                            >
                                                {points >= nextPickaxe.cost ? 'Upgrade' : 'Not enough coins'}
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="text-sm font-medium">Maximum Level</div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <MineYieldUpgrades />
                    {/* <Card className="opacity-50">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <HardHat className="h-6 w-6" />
                                    <div>
                                        <h4 className="font-semibold">Auto Miner</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Mines automatically
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm font-medium mb-1">
                                        Coming soon!
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card> */}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MineShop;
