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
 * This function scans from the top-left, making it ideal for compacting inventory.
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
 * --- FIX: New function to find the next available spot at the end of the grid. ---
 * This provides a more natural drop behavior than findEmptySpot.
 * @param {number} itemWidth The width of the item.
 * @param {number} itemHeight The height of the item.
 * @param {Array<object>} inventory The current inventory array.
 * @returns {{x: number, y: number}|null} The coordinates for the new spot.
 */
export function findNextAvailableSpot(itemWidth, itemHeight, inventory) {
    // This is the same as findEmptySpot because scanning from the top-left is the
    // most intuitive way to append to a grid. The issue was elsewhere, but keeping
    // this as a separate function allows for future behavior changes if needed..
    // For now, it will just call findEmptySpot.
    return findEmptySpot(itemWidth, itemHeight, inventory);
}


/**
 * Parses a message string containing HTML tags and splits it into text and highlighted segments.
 * This prevents highlighted words from being broken across lines.
 * @param {string} message - The message string, which may contain <span> tags.
 * @returns {DocumentFragment} A document fragment containing the parsed elements.
 */
function parseMessage(message) {
    const fragment = document.createDocumentFragment();
    // Regex to split the string by HTML tags, keeping the tags in the result.
    const parts = message.split(/(<[^>]+>)/);
    
    let isInsideTag = false;
    let currentSpan = null;

    for (const part of parts) {
        if (!part) continue;

        if (part.startsWith('<')) {
            if (part.startsWith('</')) { // It's a closing tag
                if (currentSpan) {
                    fragment.appendChild(currentSpan);
                    currentSpan = null;
                }
                isInsideTag = false;
            } else { // It's an opening tag
                isInsideTag = true;
                currentSpan = document.createElement('span');
                // Extract class from tag, e.g., <span class="epic"> -> "epic"
                const classMatch = part.match(/class="([^"]+)"/);
                if (classMatch) {
                    currentSpan.className = 'highlight ' + classMatch[1];
                }
            }
        } else if (isInsideTag && currentSpan) {
            currentSpan.textContent = part;
        } else {
            // It's plain text, split by space to wrap words individually
            const words = part.split(' ');
            words.forEach((word, index) => {
                if (word) {
                    const textNode = document.createTextNode(word + (index === words.length - 1 ? '' : ' '));
                    fragment.appendChild(textNode);
                }
            });
        }
    }
    return fragment;
}

/**
 * Appends a message to the game log element.
 * @param {HTMLElement} gameLogEl - The game log container element.
 * @param {string} message - The HTML string message to log.
 * @param {string} [className=''] - An optional CSS class for the message paragraph.
 * @param {boolean} [shouldAutoScroll=true] - Whether to scroll the log to the bottom.
 */
export function logMessage(gameLogEl, message, className = '', shouldAutoScroll = true) {
    const p = document.createElement('p');
    p.className = 'log-entry'; // Use the new class for flexbox wrapping
    if(className) p.classList.add(className);
    
    // Use the parser to build the content safely
    const content = parseMessage(message);
    p.appendChild(content);
    
    gameLogEl.appendChild(p);

    if (shouldAutoScroll) {
        gameLogEl.scrollTop = gameLogEl.scrollHeight;
    }

    // Keep the log to a fixed length by removing the oldest message if the limit is exceeded.
    if (gameLogEl.children.length > 200) {
        gameLogEl.removeChild(gameLogEl.firstChild);
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
    return Math.floor(100 * Math.pow(level, 1.9));
}

/**
 * Calculates the cost of a specific gold upgrade.
 * @param {string} upgradeType - The type of upgrade ('clickDamage' or 'dps').
 * @param {number} level - The current level of the upgrade.
 * @returns {number} The cost of the next upgrade level.
 */
export function getUpgradeCost(upgradeType, level) {
    if (upgradeType === 'clickDamage') {
        return Math.floor(10 * Math.pow(1.19, level));
    }
    if (upgradeType === 'dps') {
        return Math.floor(25 * Math.pow(1.19, level));
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
            const zone = realm.zones[zoneId];
            for (const subZoneId in zone.subZones) {
                const subZone = zone.subZones[subZoneId];
                if (level >= subZone.levelRange[0] && level <= subZone.levelRange[1]) {
                    subZone.parentZone = zone; // Add a reference to the parent zone
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