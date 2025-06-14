import { ITEMS } from './items.js';
import { GEMS } from './gems.js';

/*
* MONSTER LOOT TABLE GUIDE
*
* lootTable: An array of possible drops for a monster.
*   - When a monster is defeated, it first rolls its `dropChance`.
*   - If successful, it then processes this `lootTable` to pick one item.
*
* Each entry in the lootTable is an object with two properties:
*   - item: A reference to a specific item from data/items.js or data/gems.js.
*   - weight: A number representing how common this drop is. Higher numbers are more common.
*
* The system adds up all weights and picks a random number in that range to select a drop.
* Example: weight 1 and weight 99. Total weight is 100.
*   - Item 1 has a 1/100 (1%) chance to drop.
*   - Item 2 has a 99/100 (99%) chance to drop.
*/

export const MONSTERS = {

    //Overworld basic monsters
    SLIME: {
        name: 'Slime',
        image: 'images/monsters/slime.png',
        dropChance: 2.0,
        lootTable: [
            { item: ITEMS.RUSTY_SWORD, weight: 1 },
            { item: ITEMS.LEATHER_CAP, weight: 1 },
        ]
    },
    GOBLIN: {
        name: 'Goblin',
        image: 'images/slime.png',
        dropChance: 2.0,
        lootTable: [
            { item: ITEMS.WOODEN_SHIELD, weight: 1 },
            { item: ITEMS.MIGHTY_BELT, weight: 1 }
        ]
    },
    BAT: {
        name: 'Bat',
        image: 'images/monsters/bat.png',
        dropChance: 2.0,
        lootTable: [
            { item: ITEMS.RING_OF_WEALTH, weight: 1 }
        ]
    },
    SKELETON: {
        name: 'Skeleton',
        image: 'images/slime.png',
        dropChance: 2.5,
        lootTable: [
            { item: ITEMS.KNIGHTS_PLATELEGS, weight: 2 },
            { item: ITEMS.WOODEN_SHIELD, weight: 1 },
            { item: GEMS.BASE_SAPPHIRE, weight: 0.2 } // Low weight = rare
        ]
    },
    ZOMBIE: {
        name: 'Zombie',
        image: 'images/slime.png',
        dropChance: 2.5,
        lootTable: [
            { item: ITEMS.APPRENTICE_ROBE, weight: 2 },
            { item: ITEMS.MIGHTY_BELT, weight: 1 }
        ]
    },
    ORC: {
        name: 'Orc',
        image: 'images/slime.png',
        dropChance: 3.0,
        lootTable: [
            { item: ITEMS.GLADIATORS_LONGSWORD, weight: 1 },
            { item: ITEMS.MIGHTY_BELT, weight: 2 },
            { item: GEMS.BASE_RUBY, weight: 0.2 }
        ]
    },
    DUNGEON_GUARDIAN: {
        name: 'Dungeon Guardian',
        image: 'images/boss.png',
        dropChance: 100,
        lootTable: [
            { item: ITEMS.GLADIATORS_LONGSWORD, weight: 10 },
            { item: ITEMS.AMULET_OF_POWER, weight: 5 },
            { item: ITEMS.KNIGHTS_PLATELEGS, weight: 20 },
            { item: ITEMS.RING_OF_WEALTH, weight: 20 },
            { item: GEMS.BASE_EMERALD, weight: 8 },
            { item: GEMS.BASE_TOPAZ, weight: 8 }
        ]
    },
    ARCHDEMON_OVERLORD: {
        name: 'Archdemon Overlord',
        image: 'images/bigboss.png',
        dropChance: 100,
        lootTable: [
            { item: ITEMS.GLADIATORS_LONGSWORD, weight: 25 },
            { item: ITEMS.AMULET_OF_POWER, weight: 25 },
            { item: GEMS.BASE_AMETHYST, weight: 10 } // Special gem from the final boss
        ]
    }
};