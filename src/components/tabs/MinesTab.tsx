import { useGameStore } from '@/lib/store';
import MineArea from '../MineArea';
import MineShop from '../mines/MineShop';

const MinesTab = () => {
    const { pickaxe, miningUpgrades } = useGameStore();

    return (
        <div className='flex flex-col h-full'>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Mines</h2>
                <div className="flex gap-2 items-center">
                    <div className="text-sm text-muted-foreground mr-2">
                        Resource Yield: {(miningUpgrades?.yieldMultiplier || 1).toFixed(2)}x
                    </div>
                    <div className="text-sm text-muted-foreground mr-2">
                        Respawn Rate: 5secs
                    </div>
                    <div className="text-sm text-muted-foreground mr-2">
                        Level {pickaxe.level} Pickaxe • {pickaxe.power} damage
                    </div>
                    <MineShop />
                </div>
            </div>
            <MineArea />
        </div>
    );
};

export default MinesTab;
