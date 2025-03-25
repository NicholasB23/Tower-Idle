import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, ArrowUp } from 'lucide-react';
import { TowerAge, AGE_CONFIG } from '@/types/tower.types';
import { Progress } from '@/components/ui/progress';
import { useGameStore } from '@/lib/store';


const TowerDisplay = () => {
    const { resources, startBuildingTower, canBuildTower, tower } = useGameStore();

    const currentAgeConfig = AGE_CONFIG[tower.currentAge];

    const ageDif = currentAgeConfig.heightRange[1] - currentAgeConfig.heightRange[0]
    const heightPercentage = (tower.height / ageDif) * 100;

    // Format functions
    const formatResource = (value: number) => value > 999
        ? `${(value / 1000).toFixed(1)}k`
        : Math.floor(value);

    const getAgeColor = (age: TowerAge) => {
        switch (age) {
            case TowerAge.STONE: return 'bg-stone-600';
            case TowerAge.METAL: return 'bg-slate-700';
            case TowerAge.CARBON: return 'bg-indigo-900';
            default: return 'bg-gray-700';
        }
    };

    return (
        <Card className="h-full flex flex-col">
            <CardContent className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-6 w-6" />
                        <div>
                            <h2 className="text-xl font-bold">Tower Progress</h2>
                            <p className="text-sm text-muted-foreground">{currentAgeConfig.name}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">{
                            tower.height > 100 ? Math.floor(tower.height) : tower.height.toFixed(1)
                        }m</div>
                    </div>
                </div>
            </CardContent>

            <CardContent className="flex-1 p-4 relative bg-muted/30">



                <>
                    <div className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                        style={{
                            height: `${heightPercentage}%`,
                            background: `linear-gradient(to top, ${getAgeColor(tower.currentAge)}, ${getAgeColor(tower.currentAge)}90)`
                        }}>
                        <div className="absolute top-0 left-0 right-0 h-2 bg-primary/40" />

                        {/* Tower Floors Visual */}
                        {Array.from({ length: Math.floor(heightPercentage / 5) }).map((_, index) => (
                            <div
                                key={index}
                                className="absolute w-full h-px bg-primary/20"
                                style={{ bottom: `${index * 5}%` }}
                            />
                        ))}
                    </div>

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 shadow-lg w-2/3">
                            <h3 className="font-semibold mb-3 text-center">Required Resources</h3>
                            <div className="mb-4">
                                {tower.buildCost.stone > 0 && (
                                    <div className={`text-center p-1 rounded mb-2 ${resources.stone >= tower.buildCost.stone ? 'bg-green-100' : 'bg-red-100'}`}>
                                        <div className="">Stone: {formatResource(resources.stone)}/{formatResource(tower.buildCost.stone)}</div>
                                    </div>
                                )}
                                {tower.buildCost.metal > 0 && (
                                    <div className={`text-center p-1 rounded mb-2 ${resources.metal >= tower.buildCost.metal ? 'bg-green-100' : 'bg-red-100'}`}>
                                        <div className="">Metal: {formatResource(resources.metal)}/{formatResource(tower.buildCost.metal)}</div>
                                    </div>
                                )}
                                {tower.buildCost.carbonFiber > 0 && (
                                    <div className={`text-center p-1 rounded mb-2 ${resources.carbonFiber >= tower.buildCost.carbonFiber ? 'bg-green-100' : 'bg-red-100'}`}>
                                        <div className="font-medium">Carbon {formatResource(resources.carbonFiber)}/{formatResource(tower.buildCost.carbonFiber)}</div>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <Progress value={tower.buildProgress} className="w-full mb-4" />
                            </div>
                            <Button
                                className="w-full flex items-center justify-center"
                                onClick={startBuildingTower}
                                disabled={!canBuildTower() || tower.isBuilding}
                            >
                                <ArrowUp className="mr-2 h-4 w-4" />
                                Build
                            </Button>
                        </div>
                    </div>
                </>

            </CardContent>
        </Card>
    );
};

export default TowerDisplay;
