// --- START OF FILE items.js ---

/*
* ====================================================================================
* ITEM AGGREGATOR
*
* This file imports item definitions from their realm-specific files
* (e.g., overworld_items.js, underdark_items.js) and merges them into a
* single, flat 'ITEMS' object for the rest of the game to use.
*
* This makes it easy for the game logic to access any item by its ID, like
* ITEMS.RUSTY_SWORD, without needing to know which file it came from.
* It also keeps the individual data files small and manageable.
* ====================================================================================
*/

import { overworldItems } from './items/overworld_items.js';
import { underdarkItems } from './items/underdark_items.js';
import { sunkenWorldItems } from './items/sunken_world_items.js';
import { celestialPlanesItems } from './items/celestial_planes_items.js';
import { aetheriumForgeItems } from './items/aetherium_forge_items.js';

/**
 * The master list of all items in the game.
 * It's a single, flat object, merged from the realm-specific objects.
 */
export const ITEMS = {
    ...overworldItems,
    ...underdarkItems,
    ...sunkenWorldItems,
    ...celestialPlanesItems,
    ...aetheriumForgeItems
};