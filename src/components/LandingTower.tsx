import { useEffect, useState, ReactNode } from 'react';

interface LandingTowerProps {
    children: ReactNode;
}

const LandingTower = ({ children }: LandingTowerProps) => {
    const [floors, setFloors] = useState<number[]>([]);
    const [lightsOn, setLightsOn] = useState<Record<number, boolean>>({});
    const [floorHeight, setFloorHeight] = useState(0);
    const TOTAL_FLOORS = 20;

    useEffect(() => {
        const updateFloorHeight = () => {
            const viewportHeight = window.innerHeight;
            setFloorHeight((viewportHeight - 80) / TOTAL_FLOORS); // Subtract ground height (8px)
        };

        updateFloorHeight();
        window.addEventListener('resize', updateFloorHeight);

        return () => window.removeEventListener('resize', updateFloorHeight);
    }, []);

    useEffect(() => {
        setFloors([1, 2, 3]);
        const interval = setInterval(() => {
            setFloors(prev => {
                if (prev.length >= TOTAL_FLOORS) {
                    clearInterval(interval);
                    return prev;
                }
                return [...prev, prev.length + 1];
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const lightInterval = setInterval(() => {
            const newLights: Record<number, boolean> = {};
            floors.forEach(floor => {
                if (Math.random() < 0.3) {
                    newLights[floor] = !lightsOn[floor];
                } else {
                    newLights[floor] = lightsOn[floor] || false;
                }
            });
            setLightsOn(newLights);
        }, 800);

        return () => clearInterval(lightInterval);
    }, [floors, lightsOn]);

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Sky background */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-800 via-purple-600 to-blue-400" />

            {/* Stars */}
            <div>
                {Array.from({ length: 20 }).map((_, index) => (
                    <div
                        key={`star-${index}`}
                        className="absolute bg-white rounded-full animate-pulse"
                        style={{
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                            top: `${Math.random() * 60}%`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${Math.random() * 3 + 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Moon */}
            <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-yellow-100 opacity-90 shadow-lg shadow-yellow-100/50" />

            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-900 to-green-800" />

            {/* Tower */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/4 md:w-1/3 flex flex-col-reverse items-center">
                {floors.map((floor) => (
                    <div
                        key={floor}
                        className="w-full border-b border-primary-foreground flex items-center justify-center animate-fadeIn"
                        style={{
                            height: `${floorHeight}px`,
                            backgroundColor: floor % 3 === 0
                                ? 'rgb(59 130 246 / 0.8)'
                                : floor % 2 === 0
                                    ? 'rgb(99 102 241 / 0.8)'
                                    : 'rgb(79 70 229 / 0.8)',
                            animationDelay: `${floor * 100}ms`,
                            boxShadow: '0 0 8px rgba(59, 130, 246, 0.4)'
                        }}
                    >
                        <div
                            className={`w-3 h-3 rounded-full mx-1 transition-colors duration-300 ${lightsOn[floor] ? 'bg-yellow-300' : 'bg-gray-700'}`}
                            style={{
                                boxShadow: lightsOn[floor] ? '0 0 8px rgba(253, 224, 71, 0.8)' : 'none'
                            }}
                        />
                        <div
                            className={`w-3 h-3 rounded-full mx-1 transition-colors duration-300 ${lightsOn[floor] ? 'bg-yellow-300' : 'bg-gray-700'}`}
                            style={{
                                boxShadow: lightsOn[floor] ? '0 0 8px rgba(253, 224, 71, 0.8)' : 'none'
                            }}
                        />
                    </div>
                ))}

                {/* Base foundation */}
                <div className="w-full h-8 bg-gray-800 mb-0 shadow-md" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default LandingTower;
