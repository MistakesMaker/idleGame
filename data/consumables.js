/*
* CONSUMABLE DEFINITION GUIDE
*
* This file defines special, one-time use items that grant permanent effects
* or provide other unique actions.
*
* id: A unique key for the consumable.
* name: The display name for the UI.
* type: Must be 'consumable' to be handled correctly.
* icon: The path to the item's image.
* width/height: The item's size in the inventory grid.
* description: A player-facing description explaining what the item does.
*/
export const CONSUMABLES = {
    ARTISAN_CHISEL: {
        id: 'ARTISAN_CHISEL',
        name: "Artisan's Chisel",
        type: 'consumable',
        icon: 'images/icons/artisan_chisel.png',
        width: 2,
        height: 2,
        description: "A one-time use tool from a master craftsman. When consumed, permanently increases your T1 gems combining success rate from 50% to 60%."
    }
};