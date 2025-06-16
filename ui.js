// --- START OF FILE ui.js ---

import { STATS } from './data/stat_pools.js';
import { getXpForNextLevel, getUpgradeCost, formatNumber, findSubZoneByLevel, getCombinedItemStats } from './utils.js';
import { ITEMS } from './data/items.js';

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
        inventorySlotsEl: document.getElementById('inventory-slots'),
        gameLogEl: document.getElementById('game-log'),
        prestigeSelectionEl: document.getElementById('prestige-selection'),
        prestigeInventorySlotsEl: document.getElementById('prestige-inventory-slots'),
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
    };
}

/**
 * Updates the entire game UI based on the current state.
 */
export function updateUI(elements, gameState, playerStats, currentMonster, salvageMode, craftingGems = [], selectedItemForForge = null) {
    const {
        goldStatEl, scrapStatEl, heroXpTextEl, clickDamageStatEl, dpsStatEl, absorbedStatsListEl,
        monsterHealthTextEl, upgradeClickCostEl, upgradeDpsCostEl, heroLevelEl,
        heroXpBarEl, attributePointsEl, attrStrengthEl, attrAgilityEl, attrLuckEl, addStrengthBtn,
        addAgilityBtn, addLuckBtn, bonusGoldStatEl, magicFindStatEl, prestigeCountStatEl,
        prestigeRequirementTextEl, currentLevelEl, autoProgressCheckboxEl, monsterHealthBarEl,
        upgradeClickLevelEl, upgradeDpsLevelEl, inventorySlotsEl, lootMonsterNameEl,
        lootTableDisplayEl, prestigeButton, gemSlotsEl, gemCraftingSlotsContainer, gemCraftBtn,
        forgeInventorySlotsEl, forgeSelectedItemEl, forgeRerollBtn
    } = elements;

    const xpToNextLevel = getXpForNextLevel(gameState.hero.level);
    goldStatEl.textContent = formatNumber(gameState.gold);
    scrapStatEl.textContent = formatNumber(gameState.scrap);
    heroXpTextEl.textContent = `${formatNumber(gameState.hero.xp)} / ${formatNumber(xpToNextLevel)}`;
    clickDamageStatEl.textContent = formatNumber(playerStats.totalClickDamage);
    dpsStatEl.textContent = formatNumber(playerStats.totalDps);
    
    absorbedStatsListEl.innerHTML = '';
    const absorbedStats = gameState.absorbedStats || {};
    for (const statKey in absorbedStats) {
        if (absorbedStats[statKey] > 0) {
            const statInfo = Object.values(STATS).find(s => s.key === statKey) || { name: `${statKey.charAt(0).toUpperCase() + statKey.slice(1)}`, type: 'flat' };
            const isPercent = statInfo.type === 'percent';
            const value = absorbedStats[statKey];
            const displayValue = isPercent ? `${value.toFixed(2)}%` : formatNumber(value);

            let iconClass = 'fa-question-circle'; 
            if (statKey === STATS.CLICK_DAMAGE.key) iconClass = 'fa-hand-rock';
            if (statKey === STATS.DPS.key) iconClass = 'fa-sword';
            if (statKey === STATS.GOLD_GAIN.key) iconClass = 'fa-coins';
            if (statKey === STATS.MAGIC_FIND.key) iconClass = 'fa-star';

            const statEl = document.createElement('p');
            statEl.innerHTML = `<i class="fas ${iconClass}"></i> ${statInfo.name}: <span>${displayValue}</span>`;
            absorbedStatsListEl.appendChild(statEl);
        }
    }

    const absorbedSynergies = gameState.absorbedSynergies || [];
    for (const synergy of absorbedSynergies) {
        if (synergy.value > 0) {
            const statEl = document.createElement('p');
            statEl.innerHTML = `<i class="fas fa-link"></i> Absorbed Special: <span>+${(synergy.value * 100).toFixed(2)}% of DPS to Click Dmg</span>`;
            absorbedStatsListEl.appendChild(statEl);
        }
    }

    monsterHealthTextEl.textContent = `${formatNumber(Math.ceil(Math.max(0, gameState.monster.hp)))} / ${formatNumber(gameState.monster.maxHp)}`;
    const clickCost = getUpgradeCost('clickDamage', gameState.upgrades.clickDamage);
    const dpsCost = getUpgradeCost('dps', gameState.upgrades.dps);
    upgradeClickCostEl.textContent = formatNumber(clickCost);
    upgradeDpsCostEl.textContent = formatNumber(dpsCost);
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
    prestigeCountStatEl.textContent = (gameState.prestigeCount || 0).toString();
    currentLevelEl.textContent = gameState.currentFightingLevel.toString();
    (/** @type {HTMLInputElement} */ (autoProgressCheckboxEl)).checked = gameState.isAutoProgressing;
    const healthPercent = (gameState.monster.hp / gameState.monster.maxHp) * 100;
    monsterHealthBarEl.style.width = `${healthPercent}%`;
    if (healthPercent < 30) monsterHealthBarEl.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
    else if (healthPercent < 60) monsterHealthBarEl.style.background = 'linear-gradient(to right, #f39c12, #e67e22)';
    else monsterHealthBarEl.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';
    upgradeClickLevelEl.textContent = `Lvl ${gameState.upgrades.clickDamage}`;
    upgradeDpsLevelEl.textContent = `Lvl ${gameState.upgrades.dps}`;
    document.getElementById('upgrade-click-damage').classList.toggle('disabled', gameState.gold < clickCost);
    document.getElementById('upgrade-dps').classList.toggle('disabled', gameState.gold < dpsCost);
    (/** @type {HTMLButtonElement} */ (document.getElementById('buy-loot-crate-btn'))).disabled = gameState.scrap < 50;
    inventorySlotsEl.innerHTML = '';
    if (gameState.inventory.length > 0) {
        gameState.inventory.forEach((item, index) => {
            const itemWrapper = document.createElement('div');
            itemWrapper.className = 'item-wrapper';
            itemWrapper.dataset.index = index.toString();
            itemWrapper.innerHTML = createItemHTML(item, false);
            if (salvageMode.active && salvageMode.selections.includes(index)) {
                const itemDiv = itemWrapper.querySelector('.item');
                if (itemDiv) itemDiv.classList.add('selected-for-salvage');
            }
            inventorySlotsEl.appendChild(itemWrapper);
        });
    } else {
        inventorySlotsEl.innerHTML = `<p style="text-align:center; width:100%;">No items.</p>`;
    }
    for (const slotName in gameState.equipment) {
        const slotEl = document.getElementById(`slot-${slotName}`);
        if (!slotEl) continue;
        const item = gameState.equipment[slotName];
        slotEl.innerHTML = '';
        if (item) {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = createItemHTML(item, true); 
            itemDiv.dataset.slotName = slotName;
            slotEl.appendChild(itemDiv);
        } else {
            const placeholder = document.createElement('img');
            placeholder.src = getItemIcon(slotName.replace(/\d/g, ''));
            placeholder.className = 'placeholder-icon';
            slotEl.appendChild(placeholder);
        }
    }

    gemSlotsEl.innerHTML = '';
    if (gameState.gems && gameState.gems.length > 0) {
        gameState.gems.forEach((gem) => {
            const gemDiv = document.createElement('div');
            gemDiv.innerHTML = createGemHTML(gem);
            const firstChild = gemDiv.firstChild;
            if(firstChild) gemSlotsEl.appendChild(firstChild);
        });
    } else {
        gemSlotsEl.innerHTML = '<p>No gems yet. Find them as rare drops!</p>';
    }

    const craftingSlots = gemCraftingSlotsContainer.querySelectorAll('.gem-crafting-slot');
    craftingSlots.forEach((slot, index) => {
        slot.innerHTML = '';
        if (craftingGems[index]) {
            slot.innerHTML = createGemHTML(craftingGems[index]);
        }
    });
    (/** @type {HTMLButtonElement} */ (gemCraftBtn)).disabled = craftingGems.length !== 2 || gameState.scrap < 100;


    document.querySelectorAll('.preset-btn').forEach((btn, index) => {
        btn.textContent = gameState.presets[index].name;
        btn.classList.toggle('active', index === gameState.activePresetIndex);
    });
    
    // --- PRESTIGE UI UPDATE ---
    const nextPrestigeLevel = gameState.nextPrestigeLevel || 100;
    if (prestigeRequirementTextEl) {
        prestigeRequirementTextEl.innerHTML = `Defeat the boss at Level <b>${nextPrestigeLevel}</b> to Prestige.`;
    }
    (/** @type {HTMLButtonElement} */ (prestigeButton)).disabled = !gameState.completedLevels.includes(nextPrestigeLevel);

    const monsterDef = currentMonster.data;
    if (monsterDef) {
        lootMonsterNameEl.textContent = currentMonster.name;
        lootTableDisplayEl.innerHTML = '';
        if(monsterDef.lootTable && monsterDef.lootTable.length > 0) {
            const totalWeight = monsterDef.lootTable.reduce((sum, entry) => sum + entry.weight, 0);
            monsterDef.lootTable.forEach((entry, index) => {
                const itemChance = (entry.weight / totalWeight) * monsterDef.dropChance;
                const entryDiv = document.createElement('div');
                entryDiv.className = 'loot-table-entry';
                entryDiv.dataset.lootIndex = index.toString(); 
                entryDiv.innerHTML = `
                    <img src="${entry.item.icon}" class="loot-item-icon" alt="${entry.item.name}">
                    <div class="loot-item-details">
                        <div class="item-name">${entry.item.name}</div>
                        <div class="drop-chance">${itemChance.toFixed(2)}% chance</div>
                    </div>
                `;
                lootTableDisplayEl.appendChild(entryDiv);
            });
        } else {
            lootTableDisplayEl.innerHTML = '<p>This monster has no special drops.</p>';
        }
    }

    // --- FORGE UI UPDATE ---
    forgeInventorySlotsEl.innerHTML = '';
    
    const allPlayerItems = [
        ...Object.entries(gameState.equipment)
            .filter(([slot, item]) => item && item.stats)
            .map(([slot, item]) => ({ ...item, location: 'equipment', slot: slot })),
        ...gameState.inventory
            .map((item, index) => ({ ...item, location: 'inventory', index: index }))
            .filter(item => item && item.stats)
    ];

    allPlayerItems.sort((a, b) => {
        const aIsEquipped = a.location === 'equipment';
        const bIsEquipped = b.location === 'equipment';
        if (aIsEquipped !== bIsEquipped) return aIsEquipped ? -1 : 1;
        if (a.locked !== b.locked) return a.locked ? -1 : 1;
        return 0;
    });

    if (allPlayerItems.length > 0) {
        allPlayerItems.forEach(item => {
            const itemWrapper = document.createElement('div');
            itemWrapper.className = 'item-wrapper';
            itemWrapper.dataset.location = item.location;
            if (item.location === 'equipment') {
                itemWrapper.dataset.slot = item.slot;
            } else {
                itemWrapper.dataset.index = item.index.toString();
            }
            
            itemWrapper.innerHTML = createItemHTML(item, false);
            
            if (selectedItemForForge && selectedItemForForge.id === item.id) {
                const itemDiv = itemWrapper.querySelector('.item');
                if (itemDiv) itemDiv.classList.add('selected-for-forge');
            }

            forgeInventorySlotsEl.appendChild(itemWrapper);
        });
    } else {
        forgeInventorySlotsEl.innerHTML = `<p>No forgable equipment to display.</p>`;
    }

    if (selectedItemForForge) {
        forgeSelectedItemEl.innerHTML = createItemHTML(selectedItemForForge, false);
    } else {
        forgeSelectedItemEl.innerHTML = `<p>Select an item to begin.</p>`;
    }

    (/** @type {HTMLButtonElement} */ (forgeRerollBtn)).disabled = !selectedItemForForge || gameState.scrap < 50;
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
        statsHTML += `<li class="stat-special" style="margin: 5px 0;">Special: +${gem.synergy.value * 100}% of total DPS to Click Dmg</li>`;
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
        statsHTML += `<li>+ ${statName}: ${statInfo.min} - ${statInfo.max}</li>`;
    });
    statsHTML += '</ul>';

    let socketsHTML = '';
    if (itemBase.canHaveSockets) {
        socketsHTML = `<div class="item-sockets-tooltip">Sockets: 0 - ${itemBase.maxSockets}</div>`;
    }

    return `<div class="item-header"><span>${itemBase.name}</span></div>
            <div class="possible-stats-header">
                Possible Stats:
                <span class="tooltip-shift-hint">Hold [SHIFT] to compare</span>
            </div>
            ${statsHTML}
            ${socketsHTML}`;
}

export function createLootComparisonTooltipHTML(potentialItem, equippedItem, equippedItem2 = null) {
    if (potentialItem.type === 'ring' && (equippedItem || equippedItem2)) {
        let potentialStatsHTML = '<ul>';
        potentialItem.possibleStats.forEach(statInfo => {
            const statName = Object.values(STATS).find(s => s.key === statInfo.key)?.name || statInfo.key;
            potentialStatsHTML += `<li>+ ${statName}: ${statInfo.min} - ${statInfo.max}</li>`;
        });
        potentialStatsHTML += '</ul>';

        let equipped1StatsHTML = '<ul>';
        if (equippedItem) {
            for (const statKey in getCombinedItemStats(equippedItem)) {
                const statInfo = Object.values(STATS).find(s => s.key === statKey);
                const statName = statInfo ? statInfo.name : statKey;
                equipped1StatsHTML += `<li>+${formatNumber(getCombinedItemStats(equippedItem)[statKey])} ${statName}</li>`;
            }
        } else {
            equipped1StatsHTML += `<li>Nothing equipped</li>`;
        }
        equipped1StatsHTML += '</ul>';

        let equipped2StatsHTML = '<ul>';
        if (equippedItem2) {
             for (const statKey in getCombinedItemStats(equippedItem2)) {
                const statInfo = Object.values(STATS).find(s => s.key === statKey);
                const statName = statInfo ? statInfo.name : statKey;
                equipped2StatsHTML += `<li>+${formatNumber(getCombinedItemStats(equippedItem2)[statKey])} ${statName}</li>`;
            }
        } else {
            equipped2StatsHTML += `<li>Nothing equipped</li>`;
        }
        equipped2StatsHTML += '</ul>';

        return `<div class="item-header"><span>${potentialItem.name}</span></div>
                <div class="tooltip-comparison-section">
                    <h5>Potential Drop</h5>
                    ${potentialStatsHTML}
                </div>
                <div class="tooltip-ring-comparison">
                     <div>
                        <h5>vs. ${equippedItem ? equippedItem.name : "Empty Slot"}</h5>
                        ${equipped1StatsHTML}
                    </div>
                    <div>
                        <h5>vs. ${equippedItem2 ? equippedItem2.name : "Empty Slot"}</h5>
                        ${equipped2StatsHTML}
                    </div>
                </div>`;
    }

    let equippedStatsHTML = '<ul>';
    const combinedEquippedStats = getCombinedItemStats(equippedItem);
    if (equippedItem) {
        for (const statKey in combinedEquippedStats) {
            const statInfo = Object.values(STATS).find(s => s.key === statKey);
            const statName = statInfo ? statInfo.name : statKey;
            equippedStatsHTML += `<li>+${formatNumber(combinedEquippedStats[statKey])} ${statName}</li>`;
        }
    } else {
        equippedStatsHTML += `<li>Nothing equipped</li>`;
    }
    equippedStatsHTML += '</ul>';

    let potentialStatsHTML = '<ul>';
    potentialItem.possibleStats.forEach(statInfo => {
        const statName = Object.values(STATS).find(s => s.key === statInfo.key)?.name || statInfo.key;
        potentialStatsHTML += `<li>+ ${statName}: ${statInfo.min} - ${statInfo.max}</li>`;
    });
    potentialStatsHTML += '</ul>';
    
    return `<div class="item-header"><span>${potentialItem.name}</span></div>
            <div class="tooltip-comparison-section">
                <h5>Equipped: ${equippedItem ? equippedItem.name : 'None'}</h5>
                ${equippedStatsHTML}
            </div>
            <div class="tooltip-comparison-section">
                <h5>Potential Drop</h5>
                ${potentialStatsHTML}
            </div>`;
}


export function createItemHTML(item, isEquipped) {
    if (!item) return '';
    let socketsHTML = '';
    if (item.sockets) {
        socketsHTML += `<div class="item-sockets ${isEquipped ? 'equipped-sockets' : ''}">`;
        item.sockets.forEach(gem => {
            if (gem) {
                socketsHTML += `<div class="socket"><img src="${gem.icon}" alt="${gem.name}"></div>`;
            } else {
                socketsHTML += '<div class="socket"></div>';
            }
        });
        socketsHTML += '</div>';
    }

    // --- THIS IS THE CORRECTED LOGIC ---
    const iconSrc = item.icon || getItemIcon(item.type);

    if (isEquipped) {
        // Correctly use the specific icon for equipped items as well
        return `<img src="${iconSrc}" class="item-icon"> ${socketsHTML}`;
    }

    const lockHTML = `<i class="fas ${item.locked ? 'fa-lock' : 'fa-lock-open'} lock-icon"></i>`;
    
    const combinedStats = getCombinedItemStats(item);
    let statsHTML = '<ul>';
    for (const statKey in combinedStats) {
        const statInfo = Object.values(STATS).find(s => s.key === statKey);
        const statName = statInfo ? statInfo.name : statKey;
        const value = combinedStats[statKey];
        const statValue = statInfo && statInfo.type === 'percent' ? `${value.toFixed(1)}%` : formatNumber(value);
        statsHTML += `<li>+${statValue} ${statName}</li>`;
    }

    let totalSynergyValue = 0;
    if (item.sockets) {
        for (const gem of item.sockets) {
            if (gem && gem.synergy && gem.synergy.source === 'dps' && gem.synergy.target === 'clickDamage') {
                totalSynergyValue += gem.synergy.value;
            }
        }
    }
    if (totalSynergyValue > 0) {
        const synergyPercentage = (totalSynergyValue * 100).toFixed(1);
        statsHTML += `<li class="stat-special">Special: +${synergyPercentage}% DPS to Click Dmg</li>`;
    }

    statsHTML += '</ul>';
    
    const lockedClass = item.locked ? 'locked-item' : '';
    
    return `<div class="item ${item.rarity} ${lockedClass}">
                ${lockHTML}
                <div class="item-header">
                    <span>${item.name}</span>
                </div>
                ${statsHTML}
                ${socketsHTML} 
                <img src="${iconSrc}" class="item-bg-icon" alt="">
            </div>`;
}

export function createGemHTML(gem) {
    const gemEl = document.createElement('div');
    gemEl.className = 'gem';
    gemEl.dataset.gemId = String(gem.id);
    gemEl.innerHTML = `<img src="${gem.icon}" alt="${gem.name}">`;
    return gemEl.outerHTML;
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

export function showDamagePopup(popupContainerEl, damage) {
    const popup = document.createElement('div');
    popup.textContent = `-${formatNumber(damage)}`;
    popup.className = 'damage-popup';
    popup.style.left = `${40 + Math.random() * 20}%`;
    popup.style.top = `${40 + Math.random() * 20}%`;
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

export function showDpsPopup(popupContainerEl, damage) {
    const popup = document.createElement('div');
    popup.textContent = `-${formatNumber(damage)}`;
    popup.className = 'dps-popup';
    popup.style.left = `${30 + Math.random() * 40}%`;
    popup.style.top = `${45 + Math.random() * 20}%`;
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