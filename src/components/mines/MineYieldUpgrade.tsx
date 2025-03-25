import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import { useGameStore } from '@/lib/store';

const MineYieldUpgrades: React.FC = () => {
    const { miningUpgrades, points, purchaseYieldUpgrade, canPurchaseYieldUpgrade, getAvailableYieldUpgrades } = useGameStore();

    // Get available upgrades
    const availableUpgrades = getAvailableYieldUpgrades();

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Resource Yield Upgrades</h3>
                <div className="text-sm text-green-600 font-medium">
                    Current Multiplier: {miningUpgrades?.yieldMultiplier.toFixed(2)}x
                </div>
            </div>

            {availableUpgrades.length > 0 ? (
                <div className="grid gap-3">
                    {availableUpgrades.map((upgrade) => (
                        <Card key={upgrade.id} className={!canPurchaseYieldUpgrade(upgrade.id) ? "opacity-70" : ""}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-6 w-6 text-green-600" />
                                        <div>
                                            <h4 className="font-semibold">{upgrade.name}</h4>
                                            <p className="text-sm text-accent-foreground">
                                                {upgrade.description}
                                            </p>
                                            <p className="text-xs text-green-700">
                                                +{((upgrade.multiplier - 1) * 100).toFixed(0)}% resource yield
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-sm font-medium mb-1">
                                            Cost: {upgrade.cost} coins
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => purchaseYieldUpgrade(upgrade.id)}
                                            disabled={!canPurchaseYieldUpgrade(upgrade.id)}
                                        >
                                            {points >= upgrade.cost ? 'Purchase' : 'Not enough coins'}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-muted-foreground">All upgrades purchased!</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default MineYieldUpgrades;
