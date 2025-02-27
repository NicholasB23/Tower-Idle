import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { TowerState } from '@/types/tower.types';

interface TowerDisplayProps {
    tower: TowerState;
}
const TowerDisplay = ({ tower }: TowerDisplayProps) => {

    const heightPercentage = (tower.height / tower.maxHeight) * 100;
    return (
        <Card className="h-full flex flex-col">
            <CardContent className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-6 w-6" />
                        <h2 className="text-xl font-bold">Tower Progress</h2>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">{
                            tower.height > 100 ? Math.floor(tower.height) : tower.height.toFixed(1)
                        }m</div>
                        <div className="text-sm text-muted-foreground">
                            +{tower.heightPerMinute}m/min
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardContent className="flex-1 p-4 relative bg-muted/30">
                <div className="absolute bottom-0 left-0 right-0 bg-primary/20 transition-all duration-500"
                    style={{ height: `${heightPercentage}%` }}>
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
            </CardContent>
        </Card>
    );
};

export default TowerDisplay;
