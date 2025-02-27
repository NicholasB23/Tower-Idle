import { Card, CardContent } from '@/components/ui/card';

const WorkersTab = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Workers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">Construction Worker</h3>
                        <p className="text-sm text-muted-foreground mb-2">Increases building speed by 10%</p>
                        <div className="flex justify-between items-center">
                            <span>Cost: $100</span>
                            <span>Owned: 0</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">Maintenance Worker</h3>
                        <p className="text-sm text-muted-foreground mb-2">Increases efficiency by 5%</p>
                        <div className="flex justify-between items-center">
                            <span>Cost: $150</span>
                            <span>Owned: 0</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default WorkersTab;
