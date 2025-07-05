// --- START OF FILE utils.js ---

import { REALMS } from './data/realms.js';

export const INVENTORY_GRID = {
    WIDTH: 8,
    HEIGHT: 1000
};

/**
 * Finds the first available empty spot in the inventory grid for an item of a given size.
 * This is the new, performant version of the function.
 * @param {number} itemWidth - The width of the item to place.
 * @param {number} itemHeight - The height of the item to place.
 * @param {Array<object>} inventory - The player's current inventory array.
 * @returns {{x: number, y: number}|null} The coordinates of the top-left corner of the empty spot, or null if no spot is found.
 */
export function findEmptySpot(itemWidth, itemHeight, inventory) {
    if (inventory.length === 0) {
        return { x: 0, y: 0 };
    }

    // Determine the max search height needed. No need to scan all 1000 rows.
    let max_y = 0;
    for (const item of inventory) {
        max_y = Math.max(max_y, item.y + item.height);
    }
    const searchHeight = max_y + itemHeight;

    // Create a 2D boolean map of the grid to mark occupied cells.
    const gridMap = Array.from({ length: searchHeight }, () => Array(INVENTORY_GRID.WIDTH).fill(false));

    // Mark all cells that are already occupied by existing items.
    for (const item of inventory) {
        // Ensure the item has valid coordinates before trying to map it.
        if (typeof item.x === 'number' && typeof item.y === 'number' && item.x >= 0 && item.y >= 0) {
            for (let i = item.y; i < item.y + item.height; i++) {
                for (let j = item.x; j < item.x + item.width; j++) {
                    if (i < searchHeight && j < INVENTORY_GRID.WIDTH) {
                        gridMap[i][j] = true;
                    }
                }
            }
        }
    }

    // Now, iterate through the grid map to find an empty rectangle of the required size.
    for (let y = 0; y < searchHeight; y++) {
        for (let x = 0; x <= INVENTORY_GRID.WIDTH - itemWidth; x++) {
            let isFound = true;
            // Check if the area for the new item is free.
            for (let i = y; i < y + itemHeight; i++) {
                for (let j = x; j < x + itemWidth; j++) {
                    // If we're out of bounds or the cell is taken, this spot is invalid.
                    if (i >= searchHeight || j >= INVENTORY_GRID.WIDTH || gridMap[i][j]) {
                        isFound = false;
                        break;
                    }
                }
                if (!isFound) break;
            }

            if (isFound) {
                return { x, y }; // Found a spot.
            }
        }
    }

    return null; // No spot found.
}


/**
 * --- FIX: This function now correctly calls the performant findEmptySpot. ---
 * This provides a more natural drop behavior than the old, slow method.
 * @param {number} itemWidth The width of the item.
 * @param {number} itemHeight The height of the item.
 * @param {Array<object>} inventory The current inventory array.
 * @returns {{x: number, y: number}|null} The coordinates for the new spot.
 */
export function findNextAvailableSpot(itemWidth, itemHeight, inventory) {
    // We now just call the new, performant version of findEmptySpot.
    // This is ideal for appending items to the grid efficiently.
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
 * Calculates the total stats of an item, including its gems..
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