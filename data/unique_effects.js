/*
* UNIQUE EFFECTS DEFINITION GUIDE
*
* This file centralizes the names and descriptions of unique item effects.
* The key of each object must match the `uniqueEffect` string in the item's definition
* in `data/items.js`.
*
* name: The name of the effect, which will be displayed in the tooltip header.
* description: A detailed explanation of what the effect does. This text will be
*              displayed in the tooltip body.
*/

export const UNIQUE_EFFECTS = {
    slimeSplit: {
        name: "Slime Split",
        description: "On kill, has a 10% chance to spawn a Golden Slime which drops 3x gold. Absorbing this item via Prestige permanently grants 10% chance to spawn a Golden Slime."
    },
    weaversEnvy: {
        name: "Weaver's Envy",
        description: "Your DPS hits inflict a stacking poison, dealing 33.33% of your total DPS per stack. This weapon grants 3 stacks. Absorbing this item via Prestige permanently grants +1 stack."
    }
};