// --- START OF FILE ui.js ---

import { STATS } from './data/stat_pools.js';
import { getXpForNextLevel, getUpgradeCost, formatNumber, findSubZoneByLevel, getCombinedItemStats, findEmptySpot, findFirstLevelOfZone } from './utils.js';
import { ITEMS } from './data/items.js';
import { GEMS } from './data/gems.js';
import { MONSTERS } from './data/monsters.js';
import { UNIQUE_EFFECTS } from './data/unique_effects.js';
import * as player from './player_actions.js';
import { REALMS } from './data/realms.js';
import { PERMANENT_UPGRADES } from './data/upgrades.js';

/** @typedef {Object<string, HTMLElement|HTMLButtonElement|HTMLInputElement|HTMLImageElement|HTMLSelectElement>} DOMElements */

// --- START OF FIX: Define the canonical display order for stats ---
const STAT_DISPLAY_ORDER = [
    STATS.CLICK_DAMAGE.key,
    STATS.DPS.key,
    STATS.GOLD_GAIN.key,
    STATS.MAGIC_FIND.key,
];
// --- END OF FIX ---

/**
 * Checks if a dropped item should be considered a "boss unique".
 * This is now based on the `isUnique` flag in the item's definition and if it drops from only one boss.
 * @param {string} itemId The base ID of the item or gem to check.
 * @returns {boolean} True if the item is a unique boss drop, false otherwise.
 */
function isBossUnique(itemId) {
    const itemBase = ITEMS[itemId] || Object.values(GEMS).find(g => g.id === itemId);
    if (!itemBase || !itemBase.isUnique) {
        return false;
    }

    let dropCount = 0;
    let fromBoss = false;

    for (const monsterKey in MONSTERS) {
        const monster = MONSTERS[monsterKey];
        if (monster.lootTable && monster.lootTable.some(loot => loot.item.id === itemId)) {
            dropCount++;
            if (monster.isBoss) {
                fromBoss = true;
            }
        }
        if (dropCount > 1) {
            return false;
        }
    }
    return dropCount === 1 && fromBoss;
}


/**
 * Gathers all necessary DOM elements from the page.
 */
export function initDOMElements() {
    return {
        saveIndicatorEl: document.getElementById('save-indicator'),
        goldStatEl: document.getElementById('gold-stat'),
        scrapStatEl: document.getElementById('scrap-stat'),
        upgradeClickCostEl: document.getElementById('upgrade-click-cost'),
        upgradeDpsCostEl: document.getElementById('upgrade-dps-cost'),
        upgradeClickLevelEl: document.getElementById('upgrade-click-level'),
        upgradeDpsLevelEl: document.getElementById('upgrade-dps-level'),
        monsterNameEl: document.getElementById('monster-name'),
        currentLevelEl: document.getElementById('current-level'),
        monsterHealthBarEl: document.getElementById('monster-health-bar'),
        monsterHealthTextEl: document.getElementById('monster-health-text'),
        monsterAreaEl: document.getElementById('monster-area'),
        inventorySlotsEl: document.getElementById('inventory-slots'),
        gameLogEl: document.getElementById('game-log'),
        scrollToBottomBtn: document.getElementById('scroll-to-bottom-btn'),
        prestigeButton: document.getElementById('prestige-button'),
        monsterImageEl: document.getElementById('monster-image'),
        popupContainerEl: document.getElementById('popup-container'),
        tooltipEl: document.getElementById('item-tooltip'),
        heroLevelEl: document.getElementById('hero-level'),
        heroXpBarEl: document.getElementById('hero-xp-bar'),
        heroXpTextEl: document.getElementById('hero-xp-text'),
        attributePointsEl: document.getElementById('attribute-points'),
        attrStrengthEl: document.getElementById('attr-strength'),
        attrAgilityEl: document.getElementById('attr-agility'),
        attrLuckEl: document.getElementById('attr-luck'),
        addStrengthBtn: document.getElementById('add-strength-btn'),
        addAgilityBtn: document.getElementById('add-agility-btn'),
        addLuckBtn: document.getElementById('add-luck-btn'),
        clickDamageStatEl: document.getElementById('click-damage-stat'),
        dpsStatEl: document.getElementById('dps-stat'),
        bonusGoldStatEl: document.getElementById('bonus-gold-stat'),
        magicFindStatEl: document.getElementById('magic-find-stat'),
        lootMonsterNameEl: document.getElementById('loot-monster-name'),
        lootTableDisplayEl: document.getElementById('loot-table-display'),
        statTooltipEl: document.getElementById('stat-tooltip'),
        prestigeCountStatEl: document.getElementById('prestige-count-stat'),
        absorbedStatsListEl: document.getElementById('absorbed-stats-list'),
        prestigeRequirementTextEl: document.getElementById('prestige-requirement-text'),
        mapAccordionContainerEl: document.getElementById('map-accordion-container'),
        autoProgressToggleEl: document.getElementById('auto-progress-toggle'),
        modalBackdropEl: document.getElementById('modal-backdrop'),
        modalContentEl: document.getElementById('modal-content'),
        modalTitleEl: document.getElementById('modal-title'),
        modalBodyEl: document.getElementById('modal-body'),
        modalCloseBtnEl: document.getElementById('modal-close-btn'),
        gemSlotsEl: document.getElementById('gem-slots'),
        gemSortSelect: document.getElementById('gem-sort-select'),
        gemCraftingSlotsContainer: document.getElementById('gem-crafting-slots'),
        gemCraftBtn: document.getElementById('gem-craft-btn'),
        forgeInventorySlotsEl: document.getElementById('forge-inventory-slots'),
        forgeSelectedItemEl: document.getElementById('forge-selected-item'),
        forgeRerollBtn: document.getElementById('forge-reroll-btn'),
        offlineProgressModalBackdrop: document.getElementById('offline-progress-modal-backdrop'),
        offlineProgressCloseBtn: document.getElementById('offline-progress-close-btn'),
        offlineTime: document.getElementById('offline-time'),
        offlineGold: document.getElementById('offline-gold'),
        offlineXp: document.getElementById('offline-xp'),
        offlineScrap: document.getElementById('offline-scrap'),
        offlineRewards: document.getElementById('offline-rewards'),
        ringSelectionModalBackdrop: document.getElementById('ring-selection-modal-backdrop'),
        ringSelectionSlot1: document.getElementById('ring-selection-slot1'),
        ringSelectionSlot2: document.getElementById('ring-selection-slot2'),
        ringSelectionCancelBtn: document.getElementById('ring-selection-cancel-btn'),
        permanentUpgradesContainerEl: document.getElementById('permanent-upgrades-container'),
        bulkCombineTierSelect: document.getElementById('bulk-combine-tier-select'),
        bulkCombineStatSelect: document.getElementById('bulk-combine-stat-select'),
        bulkCombineBtn: document.getElementById('bulk-combine-btn'),
        prestigeView: document.getElementById('prestige-view'),
        prestigeEquipmentPaperdoll: document.getElementById('prestige-equipment-paperdoll'),
        prestigeInventoryDisplay: document.getElementById('prestige-inventory-display'),
        confirmPrestigeButton: document.getElementById('confirm-prestige-btn'),
        cancelPrestigeButton: document.getElementById('cancel-prestige-btn'),
        prestigeSelectionCount: document.getElementById('prestige-selection-count'),
        prestigeSelectionMax: document.getElementById('prestige-selection-max'),
        unlockSlotModalBackdrop: document.getElementById('unlock-slot-modal-backdrop'),
        unlockSlotPaperdoll: document.getElementById('unlock-slot-paperdoll'),
        unlockSlotCancelBtn: document.getElementById('unlock-slot-cancel-btn'),
        goldenSlimeStreakEl: document.getElementById('golden-slime-streak'),
        goldenSlimeRecordsEl: document.getElementById('golden-slime-records'),
        maxStreakStatEl: document.getElementById('max-streak-stat'),
        maxGoldStatEl: document.getElementById('max-gold-stat'),
        viewPrestigeSlotsBtn: document.getElementById('view-prestige-slots-btn'),
        viewSlotsModalBackdrop: document.getElementById('view-slots-modal-backdrop'),
        viewSlotsPaperdoll: document.getElementById('view-slots-paperdoll'),
        viewSlotsCloseBtn: document.getElementById('view-slots-close-btn'),
        wikiView: document.getElementById('wiki-view'),
        wikiControls: document.getElementById('wiki-controls'),
        wikiSearchInput: document.getElementById('wiki-search-input'),
        wikiTypeFilter: document.getElementById('wiki-type-filter'),
        wikiSocketsFilter: document.getElementById('wiki-sockets-filter'),
        wikiStatsFilterContainer: document.getElementById('wiki-stats-filter-container'),
        wikiResetFiltersBtn: document.getElementById('wiki-reset-filters-btn'),
        wikiResultsContainer: document.getElementById('wiki-results-container'),
        wikiShowFavoritesBtn: document.getElementById('wiki-show-favorites-btn'),
        wikiDevToolBtn: document.getElementById('wiki-dev-tool-btn'),
        devToolModalBackdrop: document.getElementById('dev-tool-modal-backdrop'),
        devToolMissingImagesList: document.getElementById('dev-tool-missing-images-list'),
        devToolOrphanedItemsList: document.getElementById('dev-tool-orphaned-items-list'),
        devToolCloseBtn: document.getElementById('dev-tool-close-btn'),
    };
}

/**
 * Gathers DOM elements specific to the Salvage Filter.
 */
export function initSalvageFilterDOMElements() {
    return {
        enableSalvageFilter: document.getElementById('enable-salvage-filter'),
        enableGemSalvage: document.getElementById('enable-gem-salvage'),
        salvageFilterControls: document.getElementById('salvage-filter-controls'),
        filterKeepRarity: document.getElementById('filter-keep-rarity'),
        filterKeepSockets: document.getElementById('filter-keep-sockets'),
        filterKeepStatsContainer: document.getElementById('filter-keep-stats-container')
    };
}

/**
 * Populates the salvage filter controls with the correct options and sets their initial values.
 * @param {DOMElements} elements - The main DOM elements object.
 * @param {object} gameState - The current game state.
 */
export function populateSalvageFilter(elements, gameState) {
    const { filterKeepStatsContainer } = initSalvageFilterDOMElements();
    if (!filterKeepStatsContainer) return;
    
    filterKeepStatsContainer.innerHTML = '';
    
    const allPossibleStats = new Set();
    for(const key in ITEMS) {
        const itemBase = ITEMS[key];
        itemBase.possibleStats.forEach(stat => allPossibleStats.add(stat.key));
    }
    
    Array.from(allPossibleStats).sort().forEach(statKey => {
        const stat = Object.values(STATS).find(s => s.key === statKey);
        if (stat) {
            const wrapper = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `filter-stat-${stat.key}`;
            checkbox.dataset.statKey = stat.key;
            checkbox.checked = gameState.salvageFilter.keepStats[stat.key] || false;
            
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = stat.name;
            
            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            filterKeepStatsContainer.appendChild(wrapper);
        }
    });
}

/**
 * Populates the gem sorting dropdown with relevant options.
 * @param {DOMElements} elements
 * @param {object[]} gems The array of gems from the game state.
 * @param {string} currentSort The currently active sort key.
 */
export function populateGemSortOptions(elements, gems, currentSort) {
    const selectEl = /** @type {HTMLSelectElement} */ (elements.gemSortSelect);
    if (!selectEl) return;

    // Keep track of what was selected
    const previousValue = selectEl.value || currentSort;
    selectEl.innerHTML = ''; // Clear existing options

    // --- Static options ---
    const defaultOptions = {
        'tier_desc': 'Tier (High -> Low)',
        'tier_asc': 'Tier (Low -> High)',
    };
    for (const [value, text] of Object.entries(defaultOptions)) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        selectEl.appendChild(option);
    }
    
    // --- Dynamic options based on stats ---
    const availableStats = new Set();
    const hasSynergy = gems.some(gem => gem.synergy);

    gems.forEach(gem => {
        if (gem.stats) {
            Object.keys(gem.stats).forEach(statKey => availableStats.add(statKey));
        }
    });

    Array.from(availableStats).sort().forEach(statKey => {
        const statInfo = STATS[Object.keys(STATS).find(k => STATS[k].key === statKey)];
        if (statInfo) {
            const option = document.createElement('option');
            option.value = statKey;
            option.textContent = `Stat: ${statInfo.name}`;
            selectEl.appendChild(option);
        }
    });

    if (hasSynergy) {
        const option = document.createElement('option');
        option.value = 'synergy';
        option.textContent = 'Stat: Synergy';
        selectEl.appendChild(option);
    }

    // Restore previous selection if it still exists
    selectEl.value = previousValue;
    if (selectEl.selectedIndex === -1) {
        // If the old selection is gone (e.g., last gem with that stat was crafted), default to tier sort
        selectEl.value = 'tier_desc';
    }
}


/**
 * Renders a list of items or gems into a grid container. This is a full re-render.
 * @param {HTMLElement} containerEl - The grid container element.
 * @param {Array<object>} items - The array of items or gems to render.
 * @param {object} options - Configuration options.
 */
export function renderGrid(containerEl, items, options = {}) {
    const { calculatePositions = false, type = 'item', selectedItem = null, salvageSelections = [], showLockIcon = true, bulkCombineSelection = {}, bulkCombineDeselectedIds = new Set(), selectedGemId = null } = options;
    
    containerEl.innerHTML = '';
    const tempPlacement = []; 
    let maxRow = 0;

    for (const item of items) {
        const wrapper = document.createElement('div');
        wrapper.className = type === 'gem' ? 'gem-wrapper' : 'item-wrapper';
        
        const id = type === 'gem' ? item.id : item.id;
        wrapper.dataset.id = String(id);
        
        let pos;
        if (calculatePositions) {
            pos = findEmptySpot(item.width, item.height, tempPlacement);
            if (pos) {
                // Update the item's position in the main state array if it's being calculated
                item.x = pos.x;
                item.y = pos.y;
                tempPlacement.push({ ...item });
            }
        } else {
            pos = { x: item.x, y: item.y };
        }

        if (pos && pos.x !== -1 && pos.x !== undefined) {
            wrapper.style.gridColumn = `${pos.x + 1} / span ${item.width}`;
            wrapper.style.gridRow = `${pos.y + 1} / span ${item.height}`;
            
            const currentMaxRow = pos.y + item.height;
            if (currentMaxRow > maxRow) {
                maxRow = currentMaxRow;
            }

            wrapper.innerHTML = type === 'gem' ? createGemHTML(item) : createItemHTML(item, showLockIcon);
            
            if (item.locked) wrapper.classList.add('locked-item');
            if (type === 'gem' && selectedGemId && item.id === selectedGemId) {
                wrapper.classList.add('selected-gem');
            }
            if (selectedItem && selectedItem.id === item.id) wrapper.classList.add('selected-for-forge');
            if (salvageSelections.some(sel => sel.id === item.id)) wrapper.classList.add('selected-for-salvage');

            if (type === 'gem' && bulkCombineSelection && bulkCombineSelection.tier && bulkCombineSelection.selectionKey) {
                const isSynergyCombine = bulkCombineSelection.selectionKey.startsWith('synergy_');
                let isMatch = false;
                if (isSynergyCombine) {
                    const synergyKey = bulkCombineSelection.selectionKey.replace('synergy_', '');
                    isMatch = item.synergy && `${item.synergy.source}_to_${item.synergy.target}` === synergyKey;
                } else {
                    isMatch = item.stats && item.stats[bulkCombineSelection.selectionKey];
                }

                if (item.tier === bulkCombineSelection.tier && isMatch && !bulkCombineDeselectedIds.has(item.id)) {
                    wrapper.classList.add('selected-for-bulk-combine');
                }
            }
            
            containerEl.appendChild(wrapper);
        }
    }
    containerEl.style.gridTemplateRows = `repeat(${Math.max(10, maxRow)}, var(--grid-cell-size))`;
}

// --- START PERFORMANCE FIX: GRANULAR UI UPDATERS ---

/**
 * Updates only the currency display in the DOM.
 * @param {DOMElements} elements The object containing all DOM elements.
 * @param {object} gameState The current game state.
 */
export function updateCurrency(elements, gameState) {
    const { goldStatEl, scrapStatEl } = elements;
    
    const getNumberTier = (amount) => {
        if (amount < 1e3) return 0; if (amount < 1e6) return 1; if (amount < 1e9) return 2;
        if (amount < 1e12) return 3; if (amount < 1e15) return 4; if (amount < 1e18) return 5;
        return 6;
    };
    
    const goldTier = getNumberTier(gameState.gold);
    const scrapTier = getNumberTier(gameState.scrap);
    goldStatEl.className = `currency-tier-${goldTier}`;
    scrapStatEl.className = `currency-tier-${scrapTier}`;
    goldStatEl.textContent = formatNumber(gameState.gold);
    scrapStatEl.textContent = formatNumber(gameState.scrap);
}

/**
 * Updates only the Hero Info panel (level, XP, attributes).
 * @param {DOMElements} elements The object containing all DOM elements.
 * @param {object} gameState The current game state.
 */
export function updateHeroPanel(elements, gameState) {
    const {
        heroLevelEl, heroXpTextEl, heroXpBarEl, attributePointsEl,
        attrStrengthEl, attrAgilityEl, attrLuckEl,
        addStrengthBtn, addAgilityBtn, addLuckBtn
    } = elements;

    const xpToNextLevel = getXpForNextLevel(gameState.hero.level);
    heroLevelEl.textContent = gameState.hero.level.toString();
    heroXpTextEl.textContent = `${formatNumber(gameState.hero.xp)} / ${formatNumber(xpToNextLevel)}`;
    heroXpBarEl.style.width = `${(gameState.hero.xp / xpToNextLevel) * 100}%`;
    attributePointsEl.textContent = gameState.hero.attributePoints.toString();
    attrStrengthEl.textContent = gameState.hero.attributes.strength.toString();
    attrAgilityEl.textContent = gameState.hero.attributes.agility.toString();
    attrLuckEl.textContent = gameState.hero.attributes.luck.toString();

    const havePoints = gameState.hero.attributePoints > 0;
    (/** @type {HTMLButtonElement} */ (addStrengthBtn)).disabled = !havePoints;
    (/** @type {HTMLButtonElement} */ (addAgilityBtn)).disabled = !havePoints;
    (/** @type {HTMLButtonElement} */ (addLuckBtn)).disabled = !havePoints;
}

/**
 * Updates only the derived stats panel (Click Dmg, DPS, etc.).
 * @param {DOMElements} elements The object containing all DOM elements.
 * @param {object} playerStats The calculated player stats.
 */
export function updateStatsPanel(elements, playerStats) {
    const { clickDamageStatEl, dpsStatEl, bonusGoldStatEl, magicFindStatEl } = elements;
    
    const getNumberTier = (amount) => {
        if (amount < 1e3) return 0; if (amount < 1e6) return 1; if (amount < 1e9) return 2;
        if (amount < 1e12) return 3; if (amount < 1e15) return 4; if (amount < 1e18) return 5;
        return 6;
    };
    
    const dpsTier = getNumberTier(playerStats.totalDps);
    const clickTier = getNumberTier(playerStats.totalClickDamage);
    dpsStatEl.className = `currency-tier-${dpsTier}`;
    clickDamageStatEl.className = `currency-tier-${clickTier}`;
    
    clickDamageStatEl.textContent = formatNumber(playerStats.totalClickDamage);
    dpsStatEl.textContent = formatNumber(playerStats.totalDps);
    bonusGoldStatEl.textContent = playerStats.bonusGold.toFixed(1);
    magicFindStatEl.textContent = playerStats.magicFind.toFixed(1);
}

/**
 * Updates only the gold upgrades panel.
 * @param {DOMElements} elements The object containing all DOM elements.
 * @param {object} gameState The current game state.
 */
export function updateUpgrades(elements, gameState) {
    const { upgradeClickCostEl, upgradeDpsCostEl, upgradeClickLevelEl, upgradeDpsLevelEl } = elements;
    
    const clickCost = getUpgradeCost('clickDamage', gameState.upgrades.clickDamage);
    const dpsCost = getUpgradeCost('dps', gameState.upgrades.dps);
    
    upgradeClickCostEl.textContent = formatNumber(clickCost);
    upgradeDpsCostEl.textContent = formatNumber(dpsCost);
    upgradeClickLevelEl.textContent = `Lvl ${gameState.upgrades.clickDamage}`;
    upgradeDpsLevelEl.textContent = `Lvl ${gameState.upgrades.dps}`;
    
    document.getElementById('upgrade-click-damage').classList.toggle('disabled', gameState.gold < clickCost);
    document.getElementById('upgrade-dps').classList.toggle('disabled', gameState.gold < dpsCost);
    (/** @type {HTMLButtonElement} */ (document.getElementById('buy-loot-crate-btn'))).disabled = gameState.scrap < 50;
}

/**
 * Updates the monster display (name, image, health, background).
 * @param {DOMElements} elements The object containing all DOM elements.
 * @param {object} gameState The current game state.
 * @param {object} currentMonster The current monster object.
 */
export function updateMonsterUI(elements, gameState, currentMonster) {
    const { monsterImageEl, monsterNameEl, currentLevelEl, monsterAreaEl, goldenSlimeStreakEl, goldenSlimeRecordsEl, maxStreakStatEl, maxGoldStatEl } = elements;
    
    if (monsterImageEl instanceof HTMLImageElement) {
        monsterImageEl.src = currentMonster.data.image;
    }
    monsterImageEl.classList.toggle('boss-image', !!currentMonster.data.isBoss);
    monsterNameEl.textContent = currentMonster.name;
    
    const isSpecialMonster = currentMonster?.data.isSpecial;
    currentLevelEl.textContent = isSpecialMonster ? '??' : gameState.currentFightingLevel.toString();
    
    const encounter = gameState.specialEncounter;
    if (encounter && encounter.type === 'GOLDEN_SLIME') {
        // Show current streak
        if (encounter.chainLevel > 1) {
            goldenSlimeStreakEl.classList.remove('hidden', 'streak-fade-out');
            const span = goldenSlimeStreakEl.querySelector('span');
            if (span) span.textContent = `x${encounter.chainLevel}`;
        } else {
            goldenSlimeStreakEl.classList.add('hidden');
        }
        
        // Show records
        const streakRecords = gameState.goldenSlimeStreak;
        if (streakRecords && streakRecords.max > 0) {
            goldenSlimeRecordsEl.classList.remove('hidden');
            maxStreakStatEl.textContent = streakRecords.max.toString();
            maxGoldStatEl.textContent = formatNumber(streakRecords.maxGold);
        } else {
            goldenSlimeRecordsEl.classList.add('hidden');
        }
    } else {
        // Hide both if not a golden slime
        goldenSlimeRecordsEl.classList.add('hidden');
        if (!goldenSlimeStreakEl.classList.contains('hidden') && !goldenSlimeStreakEl.classList.contains('streak-fade-out')) {
            goldenSlimeStreakEl.classList.add('streak-fade-out');
            setTimeout(() => {
                goldenSlimeStreakEl.classList.add('hidden');
                goldenSlimeStreakEl.classList.remove('streak-fade-out');
            }, 2000);
        }
    }

    if (currentMonster.data.background) {
        monsterAreaEl.style.backgroundImage = `url('${currentMonster.data.background}')`;
    } else if (isSpecialMonster) {
        monsterAreaEl.style.backgroundImage = `url('images/backgrounds/bg_golden_slime.png')`;
    } else {
        const subZone = findSubZoneByLevel(gameState.currentFightingLevel);
        if (subZone && subZone.parentZone) {
            monsterAreaEl.style.backgroundImage = `url('${subZone.parentZone.monsterAreaBg}')`;
        } else {
            monsterAreaEl.style.backgroundImage = `url('${REALMS[0].zones.green_meadows.monsterAreaBg}')`;
        }
    }
    
    updateMonsterHealthBar(elements, gameState.monster);
}


/**
 * Updates only the monster health bar and text.
 * @param {DOMElements} elements The object containing all DOM elements.
 * @param {object} monsterState The monster part of the game state.
 */
export function updateMonsterHealthBar(elements, monsterState) {
    const { monsterHealthTextEl, monsterHealthBarEl } = elements;
    monsterHealthTextEl.textContent = `${formatNumber(Math.ceil(Math.max(0, monsterState.hp)))} / ${formatNumber(monsterState.maxHp)}`;
    const healthPercent = (monsterState.hp / monsterState.maxHp) * 100;
    monsterHealthBarEl.style.width = `${healthPercent}%`;
    if (healthPercent < 30) monsterHealthBarEl.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
    else if (healthPercent < 60) monsterHealthBarEl.style.background = 'linear-gradient(to right, #f39c12, #e67e22)';
    else monsterHealthBarEl.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';
}

/**
 * Updates the loot panel with the current monster's info.
 * @param {DOMElements} elements The object containing all DOM elements.
 * @param {object} currentMonster The current monster object.
 * @param {object} gameState The current game state.
 */
export function updateLootPanel(elements, currentMonster, gameState) {
    const { lootMonsterNameEl, lootTableDisplayEl } = elements;
    const monsterDef = currentMonster.data;
    if (!monsterDef) return;

    const monsterKey = Object.keys(MONSTERS).find(key => MONSTERS[key] === monsterDef);
    const killCount = (monsterKey && gameState.monsterKillCounts && gameState.monsterKillCounts[monsterKey]) ? gameState.monsterKillCounts[monsterKey] : 0;
    
    const getNumberTier = (amount) => {
        if (amount < 1e3) return 0; if (amount < 1e6) return 1; if (amount < 1e9) return 2;
        if (amount < 1e12) return 3; if (amount < 1e15) return 4; if (amount < 1e18) return 5;
        return 6;
    };
    const killCountTier = getNumberTier(killCount);

    lootMonsterNameEl.innerHTML = `${currentMonster.name} <span style="font-size: 0.7em; color: #bdc3c7;">(Kill Count: <span class="currency-tier-${killCountTier}">${formatNumber(killCount)}</span>)</span>`;
    
    lootTableDisplayEl.innerHTML = '';
    if (monsterDef.lootTable && monsterDef.lootTable.length > 0) {
        const totalWeight = monsterDef.lootTable.reduce((sum, entry) => sum + entry.weight, 0);
        monsterDef.lootTable.forEach((entry, index) => {
            const itemChance = (entry.weight / totalWeight) * monsterDef.dropChance;
            const entryDiv = document.createElement('div');
            entryDiv.className = 'loot-table-entry';
            entryDiv.dataset.lootIndex = index.toString();
            entryDiv.innerHTML = `<img src="${entry.item.icon}" class="loot-item-icon" alt="${entry.item.name}"><div class="loot-item-details"><div class="item-name">${entry.item.name}</div><div class="drop-chance">${itemChance.toFixed(2)}% chance</div></div>`;
            lootTableDisplayEl.appendChild(entryDiv);
        });
    } else {
        lootTableDisplayEl.innerHTML = '<p>This monster has no special drops.</p>';
    }
}


/**
 * Adds a single item or gem to its respective grid without redrawing the whole thing.
 * @param {HTMLElement} containerEl The grid container element.
 * @param {object} item The item or gem to add.
 * @param {string} type 'item' or 'gem'.
 */
export function addItemToGrid(containerEl, item, type = 'item') {
    const wrapper = document.createElement('div');
    wrapper.className = type === 'gem' ? 'gem-wrapper' : 'item-wrapper';
    wrapper.dataset.id = String(item.id);

    // This assumes the item has x, y properties already calculated.
    wrapper.style.gridColumn = `${item.x + 1} / span ${item.width}`;
    wrapper.style.gridRow = `${item.y + 1} / span ${item.height}`;
    
    wrapper.innerHTML = type === 'gem' ? createGemHTML(item) : createItemHTML(item, true);
    containerEl.appendChild(wrapper);

    const maxRow = item.y + item.height;
    const currentRows = parseInt(containerEl.style.gridTemplateRows.replace(/[^0-9]/g, ''), 10) || 0;
    if (maxRow > currentRows) {
        containerEl.style.gridTemplateRows = `repeat(${Math.max(10, maxRow)}, var(--grid-cell-size))`;
    }
}

/**
 * Removes a single item or gem from its grid.
 * @param {HTMLElement} containerEl The grid container element.
 * @param {string|number} itemId The ID of the item/gem to remove.
 */
export function removeItemFromGrid(containerEl, itemId) {
    const itemEl = containerEl.querySelector(`[data-id="${itemId}"]`);
    if (itemEl) {
        itemEl.remove();
    }
}

/**
 * Updates a single item's display in a grid (e.g., toggling lock or salvage selection).
 * @param {HTMLElement} containerEl The grid container element.
 * @param {object} item The item that was updated.
 * @param {object} [options={}]
 * @param {boolean} [options.forceRedraw=false] - If true, redraws the item's inner HTML.
 * @param {object[]} [options.salvageSelections=[]] - The current salvage selections.
 */
export function updateItemInGrid(containerEl, item, options = {}) {
    const { forceRedraw = false, salvageSelections = [] } = options;
    const itemEl = containerEl.querySelector(`.item-wrapper[data-id="${item.id}"]`);
    if (!itemEl) return;

    // Redraw the item's content if needed (e.g., after socketing a gem)
    if (forceRedraw) {
        itemEl.innerHTML = createItemHTML(item, true);
    }
    
    // Update lock state
    const lockIcon = itemEl.querySelector('.lock-icon');
    if (lockIcon) {
        lockIcon.className = `fas ${item.locked ? 'fa-lock' : 'fa-lock-open'} lock-icon`;
    }
    itemEl.classList.toggle('locked-item', !!item.locked);

    // Update salvage selection state
    const isSelected = salvageSelections.some(sel => sel.id === item.id);
    itemEl.classList.toggle('selected-for-salvage', isSelected);
}


/**
 * Renders the equipment paperdoll.
 * @param {DOMElements} elements The object containing all DOM elements.
 * @param {object} gameState The current game state.
 */
export function renderPaperdoll(elements, gameState) {
    for (const slotName in gameState.equipment) {
        const slotEl = document.getElementById(`slot-${slotName}`);
        if (!slotEl) continue;
        const item = gameState.equipment[slotName];
        slotEl.innerHTML = '';
        if (item) {
            slotEl.innerHTML = createItemHTML(item, false);
        } else {
            const placeholder = document.createElement('img');
            placeholder.src = getItemIcon(slotName.replace(/\d/g, ''));
            placeholder.className = 'placeholder-icon';
            slotEl.appendChild(placeholder);
        }
    }
}

// --- END PERFORMANCE FIX: GRANULAR UI UPDATERS ---

/**
 * The original, monolithic update function. Kept for full re-draws when necessary (e.g., on load, major view change).
 */
export function updateUI(elements, gameState, playerStats, currentMonster, salvageMode, craftingGems = [], selectedItemForForge = null, bulkCombineSelection = {}, bulkCombineDeselectedIds = new Set()) {
    const {
        inventorySlotsEl, gemSlotsEl, forgeInventorySlotsEl,
        prestigeEquipmentPaperdoll, prestigeInventoryDisplay, prestigeSelectionCount, prestigeSelectionMax
    } = elements;

    // Update all individual UI components
    updateCurrency(elements, gameState);
    updateHeroPanel(elements, gameState);
    updateStatsPanel(elements, playerStats);
    updateUpgrades(elements, gameState);
    updateMonsterUI(elements, gameState, currentMonster);
    updateLootPanel(elements, currentMonster, gameState);
    updatePrestigeUI(elements, gameState);

    // Grid Renders
    renderGrid(inventorySlotsEl, gameState.inventory, { calculatePositions: true, salvageSelections: salvageMode.selections, showLockIcon: true });
    renderGrid(gemSlotsEl, gameState.gems, { type: 'gem', calculatePositions: false, bulkCombineSelection, bulkCombineDeselectedIds });
    renderGrid(forgeInventorySlotsEl, player.getAllItems(gameState), { calculatePositions: true, selectedItem: selectedItemForForge, showLockIcon: false });
    
    // Paperdoll
    renderPaperdoll(elements, gameState);
    
    // Gem Crafting
    updateGemCraftingUI(elements, craftingGems, gameState);
    
    // Forge
    updateForge(elements, selectedItemForForge, gameState.scrap);
    
    // Presets
    document.querySelectorAll('.preset-btn').forEach((btn, index) => {
        btn.textContent = gameState.presets[index].name;
        btn.classList.toggle('active', index === gameState.activePresetIndex);
    });

    // Prestige View
    if (elements.prestigeView.classList.contains('active')) {
        const unlockedItemTypes = gameState.unlockedPrestigeSlots.map(slot => slot.replace(/\d/g, ''));
        const filteredInventory = player.getAllItems(gameState).filter(item => unlockedItemTypes.includes(item.type.replace(/\d/g, '')));
        renderGrid(prestigeInventoryDisplay, filteredInventory, { calculatePositions: true, showLockIcon: false });
        
        prestigeEquipmentPaperdoll.querySelectorAll('.equipment-slot').forEach(slotEl => {
            const slotName = slotEl.id.replace('prestige-slot-', '');
            const item = gameState.equipment[slotName];
            slotEl.innerHTML = item ? createItemHTML(item, false) : `<img src="${getItemIcon(slotName.replace(/\d/g, ''))}" class="placeholder-icon">`;
            const isUnlocked = gameState.unlockedPrestigeSlots.includes(slotName);
            slotEl.classList.toggle('prestige-locked', !isUnlocked);
            slotEl.classList.toggle('prestige-unlocked', isUnlocked);
            slotEl.classList.remove('selected-for-prestige');
        });
        const currentSelections = gameState.unlockedPrestigeSlots.map(slot => gameState.equipment[slot]).filter(Boolean).length;
        prestigeSelectionCount.textContent = currentSelections;
        prestigeSelectionMax.textContent = gameState.unlockedPrestigeSlots.length;
    }

    // Global Toggles
    updateAutoProgressToggle(elements, gameState.isAutoProgressing);

    // Salvage Filter
    const filterElements = initSalvageFilterDOMElements();
    const filter = gameState.salvageFilter;
    (/** @type {HTMLInputElement} */ (filterElements.enableSalvageFilter)).checked = filter.enabled;
    (/** @type {HTMLInputElement} */ (filterElements.enableGemSalvage)).checked = filter.autoSalvageGems;
    filterElements.salvageFilterControls.classList.toggle('hidden', !filter.enabled);
    (/** @type {HTMLSelectElement} */ (filterElements.filterKeepRarity)).value = filter.keepRarity;
    (/** @type {HTMLInputElement} */ (filterElements.filterKeepSockets)).value = String(filter.keepSockets);
    filterElements.filterKeepStatsContainer.querySelectorAll('input').forEach(input => {
        if (input instanceof HTMLInputElement) {
            input.checked = filter.keepStats[input.dataset.statKey] || false;
        }
    });
}

/**
 * Creates the full HTML block for an item's stats and unique effects.
 */
function createDetailedItemStatBlockHTML(item) {
    if (!item) {
        return '<ul><li>(Empty Slot)</li></ul>';
    }

    const itemBase = ITEMS[item.baseId];
    
    let statsHTML = '<ul>';
    if (item.stats) {
        // --- START OF FIX: Sort the stats before displaying ---
        const statKeys = Object.keys(item.stats);
        statKeys.sort((a, b) => STAT_DISPLAY_ORDER.indexOf(a) - STAT_DISPLAY_ORDER.indexOf(b));
        // --- END OF FIX ---

        for (const statKey of statKeys) {
            const statInfo = Object.values(STATS).find(s => s.key === statKey) || { name: statKey, type: 'flat' };
            const statName = statInfo.name;
            const value = item.stats[statKey];
            const statValue = statInfo.type === 'percent' ? `${value.toFixed(1)}%` : formatNumber(value);
            statsHTML += `<li>+${statValue} ${statName}</li>`;
        }
    }
    statsHTML += '</ul>';

    let gemsHTML = '';
    if (item.sockets && item.sockets.some(g => g !== null)) {
        gemsHTML += '<div class="tooltip-gem-stats">';
        item.sockets.forEach(gem => {
            if (gem) {
                const gemName = gem.name || `T${gem.tier} Gem`;
                gemsHTML += `<div class="tooltip-gem-stats-header"><img src="${gem.icon}" alt="${gemName}">${gemName}</div>`;
                gemsHTML += '<ul>';
                if (gem.stats) {
                    // --- START OF FIX: Sort gem stats too ---
                    const gemStatKeys = Object.keys(gem.stats);
                    gemStatKeys.sort((a, b) => STAT_DISPLAY_ORDER.indexOf(a) - STAT_DISPLAY_ORDER.indexOf(b));
                    // --- END OF FIX ---
                    for (const statKey of gemStatKeys) {
                         const statInfo = Object.values(STATS).find(s => s.key === statKey) || { name: statKey, type: 'flat' };
                         const statName = statInfo.name;
                         const value = gem.stats[statKey];
                         const statValue = statInfo.type === 'percent' ? `${value.toFixed(1)}%` : formatNumber(value);
                         gemsHTML += `<li>+${statValue} ${statName}</li>`;
                    }
                }
                if (gem.synergy) {
                    const synergyPercentage = (gem.synergy.value * 100).toFixed(1);
                    gemsHTML += `<li class="stat-special">+${synergyPercentage}% DPS to Click Dmg</li>`;
                }
                gemsHTML += '</ul>';
            }
        });
        gemsHTML += '</div>';
    }

    let uniqueEffectHTML = '';
    if (itemBase && itemBase.uniqueEffect) {
        const effectData = UNIQUE_EFFECTS[itemBase.uniqueEffect];
        if (effectData) {
            uniqueEffectHTML = `
                <div class="tooltip-unique-effect">
                    <h4>${effectData.name}</h4>
                    <p>${effectData.description}</p>
                </div>
            `;
        }
    }

    return statsHTML + gemsHTML + uniqueEffectHTML;
}


/**
 * Creates the full HTML for an item's tooltip, including details, stats, and sockets.
 */
export function createTooltipHTML(item) {
    if (!item) return '';
    const itemBase = ITEMS[item.baseId];
    const isUnique = itemBase && itemBase.isUnique;

    const uniqueClass = isUnique ? 'unique-item-name' : '';
    let headerHTML = `<div class="item-header"><span class="${item.rarity}">${item.name}</span></div>`;
    headerHTML += `<div style="font-size: 0.9em; color: #95a5a6; margin-bottom: 5px;">${item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)} ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>`;

    const detailedBlock = createDetailedItemStatBlockHTML(item);

    let socketsHTML = '';
    if (item.sockets) {
        socketsHTML += `<div class="item-sockets" style="margin-top: 10px; padding-left:0; justify-content:center; position: static; transform: none;">`;
        item.sockets.forEach(gem => {
            if (gem) {
                socketsHTML += `<div class="socket"><img src="${gem.icon}" alt="${gem.name}"></div>`;
            } else {
                socketsHTML += '<div class="socket"></div>';
            }
        });
        socketsHTML += '</div>';
    }

    return headerHTML + detailedBlock + socketsHTML;
}

/**
 * Creates the HTML for an item comparison tooltip, now with embedded differences.
 * @param {object} hoveredItem The item being hovered over.
 * @param {object|null} equippedItem The first equipped item to compare against.
 * @param {object|null} [equippedItem2=null] The second equipped item (only used for rings).
 * @returns {string} The complete HTML for the tooltip.
 */
export function createItemComparisonTooltipHTML(hoveredItem, equippedItem, equippedItem2 = null) {
    if (!hoveredItem) return '';
    const itemBase = ITEMS[hoveredItem.baseId];

    const uniqueClass = itemBase?.isUnique ? 'unique-item-name' : '';
    let html = `<div class="item-header"><span class="${hoveredItem.rarity}">${hoveredItem.name}</span></div>`;
    html += `<div style="font-size: 0.9em; color: #95a5a6; margin-bottom: 5px;">${hoveredItem.rarity.charAt(0).toUpperCase() + hoveredItem.rarity.slice(1)} ${hoveredItem.type.charAt(0).toUpperCase() + hoveredItem.type.slice(1)}</div>`;

    const hoveredStats = getCombinedItemStats(hoveredItem);
    let statsHTML = '';

    if (hoveredItem.type === 'ring' && equippedItem2) {
        statsHTML = createDualRingComparison(hoveredStats, equippedItem, equippedItem2);
    } else {
        const comparisonTargetStats = equippedItem ? getCombinedItemStats(equippedItem) : {};
        const allStatKeys = new Set([...Object.keys(hoveredStats), ...Object.keys(comparisonTargetStats)]);
        
        let statListHtml = '<ul>';

        // --- START OF FIX: Use the defined order for comparison ---
        const sortedStatKeys = Array.from(allStatKeys).sort((a, b) => STAT_DISPLAY_ORDER.indexOf(a) - STAT_DISPLAY_ORDER.indexOf(b));
        // --- END OF FIX ---

        for (const statKey of sortedStatKeys) {
            const hoveredValue = hoveredStats[statKey] || 0;
            const equippedValue = comparisonTargetStats[statKey] || 0;
            const diff = hoveredValue - equippedValue;

            const statInfo = Object.values(STATS).find(s => s.key === statKey) || { name: statKey, type: 'flat' };
            const isPercent = statInfo.type === 'percent';
            const valueStr = isPercent ? `${hoveredValue.toFixed(1)}%` : formatNumber(hoveredValue);
            
            let diffSpan = '';
            if (equippedItem && Math.abs(diff) > 0.001) {
                const diffClass = diff > 0 ? 'stat-better' : 'stat-worse';
                const sign = diff > 0 ? '+' : '';
                const diffStr = isPercent ? `${diff.toFixed(1)}%` : formatNumber(diff);
                diffSpan = ` <span class="${diffClass}">(${sign}${diffStr})</span>`;
            }
            statListHtml += `<li>+${valueStr} ${statInfo.name}${diffSpan}</li>`;
        };
        statListHtml += '</ul>';
        statsHTML = statListHtml;
    }
    
    html += statsHTML;
    html += createDetailedItemStatBlockHTML(hoveredItem).replace(/<ul>.*?<\/ul>/, ''); 

    if (hoveredItem.sockets) {
        html += `<div class="item-sockets" style="margin-top: 10px; padding-left:0; justify-content:center; position: static; transform: none;">`;
        hoveredItem.sockets.forEach(gem => {
            html += `<div class="socket">${gem ? `<img src="${gem.icon}" alt="${gem.name}">` : ''}</div>`;
        });
        html += '</div>';
    }

    return html;
}

/**
 * Helper function to create the dual-ring comparison HTML block.
 * @param {object} hoveredStats - The combined stats of the hovered ring.
 * @param {object|null} equippedRing1 - The first equipped ring.
 * @param {object|null} equippedRing2 - The second equipped ring.
 * @returns {string} The HTML string for the comparison.
 */
function createDualRingComparison(hoveredStats, equippedRing1, equippedRing2) {
    let html = '<div class="tooltip-ring-comparison">';
    
    const generateComparisonSide = (equippedRing, title) => {
        let sideHtml = `<div><h5>vs. ${title}</h5>`;
        const equippedStats = equippedRing ? getCombinedItemStats(equippedRing) : {};
        const allStatKeys = new Set([...Object.keys(hoveredStats), ...Object.keys(equippedStats)]);
        
        // --- START OF FIX: Use the defined order for comparison ---
        const sortedStatKeys = Array.from(allStatKeys).sort((a, b) => STAT_DISPLAY_ORDER.indexOf(a) - STAT_DISPLAY_ORDER.indexOf(b));
        // --- END OF FIX ---
        
        let statListHtml = '<ul>';
        if (sortedStatKeys.length === 0 && !equippedRing) {
             statListHtml += '<li>(Empty Slot)</li>';
        } else if (sortedStatKeys.length === 0 && equippedRing) {
             statListHtml += '<li>(No stats)</li>';
        }else {
            for (const statKey of sortedStatKeys) {
                const hoveredValue = hoveredStats[statKey] || 0;
                const equippedValue = equippedStats[statKey] || 0;
                const diff = hoveredValue - equippedValue;
                const statInfo = Object.values(STATS).find(s => s.key === statKey) || { name: statKey, type: 'flat' };
                
                let diffSpan = '';
                if (Math.abs(diff) > 0.001) {
                    const diffClass = diff > 0 ? 'stat-better' : 'stat-worse';
                    const sign = diff > 0 ? '+' : '';
                    const diffStr = statInfo.type === 'percent' ? `${diff.toFixed(1)}%` : formatNumber(diff);
                    diffSpan = ` <span class="${diffClass}">(${sign}${diffStr})</span>`;
                }
                statListHtml += `<li>${statInfo.name}${diffSpan}</li>`;
            };
        }
        statListHtml += '</ul>';
        sideHtml += statListHtml + '</div>';
        return sideHtml;
    };

    html += generateComparisonSide(equippedRing1, 'Ring 1');
    html += generateComparisonSide(equippedRing2, 'Ring 2');
    html += '</div>';
    return html;
}



export function createGemTooltipHTML(gem) {
    const name = gem.name || `T${gem.tier} Gem`;
    const displayName = gem.tier > 1 ? `T${gem.tier} Fused Gem` : name;
    const headerHTML = `<div class="item-header gem-tooltip"><span>${displayName}</span></div>`;
    let statsHTML = '<ul>';

    if (gem.stats) {
        // --- START OF FIX: Sort gem stats ---
        const statKeys = Object.keys(gem.stats);
        statKeys.sort((a, b) => STAT_DISPLAY_ORDER.indexOf(a) - STAT_DISPLAY_ORDER.indexOf(b));
        // --- END OF FIX ---

        for (const statKey of statKeys) {
            const statInfo = Object.values(STATS).find(s => s.key === statKey);
            const statName = statInfo ? statInfo.name : statKey;
            const value = gem.stats[statKey];
            const statValue = statInfo && statInfo.type === 'percent' ? `${value}%` : formatNumber(value);
            statsHTML += `<li>+${statValue} ${statName}</li>`;
        }
    }

    if (gem.synergy) {
        statsHTML += `<li class="stat-special" style="margin: 5px 0;">Special: +${(gem.synergy.value * 100).toFixed(2)}% of total DPS to Click Dmg</li>`;
    }

    if (statsHTML === '<ul>') {
        statsHTML += `<li>A mysterious gem...</li>`;
    }

    statsHTML += '</ul>';
    return headerHTML + statsHTML;
}

export function createLootTableTooltipHTML(itemBase) {
    let statsHTML = '<ul>';

    // --- START OF FIX: Sort potential stats ---
    const sortedPossibleStats = [...itemBase.possibleStats].sort((a, b) => STAT_DISPLAY_ORDER.indexOf(a.key) - STAT_DISPLAY_ORDER.indexOf(b.key));
    // --- END OF FIX ---

    sortedPossibleStats.forEach(statInfo => {
        const statName = Object.values(STATS).find(s => s.key === statInfo.key)?.name || statInfo.key;
        statsHTML += `<li>+ ${statInfo.min} - ${statInfo.max} ${statName}</li>`;
    });
    statsHTML += '</ul>';

    let socketsHTML = '';
    if (itemBase.canHaveSockets) {
        socketsHTML = `<div class="item-sockets-tooltip">Sockets: 0 - ${itemBase.maxSockets}</div>`;
    }
    
    let uniqueEffectHTML = '';
    if (itemBase && itemBase.uniqueEffect) {
        const effectData = UNIQUE_EFFECTS[itemBase.uniqueEffect];
        if (effectData) {
            uniqueEffectHTML = `
                <div class="tooltip-unique-effect" style="padding-top: 5px; margin-top: 5px; border-top: 1px solid #4a637e;">
                    <h4>${effectData.name}</h4>
                    <p>${effectData.description}</p>
                </div>
            `;
        }
    }
    
    const isUnique = itemBase && itemBase.isUnique;
    const uniqueClass = isUnique ? 'unique-item-name' : '';
    const headerHTML = `<div class="item-header"><span class="${uniqueClass}">${itemBase.name}</span></div>`;

    return `${headerHTML}
            <div class="possible-stats-header">
                Possible Stats:
                <span class="tooltip-shift-hint">Hold [SHIFT] to compare</span>
            </div>
            ${statsHTML}
            ${socketsHTML}
            ${uniqueEffectHTML}`;
}

export function createLootComparisonTooltipHTML(potentialItem, equippedItem, equippedItem2 = null) {
    const potentialIsUnique = potentialItem.isUnique ? 'unique-item-name' : '';
    const headerHTML = `<div class="item-header"><span class="${potentialIsUnique}">${potentialItem.name}</span></div>`;

    let potentialStatsHTML = '<ul>';

    // --- START OF FIX: Sort potential stats in comparison view ---
    const sortedPossibleStats = [...potentialItem.possibleStats].sort((a, b) => STAT_DISPLAY_ORDER.indexOf(a.key) - STAT_DISPLAY_ORDER.indexOf(b.key));
    // --- END OF FIX ---

    sortedPossibleStats.forEach(statInfo => {
        const statName = Object.values(STATS).find(s => s.key === statInfo.key)?.name || statInfo.key;
        potentialStatsHTML += `<li>+ ${statInfo.min} - ${statInfo.max} ${statName}</li>`;
    });
    potentialStatsHTML += '</ul>';
    
    let uniqueEffectHTML = '';
    if (potentialItem.uniqueEffect) {
        const effectData = UNIQUE_EFFECTS[potentialItem.uniqueEffect];
        if (effectData) {
            uniqueEffectHTML = `
                <div class="tooltip-unique-effect" style="margin-top: 5px; padding-top: 5px; border-top: 1px solid #f39c12;">
                    <h4>${effectData.name}</h4>
                    <p>${effectData.description}</p>
                </div>
            `;
        }
    }
    const potentialBlock = `<div><h5>Potential Drop</h5>${potentialStatsHTML}${uniqueEffectHTML}</div>`;

    const createComparisonBlock = (item, title) => {
        if (!item) {
            return `<div><h5>${title}</h5><ul><li>(Empty Slot)</li></ul></div>`;
        }
        const itemBase = ITEMS[item.baseId];
        const isUnique = itemBase && itemBase.isUnique;
        const itemNameClass = isUnique ? 'unique-item-name' : '';
        const itemRarityClass = item.rarity || 'common';

        const blockTitle = `<h5>${title}: <span class="${itemRarityClass} ${itemNameClass}">${item.name}</span></h5>`;
        const detailedStats = createDetailedItemStatBlockHTML(item);
        return `<div>${blockTitle}${detailedStats}</div>`;
    };

    if (potentialItem.type === 'ring') {
        const equippedBlock1 = createComparisonBlock(equippedItem, "Ring 1");
        const equippedBlock2 = createComparisonBlock(equippedItem2, "Ring 2");
        return `${headerHTML}<div class="tooltip-ring-comparison">${potentialBlock}${equippedBlock1}${equippedBlock2}</div>`;
    } else {
        const equippedBlock = createComparisonBlock(equippedItem, "Equipped");
        return `${headerHTML}<div class="tooltip-comparison-container">${potentialBlock}${equippedBlock}</div>`;
    }
}


/**
 * Creates the HTML for an item's icon-centric view in the grid.
 * @param {object} item - The item to create HTML for.
 * @param {boolean} [showLock=true] - Whether to render the lock icon.
 * @returns {string} The generated HTML string.
 */
export function createItemHTML(item, showLock = true) {
    if (!item) return '';
    let socketsHTML = '';
    if (item.sockets) {
        socketsHTML += `<div class="item-sockets">`;
        item.sockets.forEach(gem => {
            if (gem) {
                socketsHTML += `<div class="socket"><img src="${gem.icon}" alt="${gem.name || ''}"></div>`;
            } else {
                socketsHTML += '<div class="socket"></div>';
            }
        });
        socketsHTML += '</div>';
    }

    const iconSrc = item.icon || getItemIcon(item.type);
    
    const lockHTML = showLock && item.locked !== undefined ? `<i class="fas ${item.locked ? 'fa-lock' : 'fa-lock-open'} lock-icon"></i>` : '';

    return `<div class="item ${item.rarity}">
                <img src="${iconSrc}" class="item-icon" alt="${item.name}">
                ${socketsHTML}
                ${lockHTML}
            </div>`;
}

export function createGemHTML(gem) {
    if (!gem) return '';
    return `<div class="gem gem-quality" data-gem-id="${String(gem.id)}">
                <img src="${gem.icon}" alt="${gem.name}">
            </div>`;
}

export function getItemIcon(type) {
    switch (type) {
        case 'sword': return 'images/icons/sword.png';
        case 'shield': return 'images/icons/shield.png';
        case 'helmet': return 'images/icons/helmet.png';
        case 'necklace': return 'images/icons/necklace.png';
        case 'platebody': return 'images/icons/platebody.png';
        case 'platelegs': return 'images/icons/platelegs.png';
        case 'ring': return 'images/icons/ring.png';
        case 'belt': return 'images/icons/belt.png';
        default: return 'images/icons/sword.png';
    }
}

export function showDamagePopup(popupContainerEl, damage, isCrit = false, isMultiStrike = false) {
    const popup = document.createElement('div');
    let content = `-${formatNumber(damage)}`;
    if (isMultiStrike) {
        content += ' (Multi!)';
    }
    popup.textContent = content;
    popup.className = 'damage-popup';
    if (isCrit) {
        popup.classList.add('crit');
    }
    if (isMultiStrike) {
        popup.style.left = `${50 + Math.random() * 20}%`;
        popup.style.top = `${20 + Math.random() * 20}%`;
    } else {
        popup.style.left = `${40 + Math.random() * 20}%`;
        popup.style.top = `${40 + Math.random() * 20}%`;
    }
    
    popupContainerEl.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
}

export function showGoldPopup(popupContainerEl, gold) {
    const popup = document.createElement('div');
    popup.innerHTML = `+${formatNumber(gold)} <i class="fas fa-coins"></i>`;
    popup.className = 'gold-popup';
    popup.style.left = `${40 + Math.random() * 20}%`;
    popup.style.top = `${50}%`;
    popupContainerEl.appendChild(popup);
    setTimeout(() => popup.remove(), 1500);
}

/**
 * Creates a temporary image element and adds it to the monster area to show a visual item drop.
 * @param {HTMLElement} popupContainerEl - The container inside the monster display area.
 * @param {object} item - The dropped item object.
 * @param {number} [animationIndex=0] - An index to vary the animation for multiple drops.
 */
export function showItemDropAnimation(popupContainerEl, item, animationIndex = 0) {
    if (!item || !item.icon) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'item-drop-wrapper';

    const itemImg = document.createElement('img');
    itemImg.src = item.icon;
    itemImg.className = 'item-drop-animation';

    if (isBossUnique(item.baseId)) {
        wrapper.classList.add('boss-unique-drop');
        itemImg.classList.add('sparkle-animation');
    }

    const startX = 40 + (Math.random() * 20) + (animationIndex * 15);
    const startY = 40 + (Math.random() * 20) - (animationIndex * 15);
    wrapper.style.left = `${startX}%`;
    wrapper.style.top = `${startY}%`;

    const horizontalDirection = Math.random() < 0.5 ? -1 : 1;
    const peakX = (50 + Math.random() * 50 + (animationIndex * 20)) * horizontalDirection;
    const peakY = -(150 + Math.random() * 50);
    const endX = (100 + Math.random() * 50 + (animationIndex * 30)) * horizontalDirection;
    const endY = 100;

    wrapper.style.setProperty('--peak-x', `${peakX}px`);
    wrapper.style.setProperty('--peak-y', `${peakY}px`);
    wrapper.style.setProperty('--end-x', `${endX}px`);
    wrapper.style.setProperty('--end-y', `${endY}px`);

    wrapper.appendChild(itemImg);
    popupContainerEl.appendChild(wrapper);

    setTimeout(() => {
        wrapper.remove();
    }, 1500);
}


export function showDpsPopup(popupContainerEl, damage, isCrit = false, isMultiStrike = false) {
    const popup = document.createElement('div');
    let content = `-${formatNumber(damage)}`;
    if (isMultiStrike) {
        content += ' (Multi!)';
    }
    popup.textContent = content;
    popup.className = 'dps-popup';
    if (isCrit) {
        popup.classList.add('crit');
    }

    if (isMultiStrike) {
        popup.style.left = `${40 + Math.random() * 40}%`;
        popup.style.top = `${35 + Math.random() * 20}%`;
    } else {
        popup.style.left = `${30 + Math.random() * 40}%`;
        popup.style.top = `${45 + Math.random() * 20}%`;
    }

    popupContainerEl.appendChild(popup);
    setTimeout(() => popup.remove(), 800);
}

/**
 * Shows a large informational popup in the monster area (e.g., for special events).
 * @param {HTMLElement} popupContainerEl - The container to add the popup to.
 * @param {string} text - The text to display.
 * @param {object} [options={}] - Customization options.
 */
export function showInfoPopup(popupContainerEl, text, options = {}) {
    const {
        color = '#9b59b6',
        fontSize = '3em',
        duration = 2000,
        top = '30%',
        left = '50%',
        transform = 'translateX(-50%)'
    } = options;

    const popup = document.createElement('div');
    popup.textContent = text;
    popup.className = 'info-popup';
    popup.style.color = color;
    popup.style.fontSize = fontSize;
    popup.style.top = top;
    popup.style.left = left;
    popup.style.transform = transform;
    
    popupContainerEl.appendChild(popup);
    setTimeout(() => popup.remove(), duration);
}

export function createMapNode(name, iconSrc, coords, isUnlocked, isCompleted, currentFightingLevel, levelRange = null, isBoss = false, isFightingZone = false) {
    const node = document.createElement('div');
    node.className = 'map-node';
    if (!isUnlocked) node.classList.add('locked');
    if (isBoss) node.classList.add('boss-node');

    const currentFightingSubZone = findSubZoneByLevel(currentFightingLevel);
    if (currentFightingSubZone && currentFightingSubZone.name === name) {
        node.classList.add('active-zone');
    }

    if (isFightingZone) {
        node.classList.add('active-fighting-zone');
    }

    node.style.top = coords.top;
    node.style.left = coords.left;

    let levelText = '';
    if (levelRange) {
        if (levelRange[0] === levelRange[1]) {
            levelText = `<br>(Lvl ${levelRange[0]})`;
        } else {
            levelText = `<br>(Lvls ${levelRange[0]}-${levelRange[1]})`;
        }
    }
    
    const displayName = isFightingZone ? `<b>${name}</b>` : name;

    let iconHtml = `<img src="${iconSrc}" class="map-node-icon ${isUnlocked ? '' : 'locked'} ${isCompleted ? 'completed' : ''}" alt="${name} icon">`;
    if (isCompleted) {
        iconHtml += `<i class="fas fa-check-circle map-node-completed-icon"></i>`;
    }
    if (!isUnlocked) {
        iconHtml += `<i class="fas fa-lock map-node-lock-icon"></i>`;
    }
    
    node.innerHTML = `
        ${iconHtml}
        <span class="map-node-label">${displayName}${levelText}</span>
    `;
    return node;
}

export function getHighestCompletedLevelInSubZone(completedLevels, subZone) {
    let highest = 0;
    for (const level of completedLevels) {
        if (level >= subZone.levelRange[0] && level <= subZone.levelRange[1]) {
            if (level > highest) {
                highest = level;
            }
        }
    }
    return highest;
}

/**
 * Shows the modal for unlocking a new legacy slot.
 * @param {DOMElements} elements - The DOMElements object.
 * @param {string[]} unlockedSlots - Array of currently unlocked slot names.
 */
export function showUnlockSlotModal(elements, unlockedSlots) {
    const { unlockSlotPaperdoll, unlockSlotModalBackdrop } = elements;
    
    unlockSlotPaperdoll.querySelectorAll('.equipment-slot').forEach(slotEl => {
        const slotName = slotEl.id.replace('unlock-slot-', '');
        slotEl.innerHTML = `<img src="${getItemIcon(slotName.replace(/\d/g, ''))}" class="placeholder-icon">`;
        slotEl.classList.toggle('prestige-unlocked', unlockedSlots.includes(slotName));
    });

    unlockSlotModalBackdrop.classList.remove('hidden');
}

/**
 * Hides the modal for unlocking a new legacy slot.
 * @param {DOMElements} elements - The DOMElements object.
 */
export function hideUnlockSlotModal(elements) {
    elements.unlockSlotModalBackdrop.classList.add('hidden');
}

/**
 * Shows the modal for viewing unlocked prestige slots using a paperdoll.
 * @param {DOMElements} elements - The DOMElements object.
 * @param {string[]} unlockedSlots - Array of currently unlocked slot names.
 */
export function showViewSlotsModal(elements, unlockedSlots) {
    const { viewSlotsPaperdoll, viewSlotsModalBackdrop } = elements;

    viewSlotsPaperdoll.querySelectorAll('.equipment-slot').forEach(slotEl => {
        const slotName = slotEl.id.replace('view-slot-', '');
        const isUnlocked = unlockedSlots.includes(slotName);
        
        slotEl.classList.toggle('view-unlocked', isUnlocked);
        slotEl.classList.toggle('view-locked', !isUnlocked);

        slotEl.innerHTML = `<img src="${getItemIcon(slotName.replace(/\d/g, ''))}" class="placeholder-icon">`;
    });

    viewSlotsModalBackdrop.classList.remove('hidden');
}


/**
 * Switches the active view in the middle panel.
 * @param {DOMElements} elements - The DOMElements object.
 * @param {string} viewIdToShow - The ID of the view to make active.
 */
export function switchView(elements, viewIdToShow) {
    const parentPanel = document.querySelector('.middle-panel');
    parentPanel.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    parentPanel.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
    
    const viewElement = document.getElementById(viewIdToShow);
    const tabElement = parentPanel.querySelector(`.tab-button[data-view="${viewIdToShow}"]`);

    if (viewElement) viewElement.classList.add('active');
    if (tabElement) tabElement.classList.add('active');
}


/**
 * Renders the new accordion-style map view.
 * @param {DOMElements} elements - DOMElements object.
 * @param {object} gameState - The current game state.
 * @param {number} viewingRealmIndex - The index of the realm currently being viewed.
 * @param {string} viewingZoneId - The ID of the zone currently being viewed within the realm.
 * @param {number} fightingRealmIndex - The index of the realm the player is in.
 * @param {string | null} fightingZoneId - The ID of the zone the player is in.
 * @param {object} callbacks - An object containing the callback functions.
 */
export function renderMapAccordion(elements, gameState, viewingRealmIndex, viewingZoneId, fightingRealmIndex, fightingZoneId, callbacks) {
    const { onRealmHeaderClick } = callbacks;
    const container = elements.mapAccordionContainerEl;
    container.innerHTML = '';

    REALMS.forEach((realm, index) => {
        const isUnlocked = gameState.maxLevel >= realm.requiredLevel;
        if (!isUnlocked) return;

        const isViewing = index === viewingRealmIndex;
        const isFightingInThisRealm = index === fightingRealmIndex;

        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item';

        const header = document.createElement('div');
        header.className = `accordion-header ${isViewing ? 'active' : ''} ${isFightingInThisRealm ? 'active-fighting-realm' : ''}`;
        header.textContent = realm.name;
        header.dataset.realmIndex = index.toString();
        header.addEventListener('click', () => onRealmHeaderClick(index));

        const content = document.createElement('div');
        content.className = 'accordion-content';

        if (isViewing) {
            renderMap(/** @type {HTMLElement} */(content), realm, viewingZoneId, gameState, fightingZoneId, callbacks);
            const contentEl = /** @type {HTMLElement} */ (content);
            setTimeout(() => {
                contentEl.style.maxHeight = contentEl.scrollHeight + 'px';
                contentEl.addEventListener('transitionend', function onTransitionEnd() {
                    const mapContainerEl = contentEl.querySelector('.map-container-instance');
                    if(mapContainerEl) {
                        drawMapPaths(/** @type {HTMLElement} */(mapContainerEl), realm, viewingZoneId, gameState);
                    }
                    contentEl.removeEventListener('transitionend', onTransitionEnd);
                });
            }, 0);
        }

        accordionItem.appendChild(header);
        accordionItem.appendChild(content);
        container.appendChild(accordionItem);
    });
}


/**
 * Renders a specific map (world or zone) into a given container.
 * @param {HTMLElement} contentEl - The accordion content element to render into.
 * @param {object} realm - The realm object from REALMS data.
 * @param {string} viewingZoneId - The ID of the zone to view. 'world' for the realm map.
 * @param {object} gameState - The current game state.
 * @param {string | null} fightingZoneId - The ID of the zone the player is fighting in.
 * @param {object} callbacks - Click handler callbacks.
 */
function renderMap(contentEl, realm, viewingZoneId, gameState, fightingZoneId, { onZoneNodeClick, onSubZoneNodeClick, onBackToWorldClick }) {
    contentEl.innerHTML = `
        <div id="map-header">
            <h2 id="map-title"></h2>
            <button id="back-to-world-map-btn" class="hidden">Back to World</button>
        </div>
        <div id="map-container" class="map-container-instance"></div>
    `;

    const mapTitleEl = /** @type {HTMLHeadingElement} */ (contentEl.querySelector('#map-title'));
    const mapContainerEl = /** @type {HTMLElement} */ (contentEl.querySelector('.map-container-instance'));
    const backBtn = /** @type {HTMLButtonElement} */ (contentEl.querySelector('#back-to-world-map-btn'));
    
    backBtn.addEventListener('click', () => onBackToWorldClick(REALMS.indexOf(realm)));

    if (viewingZoneId === 'world') {
        mapTitleEl.textContent = realm.name;
        backBtn.classList.add('hidden');
        mapContainerEl.style.backgroundImage = `url('${realm.mapImage}')`;
        for (const zoneId in realm.zones) {
            const zone = realm.zones[zoneId];
            const isUnlocked = gameState.maxLevel >= findFirstLevelOfZone(zone);
            const isFightingInThisZone = zoneId === fightingZoneId;
            const node = createMapNode(zone.name, zone.icon, zone.coords, isUnlocked, false, gameState.currentFightingLevel, null, false, isFightingInThisZone);
            if (isUnlocked) {
                node.addEventListener('click', () => onZoneNodeClick(REALMS.indexOf(realm), zoneId));
            }
            mapContainerEl.appendChild(node);
        }
    } else {
        const zone = realm.zones[viewingZoneId];
        if (!zone) return;

        mapTitleEl.textContent = zone.name;
        backBtn.classList.remove('hidden');
        mapContainerEl.style.backgroundImage = `url('${zone.mapImage}')`;

        const subZonesArray = Object.values(zone.subZones).sort((a, b) => a.levelRange[0] - b.levelRange[0]);
        for (const subZone of subZonesArray) {
            const isUnlocked = gameState.maxLevel >= subZone.levelRange[0];
            const isCompleted = gameState.completedLevels.includes(subZone.levelRange[1]);
            
            // --- START OF MODIFICATION: Determine the correct icon source ---
            let iconSrc;
            if (subZone.isBoss && subZone.monsterPool && subZone.monsterPool.length === 1) {
                iconSrc = subZone.monsterPool[0].image;
            } else {
                iconSrc = subZone.icon;
            }
            // --- END OF MODIFICATION ---
            
            const node = createMapNode(subZone.name, iconSrc, subZone.coords, isUnlocked, isCompleted, gameState.currentFightingLevel, subZone.levelRange, subZone.isBoss, false);
            if (isUnlocked) {
                node.addEventListener('click', () => onSubZoneNodeClick(subZone));
            }
            mapContainerEl.appendChild(node);
        }
    }
}

/**
 * Draws the SVG paths between nodes on a zone map.
 * @param {HTMLElement} mapContainerEl - The specific map container instance to draw in.
 * @param {object} realm - The realm object from REALMS data.
 * @param {string} viewingZoneId - The ID of the zone being viewed.
 * @param {object} gameState - The current game state.
 */
function drawMapPaths(mapContainerEl, realm, viewingZoneId, gameState) {
    const zone = realm.zones[viewingZoneId];
    if (!zone || !mapContainerEl) return;

    const subZonesArray = Object.values(zone.subZones).sort((a, b) => a.levelRange[0] - b.levelRange[0]);
    const unlockedNodes = subZonesArray.filter(sz => gameState.maxLevel >= sz.levelRange[0]);

    if (unlockedNodes.length > 1) {
        const mapWidth = mapContainerEl.clientWidth;
        const mapHeight = mapContainerEl.clientHeight;
        if (mapWidth === 0 || mapHeight === 0) return;
        
        const NODE_RADIUS = 21;

        const points = unlockedNodes.map(sz => ({
            x: parseFloat(sz.coords.left) / 100 * mapWidth,
            y: parseFloat(sz.coords.top) / 100 * mapHeight,
        }));
        
        const svgNS = "http://www.w3.org/2000/svg";
        const svgEl = document.createElementNS(svgNS, 'svg');
        svgEl.setAttribute('class', 'map-path-svg');
        svgEl.setAttribute('viewBox', `0 0 ${mapWidth} ${mapHeight}`);

        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i+1];

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const mag = Math.sqrt(dx * dx + dy * dy);
            if (mag < NODE_RADIUS * 2) continue;

            const unitX = dx / mag;
            const unitY = dy / mag;

            const startX = p1.x + unitX * NODE_RADIUS;
            const startY = p1.y + unitY * NODE_RADIUS;

            const endX = p2.x - unitX * NODE_RADIUS;
            const endY = p2.y - unitY * NODE_RADIUS;
            
            const segDx = endX - startX;
            const segDy = endY - startY;
            const segDist = Math.sqrt(segDx * segDx + segDy * segDy);
            if (segDist < 1) continue;

            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;

            const waviness = ((i + 1) % 2 === 1) ? 1 : -1;
            const offsetMagnitude = Math.min(segDist / 8, 15) * waviness;

            const controlX = midX - segDy * (offsetMagnitude / segDist);
            const controlY = midY + segDx * (offsetMagnitude / segDist);
            
            const pathEl = document.createElementNS(svgNS, 'path');
            pathEl.setAttribute('d', `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`);
            pathEl.setAttribute('class', 'map-path-line');
            
            svgEl.appendChild(pathEl);
        }
        
        const oldSvg = mapContainerEl.querySelector('.map-path-svg');
        if (oldSvg) oldSvg.remove();
        
        mapContainerEl.appendChild(svgEl);
    }
}

/**
 * Populates the Wiki filter controls with all possible item types and stats.
 * @param {DOMElements} elements - The main DOM elements object.
 * @param {Set<string>} allItemTypes - A set of all unique item types.
 * @param {Set<string>} allStatKeys - A set of all unique stat keys.
 */
export function populateWikiFilters(elements, allItemTypes, allStatKeys) {
    const { wikiTypeFilter, wikiStatsFilterContainer } = elements;

    allItemTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        wikiTypeFilter.appendChild(option);
    });

    wikiStatsFilterContainer.innerHTML = '';
    Array.from(allStatKeys).sort().forEach(statKey => {
        const stat = Object.values(STATS).find(s => s.key === statKey);
        if (stat) {
            const wrapper = document.createElement('div');
            wrapper.className = 'wiki-stat-filter';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `wiki-filter-stat-${stat.key}`;
            checkbox.dataset.statKey = stat.key;
            
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = stat.name;
            
            const valueInput = document.createElement('input');
            valueInput.type = 'number';
            valueInput.id = `wiki-filter-value-${stat.key}`;
            valueInput.dataset.statKey = stat.key;
            valueInput.placeholder = "Min Val";
            valueInput.classList.add('hidden');
            valueInput.min = "0";

            checkbox.addEventListener('change', () => {
                valueInput.classList.toggle('hidden', !checkbox.checked);
                if (!checkbox.checked) {
                    valueInput.value = '';
                }
            });

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            wrapper.appendChild(valueInput);
            wikiStatsFilterContainer.appendChild(wrapper);
        }
    });
}

/**
 * Renders the results of a wiki search into the container.
 * @param {HTMLElement} containerEl - The container element for the results.
 * @param {Array<object>} wikiData - The array of processed item data to display.
 * @param {Array<string>} wikiFavorites - An array of favorited item IDs.
 * @param {boolean} showOnlyFavorites - Flag to determine if only favorites should be shown.
 */
export function renderWikiResults(containerEl, wikiData, wikiFavorites, showOnlyFavorites) {
    containerEl.innerHTML = '';

    let dataToRender = wikiData;
    if (showOnlyFavorites) {
        dataToRender = wikiData.filter(itemData => wikiFavorites.includes(itemData.id));
    }

    // --- START OF SORTING FIX ---
    dataToRender.sort((a, b) => {
        // Helper function to find the minimum level an item can be obtained at.
        const getMinLevel = (itemData) => {
            if (!itemData.dropSources || itemData.dropSources.length === 0) {
                // If an item has no drop source, push it to the end of the list.
                return Infinity;
            }
            // Find the minimum level among all possible drop sources.
            return Math.min(...itemData.dropSources.map(source => source.level));
        };

        const minLevelA = getMinLevel(a);
        const minLevelB = getMinLevel(b);

        // Sort by the minimum level in ascending order.
        return minLevelA - minLevelB;
    });
    // --- END OF SORTING FIX ---

    if (dataToRender.length === 0) {
        const message = showOnlyFavorites ? "You haven't favorited any items yet." : "No items match your criteria.";
        containerEl.innerHTML = `<p style="text-align: center; margin-top: 20px;">${message}</p>`;
        return;
    }

    dataToRender.forEach(itemData => {
        const isFavorited = wikiFavorites.includes(itemData.id);
        const card = document.createElement('div');
        card.className = 'wiki-item-card';
        card.dataset.itemId = itemData.id;
        card.innerHTML = createWikiItemCardHTML(itemData, isFavorited);
        containerEl.appendChild(card);
    });
}


/**
 * Creates the HTML for a single item card in the wiki.
 * @param {object} itemData - The processed data for a single item.
 * @param {boolean} isFavorited - Whether the item is currently favorited.
 * @returns {string} The HTML string for the card.
 */
function createWikiItemCardHTML(itemData, isFavorited) {
    const itemBase = ITEMS[itemData.id] || GEMS[itemData.id];
    const isUnique = itemBase.isUnique ? 'unique-item-name' : '';
    const rarity = itemBase.rarity || 'common'; 

    const starClass = isFavorited ? 'fas fa-star favorited' : 'far fa-star';

    let statsHtml = '<ul>';
    if (itemBase.stats) {
        for (const statKey in itemBase.stats) {
            const statInfo = Object.values(STATS).find(s => s.key === statKey) || { name: statKey, type: 'flat' };
            const statName = statInfo.name;
            const value = itemBase.stats[statKey];
            const statValue = statInfo.type === 'percent' ? `${value}%` : formatNumber(value);
            statsHtml += `<li>+${statValue} ${statName}</li>`;
        }
    }

    itemBase.possibleStats?.forEach(stat => {
        const statName = Object.values(STATS).find(s => s.key === stat.key)?.name || stat.key;
        statsHtml += `<li>+${stat.min} to ${stat.max} ${statName}</li>`;
    });
    
    if (itemBase.canHaveSockets && itemBase.maxSockets > 0) {
        statsHtml += `<li>Sockets: 0 - ${itemBase.maxSockets}</li>`;
    }
    
    if (itemBase.synergy) {
        statsHtml += `<li class="stat-special">Special: +${(itemBase.synergy.value * 100).toFixed(2)}% of total DPS to Click Dmg</li>`;
    }
    
    if (itemBase.uniqueEffect) {
        const effect = UNIQUE_EFFECTS[itemBase.uniqueEffect];
        statsHtml += `<li style="margin-top: 8px;"><b>${effect.name}:</b> ${effect.description}</li>`;
    }

    statsHtml += '</ul>';

    let dropsHtml = '<ul>';
    if (itemData.dropSources.length > 0) {
        const sortedSources = itemData.dropSources.sort((a, b) => a.level - b.level);
        sortedSources.forEach(source => {
            dropsHtml += `
                <li class="wiki-drop-source">
                    <img src="${source.monster.image}" alt="${source.monster.name}">
                    <div class="wiki-drop-source-details">
                         <span class="wiki-monster-name">${source.monster.name}</span>
                         <span class="wiki-monster-location">${source.location}</span>
                    </div>
                    <span class="drop-chance">${source.chance.toFixed(2)}%</span>
                </li>
            `;
        });
    } else {
        dropsHtml = '<li>No known drop sources.</li>';
    }
    dropsHtml += '</ul>';

    return `
        <i class="${starClass} wiki-favorite-star" data-item-id="${itemData.id}"></i>
        <div class="wiki-item-header ${rarity}">
            <img src="${itemBase.icon}" class="item-icon" alt="${itemBase.name}">
            <span class="item-name ${isUnique}">${itemBase.name}</span>
        </div>
        <div class="wiki-item-details">
            <div class="wiki-item-stats">
                <h4>Stats & Effects</h4>
                ${statsHtml}
            </div>
            <div class="wiki-item-drops">
                <h4>Drop Sources</h4>
                ${dropsHtml}
            </div>
        </div>
    `;
}

/**
 * Shows the modal for selecting a monster to travel to.
 * @param {DOMElements} elements - The main DOM elements object.
 * @param {Array<object>} dropSources - The sources for a specific item.
 * @param {number} playerMaxLevel - The highest level the player has reached.
 * @param {function(number): void} travelCallback - Function to call when a travel button is clicked.
 */
export function showWikiTravelModal(elements, dropSources, playerMaxLevel, travelCallback) {
    elements.modalTitleEl.textContent = 'Travel to Monster';
    
    const list = document.createElement('ul');
    list.className = 'wiki-travel-options-list';

    if (dropSources.length > 0) {
        const sortedSources = dropSources.sort((a, b) => a.level - b.level);
        sortedSources.forEach(source => {
            const isUnlocked = playerMaxLevel >= source.level;
            const li = document.createElement('li');
            li.className = 'wiki-travel-option';

            const travelBtn = document.createElement('button');
            travelBtn.className = 'wiki-travel-btn';
            travelBtn.textContent = 'Travel';
            travelBtn.disabled = !isUnlocked;
            if (isUnlocked) {
                travelBtn.addEventListener('click', () => travelCallback(source.level));
            }
            
            li.innerHTML = `
                <img src="${source.monster.image}" alt="${source.monster.name}" class="wiki-travel-monster-icon">
                <div class="wiki-travel-monster-details">
                    <span class="wiki-monster-name">${source.monster.name}</span>
                    <span class="wiki-monster-location">${source.location}</span>
                </div>
            `;
            li.appendChild(travelBtn);
            list.appendChild(li);
        });
    } else {
        list.innerHTML = '<li>No known drop sources for this item.</li>';
    }

    elements.modalBodyEl.innerHTML = '';
    elements.modalBodyEl.appendChild(list);
    
    elements.modalCloseBtnEl.classList.remove('hidden');
    elements.modalBackdropEl.classList.remove('hidden');
}

// --- START PERFORMANCE FIX: NEW GRANULAR UI UPDATERS ---

export function updatePrestigeUI(elements, gameState) {
    const { prestigeCountStatEl, absorbedStatsListEl, prestigeRequirementTextEl, prestigeButton } = elements;
    
    absorbedStatsListEl.innerHTML = '';
    const prestigeStatsToShow = {
        [STATS.DPS.key]: { icon: 'fa-sword', label: 'DPS' },
        [STATS.CLICK_DAMAGE.key]: { icon: 'fa-hand-rock', label: 'Click Dmg' },
        [STATS.GOLD_GAIN.key]: { icon: 'fa-coins', label: '% Gold Gain' },
        [STATS.MAGIC_FIND.key]: { icon: 'fa-star', label: '% Magic Find' },
    };

    for (const [key, config] of Object.entries(prestigeStatsToShow)) {
        if (gameState.absorbedStats[key] > 0) {
            const isPercent = STATS[Object.keys(STATS).find(k => STATS[k].key === key)].type === 'percent';
            const value = isPercent ? `${gameState.absorbedStats[key].toFixed(2)}%` : formatNumber(gameState.absorbedStats[key]);
            
            const statEl = document.createElement('div');
            statEl.className = 'prestige-stat-entry';
            statEl.innerHTML = `<i class="fas ${config.icon}"></i><div class="prestige-stat-text"><div>${config.label}:</div><div>${value}</div></div>`;
            absorbedStatsListEl.appendChild(statEl);
        }
    }
    
    const absorbedUniqueEffects = gameState.absorbedUniqueEffects || {};
    for (const [effectKey, count] of Object.entries(absorbedUniqueEffects)) {
        if (count > 0) {
            const effectData = UNIQUE_EFFECTS[effectKey];
            if (effectData) {
                const stackText = count > 1 ? ` (x${count})` : '';
                const effectEl = document.createElement('div');
                effectEl.className = 'prestige-stat-entry';

                if (effectKey === 'slimeSplit') {
                    const isEnabled = gameState.isSlimeSplitEnabled !== false;
                    const imgSrc = isEnabled ? 'images/game_assets/on_button.png' : 'images/game_assets/off_button.png';
                    effectEl.innerHTML = `<img src="${imgSrc}" class="toggle-switch-img slime-split-toggle-img" alt="Toggle Slime Split"><div class="prestige-stat-text"><div>Absorbed Unique:</div><div>${effectData.name}${stackText}</div></div>`;
                    effectEl.title = `${effectData.description} Click to toggle ON/OFF.`;
                } else {
                    effectEl.innerHTML = `<i class="fas fa-magic"></i><div class="prestige-stat-text"><div>Absorbed Unique:</div><div>${effectData.name}${stackText}</div></div>`;
                    effectEl.title = effectData.description;
                }
                absorbedStatsListEl.appendChild(effectEl);
            }
        }
    }

    const absorbedSynergies = gameState.absorbedSynergies || {};
    const amethystSynergyValue = absorbedSynergies['dps_to_clickDamage'] || 0;
    if (amethystSynergyValue > 0) {
        const synergyEl = document.createElement('div');
        synergyEl.className = 'prestige-stat-entry';
        const synergyValueText = (amethystSynergyValue * 100).toFixed(1);
        synergyEl.innerHTML = `<i class="fas fa-magic"></i><div class="prestige-stat-text"><div>Absorbed Synergy:</div><div>+${synergyValueText}% DPS to Click</div></div>`;
        synergyEl.title = `Converts ${synergyValueText}% of your total DPS into Click Damage.`;
        absorbedStatsListEl.appendChild(synergyEl);
    }

    const nextPrestigeLevel = gameState.nextPrestigeLevel || 100;
    prestigeCountStatEl.textContent = (gameState.prestigeCount || 0).toString();
    prestigeRequirementTextEl.innerHTML = `Defeat the boss at Level <b>${nextPrestigeLevel}</b> to Prestige.`;
    (/** @type {HTMLButtonElement} */ (prestigeButton)).disabled = !gameState.currentRunCompletedLevels.includes(nextPrestigeLevel);
}

export function updateAutoProgressToggle(elements, isAutoProgressing) {
    if (elements.autoProgressToggleEl instanceof HTMLImageElement) {
        elements.autoProgressToggleEl.src = isAutoProgressing ? 'images/game_assets/on_button.png' : 'images/game_assets/off_button.png';
    }
}

export function updateGemCraftingUI(elements, craftingGems, gameState) {
    const { gemCraftingSlotsContainer, gemCraftBtn } = elements;
    const craftingSlots = gemCraftingSlotsContainer.querySelectorAll('.gem-crafting-slot');
    craftingSlots.forEach((slot, index) => {
        slot.innerHTML = '';
        if (craftingGems[index]) {
            slot.innerHTML = createGemHTML(craftingGems[index]);
        }
    });
    (/** @type {HTMLButtonElement} */ (gemCraftBtn)).disabled = craftingGems.length !== 2 || gameState.scrap < 100;
}

export function updateForge(elements, selectedItem, currentScrap) {
    const { forgeSelectedItemEl, forgeRerollBtn } = elements;
    if (selectedItem) {
        forgeSelectedItemEl.innerHTML = `<div class="item-wrapper">${createItemHTML(selectedItem, false)}</div>`;
    } else {
        forgeSelectedItemEl.innerHTML = `<p>Select an item to begin.</p>`;
    }
    (/** @type {HTMLButtonElement} */ (forgeRerollBtn)).disabled = !selectedItem || currentScrap < 50;
    
    // Update highlights
    elements.forgeInventorySlotsEl.querySelectorAll('.selected-for-forge').forEach(el => el.classList.remove('selected-for-forge'));
    if (selectedItem) {
        const itemEl = elements.forgeInventorySlotsEl.querySelector(`.item-wrapper[data-id="${selectedItem.id}"]`);
        if (itemEl) {
            itemEl.classList.add('selected-for-forge');
        }
    }
}

export function updateActivePresetButton(elements, gameState) {
    document.querySelectorAll('.preset-btn').forEach((btn, index) => {
        if(btn instanceof HTMLElement) {
            btn.textContent = gameState.presets[index].name;
            btn.classList.toggle('active', index === gameState.activePresetIndex);
        }
    });
}

export function toggleLootLog(buttonEl, logView, lootView) {
    if (buttonEl.classList.contains('active')) {
        buttonEl.classList.remove('active');
        buttonEl.textContent = 'View Loot';
        logView.classList.remove('hidden');
        lootView.classList.add('hidden');
    } else {
        buttonEl.classList.add('active');
        buttonEl.textContent = 'View Log';
        logView.classList.add('hidden');
        lootView.classList.remove('hidden');
    }
}

export function toggleSalvageMode(elements, isActive) {
    const { autoSalvageFilterBtn, salvageModeBtn, confirmSalvageBtn, selectAllSalvageBtn, salvageByRarityControls } = {
        autoSalvageFilterBtn: document.getElementById('auto-salvage-filter-btn'),
        salvageModeBtn: document.getElementById('salvage-mode-btn'),
        confirmSalvageBtn: document.getElementById('confirm-salvage-btn'),
        selectAllSalvageBtn: document.getElementById('select-all-salvage-btn'),
        salvageByRarityControls: document.getElementById('salvage-by-rarity-controls'),
    };

    salvageModeBtn.textContent = isActive ? 'Cancel Salvage' : 'Select to Salvage';
    salvageModeBtn.classList.toggle('active', isActive);
    autoSalvageFilterBtn.classList.toggle('hidden', isActive);
    confirmSalvageBtn.classList.toggle('hidden', !isActive);
    selectAllSalvageBtn.classList.toggle('hidden', !isActive);
    salvageByRarityControls.classList.toggle('hidden', !isActive);
    document.body.classList.toggle('salvage-mode-active', isActive);
    if (!isActive) {
        updateSalvageCount(elements, 0);
    }
}

export function updateSalvageCount(elements, count) {
    const el = document.getElementById('salvage-count');
    if (el) el.textContent = count.toString();
}

export function updateSocketingHighlights(elements, selectedGem, gameState) {
    // Clear all old highlights first
    document.querySelectorAll('.gem-wrapper.selected-gem').forEach(el => el.classList.remove('selected-gem'));
    document.querySelectorAll('.socket-target').forEach(el => el.classList.remove('socket-target'));

    if (selectedGem) {
        // Highlight the selected gem
        const gemEl = document.querySelector(`.gem-wrapper[data-id="${selectedGem.id}"]`);
        if (gemEl) gemEl.classList.add('selected-gem');
        
        // Highlight potential targets in inventory
        gameState.inventory.forEach((item) => {
            if (item.sockets && item.sockets.includes(null)) {
                const itemEl = document.querySelector(`#inventory-slots .item-wrapper[data-id="${item.id}"]`);
                if (itemEl) itemEl.classList.add('socket-target');
            }
        });

        // Highlight potential targets in equipment
        for (const slotName in gameState.equipment) {
            const item = gameState.equipment[slotName];
            if (item && item.sockets && item.sockets.includes(null)) {
                const slotEl = document.getElementById(`slot-${slotName}`);
                if (slotEl) slotEl.classList.add('socket-target');
            }
        }
    }
}

export function updateBulkCombineHighlights(elements, gameState, bulkCombineSelection, bulkCombineDeselectedIds) {
    const gemGrid = elements.gemSlotsEl;
    gemGrid.querySelectorAll('.gem-wrapper').forEach(wrapper => {
        wrapper.classList.remove('selected-for-bulk-combine');
        const gemId = wrapper.dataset.id;
        const gem = gameState.gems.find(g => String(g.id) === gemId);

        if (gem && bulkCombineSelection && bulkCombineSelection.tier && bulkCombineSelection.selectionKey) {
            const isSynergyCombine = bulkCombineSelection.selectionKey.startsWith('synergy_');
            let isMatch = false;
            if (isSynergyCombine) {
                const synergyKey = bulkCombineSelection.selectionKey.replace('synergy_', '');
                isMatch = gem.synergy && `${gem.synergy.source}_to_${gem.synergy.target}` === synergyKey;
            } else {
                isMatch = gem.stats && gem.stats[bulkCombineSelection.selectionKey];
            }

            if (gem.tier === bulkCombineSelection.tier && isMatch && !bulkCombineDeselectedIds.has(gem.id)) {
                wrapper.classList.add('selected-for-bulk-combine');
            }
        }
    });
}

export function renderPermanentUpgrades(elements, gameState) {
    const container = elements.permanentUpgradesContainerEl;
    container.innerHTML = '';

    for (const key in PERMANENT_UPGRADES) {
        const upgrade = PERMANENT_UPGRADES[key];
        const currentLevel = gameState.permanentUpgrades[key] || 0;
        const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costScalar, currentLevel));
        const isMaxed = currentLevel >= upgrade.maxLevel;
        
        const bonus = upgrade.bonusPerLevel * currentLevel;
        
        const card = document.createElement('div');
        card.className = 'permanent-upgrade-card';
        if (gameState.gold < cost && !isMaxed) card.classList.add('disabled');
        if (isMaxed) card.classList.add('maxed');

        const description = upgrade.description.replace('{value}', bonus.toFixed(2).replace(/\.?0+$/, '')); // Format bonus and remove trailing zeros

        card.innerHTML = `
            <div class="upgrade-icon"><i class="${upgrade.icon}"></i></div>
            <div class="upgrade-details">
                <h4>${upgrade.name}</h4>
                <p>${description}</p>
                <div class="upgrade-level">Level: ${currentLevel} / ${upgrade.maxLevel === Infinity ? '∞' : upgrade.maxLevel}</div>
            </div>
            <div class="upgrade-buy-section">
                ${isMaxed ? 'MAXED' : `<div class="upgrade-cost">${formatNumber(cost)} Gold</div>`}
                <button class="buy-permanent-upgrade-btn" data-upgrade-id="${upgrade.id}" ${gameState.gold < cost || isMaxed ? 'disabled' : ''}>Buy</button>
            </div>
        `;
        container.appendChild(card);
    }
}

/**
 * Shows the Developer Tool modal with lists of problematic items.
 * @param {DOMElements} elements The main DOM elements object.
 * @param {object[]} wikiData The compiled wiki data containing all item info.
 */
export async function showDevToolModal(elements, wikiData) {
    const {
        devToolModalBackdrop,
        devToolMissingImagesList,
        devToolOrphanedItemsList,
    } = elements;

    devToolMissingImagesList.innerHTML = '<li>Checking...</li>';
    devToolOrphanedItemsList.innerHTML = '<li>Checking...</li>';
    devToolModalBackdrop.classList.remove('hidden');

    // --- Check for Missing Images ---
    const imageCheckPromises = [];
    const missingImageItems = [];

    const allGameItems = { ...ITEMS, ...GEMS };

    for (const key in allGameItems) {
        const item = allGameItems[key];
        if (item.icon) {
            const promise = new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve({ item, status: 'ok' });
                img.onerror = () => resolve({ item, status: 'missing' });
                img.src = item.icon;
            });
            imageCheckPromises.push(promise);
        }
    }

    const imageResults = await Promise.all(imageCheckPromises);
    imageResults.forEach(result => {
        if (result.status === 'missing') {
            missingImageItems.push(result.item);
        }
    });

    devToolMissingImagesList.innerHTML = '';
    if (missingImageItems.length > 0) {
        missingImageItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.id} (${item.icon})`;
            devToolMissingImagesList.appendChild(li);
        });
    } else {
        devToolMissingImagesList.innerHTML = '<li>All item images loaded successfully.</li>';
    }

    // --- Check for Orphaned Items ---
    const orphanedItems = wikiData.filter(itemData => itemData.dropSources.length === 0);
    
    devToolOrphanedItemsList.innerHTML = '';
    if (orphanedItems.length > 0) {
        orphanedItems.forEach(itemData => {
            const li = document.createElement('li');
            li.textContent = `${itemData.id} (${itemData.base.name})`;
            devToolOrphanedItemsList.appendChild(li);
        });
    } else {
        devToolOrphanedItemsList.innerHTML = '<li>No orphaned items found.</li>';
    }
}