// --- START OF FILE utils.js ---

import { REALMS } from './data/realms.js';

export const INVENTORY_GRID = {
    WIDTH: 8,
    HEIGHT: 1000
};

/**
 * Checks if a proposed area in the grid is occupied by any existing items.
 * This is a helper function for findEmptySpot and is not exported.
 * @param {number} x - The starting column (0-indexed).
 * @param {number} y - The starting row (0-indexed).
 * @param {number} width - The width of the area to check.
 * @param {number} height - The height of the area to check.
 * @param {Array<object>} inventory - The player's inventory array.
 * @returns {boolean} True if any part of the area is occupied, false otherwise.
 */
function isOccupied(x, y, width, height, inventory) {
    // Check if the item goes out of the grid's right boundary
    if (x + width > INVENTORY_GRID.WIDTH) {
        return true;
    }

    // Check for collision with every other item in the inventory
    for (const item of inventory) {
        if (
            item.x < x + width &&
            item.x + item.width > x &&
            item.y < y + height &&
            item.y + item.height > y
        ) {
            return true; // Collision detected
        }
    }

    return false; // No collision
}

/**
 * Finds the first available empty spot in the inventory grid for an item of a given size.
 * @param {number} itemWidth - The width of the item to place.
 * @param {number} itemHeight - The height of the item to place.
 * @param {Array<object>} inventory - The player's current inventory array.
 * @returns {{x: number, y: number}|null} The coordinates of the top-left corner of the empty spot, or null if no spot is found.
 */
export function findEmptySpot(itemWidth, itemHeight, inventory) {
    // Iterate through each cell of the grid as a potential top-left corner
    for (let y = 0; y < INVENTORY_GRID.HEIGHT; y++) {
        for (let x = 0; x <= INVENTORY_GRID.WIDTH - itemWidth; x++) {
            // Check if this spot is free
            if (!isOccupied(x, y, itemWidth, itemHeight, inventory)) {
                return { x, y }; // Found a spot
            }
        }
    }
    return null; // No spot found in the entire grid
}


/**
 * Prepends a message to the game log element and auto-scrolls if appropriate.
 * @param {HTMLElement} gameLogEl - The game log container element.
 * @param {string} message - The HTML string message to log.
 * @param {string} [className=''] - An optional CSS class for the message paragraph.
 */
export function logMessage(gameLogEl, message, className = '') {
    // Check if the user is scrolled to the bottom before adding the new message.
    // In a reversed flex-column, being "at the bottom" means scrollTop is 0.
    const isScrolledToBottom = gameLogEl.scrollTop === 0;

    const p = document.createElement('p');
    p.innerHTML = message;
    if (className) p.classList.add(className);
    gameLogEl.prepend(p);

    // If they were at the bottom, automatically scroll to the new message.
    if (isScrolledToBottom) {
        gameLogEl.scrollTop = 0;
    }

    // Keep the log to a fixed length by removing the oldest message if the limit is exceeded.
    if (gameLogEl.children.length > 50) { // Increased history from 30 to 50
        gameLogEl.removeChild(gameLogEl.lastChild);
    }
}

const numberAbbreviations = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

/**
 * Formats a number into a shorter, more readable string (e.g., 1,234,567 -> "1.23M").
 * @param {number} num - The number to format.
 * @returns {string} The formatted number string.
 */
export function formatNumber(num) {
    if (num < 1000) {
        return Math.floor(num).toString();
    }
    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
    if (tier === 0 || tier > numberAbbreviations.length) {
        return num.toExponential(2);
    }
    const suffix = numberAbbreviations[tier - 1];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
    return scaled.toFixed(2) + suffix;
}

/**
 * Checks if a given level is a mini-boss level (every 25, but not 50 or 100).
 * @param {number} level - The level to check.
 * @returns {boolean}
 */
export function isMiniBossLevel(level) {
    return level > 0 && level % 25 === 0 && level % 50 !== 0;
}

/**
 * Checks if a given level is a mid-zone boss level (every 50, but not 100).
 * @param {number} level - The level to check.
 * @returns {boolean}
 */
export function isBossLevel(level) {
    return level > 0 && level % 50 === 0 && level % 100 !== 0;
}

/**
 * Checks if a given level is a major realm boss level (every 100).
 * @param {number} level - The level to check.
 * @returns {boolean}
 */
export function isBigBossLevel(level) {
    return level > 0 && level % 100 === 0;
}


/**
 * Calculates the experience required to reach the next level.
 * @param {number} level - The current level.
 * @returns {number} The XP required for the next level.
 */
export function getXpForNextLevel(level) {
    return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calculates the cost of a specific gold upgrade.
 * @param {string} upgradeType - The type of upgrade ('clickDamage' or 'dps').
 * @param {number} level - The current level of the upgrade.
 * @returns {number} The cost of the next upgrade level.
 */
export function getUpgradeCost(upgradeType, level) {
    if (upgradeType === 'clickDamage') {
        return Math.floor(10 * Math.pow(1.15, level));
    }
    if (upgradeType === 'dps') {
        return Math.floor(25 * Math.pow(1.18, level));
    }
    return Infinity;
}

/**
 * Finds the sub-zone data for a given level.
 * @param {number} level - The level to find the sub-zone for.
 * @returns {object|null} The sub-zone object or null if not found.
 */
export function findSubZoneByLevel(level) {
    for (const realm of REALMS) {
        for (const zoneId in realm.zones) {
            for (const subZoneId in realm.zones[zoneId].subZones) {
                const subZone = realm.zones[zoneId].subZones[subZoneId];
                if (level >= subZone.levelRange[0] && level <= subZone.levelRange[1]) {
                    return subZone;
                }
            }
        }
    }
    return null;
}

/**
 * Finds the first level of a given zone.
 * @param {object} zone - The zone object from REALMS data.
 * @returns {number} The starting level of the zone.
 */
export function findFirstLevelOfZone(zone) {
    let firstLevel = Infinity;
    for (const subZoneId in zone.subZones) {
        if (zone.subZones[subZoneId].levelRange[0] < firstLevel) {
            firstLevel = zone.subZones[subZoneId].levelRange[0];
        }
    }
    return firstLevel;
}

/**
 * Calculates the total stats of an item, including its gems.
 * @param {object} item The item object.
 * @returns {Object<string, number>} An object containing the combined stats.
 */
export function getCombinedItemStats(item) {
    if (!item) return {};
    const combinedStats = { ...(item.stats || {}) };

    if (item.sockets) {
        for (const gem of item.sockets) {
            if (gem && gem.stats) {
                for (const statKey in gem.stats) {
                    combinedStats[statKey] = (combinedStats[statKey] || 0) + gem.stats[statKey];
                }
            }
        }
    }
    return combinedStats;
}