import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '@/lib/store';
import { Rock, generateRock, generateRocks, calculateResourceYield, calculateCurrencyYield } from '@/game/generators/rockGenerator'
import RockComponent from '@/components/mines/RockComponent';
import { cn } from '@/lib/utils';
import { RockType } from '@/types/mine.types';

const MineArea = () => {
    const [rocks, setRocks] = useState<Rock[]>([]);
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
    const mineAreaRef = useRef<HTMLDivElement>(null);
    const { addResource, addPoints, pickaxe, tower } = useGameStore();

    // Custom pickaxe cursor
    const cursorUrl = 'src/assets/icons/pickaxe.svg';
    const pickaxeCursorClass = {
        cursor: `url("${cursorUrl}") 16 16, auto`
    };

    // Update container dimensions
    useEffect(() => {
        if (!mineAreaRef.current) return;

        const updateDimensions = () => {
            if (mineAreaRef.current) {
                const { clientWidth, clientHeight } = mineAreaRef.current;
                setContainerDimensions({ width: clientWidth, height: clientHeight });

                // Only generate rocks on first load when rocks array is empty
                if (rocks.length === 0) {
                    setRocks(generateRocks(clientWidth, clientHeight, 10, tower.height)); // Pass tower height to the function
                }
            }
        };

        // Initial update
        updateDimensions();

        // Setup resize observer to detect container size changes
        const resizeObserver = new ResizeObserver(updateDimensions);
        resizeObserver.observe(mineAreaRef.current);

        // Cleanup
        return () => {
            if (mineAreaRef.current) {
                resizeObserver.unobserve(mineAreaRef.current);
            }
            resizeObserver.disconnect();
        };
    }, [rocks.length, pickaxe.level, tower.height]);

    const handleMineRock = (rockId: string) => {
        setRocks(prevRocks =>
            prevRocks.map(rock => {
                if (rock.id !== rockId) return rock;

                // Apply pickaxe power instead of fixed -1
                const newHealth = rock.health - pickaxe.power;

                // Rock is depleted
                if (newHealth <= 0) {
                    // Check if it's a crystal rock
                    if (rock.rockType === RockType.CRYSTAL) {
                        // Calculate currency to add based on the crystal's resources
                        const currencyAmount = calculateCurrencyYield(rock.resources);
                        if (currencyAmount > 0) {
                            addPoints(currencyAmount);
                        }
                    } else {
                        // Handle regular rocks as before - add resources
                        const resources = calculateResourceYield(rock.resources);
                        Object.entries(resources).forEach(([type, amount]) => {
                            addResource(type as 'stone' | 'metal' | 'wood', amount);
                        });
                    }

                    // Generate a new rock to replace the mined one
                    if (containerDimensions.width && containerDimensions.height) {
                        const otherRocks = prevRocks.filter(r => r.id !== rockId);
                        return generateRock(
                            containerDimensions.width,
                            containerDimensions.height,
                            otherRocks,
                            tower.height  // Pass tower height to the function
                        );
                    }
                }

                // Update rock health
                return { ...rock, health: newHealth };
            })
        );
    };

    return (
        <div
            ref={mineAreaRef}
            className={cn('flex-grow w-full bg-stone-200 rounded-md relative mb-4 min-h-[300px]')}
            style={pickaxeCursorClass}
        >
            {rocks.map(rock => (
                <RockComponent
                    key={rock.id}
                    rock={rock}
                    onMine={handleMineRock}
                    containerWidth={containerDimensions.width}
                    containerHeight={containerDimensions.height}
                />
            ))}
        </div>
    )
}

export default MineArea;
