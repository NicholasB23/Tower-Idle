// src/components/ResourceBar.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useGameStore } from '@/lib/store';
import { Coins, TreePine, Mountain, Factory, ArrowUp, Atom } from 'lucide-react';
import { TowerAge } from '@/types/tower.types';

const ResourceBar: React.FC = () => {
    const { points, resources, production, tower } = useGameStore();

    // Determine which resources to show based on tower age
    const showMetal = tower.currentAge !== TowerAge.STONE;
    const showCarbonFiber = tower.currentAge === TowerAge.CARBON;

    // Dynamic grid columns based on visible resources
    const gridCols = 2 + (showMetal ? 1 : 0) + (showCarbonFiber ? 1 : 0) + 1; // +1 for currency

    const resourceItems = [
        {
            name: 'Currency',
            value: points,
            icon: <Coins className="h-5 w-5 text-yellow-500" />,
            rate: null,
            always: true
        },
        {
            name: 'Stone',
            value: resources.stone,
            icon: <Mountain className="h-5 w-5 text-gray-600" />,
            rate: production.stoneRate,
            always: true
        },
        {
            name: 'Metal',
            value: resources.metal,
            icon: <Factory className="h-5 w-5 text-blue-600" />,
            rate: production.metalRate,
            always: false,
            showWhen: showMetal
        },
        {
            name: 'Carbon',
            value: resources.carbonFiber,
            icon: <Atom className="h-5 w-5 text-purple-600" />,
            rate: production.carbonFiberRate,
            always: false,
            showWhen: showCarbonFiber
        },
        {
            name: 'Wood',
            value: resources.wood,
            icon: <TreePine className="h-5 w-5 text-green-700" />,
            rate: production.woodRate,
            always: true
        }
    ];

    // Filter resources to show based on current age
    const visibleResources = resourceItems.filter(item => item.always || item.showWhen);

    return (
        <Card className="mb-4">
            <CardContent className="p-4">
                <div className={`grid grid-cols-${gridCols} gap-4`}>
                    {visibleResources.map((item, index) => (
                        <div key={index} className="flex items-center justify-center gap-2">
                            {item.icon}
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{item.name}</span>
                                <div className="flex items-center">
                                    <span className="font-bold">
                                        {typeof item.value === 'number' && item.value > 100
                                            ? Math.floor(item.value)
                                            : Number(item.value).toFixed(1)}
                                    </span>
                                    {item.rate !== null && item.rate > 0 && (
                                        <div className="ml-1 flex items-center text-xs text-green-600">
                                            <ArrowUp className="h-3 w-3" />
                                            {item.rate.toFixed(1)}/s
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ResourceBar;
