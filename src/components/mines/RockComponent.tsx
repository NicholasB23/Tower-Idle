import { Progress } from '@/components/ui/progress';
import { Mountain, DollarSign } from 'lucide-react';
import { Rock } from '@/game/generators/rockGenerator';
import { ROCK_TYPES, RockType } from '@/types/mine.types';

interface RockProps {
    rock: Rock;
    onMine: (rockId: string) => void;
    containerWidth: number;
    containerHeight: number;
}

const RockComponent: React.FC<RockProps> = ({
    rock,
    onMine,
    containerWidth,
    containerHeight
}) => {
    // Convert percentage positions to actual pixels
    const x = (rock.xPercent * containerWidth) / 100;
    const y = (rock.yPercent * containerHeight) / 100;

    // Get rock configuration
    const rockConfig = ROCK_TYPES[rock.rockType];

    // Determine if this is a crystal rock
    const isCrystal = rock.rockType === RockType.CRYSTAL;

    return (
        <div
            className="absolute flex flex-col items-center"
            style={{
                left: `${x}px`,
                top: `${y}px`,
            }}
            onClick={() => onMine(rock.id)}
        >
            <div className="relative">
                <Mountain
                    size={rock.size}
                    strokeWidth="1"
                    color={rockConfig.color}
                    fill={rockConfig.fillColor}
                />

                {/* Add currency indicator for crystal rocks */}
                {isCrystal && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 animate-pulse">
                        <DollarSign size={16} className="text-yellow-800" />
                    </div>
                )}
            </div>
            <Progress
                value={(rock.health / rock.maxHealth) * 100}
                className={`w-16 h-1 mt-1 ${isCrystal ? 'bg-yellow-200' : ''}`}
            />
        </div>
    );
};

export default RockComponent;
