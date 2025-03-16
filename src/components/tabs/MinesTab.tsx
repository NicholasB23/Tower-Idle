import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pickaxe } from 'lucide-react';
import { useGameStore } from '@/lib/store';
import MineArea from '../MineArea';

const MinesTab = () => {
    const {
        pickaxe,
        upgradePickaxe,
        canUpgradePickaxe,
        getNextPickaxeUpgrade
    } = useGameStore();

    const nextUpgrade = getNextPickaxeUpgrade();

    return (
        <div className='flex flex-col h-full'>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Mines</h2>
                <div className="flex gap-2 items-center">
                    <div className="text-sm text-muted-foreground mr-2">
                        Level {pickaxe.level} Pickaxe • {pickaxe.power} damage
                    </div>
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={upgradePickaxe}
                        disabled={!canUpgradePickaxe()}
                    >
                        <Pickaxe className="h-4 w-4" />
                        {nextUpgrade
                            ? `Upgrade (${nextUpgrade.cost} coins)`
                            : "Max Level"}
                    </Button>
                </div>
            </div>

            <MineArea />

            <div className="space-y-4">
                <Card className="bg-muted/30 border-dashed">
                    <CardContent className="p-4 text-center text-muted-foreground">
                        <h3 className="font-semibold mb-2">Mining Upgrades Coming Soon</h3>
                        <p className="text-sm">Hire and upgrade miners in the workers tab to automate stone production</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MinesTab;
