import { ITEMS } from './items.js';

export const MONSTERS = {
    SLIME: {
        name: 'Slime',
        image: 'images/slime.png',
        dropChance: 1.0,
        lootTable: [ITEMS.RING, ITEMS.BELT]
    },
    GOBLIN: {
        name: 'Goblin',
        image: 'images/slime.png',
        dropChance: 1.0,
        lootTable: [ITEMS.SWORD, ITEMS.BELT]
    },
    BAT: {
        name: 'Bat',
        image: 'images/slime.png',
        dropChance: 1.0,
        lootTable: [ITEMS.RING, ITEMS.NECKLACE]
    },
    SKELETON: {
        name: 'Skeleton',
        image: 'images/slime.png',
        dropChance: 1.5,
        lootTable: [ITEMS.SHIELD, ITEMS.HELMET]
    },
    ZOMBIE: {
        name: 'Zombie',
        image: 'images/slime.png',
        dropChance: 1.5,
        lootTable: [ITEMS.SWORD, ITEMS.PLATELEGS]
    },
    ORC: {
        name: 'Orc',
        image: 'images/slime.png',
        dropChance: 2.0,
        lootTable: [ITEMS.SWORD, ITEMS.PLATEBODY]
    },
    DUNGEON_GUARDIAN: {
        name: 'Dungeon Guardian',
        image: 'images/boss.png',
        dropChance: 100,
        lootTable: [ITEMS.SWORD, ITEMS.SHIELD, ITEMS.HELMET, ITEMS.PLATEBODY, ITEMS.PLATELEGS]
    },
    ARCHDEMON_OVERLORD: {
        name: 'Archdemon Overlord',
        image: 'images/bigboss.png',
        dropChance: 100,
        lootTable: [ITEMS.SWORD, ITEMS.SHIELD, ITEMS.HELMET, ITEMS.PLATEBODY, ITEMS.PLATELEGS, ITEMS.RING, ITEMS.NECKLACE, ITEMS.BELT]
    }
};