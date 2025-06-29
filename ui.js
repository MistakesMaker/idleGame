// --- START OF FILE ui.js ---

import { STATS } from './data/stat_pools.js';
import { getXpForNextLevel, getUpgradeCost, formatNumber, findSubZoneByLevel, getCombinedItemStats, findEmptySpot } from './utils.js';
import { ITEMS } from './data/items.js';
import { MONSTERS } from './data/monsters.js';
import { UNIQUE_EFFECTS } from './data/unique_effects.js';
import * as player from './player_actions.js';

/**
 * Checks if an item is a "boss unique" by seeing if it only drops from one boss monster in the entire game.
 * @param {string} itemId The base ID of the item to check.
 * @returns {boolean} True if the item is a unique boss drop, false otherwise.
 */
function isBossUnique(itemId) {
    // First, check if the item itself is defined as a unique.
    const itemBase = ITEMS[itemId];
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
            return false; // Optimization: if we find it twice, it can't be a unique drop.
        }
    }

    // Now, it must be a unique item that drops from exactly one source, and that source must be a boss.
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
        mapContainerEl: document.getElementById('map-container'),
        mapTitleEl: document.getElementById('map-title'),
        backToWorldMapBtnEl: document.getElementById('back-to-world-map-btn'),
        modalBackdropEl: document.getElementById('modal-backdrop'),
        modalContentEl: document.getElementById('modal-content'),
        modalTitleEl: document.getElementById('modal-title'),
        modalBodyEl: document.getElementById('modal-body'),
        modalCloseBtnEl: document.getElementById('modal-close-btn'),
        autoProgressCheckboxEl: document.getElementById('auto-progress-checkbox'),
        realmTabsContainerEl: document.getElementById('realm-tabs-container'),
        gemSlotsEl: document.getElementById('gem-slots'),
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

        // Bulk Gem Combine
        bulkCombineTierSelect: document.getElementById('bulk-combine-tier-select'),
        bulkCombineStatSelect: document.getElementById('bulk-combine-stat-select'),
        bulkCombineBtn: document.getElementById('bulk-combine-btn'),

        // New Prestige and Unlock Slot elements
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

        // View Prestige Slots Modal
        viewPrestigeSlotsBtn: document.getElementById('view-prestige-slots-btn'),
        viewSlotsModalBackdrop: document.getElementById('view-slots-modal-backdrop'),
        viewSlotsPaperdoll: document.getElementById('view-slots-paperdoll'),
        viewSlotsCloseBtn: document.getElementById('view-slots-close-btn'),
    };
}

/**
 * Gathers DOM elements specific to the Salvage Filter.
 */
export function initSalvageFilterDOMElements() {
    return {
        enableSalvageFilter: document.getElementById('enable-salvage-filter'),
        enableGemSalvage: document.getElementById('enable-gem-salvage'), // NEW
        salvageFilterControls: document.getElementById('salvage-filter-controls'),
        filterKeepRarity: document.getElementById('filter-keep-rarity'),
        filterKeepSockets: document.getElementById('filter-keep-sockets'),
        filterKeepStatsContainer: document.getElementById('filter-keep-stats-container')
    };
}

/**
 * Populates the salvage filter controls with the correct options and sets their initial values.
 * @param {object} elements - The main DOM elements object.
 * @param {object} gameState - The current game state.
 */
export function populateSalvageFilter(elements, gameState) {
    const { filterKeepStatsContainer } = initSalvageFilterDOMElements();
    if (!filterKeepStatsContainer) return; // Add a guard clause
    
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
 * Renders a list of items or gems into a grid container.
 * @param {HTMLElement} containerEl - The grid container element.
 * @param {Array<object>} items - The array of items or gems to render.
 * @param {object} options - Configuration options.
 */
export function renderGrid(containerEl, items, options = {}) {
    const { calculatePositions = false, type = 'item', selectedItem = null, salvageSelections = [], showLockIcon = true, bulkCombineSelection = {}, bulkCombineDeselectedIds = new Set() } = options;
    
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
                tempPlacement.push({ ...item, ...pos });
            }
        } else {
            pos = { x: item.x, y: item.y };
        }

        if (pos && pos.x !== -1) {
            wrapper.style.gridColumn = `${pos.x + 1} / span ${item.width}`;
            wrapper.style.gridRow = `${pos.y + 1} / span ${item.height}`;
            
            const currentMaxRow = pos.y + item.height;
            if (currentMaxRow > maxRow) {
                maxRow = currentMaxRow;
            }

            wrapper.innerHTML = type === 'gem' ? createGemHTML(item) : createItemHTML(item, showLockIcon);
            
            if (item.locked) wrapper.classList.add('locked-item');
            if (selectedItem && selectedItem.id === item.id) wrapper.classList.add('selected-for-forge');
            if (salvageSelections.some(sel => sel.id === item.id)) wrapper.classList.add('selected-for-salvage');

            if (type === 'gem' && bulkCombineSelection && bulkCombineSelection.tier && bulkCombineSelection.statKey) {
                if (item.tier === bulkCombineSelection.tier && item.stats && item.stats[bulkCombineSelection.statKey] && !bulkCombineDeselectedIds.has(item.id)) {
                    wrapper.classList.add('selected-for-bulk-combine');
                }
            }
            
            containerEl.appendChild(wrapper);
        }
    }
    containerEl.style.gridTemplateRows = `repeat(${Math.max(10, maxRow)}, var(--grid-cell-size))`;
}

/**
 * Updates the entire game UI based on the current state.
 */
export function updateUI(elements, gameState, playerStats, currentMonster, salvageMode, craftingGems = [], selectedItemForForge = null, bulkCombineSelection = {}, bulkCombineDeselectedIds = new Set()) {
    const {
        goldStatEl, scrapStatEl, heroXpTextEl, clickDamageStatEl, dpsStatEl, absorbedStatsListEl,
        monsterHealthTextEl, upgradeClickCostEl, upgradeDpsCostEl, heroLevelEl,
        heroXpBarEl, attributePointsEl, attrStrengthEl, attrAgilityEl, attrLuckEl, addStrengthBtn,
        addAgilityBtn, addLuckBtn, bonusGoldStatEl, magicFindStatEl, prestigeCountStatEl,
        prestigeRequirementTextEl, currentLevelEl, autoProgressCheckboxEl, monsterHealthBarEl,
        upgradeClickLevelEl, upgradeDpsLevelEl, inventorySlotsEl, lootMonsterNameEl,
        lootTableDisplayEl, prestigeButton, gemSlotsEl, gemCraftingSlotsContainer, gemCraftBtn,
        forgeInventorySlotsEl, forgeSelectedItemEl, forgeRerollBtn,
        prestigeEquipmentPaperdoll, prestigeInventoryDisplay, prestigeSelectionCount, prestigeSelectionMax,
        goldenSlimeStreakEl
    } = elements;

    // --- Stats and Hero Info ---
    const xpToNextLevel = getXpForNextLevel(gameState.hero.level);

    // --- Currency/Stat Formatting & Coloring ---
    const getNumberTier = (amount) => {
        if (amount < 1e3) return 0;
        if (amount < 1e6) return 1;
        if (amount < 1e9) return 2;
        if (amount < 1e12) return 3;
        if (amount < 1e15) return 4;
        if (amount < 1e18) return 5;
        return 6;
    };
    
    const goldTier = getNumberTier(gameState.gold);
    const scrapTier = getNumberTier(gameState.scrap);
    goldStatEl.className = `currency-tier-${goldTier}`;
    scrapStatEl.className = `currency-tier-${scrapTier}`;
    goldStatEl.textContent = formatNumber(gameState.gold);
    scrapStatEl.textContent = formatNumber(gameState.scrap);

    const dpsTier = getNumberTier(playerStats.totalDps);
    const clickTier = getNumberTier(playerStats.totalClickDamage);
    dpsStatEl.className = `currency-tier-${dpsTier}`;
    clickDamageStatEl.className = `currency-tier-${clickTier}`;
    clickDamageStatEl.textContent = formatNumber(playerStats.totalClickDamage);
    dpsStatEl.textContent = formatNumber(playerStats.totalDps);
    
    // --- End Currency Formatting ---

    heroXpTextEl.textContent = `${formatNumber(gameState.hero.xp)} / ${formatNumber(xpToNextLevel)}`;
    heroLevelEl.textContent = gameState.hero.level.toString();
    heroXpBarEl.style.width = `${(gameState.hero.xp / xpToNextLevel) * 100}%`;
    attributePointsEl.textContent = gameState.hero.attributePoints.toString();
    attrStrengthEl.textContent = gameState.hero.attributes.strength.toString();
    attrAgilityEl.textContent = gameState.hero.attributes.agility.toString();
    attrLuckEl.textContent = gameState.hero.attributes.luck.toString();
    const havePoints = gameState.hero.attributePoints > 0;
    (/** @type {HTMLButtonElement} */ (addStrengthBtn)).disabled = !havePoints;
    (/** @type {HTMLButtonElement} */ (addAgilityBtn)).disabled = !havePoints;
    (/** @type {HTMLButtonElement} */ (addLuckBtn)).disabled = !havePoints;
    bonusGoldStatEl.textContent = playerStats.bonusGold.toFixed(1);
    magicFindStatEl.textContent = playerStats.magicFind.toFixed(1);

    // --- Monster Info ---
    const isSpecialMonster = currentMonster && currentMonster.data.isSpecial;
    currentLevelEl.textContent = isSpecialMonster ? '??' : gameState.currentFightingLevel.toString();
    monsterHealthTextEl.textContent = `${formatNumber(Math.ceil(Math.max(0, gameState.monster.hp)))} / ${formatNumber(gameState.monster.maxHp)}`;
    const healthPercent = (gameState.monster.hp / gameState.monster.maxHp) * 100;
    monsterHealthBarEl.style.width = `${healthPercent}%`;
    if (healthPercent < 30) monsterHealthBarEl.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
    else if (healthPercent < 60) monsterHealthBarEl.style.background = 'linear-gradient(to right, #f39c12, #e67e22)';
    else monsterHealthBarEl.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';

    // Golden Slime Streak UI
    if (gameState.goldenSlimeStreak > 1 && currentMonster.data.id === 'GOLDEN_SLIME') {
        goldenSlimeStreakEl.classList.remove('hidden', 'streak-fade-out');
        const span = goldenSlimeStreakEl.querySelector('span');
        if(span) span.textContent = gameState.goldenSlimeStreak.toString();
    } else {
         if (!goldenSlimeStreakEl.classList.contains('hidden') && !goldenSlimeStreakEl.classList.contains('streak-fade-out')) {
            // This condition is met when the streak has just been broken.
            goldenSlimeStreakEl.classList.add('streak-fade-out');
            setTimeout(() => {
                goldenSlimeStreakEl.classList.add('hidden');
                goldenSlimeStreakEl.classList.remove('streak-fade-out');
            }, 2000);
        }
    }


    // --- Upgrades ---
    const clickCost = getUpgradeCost('clickDamage', gameState.upgrades.clickDamage);
    const dpsCost = getUpgradeCost('dps', gameState.upgrades.dps);
    upgradeClickCostEl.textContent = formatNumber(clickCost);
    upgradeDpsCostEl.textContent = formatNumber(dpsCost);
    upgradeClickLevelEl.textContent = `Lvl ${gameState.upgrades.clickDamage}`;
    upgradeDpsLevelEl.textContent = `Lvl ${gameState.upgrades.dps}`;
    document.getElementById('upgrade-click-damage').classList.toggle('disabled', gameState.gold < clickCost);
    document.getElementById('upgrade-dps').classList.toggle('disabled', gameState.gold < dpsCost);
    (/** @type {HTMLButtonElement} */ (document.getElementById('buy-loot-crate-btn'))).disabled = gameState.scrap < 50;
    
    // --- Grid Renders ---
    renderGrid(inventorySlotsEl, gameState.inventory, { calculatePositions: true, salvageSelections: salvageMode.selections, showLockIcon: true });
    renderGrid(gemSlotsEl, gameState.gems, { type: 'gem', calculatePositions: true, bulkCombineSelection, bulkCombineDeselectedIds });
    
    const allForgeItems = player.getAllItems(gameState);
    renderGrid(forgeInventorySlotsEl, allForgeItems, { calculatePositions: true, selectedItem: selectedItemForForge, showLockIcon: false });

    if (selectedItemForForge) {
        forgeSelectedItemEl.innerHTML = `<div class="item-wrapper">${createItemHTML(selectedItemForForge, false)}</div>`;
    } else {
        forgeSelectedItemEl.innerHTML = `<p>Select an item to begin.</p>`;
    }
    (/** @type {HTMLButtonElement} */ (forgeRerollBtn)).disabled = !selectedItemForForge || gameState.scrap < 50;
    
    // --- Paperdoll Equipment ---
    for (const slotName in gameState.equipment) {
        const slotEl = document.getElementById(`slot-${slotName}`);
        if (!slotEl) continue;
        const item = gameState.equipment[slotName];
        slotEl.innerHTML = '';
        if (item) {
            slotEl.innerHTML = createItemHTML(item, false); // Don't show lock icon on paperdoll
        } else {
            const placeholder = document.createElement('img');
            placeholder.src = getItemIcon(slotName.replace(/\d/g, ''));
            placeholder.className = 'placeholder-icon';
            slotEl.appendChild(placeholder);
        }
    }
    
    // --- Gem Crafting ---
    const craftingSlots = gemCraftingSlotsContainer.querySelectorAll('.gem-crafting-slot');
    craftingSlots.forEach((slot, index) => {
        slot.innerHTML = '';
        if (craftingGems[index]) {
            slot.innerHTML = createGemHTML(craftingGems[index]);
        }
    });
    (/** @type {HTMLButtonElement} */ (gemCraftBtn)).disabled = craftingGems.length !== 2 || gameState.scrap < 100;
    
    // --- Presets ---
    document.querySelectorAll('.preset-btn').forEach((btn, index) => {
        btn.textContent = gameState.presets[index].name;
        btn.classList.toggle('active', index === gameState.activePresetIndex);
    });
    
    // --- Prestige Area ---
    absorbedStatsListEl.innerHTML = '';
    const absorbedStats = gameState.absorbedStats || {};
    const prestigeStatsToShow = {
        [STATS.DPS.key]: { icon: 'fa-sword', label: 'DPS' },
        [STATS.CLICK_DAMAGE.key]: { icon: 'fa-hand-rock', label: 'Click Dmg' },
        [STATS.GOLD_GAIN.key]: { icon: 'fa-coins', label: '% Gold Gain' },
        [STATS.MAGIC_FIND.key]: { icon: 'fa-star', label: '% Magic Find' },
    };

    for (const [key, config] of Object.entries(prestigeStatsToShow)) {
        if (absorbedStats[key] > 0) {
            const isPercent = STATS[Object.keys(STATS).find(k => STATS[k].key === key)].type === 'percent';
            const value = isPercent ? `${absorbedStats[key].toFixed(2)}%` : formatNumber(absorbedStats[key]);
            
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
                effectEl.innerHTML = `<i class="fas fa-magic"></i><div class="prestige-stat-text"><div>Absorbed Unique:</div><div>${effectData.name}${stackText}</div></div>`;
                effectEl.title = effectData.description;
                absorbedStatsListEl.appendChild(effectEl);
            }
        }
    }

    // --- CORRECTED: Display Absorbed Amethyst Synergy ---
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
    // --- END: Display Absorbed Amethyst Synergy ---

    const nextPrestigeLevel = gameState.nextPrestigeLevel || 100;
    prestigeCountStatEl.textContent = (gameState.prestigeCount || 0).toString();
    prestigeRequirementTextEl.innerHTML = `Defeat the boss at Level <b>${nextPrestigeLevel}</b> to Prestige.`;
    (/** @type {HTMLButtonElement} */ (prestigeButton)).disabled = !gameState.currentRunCompletedLevels.includes(nextPrestigeLevel);

    // --- New Prestige View UI ---
    if (elements.prestigeView.classList.contains('active')) {
        const unlockedItemTypes = gameState.unlockedPrestigeSlots.map(slot => slot.replace(/\d/g, ''));
        const allItems = player.getAllItems(gameState);
        const filteredInventory = allItems.filter(item => {
            const itemType = item.type.replace(/\d/g, '');
            return unlockedItemTypes.includes(itemType);
        });

        renderGrid(prestigeInventoryDisplay, filteredInventory, { calculatePositions: true, showLockIcon: false });
        
        prestigeEquipmentPaperdoll.querySelectorAll('.equipment-slot').forEach(slotEl => {
            const slotName = slotEl.id.replace('prestige-slot-', '');
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

            const isUnlocked = gameState.unlockedPrestigeSlots.includes(slotName);
            slotEl.classList.toggle('prestige-locked', !isUnlocked);
            slotEl.classList.toggle('prestige-unlocked', isUnlocked);

            slotEl.classList.remove('selected-for-prestige');
        });
        const currentSelections = gameState.unlockedPrestigeSlots.map(slot => gameState.equipment[slot]).filter(Boolean).length;
        prestigeSelectionCount.textContent = currentSelections;
        prestigeSelectionMax.textContent = gameState.unlockedPrestigeSlots.length;
    }


    // --- Map and Monster Info ---
    (/** @type {HTMLInputElement} */ (autoProgressCheckboxEl)).checked = gameState.isAutoProgressing;
    const monsterDef = currentMonster.data;
    if (monsterDef) {
        // --- NEW: Kill Count Display Logic ---
        const monsterKey = Object.keys(MONSTERS).find(key => MONSTERS[key] === monsterDef);
        const killCount = (monsterKey && gameState.monsterKillCounts && gameState.monsterKillCounts[monsterKey]) ? gameState.monsterKillCounts[monsterKey] : 0;
        const killCountTier = getNumberTier(killCount);
        lootMonsterNameEl.innerHTML = `${currentMonster.name} <span style="font-size: 0.7em; color: #bdc3c7;">(Kills: <span class="currency-tier-${killCountTier}">${formatNumber(killCount)}</span>)</span>`;
        // --- END: Kill Count Display Logic ---

        lootTableDisplayEl.innerHTML = '';
        if(monsterDef.lootTable && monsterDef.lootTable.length > 0) {
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

    // --- Salvage Filter ---
    const filterElements = initSalvageFilterDOMElements();
    const filter = gameState.salvageFilter;
    (/** @type {HTMLInputElement} */ (filterElements.enableSalvageFilter)).checked = filter.enabled;
    (/** @type {HTMLInputElement} */ (filterElements.enableGemSalvage)).checked = filter.autoSalvageGems; // NEW
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
    
    // Base item stats
    let statsHTML = '<ul>';
    if (item.stats) {
        for (const statKey in item.stats) {
            const statInfo = Object.values(STATS).find(s => s.key === statKey) || { name: statKey, type: 'flat' };
            const statName = statInfo.name;
            const value = item.stats[statKey];
            const statValue = statInfo.type === 'percent' ? `${value.toFixed(1)}%` : formatNumber(value);
            statsHTML += `<li>+${statValue} ${statName}</li>`;
        }
    }
    statsHTML += '</ul>';

    // Gem stats blueprint
    let gemsHTML = '';
    if (item.sockets && item.sockets.some(g => g !== null)) {
        gemsHTML += '<div class="tooltip-gem-stats">';
        item.sockets.forEach(gem => {
            if (gem) {
                const gemName = gem.name || `T${gem.tier} Gem`;
                gemsHTML += `<div class="tooltip-gem-stats-header"><img src="${gem.icon}" alt="${gemName}">${gemName}</div>`;
                gemsHTML += '<ul>';
                if (gem.stats) {
                    for (const statKey in gem.stats) {
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

    // Unique effect
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

    // --- Header ---
    const uniqueClass = itemBase?.isUnique ? 'unique-item-name' : '';
    let html = `<div class="item-header"><span class="${hoveredItem.rarity}">${hoveredItem.name}</span></div>`;
    html += `<div style="font-size: 0.9em; color: #95a5a6; margin-bottom: 5px;">${hoveredItem.rarity.charAt(0).toUpperCase() + hoveredItem.rarity.slice(1)} ${hoveredItem.type.charAt(0).toUpperCase() + hoveredItem.type.slice(1)}</div>`;

    // --- Stats & Comparison ---
    const hoveredStats = getCombinedItemStats(hoveredItem);
    let statsHTML = '';

    if (hoveredItem.type === 'ring' && equippedItem2) {
        // --- DUAL RING COMPARISON ---
        statsHTML = createDualRingComparison(hoveredStats, equippedItem, equippedItem2);
    } else {
        // --- STANDARD SINGLE COMPARISON ---
        const comparisonTargetStats = equippedItem ? getCombinedItemStats(equippedItem) : {};
        const allStatKeys = new Set([...Object.keys(hoveredStats), ...Object.keys(comparisonTargetStats)]);
        
        let statListHtml = '<ul>';
        allStatKeys.forEach(statKey => {
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
        });
        statListHtml += '</ul>';
        statsHTML = statListHtml;
    }
    
    html += statsHTML;

    // --- Gem & Unique Blueprints (for hovered item only) ---
    html += createDetailedItemStatBlockHTML(hoveredItem).replace(/<ul>.*?<\/ul>/, ''); 

    // --- Sockets Visual ---
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
    
    // Function to generate one side of the comparison
    const generateComparisonSide = (equippedRing, title) => {
        let sideHtml = `<div><h5>vs. ${title}</h5>`;
        const equippedStats = equippedRing ? getCombinedItemStats(equippedRing) : {};
        const allStatKeys = new Set([...Object.keys(hoveredStats), ...Object.keys(equippedStats)]);
        
        let statListHtml = '<ul>';
        if (allStatKeys.size === 0 && !equippedRing) {
             statListHtml += '<li>(Empty Slot)</li>';
        } else if (allStatKeys.size === 0 && equippedRing) {
             statListHtml += '<li>(No stats)</li>';
        }else {
            allStatKeys.forEach(statKey => {
                const hoveredValue = hoveredStats[statKey] || 0;
                const equippedValue = equippedStats[statKey] || 0;
                const diff = hoveredValue - equippedValue;
                const statInfo = Object.values(STATS).find(s => s.key === statKey) || { name: statKey, type: 'flat' };
                const isPercent = statInfo.type === 'percent';
                
                let diffSpan = '';
                if (Math.abs(diff) > 0.001) {
                    const diffClass = diff > 0 ? 'stat-better' : 'stat-worse';
                    const sign = diff > 0 ? '+' : '';
                    const diffStr = isPercent ? `${diff.toFixed(1)}%` : formatNumber(diff);
                    diffSpan = ` <span class="${diffClass}">(${sign}${diffStr})</span>`;
                }
                statListHtml += `<li>${statInfo.name}${diffSpan}</li>`;
            });
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
        for (const statKey in gem.stats) {
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
    itemBase.possibleStats.forEach(statInfo => {
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
    potentialItem.possibleStats.forEach(statInfo => {
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
                socketsHTML += `<div class="socket"><img src="${gem.icon}" alt="${gem.name}"></div>`;
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
    return `<div class="gem" data-gem-id="${String(gem.id)}">
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
 */
export function showItemDropAnimation(popupContainerEl, item) {
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

    const startX = 40 + Math.random() * 20;
    const startY = 40 + Math.random() * 20;
    wrapper.style.left = `${startX}%`;
    wrapper.style.top = `${startY}%`;

    const horizontalDirection = Math.random() < 0.5 ? -1 : 1;
    const peakX = (50 + Math.random() * 50) * horizontalDirection;
    const peakY = -(150 + Math.random() * 50);
    const endX = (100 + Math.random() * 50) * horizontalDirection;
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

export function createMapNode(name, iconSrc, coords, isUnlocked, isCompleted, currentFightingLevel, levelRange = null, isBoss = false) {
    const node = document.createElement('div');
    node.className = 'map-node';
    if (!isUnlocked) node.classList.add('locked');
    if (isBoss) node.classList.add('boss-node');

    const currentFightingSubZone = findSubZoneByLevel(currentFightingLevel);
    if (currentFightingSubZone && currentFightingSubZone.name === name) {
        node.classList.add('active-zone');
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
    
    const finalIconSrc = isBoss ? 'images/icons/boss.png' : iconSrc;

    let iconHtml = `<img src="${finalIconSrc}" class="map-node-icon ${isUnlocked ? '' : 'locked'} ${isCompleted ? 'completed' : ''}">`;
    if (isCompleted) {
        iconHtml += `<i class="fas fa-check-circle map-node-completed-icon"></i>`;
    }
    if (!isUnlocked) {
        iconHtml += `<i class="fas fa-lock map-node-lock-icon"></i>`;
    }

    node.innerHTML = `
        ${iconHtml}
        <span class="map-node-label">${name}${levelText}</span>
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
 * @param {object} elements - The DOMElements object.
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
 * @param {object} elements - The DOMElements object.
 */
export function hideUnlockSlotModal(elements) {
    elements.unlockSlotModalBackdrop.classList.add('hidden');
}

/**
 * Shows the modal for viewing unlocked prestige slots using a paperdoll.
 * @param {object} elements - The DOMElements object.
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
 * @param {object} elements - The DOMElements object.
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