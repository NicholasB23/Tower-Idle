// src/game/generators/rockGenerator.ts
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

// Random crystal rock or choose rock based on tower height
export function chooseRockType(towerHeight: number): RockType {
    let chosenRock: RockType = RockType.NORMAL;

    if (Math.random() < 0.1) {
        chosenRock = RockType.CRYSTAL;
    } else if (towerHeight <= 100) {
        chosenRock = RockType.HARD;
    } else if (towerHeight <= 1000) {
        chosenRock = RockType.GRANITE;
    } else if (towerHeight <= 10000) {
        chosenRock = RockType.GEODE;
    } else if (towerHeight <= 100000) {
        chosenRock = RockType.METEORITE;
    } else {
        chosenRock = RockType.NORMAL;
    }
    return chosenRock;
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
    // Choose rock type
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
export function calculateResourceYield(resources: ResourceYield[]): Record<string, number> {
    const result: Record<string, number> = {};

    resources.forEach(resource => {
        // Calculate a random value between min and max
        const amount = Math.floor(
            resource.min + Math.random() * (resource.max - resource.min + 1)
        );

        if (amount > 0) {
            result[resource.type] = amount;
        }
    });

    return result;
}

// New function to calculate currency yield from crystal rocks
export function calculateCurrencyYield(resources: ResourceYield[]): number {
    let currencyAmount = 0;

    resources.forEach(resource => {
        // Convert resource yields to currency
        const baseAmount = Math.floor(
            resource.min + Math.random() * (resource.max - resource.min + 1)
        );

        // Calculate currency based on resource type
        if (resource.type === 'stone') {
            currencyAmount += baseAmount * 2;
        } else if (resource.type === 'metal') {
            currencyAmount += baseAmount * 5;
        } else if (resource.type === 'wood') {
            currencyAmount += baseAmount * 1;
        }
    });

    return currencyAmount;
}
