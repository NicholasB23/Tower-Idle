import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useGameStore } from '@/lib/store';
import { Coins, TreePine, Mountain, Factory, ArrowUp } from 'lucide-react';

const ResourceBar: React.FC = () => {
    const { points, resources, production } = useGameStore();

    const resourceItems = [
        {
            name: 'Currency',
            value: points,
            icon: <Coins className="h-5 w-5 text-yellow-500" />,
            rate: null
        },
        {
            name: 'Wood',
            value: resources.wood,
            icon: <TreePine className="h-5 w-5 text-green-700" />,
            rate: production.woodRate
        },
        {
            name: 'Stone',
            value: resources.stone,
            icon: <Mountain className="h-5 w-5 text-gray-600" />,
            rate: production.stoneRate
        },
        {
            name: 'Metal',
            value: resources.metal,
            icon: <Factory className="h-5 w-5 text-blue-600" />,
            rate: production.metalRate
        }
    ];

    return (
        <Card className="mb-4">
            <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-4">
                    {resourceItems.map((item, index) => (
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
