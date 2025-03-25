import { RockType, ROCK_TYPES, ResourceYield } from '@/types/mine.types';

export interface Rock {
    id: string;
    xPercent: number;
    yPercent: number;
    size: number;
    rockType: RockType;
    health: number;
    maxHealth: number;
    resources: ResourceYield[];
}

// Check if a new rock overlaps with existing rocks
export function checkRockCollision(
    newRock: Rock,
    existingRocks: Rock[],
    containerWidth: number,
    containerHeight: number
): boolean {
    // Convert percentage positions to pixel distances for collision detection
    return existingRocks.some(existing => {
        const existingX = (existing.xPercent * containerWidth) / 100;
        const existingY = (existing.yPercent * containerHeight) / 100;
        const newX = (newRock.xPercent * containerWidth) / 100;
        const newY = (newRock.yPercent * containerHeight) / 100;

        const distance = Math.sqrt(
            Math.pow(existingX - newX, 2) +
            Math.pow(existingY - newY, 2)
        );

        return distance < (existing.size + newRock.size) / 2 + 10; // Add padding
    });
}

// Choose rock type based on tower height
export function chooseRockType(towerHeight: number): RockType {
    // Crystal rocks have a fixed chance at any height
    if (Math.random() < 0.1) {
        return RockType.CRYSTAL;
    }

    // Filter rock types available at the current tower height
    const availableRockTypes = Object.values(ROCK_TYPES).filter(
        rockConfig => towerHeight >= rockConfig.minTowerHeight
    );

    if (availableRockTypes.length === 0) {
        return RockType.NORMAL; // Fallback
    }

    // Weight rock types based on rarity - rarer rocks at higher heights
    const weights = availableRockTypes.map((_, index) => index + 1);
    const totalWeightSum = weights.reduce((sum, weight) => sum + weight, 0);

    // Choose a random rock type based on weights
    let random = Math.random() * totalWeightSum;
    let cumulativeWeight = 0;

    for (let i = 0; i < availableRockTypes.length; i++) {
        cumulativeWeight += weights[i];
        if (random <= cumulativeWeight) {
            return availableRockTypes[i].type;
        }
    }

    // Fallback to the highest level rock
    return availableRockTypes[availableRockTypes.length - 1].type;
}

/**
 * Generate a single rock with position and properties
 */
export function generateRock(
    containerWidth: number,
    containerHeight: number,
    existingRocks: Rock[] = [],
    towerHeight: number = 0,
    id: string = `rock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
): Rock {
    // Choose rock type based on tower height
    const rockType = chooseRockType(towerHeight);
    const rockConfig = ROCK_TYPES[rockType];
    const health = rockConfig.health;
    const size = 64;
    const padding = 20;

    // Try up to 10 times to find a non-overlapping position
    for (let attempt = 0; attempt < 10; attempt++) {
        // Generate positions as percentages
        const xPercent = ((padding + Math.random() * (containerWidth - size - padding * 2)) / containerWidth) * 100;
        const yPercent = ((padding + Math.random() * (containerHeight - size - padding * 2)) / containerHeight) * 100;

        const newRock = {
            id,
            xPercent,
            yPercent,
            size,
            rockType,
            health,
            maxHealth: health,
            resources: rockConfig.resources
        };

        if (!checkRockCollision(newRock, existingRocks, containerWidth, containerHeight)) {
            return newRock;
        }
    }

    // If we can't find a non-overlapping position after 10 attempts,
    // place it in a corner with adjusted size
    return {
        id,
        xPercent: (padding / containerWidth) * 100,
        yPercent: (padding / containerHeight) * 100,
        size: Math.max(size - 10, 15),
        rockType: RockType.NORMAL,
        health: 3,
        maxHealth: 3,
        resources: ROCK_TYPES[RockType.NORMAL].resources
    };
}

/**
 * Generate multiple rocks for the mining area
 */
export function generateRocks(
    containerWidth: number,
    containerHeight: number,
    count: number,
    towerHeight: number = 0
): Rock[] {
    const rocks: Rock[] = [];

    for (let i = 0; i < count; i++) {
        const rock = generateRock(
            containerWidth,
            containerHeight,
            rocks,
            towerHeight,
            `rock-${i}`
        );
        rocks.push(rock);
    }

    return rocks;
}

// Helper function to calculate resource yield from a rock
export function calculateResourceYield(resources: ResourceYield[], multiplier: number = 1): Record<string, number> {
    const result: Record<string, number> = {};

    resources.forEach(resource => {
        // Use fixed amount with multiplier
        const amount = Math.floor(resource.amount * multiplier);

        if (amount > 0) {
            result[resource.type] = amount;
        }
    });

    return result;
}

// Function to calculate currency yield from crystal rocks
export function calculateCurrencyYield(resources: ResourceYield[], multiplier: number = 1): number {
    let currencyAmount = 0;

    resources.forEach(resource => {
        // Use fixed amount with multiplier
        const amount = Math.floor(resource.amount * multiplier);

        // Calculate currency based on resource type
        if (resource.type === 'stone') {
            currencyAmount += amount * 2;
        } else if (resource.type === 'metal') {
            currencyAmount += amount * 5;
        } else if (resource.type === 'wood') {
            currencyAmount += amount * 1;
        } else if (resource.type === 'carbonFiber') {
            currencyAmount += amount * 10; // Carbon fiber is more valuable
        }
    });

    return currencyAmount;
}
