// --- START OF FILE monsters.js ---

/*
* ====================================================================================
* MONSTER AGGREGATOR
*
* This file imports monster definitions from their realm-specific files
* (e.g., overworld_monsters.js, underdark_monsters.js) and merges them into a
* single, flat 'MONSTERS' object for the rest of the game to use.
*
* This makes it easy for game logic (especially in realms.js) to access any monster
* by its ID, like MONSTERS.SLIME, without needing to know which file it came from.
* It also keeps the individual data files small and manageable.
* ====================================================================================
*/

import { overworldMonsters } from './monsters/overworld_monsters.js';
import { underdarkMonsters } from './monsters/underdark_monsters.js';
import { sunkenWorldMonsters } from './monsters/sunken_world_monsters.js';
import { celestialPlanesMonsters } from './monsters/celestial_planes_monsters.js';
import { aetheriumForgeMonsters } from './monsters/aetherium_forge_monsters.js';
import { ITEMS } from './items.js';
import { GEMS } from './gems.js';

// ====================================================================================
// --- Special & Generic Monsters ---
// These monsters don't belong to a specific realm or are used across multiple.
// They are kept here for simplicity.
// ====================================================================================
const otherMonsters = {
    GOLDEN_SLIME: {
        id: 'GOLDEN_SLIME',
        name: 'Golden Slime',
        image: 'images/monsters/golden_slime.png',
        dropChance: 0, // No item drops
        lootTable: [],
        isSpecial: true,
        background: 'images/backgrounds/bg_golden_slime.png'
    },
    DUNGEON_GUARDIAN: {
        name: 'Dungeon Guardian',
        image: 'images/boss.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.RUNIC_BLADE, weight: 10 },
            { item: ITEMS.GIRDLE_OF_COLOSSAL_STRENGTH, weight: 1 },
            { item: ITEMS.TOWER_SHIELD, weight: 20 },
            { item: GEMS.BASE_EMERALD, weight: 8 },
            { item: GEMS.BASE_TOPAZ, weight: 8 }
        ]
    },
};

// ====================================================================================
// --- Master Export ---
// ====================================================================================

/**
 * The master list of all monsters in the game.
 * It's a single, flat object, merged from the realm-specific objects above.
 */
export const MONSTERS = {
    ...overworldMonsters,
    ...underdarkMonsters,
    ...sunkenWorldMonsters,
    ...celestialPlanesMonsters,
    ...aetheriumForgeMonsters,
    ...otherMonsters
};