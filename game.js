// game.js

import { REALMS } from './data/realms.js';
import { MONSTERS } from './data/monsters.js';
import { ITEMS } from './data/items.js';
import { STATS } from './data/stat_pools.js';
import { PERMANENT_UPGRADES } from './data/upgrades.js';
import { logMessage, formatNumber, getUpgradeCost, findSubZoneByLevel, findFirstLevelOfZone, isBossLevel, isBigBossLevel, getCombinedItemStats, isMiniBossLevel, findEmptySpot } from './utils.js';
import * as ui from './ui.js';
import * as player from './player_actions.js';
import * as logic from './game_logic.js';

export const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

/** @typedef {Object<string, HTMLElement|HTMLButtonElement|HTMLInputElement|HTMLImageElement|HTMLSelectElement>} DOMElements */

/**
 * Attaches a 'tap' event listener that works for both click and touch events.
 * This is crucial for mobile compatibility, especially on Android.
 * It handles scroll detection to prevent firing on scroll, and prevents 'ghost clicks'.
 * @param {EventTarget} element The DOM element to attach the listener to.
 * @param {function(Event): void} handler The event handler function.
 */
function addTapListener(element, handler) {
    let startX, startY;
    let touchMoved = false;

    const handleTouchStart = (e) => {
        // We only care about the first touch to avoid issues with multi-touch gestures.
        if (e.touches.length > 1) {
            touchMoved = true; // Treat multi-touch as a reason to not fire the tap.
            return;
        }
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        touchMoved = false; // Reset on new touch
    };

    const handleTouchMove = (e) => {
        if (touchMoved) return; // No need to check again
        if (e.touches.length === 0) return; // Handle edge cases
        // If finger moves more than 10px, it's a scroll.
        if (Math.abs(e.touches[0].clientX - startX) > 10 || Math.abs(e.touches[0].clientY - startY) > 10) {
            touchMoved = true;
        }
    };
    
    const handleTouchEnd = (e) => {
        // Only trigger handler if it was a tap, not a scroll.
        if (!touchMoved) {
            // This was a tap. We immediately trigger the action.
            // We must prevent the default action, which is to fire a
            // synthetic click event later. This is the primary mechanism
            // for preventing "ghost clicks".
            e.preventDefault();
            handler(e);
        }
    };

    const handleClick = (e) => {
        // If e.defaultPrevented is true, it means the touchend handler already
        // ran and called e.preventDefault(). We must not run the handler again.
        if (e.defaultPrevented) {
            return;
        }
        
        // This is a genuine mouse click that was not handled by touch.
        handler(e);
    };

    // Touch listeners are passive for good scrolling performance.
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    // touchend listener must NOT be passive so that it can call preventDefault().
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // The click handler now correctly distinguishes between genuine mouse clicks
    // and synthetic clicks from touch events.
    element.addEventListener('click', handleClick);
}


document.addEventListener('DOMContentLoaded', () => {

    let gameState = {};
    
    // --- Separate state for UI/View concerns ---
    let currentViewingRealmIndex = 0;
    let currentViewingZoneId = 'world';
    let isMapRenderPending = true; // Flag to control map re-rendering

    let currentMonster = { name: "Slime", data: MONSTERS.SLIME };
    let playerStats = { baseClickDamage: 1, baseDps: 0, totalClickDamage: 1, totalDps: 0, bonusGold: 0, magicFind: 0 };
    let salvageMode = { active: false, selections: [] };
    let saveTimeout;
    let isShiftPressed = false;
    let lastMousePosition = { x: 0, y: 0 };
    let pendingRingEquip = null;
    let selectedGemForSocketing = null;
    let craftingGems = [];
    let selectedItemForForge = null;
    let isResetting = false; 
    let pendingLegacyKeeperUpgrade = false; 
    let bulkCombineSelection = { tier: null, selectionKey: null };
    let bulkCombineDeselectedIds = new Set();
    let lastBulkCombineStatKey = null;
    let isAutoScrollingLog = true;

    /** @type {DOMElements} */
    let elements = {};

    let socket = null;
    if (typeof io !== 'undefined') {
        socket = io('https://idlegame-oqyq.onrender.com');
    }

    let raidPanel = null;
    let raidPlayerId = `Player_${Math.random().toString(36).substr(2, 5)}`;
    
    const defaultEquipmentState = { sword: null, shield: null, helmet: null, necklace: null, platebody: null, platelegs: null, ring1: null, ring2: null, belt: null };

    function getDefaultGameState() {
        const defaultPermUpgrades = {};
        for (const key in PERMANENT_UPGRADES) {
            defaultPermUpgrades[key] = 0;
        }

        const allPossibleStats = new Set();
        for(const key in ITEMS) {
            const itemBase = ITEMS[key];
            itemBase.possibleStats.forEach(stat => allPossibleStats.add(stat.key));
        }
        const defaultKeepStats = {};
        allPossibleStats.forEach(key => {
            defaultKeepStats[key] = false;
        });


        return {
            gold: 0, scrap: 0, upgrades: { clickDamage: 0, dps: 0 }, maxLevel: 1, currentFightingLevel: 1,
            monster: { hp: 10, maxHp: 10 },
            equipment: { ...defaultEquipmentState }, // This will be a REFERENCE to the active preset's equipment
            inventory: [], // This is now for "loose" items only
            gems: [],
            monsterKillCounts: {},
            unlockedPrestigeSlots: ['sword'], 
            absorbedStats: {},
            absorbedSynergies: {},
            absorbedUniqueEffects: {},
            prestigeCount: 0,
            nextPrestigeLevel: 100,
            specialEncounter: null,
            hero: {
                level: 1, xp: 0, attributePoints: 0,
                attributes: { strength: 0, agility: 0, luck: 0 }
            },
            presets: [
                { name: "Preset 1", equipment: { ...defaultEquipmentState } },
                { name: "Preset 2", equipment: { ...defaultEquipmentState } },
                { name: "Preset 3", equipment: { ...defaultEquipmentState } },
            ],
            activePresetIndex: 0,
            completedLevels: [],
            currentRunCompletedLevels: [],
            isFarming: true,
            isAutoProgressing: true,
            isSlimeSplitEnabled: true, 
            lastSaveTimestamp: null,
            permanentUpgrades: defaultPermUpgrades,
            presetSystemMigrated: true,
            salvageFilter: {
                enabled: false,
                autoSalvageGems: false, 
                keepRarity: 'uncommon',
                keepSockets: 0,
                keepStats: defaultKeepStats
            }
        };
    }

    function recalculateStats() {
        const hero = gameState.hero;
        const absorbed = gameState.absorbedStats || {};
        const permUpgrades = gameState.permanentUpgrades || {};
        const permUpgradeDefs = PERMANENT_UPGRADES;

        // Calculate bonuses from permanent upgrades first
        const permanentUpgradeBonuses = {
            gold: (permUpgrades.GOLD_MASTERY || 0) * permUpgradeDefs.GOLD_MASTERY.bonusPerLevel,
            magicFind: (permUpgrades.LOOT_HOARDER || 0) * (permUpgradeDefs.LOOT_HOARDER?.bonusPerLevel || 0),
            critChance: (permUpgrades.CRITICAL_POWER || 0) * permUpgradeDefs.CRITICAL_POWER.bonusPerLevel,
            critDamage: (permUpgrades.CRITICAL_DAMAGE || 0) * permUpgradeDefs.CRITICAL_DAMAGE.bonusPerLevel,
            prestigePower: (permUpgrades.PRESTIGE_POWER || 0) * permUpgradeDefs.PRESTIGE_POWER.bonusPerLevel,
            scrap: (permUpgrades.SCRAP_SCAVENGER || 0) * permUpgradeDefs.SCRAP_SCAVENGER.bonusPerLevel,
            gemFind: (permUpgrades.GEM_FIND || 0) * permUpgradeDefs.GEM_FIND.bonusPerLevel,
            bossDamage: (permUpgrades.BOSS_HUNTER || 0) * permUpgradeDefs.BOSS_HUNTER.bonusPerLevel,
            multiStrike: (permUpgrades.SWIFT_STRIKES || 0) * permUpgradeDefs.SWIFT_STRIKES.bonusPerLevel,
            legacyKeeper: (permUpgrades.LEGACY_KEEPER || 0) * permUpgradeDefs.LEGACY_KEEPER.bonusPerLevel,
        };
        
        const prestigeMultiplier = 1 + ((permanentUpgradeBonuses.prestigePower * (gameState.prestigeCount || 0)) / 100);

        const newCalculatedStats = {
            baseClickDamage: 1,
            baseDps: 0,
            bonusGold: permanentUpgradeBonuses.gold,
            magicFind: permanentUpgradeBonuses.magicFind,
        };

        for (const statKey in absorbed) {
            const boostedValue = absorbed[statKey] * prestigeMultiplier;
            if (STATS.CLICK_DAMAGE.key === statKey) newCalculatedStats.baseClickDamage += boostedValue;
            if (STATS.DPS.key === statKey) newCalculatedStats.baseDps += boostedValue;
            if (STATS.GOLD_GAIN.key === statKey) newCalculatedStats.bonusGold += boostedValue;
            if (STATS.MAGIC_FIND.key === statKey) newCalculatedStats.magicFind += boostedValue;
        }

        let totalSynergyValue = 0;

        const allItems = Object.values(gameState.equipment);

        for (const item of allItems) {
            if (item) {
                const combinedStats = getCombinedItemStats(item);
                for(const statKey in combinedStats) {
                    const value = combinedStats[statKey];
                    if (STATS.CLICK_DAMAGE.key === statKey) newCalculatedStats.baseClickDamage += value;
                    if (STATS.DPS.key === statKey) newCalculatedStats.baseDps += value;
                    if (STATS.GOLD_GAIN.key === statKey) newCalculatedStats.bonusGold += value;
                    if (STATS.MAGIC_FIND.key === statKey) newCalculatedStats.magicFind += value;
                }
                
                if (item.sockets) {
                    for (const gem of item.sockets) {
                        if (gem && gem.synergy && gem.synergy.source === 'dps' && gem.synergy.target === 'clickDamage') {
                            totalSynergyValue += gem.synergy.value;
                        }
                    }
                }
            }
        }
        
        const strengthBonusClickFlat = hero.attributes.strength * 0.5;
        const strengthBonusClickPercent = hero.attributes.strength * 0.2;
        const agilityBonusDpsFlat = hero.attributes.agility * 1;
        const agilityBonusDpsPercent = hero.attributes.agility * 0.3;

        let clickDamageSubtotal = newCalculatedStats.baseClickDamage + strengthBonusClickFlat;
        clickDamageSubtotal *= (1 + (strengthBonusClickPercent / 100));

        let dpsSubtotal = newCalculatedStats.baseDps + agilityBonusDpsFlat;
        dpsSubtotal *= (1 + (agilityBonusDpsPercent / 100));

        const clickUpgradeBonusPercent = gameState.upgrades.clickDamage * 1;
        let finalClickDamage = clickDamageSubtotal * (1 + (clickUpgradeBonusPercent / 100));
        
        const dpsUpgradeBonusPercent = gameState.upgrades.dps * 1;
        let finalDps = dpsSubtotal * (1 + (dpsUpgradeBonusPercent / 100));

        const luckBonusGold = hero.attributes.luck * 0.5;
        const finalBonusGold = newCalculatedStats.bonusGold + luckBonusGold;
        const finalMagicFind = newCalculatedStats.magicFind;

        const dpsToClickSynergyValue = (gameState.absorbedSynergies && gameState.absorbedSynergies['dps_to_clickDamage']) || 0;
        totalSynergyValue += (dpsToClickSynergyValue * prestigeMultiplier);
        
        if (totalSynergyValue > 0) {
            finalClickDamage += finalDps * totalSynergyValue;
        }

        playerStats = {
            baseClickDamage: newCalculatedStats.baseClickDamage,
            baseDps: newCalculatedStats.baseDps,
            totalClickDamage: finalClickDamage,
            totalDps: finalDps,
            bonusGold: finalBonusGold,
            magicFind: finalMagicFind,
            critChance: permanentUpgradeBonuses.critChance,
            critDamage: 1.5 + (permanentUpgradeBonuses.critDamage / 100),
            multiStrikeChance: permanentUpgradeBonuses.multiStrike,
            bossDamageBonus: 1 + (permanentUpgradeBonuses.bossDamage / 100),
            scrapBonus: 1 + (permanentUpgradeBonuses.scrap / 100),
            gemFindChance: permanentUpgradeBonuses.gemFind,
            legacyKeeperBonus: permanentUpgradeBonuses.legacyKeeper,
        };

        if (socket && socket.connected) {
            socket.emit('updatePlayerStats', { dps: playerStats.totalDps });
        }
    }

    function handleMonsterDefeated() {
        const result = logic.monsterDefeated(gameState, playerStats, currentMonster);
        
        result.logMessages.forEach(msg => {
            logMessage(elements.gameLogEl, msg.message, msg.class, isAutoScrollingLog);
        });

        if (result.events && result.events.includes('gemFind')) {
            ui.showInfoPopup(elements.popupContainerEl, 'Double Gem!', {
                top: '10%', 
                fontSize: '3.5em' 
            });
        }

        ui.showGoldPopup(elements.popupContainerEl, result.goldGained);
        
        const allDrops = [...(result.droppedItems || []), ...(result.droppedGems || [])];
        if (allDrops.length > 0) {
            allDrops.forEach((drop, index) => {
                ui.showItemDropAnimation(elements.popupContainerEl, drop, index);
            });
        }

        const levelUpLogs = player.gainXP(gameState, result.xpGained);
        levelUpLogs.forEach(msg => {
            logMessage(elements.gameLogEl, msg, 'legendary', isAutoScrollingLog);
        });

        const currentFightingRealmIndex = REALMS.findIndex(realm => 
            Object.values(realm.zones).some(zone => 
                Object.values(zone.subZones).some(sz => 
                    gameState.currentFightingLevel >= sz.levelRange[0] && gameState.currentFightingLevel <= sz.levelRange[1]
                )
            )
        ) || 0;

        const nextRealmIndex = currentFightingRealmIndex + 1;
        if (REALMS[nextRealmIndex] && gameState.maxLevel >= REALMS[nextRealmIndex].requiredLevel && !gameState.completedLevels.includes(REALMS[nextRealmIndex].requiredLevel - 1)) {
            logMessage(elements.gameLogEl, `A new realm has been unlocked: <b>${REALMS[nextRealmIndex].name}</b>!`, 'legendary', isAutoScrollingLog);
            isMapRenderPending = true; // Flag map for re-render to show the new realm
        }
        autoSave();
        setTimeout(() => {
            const scrollPositions = {
                inventory: elements.inventorySlotsEl.parentElement.scrollTop,
                forge: elements.forgeInventorySlotsEl.parentElement.scrollTop,
                gems: elements.gemSlotsEl.parentElement.scrollTop,
                actionsPanel: document.querySelector('.actions-panel')?.scrollTop || 0
            };

            startNewMonster();
            updateAll();
            
            elements.inventorySlotsEl.parentElement.scrollTop = scrollPositions.inventory;
            elements.forgeInventorySlotsEl.parentElement.scrollTop = scrollPositions.forge;
            elements.gemSlotsEl.parentElement.scrollTop = scrollPositions.gems;
            const actionsPanel = document.querySelector('.actions-panel');
            if (actionsPanel) {
                actionsPanel.scrollTop = scrollPositions.actionsPanel;
            }

        }, 300);
    }
        function startNewMonster() {
        const { newMonster, newMonsterState } = logic.generateMonster(gameState.currentFightingLevel, gameState.specialEncounter);
        currentMonster = newMonster;
        gameState.monster = newMonsterState;
    
        const monsterImageEl = (/** @type {HTMLImageElement} */ (elements.monsterImageEl));
        monsterImageEl.src = currentMonster.data.image;
        monsterImageEl.classList.toggle('boss-image', !!currentMonster.data.isBoss);
    
        elements.monsterNameEl.textContent = currentMonster.name;
    
        const monsterAreaEl = document.getElementById('monster-area');
        if (currentMonster.data.background) {
            monsterAreaEl.style.backgroundImage = `url('${currentMonster.data.background}')`;
        } else if (currentMonster.data.isSpecial) {
            monsterAreaEl.style.backgroundImage = `url('images/backgrounds/bg_treasure_realm.png')`;
        } else {
            const subZone = findSubZoneByLevel(gameState.currentFightingLevel);
            if (subZone && subZone.parentZone) {
                monsterAreaEl.style.backgroundImage = `url('${subZone.parentZone.monsterAreaBg}')`;
            } else {
                monsterAreaEl.style.backgroundImage = `url('${REALMS[0].zones.green_meadows.monsterAreaBg}')`;
            }
        }
    }

    function attack(baseDamage, isClick = false) {
        if (gameState.monster.hp <= 0) return;

        let finalDamage = baseDamage;
        const level = gameState.currentFightingLevel;
        const isAnyBoss = isBossLevel(level) || isBigBossLevel(level) || isMiniBossLevel(level);

        if (isAnyBoss) {
            finalDamage *= playerStats.bossDamageBonus;
        }

        const isCrit = Math.random() * 100 < playerStats.critChance;
        if (isCrit) {
            finalDamage *= playerStats.critDamage;
        }
        
        gameState.monster.hp -= finalDamage;

        if (isClick) {
            ui.showDamagePopup(elements.popupContainerEl, finalDamage, isCrit);
        } else {
            ui.showDpsPopup(elements.popupContainerEl, finalDamage, isCrit);
        }

        if (Math.random() * 100 < playerStats.multiStrikeChance) {
            gameState.monster.hp -= finalDamage;
             if (isClick) {
                ui.showDamagePopup(elements.popupContainerEl, finalDamage, isCrit, true);
            } else {
                ui.showDpsPopup(elements.popupContainerEl, finalDamage, isCrit, true);
            }
        }
    }

    function clickMonster() {
        if (gameState.monster.hp <= 0) return;
        attack(playerStats.totalClickDamage, true);
        elements.monsterImageEl.classList.add('monster-hit');
        setTimeout(() => elements.monsterImageEl.classList.remove('monster-hit'), 200);
        if (gameState.monster.hp <= 0) {
            handleMonsterDefeated();
        }
        updateMonsterHealthUI();
    }

    function gameLoop() {
        if (playerStats.totalDps > 0 && gameState.monster.hp > 0) {
            attack(playerStats.totalDps, false);
            if (gameState.monster.hp <= 0) {
                handleMonsterDefeated();
            }
            updateMonsterHealthUI();
        }
    }

    function updateMonsterHealthUI() {
        const { monsterHealthTextEl, monsterHealthBarEl } = elements;
        monsterHealthTextEl.textContent = `${formatNumber(Math.ceil(Math.max(0, gameState.monster.hp)))} / ${formatNumber(gameState.monster.maxHp)}`;
        const healthPercent = (gameState.monster.hp / gameState.monster.maxHp) * 100;
        monsterHealthBarEl.style.width = `${healthPercent}%`;
        if (healthPercent < 30) monsterHealthBarEl.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
        else if (healthPercent < 60) monsterHealthBarEl.style.background = 'linear-gradient(to right, #f39c12, #e67e22)';
        else monsterHealthBarEl.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';
    }

    function updateAll() {
        ui.updateUI(elements, gameState, playerStats, currentMonster, salvageMode, craftingGems, selectedItemForForge, bulkCombineSelection, bulkCombineDeselectedIds);
        
        // --- Conditional Map Rendering ---
        if (isMapRenderPending) {
            renderMapAccordion();
            isMapRenderPending = false;
        }
        
        renderPermanentUpgrades();
        
        document.querySelectorAll('.gem-wrapper.selected-gem').forEach(el => el.classList.remove('selected-gem'));
        document.querySelectorAll('.socket-target').forEach(el => el.classList.remove('socket-target'));

        if (selectedGemForSocketing) {
            const gemEl = document.querySelector(`.gem-wrapper[data-id="${selectedGemForSocketing.id}"]`);
            if (gemEl) gemEl.classList.add('selected-gem');
            
            gameState.inventory.forEach((item) => {
                if (item.sockets && item.sockets.includes(null)) {
                    const itemEl = document.querySelector(`#inventory-slots .item-wrapper[data-id="${item.id}"]`);
                    if (itemEl) itemEl.classList.add('socket-target');
                }
            });

            for (const slotName in gameState.equipment) {
                const item = gameState.equipment[slotName];
                if (item && item.sockets && item.sockets.includes(null)) {
                    const slotEl = document.getElementById(`slot-${slotName}`);
                    if (slotEl) slotEl.classList.add('socket-target');
                }
            }
        }
    }

    function autoSave() {
        elements.saveIndicatorEl.classList.add('visible');
        if (saveTimeout) clearTimeout(saveTimeout);
        
        gameState.lastSaveTimestamp = Date.now();
        localStorage.setItem('idleRPGSaveData', JSON.stringify(gameState));

        saveTimeout = setTimeout(() => {
            elements.saveIndicatorEl.classList.remove('visible');
        }, 2000);
    }

    function saveOnExit() {
        if (isResetting) return;
        gameState.lastSaveTimestamp = Date.now();
        localStorage.setItem('idleRPGSaveData', JSON.stringify(gameState));
    }

    function resetGame() {
        if (confirm("Are you sure? This will delete your save permanently.")) {
            isResetting = true;
            window.removeEventListener('beforeunload', saveOnExit);
            localStorage.removeItem('idleRPGSaveData');
            window.location.reload();
        }
    }

    function renderMapAccordion() {
        // Determine player's current fighting location
        const fightingSubZone = findSubZoneByLevel(gameState.currentFightingLevel);
        const fightingRealmIndex = fightingSubZone ? REALMS.findIndex(r => Object.values(r.zones).some(z => z === fightingSubZone.parentZone)) : -1;
        const fightingZoneId = fightingSubZone ? Object.keys(REALMS[fightingRealmIndex].zones).find(id => REALMS[fightingRealmIndex].zones[id] === fightingSubZone.parentZone) : null;

        const callbacks = {
            onRealmHeaderClick: handleRealmHeaderClick,
            onZoneNodeClick: handleZoneNodeClick,
            onSubZoneNodeClick: handleSubZoneNodeClick,
            onBackToWorldClick: handleBackToWorldClick,
        };
        ui.renderMapAccordion(elements, gameState, currentViewingRealmIndex, currentViewingZoneId, fightingRealmIndex, fightingZoneId, callbacks);
    }
    
    function handleRealmHeaderClick(realmIndex) {
        if (currentViewingRealmIndex === realmIndex) {
            currentViewingRealmIndex = -1;
        } else {
            currentViewingRealmIndex = realmIndex;
        }
        currentViewingZoneId = 'world';
        isMapRenderPending = true;
        updateAll();
    }
    
    function handleZoneNodeClick(realmIndex, zoneId) {
        currentViewingRealmIndex = realmIndex;
        currentViewingZoneId = zoneId;
        isMapRenderPending = true;
        updateAll();
    }
    
    function handleSubZoneNodeClick(subZone) {
        showSubZoneModal(subZone);
    }

    function handleBackToWorldClick(realmIndex) {
        currentViewingRealmIndex = realmIndex;
        currentViewingZoneId = 'world';
        isMapRenderPending = true;
        updateAll();
    }
    
    function renderPermanentUpgrades() {
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

            const description = upgrade.description.replace('{value}', bonus.toFixed(1));

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

    function populateBulkCombineControls() {
        const bulkCombineTierSelect = /** @type {HTMLSelectElement} */ (elements.bulkCombineTierSelect);
        const bulkCombineStatSelect = /** @type {HTMLSelectElement} */ (elements.bulkCombineStatSelect);
        
        const availableTiers = new Set();
        const availableOptions = new Map();

        gameState.gems.forEach(gem => {
            if (gem.tier) {
                availableTiers.add(gem.tier);
                if (!availableOptions.has(gem.tier)) {
                    availableOptions.set(gem.tier, new Set());
                }
                if (gem.stats) {
                    for (const statKey in gem.stats) {
                        availableOptions.get(gem.tier).add(statKey);
                    }
                }
                if (gem.synergy) {
                    availableOptions.get(gem.tier).add(`synergy_${gem.synergy.source}_to_${gem.synergy.target}`);
                }
            }
        });

        const currentTier = bulkCombineSelection.tier;
        const currentSelectionKey = bulkCombineSelection.selectionKey;

        bulkCombineTierSelect.innerHTML = '<option value="">Select Tier</option>';
        Array.from(availableTiers).sort((a,b) => a-b).forEach(tier => {
            const option = document.createElement('option');
            option.value = String(tier);
            option.textContent = `Tier ${tier}`;
            if (tier === currentTier) option.selected = true;
            bulkCombineTierSelect.appendChild(option);
        });
        
        const populateOptions = (tier) => {
            bulkCombineStatSelect.innerHTML = '<option value="">Select Stat</option>';
            bulkCombineStatSelect.disabled = true;
            if (tier && availableOptions.has(tier)) {
                bulkCombineStatSelect.disabled = false;
                availableOptions.get(tier).forEach(key => {
                    const option = document.createElement('option');
                    option.value = key;

                    if (key.startsWith('synergy_')) {
                        option.textContent = "DPS to Click Dmg";
                    } else {
                        const statInfo = Object.values(STATS).find(s => s.key === key);
                        option.textContent = statInfo ? statInfo.name : key;
                    }

                    if (key === currentSelectionKey) option.selected = true;
                    bulkCombineStatSelect.appendChild(option);
                });
            }
        };
        populateOptions(currentTier);
    }    function showSubZoneModal(subZone) {
        elements.modalTitleEl.textContent = subZone.name;
        elements.modalBodyEl.innerHTML = '';
        elements.modalCloseBtnEl.classList.remove('hidden');

        const startLevel = subZone.levelRange[0];
        const finalLevel = subZone.levelRange[1];
        const isSingleLevelZone = startLevel === finalLevel;

        const startCombat = (level, isFarming) => {
            gameState.currentFightingLevel = level;
            gameState.isFarming = isFarming;
            // The auto-progress checkbox is now dynamically created, so we need to find it
            const autoProgressCheckbox = document.querySelector('#map-view #auto-progress-checkbox');
            gameState.isAutoProgressing = isFarming ? (autoProgressCheckbox && (/** @type {HTMLInputElement} */ (autoProgressCheckbox)).checked) : false;
            logMessage(elements.gameLogEl, `Traveling to level ${level}.`, '', isAutoScrollingLog);
            elements.modalBackdropEl.classList.add('hidden');
            startNewMonster();
            updateAll();
            autoSave();
        };

        if (isSingleLevelZone) {
            const bossLevel = startLevel;
            const fightBossButton = document.createElement('button');
            fightBossButton.textContent = gameState.completedLevels.includes(bossLevel) ? `Re-fight Boss (Lvl ${bossLevel})` : `Fight Boss (Lvl ${bossLevel})`;
            addTapListener(fightBossButton, () => startCombat(bossLevel, false));
            elements.modalBodyEl.appendChild(fightBossButton);

        } else {
            const highestCompleted = ui.getHighestCompletedLevelInSubZone(gameState.completedLevels, subZone);
            
            const nextLevelToTry = Math.min(highestCompleted + 1, finalLevel);
            const isNewZone = highestCompleted < startLevel;
            const levelToStart = isNewZone ? startLevel : nextLevelToTry;

            const continueButton = document.createElement('button');
            continueButton.textContent = isNewZone ? `Start at Lvl ${startLevel}` : `Continue at Lvl ${levelToStart}`;
            addTapListener(continueButton, () => startCombat(levelToStart, true));
            elements.modalBodyEl.appendChild(continueButton);

            if (!isNewZone && highestCompleted < finalLevel) {
                const restartButton = document.createElement('button');
                restartButton.textContent = `Restart at Lvl ${startLevel}`;
                addTapListener(restartButton, () => startCombat(startLevel, true));
                elements.modalBodyEl.appendChild(restartButton);
            }
        }

        elements.modalBackdropEl.classList.remove('hidden');
    }

    function showRingSelectionModal(pendingRing) {
        const { ringSelectionModalBackdrop, ringSelectionSlot1, ringSelectionSlot2 } = elements;
        
        const createRingHTML = (ring) => {
            if (!ring) return '';
            const wrapper = document.createElement('div');
            wrapper.className = 'item-wrapper';
            if(ring.rarity) wrapper.classList.add(ring.rarity);
            wrapper.innerHTML = ui.createItemHTML(ring);
            return wrapper.outerHTML;
        }

        ringSelectionSlot1.innerHTML = createRingHTML(gameState.equipment.ring1);
        ringSelectionSlot2.innerHTML = createRingHTML(gameState.equipment.ring2);

        ringSelectionModalBackdrop.classList.remove('hidden');
    }

    function hideRingSelectionModal() {
        elements.ringSelectionModalBackdrop.classList.add('hidden');
        pendingRingEquip = null;
    }

    function calculateOfflineProgress() {
        if (!gameState.lastSaveTimestamp) return;

        const offlineDurationSeconds = (Date.now() - gameState.lastSaveTimestamp) / 1000;
        if (offlineDurationSeconds < 10) return;

        recalculateStats();

        if (playerStats.totalDps <= 0) return;

        const level = gameState.currentFightingLevel;
        
        const { newMonster, newMonsterState } = logic.generateMonster(level);
        const monsterHp = newMonsterState.maxHp;
        const monsterDropChance = newMonster.data.dropChance;
        
        const timeToKill = monsterHp / playerStats.totalDps;
        const killsPerSecond = 1 / timeToKill;

        const tier = Math.floor((level - 1) / 10);
        const difficultyResetFactor = 1;
        const effectiveLevel = level - (tier * difficultyResetFactor);

        const baseGold = 10;
        const goldFactor = 3;
        const goldPower = 2.0;
        let goldPerKill = baseGold + (goldFactor * Math.pow(effectiveLevel, goldPower));
        goldPerKill = Math.ceil(goldPerKill * (1 + (playerStats.bonusGold / 100)));

        const baseXp = 20;
        const xpPower = 1.2;
        // --- FIX: Use the correct `level` variable for XP calculation, matching the online formula ---
        let xpPerKill = baseXp * Math.pow(level, xpPower);
        
        if (isBigBossLevel(level)) {
            xpPerKill *= 3;
            goldPerKill *= 3;
        } else if (isBossLevel(level)) {
            xpPerKill *= 2;
            goldPerKill *= 2;
        } else if(isMiniBossLevel(level)) {
            xpPerKill *= 1.5;
            goldPerKill *= 1.5;
        }

        const goldPerSecond = goldPerKill * killsPerSecond;
        const xpPerSecond = xpPerKill * killsPerSecond;

        const AVERAGE_SCRAP_VALUE = 2 * playerStats.scrapBonus;
        const dropsPerSecond = (monsterDropChance / 100) * killsPerSecond;
        const scrapPerSecond = dropsPerSecond * AVERAGE_SCRAP_VALUE;

        const totalGoldGained = Math.floor(goldPerSecond * offlineDurationSeconds);
        const totalXPGained = Math.floor(xpPerSecond * offlineDurationSeconds);
        const totalScrapGained = Math.floor(scrapPerSecond * offlineDurationSeconds);

        if (totalGoldGained === 0 && totalXPGained === 0 && totalScrapGained === 0) return;

        const startingLevel = gameState.hero.level;
        gameState.gold += totalGoldGained;
        gameState.scrap += totalScrapGained;
        player.gainXP(gameState, totalXPGained);
        const finalLevel = gameState.hero.level;

        recalculateStats();

        const hours = Math.floor(offlineDurationSeconds / 3600);
        const minutes = Math.floor((offlineDurationSeconds % 3600) / 60);
        elements.offlineTime.textContent = `${hours} hours and ${minutes} minutes`;
        elements.offlineGold.textContent = formatNumber(totalGoldGained);
        elements.offlineXp.textContent = formatNumber(totalXPGained);
        elements.offlineScrap.textContent = formatNumber(totalScrapGained);
        
        const existingLevelUps = elements.offlineRewards.querySelectorAll('.level-up-summary');
        existingLevelUps.forEach(el => el.remove());

        if (finalLevel > startingLevel) {
            const p = document.createElement('p');
            p.innerHTML = `Leveled Up! (Level ${startingLevel} → Level ${finalLevel})`;
            p.className = 'legendary level-up-summary';
            elements.offlineRewards.appendChild(p);
        }

        elements.offlineProgressModalBackdrop.classList.remove('hidden');
    }

    /**
     * Shows a dynamic tooltip for an item.
     * @param {object | null} item The item to display.
     * @param {HTMLElement} element The element to anchor the tooltip to.
     */
    function showItemTooltip(item, element) {
        if (!item) return;

        elements.tooltipEl.className = 'hidden';
        elements.tooltipEl.classList.add(item.rarity);

        if (isShiftPressed) {
            const itemBase = ITEMS[item.baseId];
            if (itemBase) {
                elements.tooltipEl.innerHTML = ui.createLootTableTooltipHTML(itemBase);
            } else {
                elements.tooltipEl.innerHTML = ui.createTooltipHTML(item);
            }
        } else {
            if (item.type === 'ring') {
                elements.tooltipEl.innerHTML = ui.createItemComparisonTooltipHTML(item, gameState.equipment.ring1, gameState.equipment.ring2);
            } else {
                const equippedItem = gameState.equipment[item.type];
                elements.tooltipEl.innerHTML = ui.createItemComparisonTooltipHTML(item, equippedItem);
            }
        }

        const rect = element.getBoundingClientRect();
        elements.tooltipEl.style.left = `${rect.right + 10}px`;
        elements.tooltipEl.style.top = `${rect.top}px`;
        elements.tooltipEl.classList.remove('hidden');
    }
    
    /**
     * Shows a focused comparison tooltip for a pending ring vs one equipped ring.
     * @param {object} pendingItem The new ring to be equipped.
     * @param {object | null} equippedItem The specific equipped ring to compare against.
     * @param {HTMLElement} element The element to anchor the tooltip to.
     */
    function showRingComparisonTooltip(pendingItem, equippedItem, element) {
        if (!pendingItem) return;
        elements.tooltipEl.className = 'hidden';
        elements.tooltipEl.classList.add(pendingItem.rarity);

        elements.tooltipEl.innerHTML = ui.createItemComparisonTooltipHTML(pendingItem, equippedItem, null);
        
        const rect = element.getBoundingClientRect();
        elements.tooltipEl.style.left = `${rect.right + 10}px`;
        elements.tooltipEl.style.top = `${rect.top}px`;
        elements.tooltipEl.classList.remove('hidden');
    }

    /** Generic mouseout handler for item grids. */
    const onGridMouseOut = () => elements.tooltipEl.classList.add('hidden');
        function main() {
        elements = ui.initDOMElements();
        
        const savedData = localStorage.getItem('idleRPGSaveData');
        if (savedData) {
            let loadedState = JSON.parse(savedData);
            
            if (!loadedState.presetSystemMigrated) {
                 loadedState = migrateToPresetInventories(loadedState);
            }

            const baseState = getDefaultGameState();
            gameState = { 
                ...baseState, 
                ...loadedState,
                permanentUpgrades: { 
                    ...baseState.permanentUpgrades,
                    ...(loadedState.permanentUpgrades || {})
                },
                absorbedSynergies: (typeof loadedState.absorbedSynergies === 'object' && !Array.isArray(loadedState.absorbedSynergies)) ? loadedState.absorbedSynergies : {},
                salvageFilter: {
                    ...baseState.salvageFilter,
                    ...(loadedState.salvageFilter || {}),
                    keepStats: {
                        ...baseState.salvageFilter.keepStats,
                        ...((loadedState.salvageFilter || {}).keepStats || {})
                    }
                }
            };
            
            gameState.equipment = gameState.presets[gameState.activePresetIndex].equipment;
            
            calculateOfflineProgress();
        } else {
            gameState = getDefaultGameState();
            gameState.equipment = gameState.presets[gameState.activePresetIndex].equipment;
        }
        
        // --- Set initial map view state based on current fighting level ---
        const fightingSubZone = findSubZoneByLevel(gameState.currentFightingLevel);
        const fightingRealmIndex = fightingSubZone ? REALMS.findIndex(r => Object.values(r.zones).some(z => z === fightingSubZone.parentZone)) : -1;
        const fightingZoneId = fightingSubZone ? Object.keys(REALMS[fightingRealmIndex].zones).find(id => REALMS[fightingRealmIndex].zones[id] === fightingSubZone.parentZone) : null;

        if (fightingRealmIndex !== -1) {
            currentViewingRealmIndex = fightingRealmIndex;
            currentViewingZoneId = fightingZoneId || 'world';
        } else {
            // Fallback for cases where level is out of defined bounds (e.g., new game)
            currentViewingRealmIndex = 0;
            currentViewingZoneId = 'world';
        }
        
        setupEventListeners();
        recalculateStats();
        startNewMonster();
        logMessage(elements.gameLogEl, savedData ? "Saved game loaded!" : "Welcome! Your progress will be saved automatically.", '', isAutoScrollingLog);
        updateAll();
        
        autoSave(); 
        setInterval(autoSave, 30000);
        setInterval(gameLoop, 1000);
    }    function setupEventListeners() {
        window.addEventListener('beforeunload', saveOnExit);

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Shift' && !isShiftPressed) {
                isShiftPressed = true;
                const elementUnderMouse = document.elementFromPoint(lastMousePosition.x, lastMousePosition.y);
                if (elementUnderMouse) {
                    elementUnderMouse.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                }
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.key === 'Shift') {
                isShiftPressed = false;
                const elementUnderMouse = document.elementFromPoint(lastMousePosition.x, lastMousePosition.y);
                 if (elementUnderMouse) {
                    elementUnderMouse.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                }
            }
        });
        window.addEventListener('blur', () => { isShiftPressed = false; });
        window.addEventListener('mousemove', (e) => {
            lastMousePosition.x = e.clientX;
            lastMousePosition.y = e.clientY;
        });
        
        addTapListener(document.getElementById('attributes-area'), (e) => {
            if (!(e.target instanceof Element)) return;
            const button = e.target.closest('.attribute-btn');
            if (button instanceof HTMLButtonElement && !button.disabled) {
                const attributeRow = button.closest('.attribute-row');
                if (attributeRow instanceof HTMLElement && attributeRow.dataset.attribute) {
                    player.spendAttributePoint(gameState, attributeRow.dataset.attribute);
                    recalculateStats();
                    updateAll();
                    autoSave();
                }
            }
        });

        addTapListener(elements.absorbedStatsListEl, (e) => {
            if (!(e.target instanceof Element)) return;
            const toggleButton = e.target.closest('.slime-split-toggle-btn');
            if (toggleButton) {
                gameState.isSlimeSplitEnabled = !gameState.isSlimeSplitEnabled;
                logMessage(elements.gameLogEl, `Slime Split effect is now <b class="legendary">${gameState.isSlimeSplitEnabled ? 'ON' : 'OFF'}</b>.`, '', isAutoScrollingLog);
                updateAll();
                autoSave();
            }
        });


        addTapListener(document.getElementById('upgrades-area'), (e) => {
            if (!(e.target instanceof Element)) return;
            const upgradeButton = e.target.closest('.upgrade-button');
            if (upgradeButton instanceof HTMLElement && !upgradeButton.classList.contains('disabled')) {
                let upgradeType;
                if (upgradeButton.id === 'upgrade-click-damage') {
                    upgradeType = 'clickDamage';
                } else if (upgradeButton.id === 'upgrade-dps') {
                    upgradeType = 'dps';
                } else {
                    return; 
                }

                if (e.target.closest('.buy-max-btn')) {
                    const result = player.buyMaxUpgrade(gameState, upgradeType);
                    if (result.levelsBought > 0) {
                        logMessage(elements.gameLogEl, `Bought ${result.levelsBought} ${upgradeType === 'dps' ? 'DPS' : 'Click Damage'} levels!`, '', isAutoScrollingLog);
                    } else {
                        logMessage(elements.gameLogEl, "Not enough gold for even one level!", '', isAutoScrollingLog);
                    }
                } else {
                    const cost = getUpgradeCost(upgradeType, gameState.upgrades[upgradeType]);
                    const result = player.buyUpgrade(gameState, upgradeType, cost);
                    logMessage(elements.gameLogEl, result.message, '', isAutoScrollingLog);
                }

                recalculateStats();
                updateAll();
                autoSave();
            }
        });
        
        addTapListener(elements.monsterImageEl, clickMonster);

        addTapListener(document.getElementById('buy-loot-crate-btn'), () => {
            const result = player.buyLootCrate(gameState, logic.generateItem);
            logMessage(elements.gameLogEl, result.message, '', isAutoScrollingLog);
            if (result.success && result.item) {
                logMessage(elements.gameLogEl, `The crate contained: <span class="${result.item.rarity}">${result.item.name}</span>`, '', isAutoScrollingLog);
            }
            updateAll();
            autoSave();
        });

        addTapListener(document.getElementById('salvage-mode-btn'), () => {
            salvageMode.active = !salvageMode.active;
            const salvageBtn = document.getElementById('salvage-mode-btn');
            const confirmBtn = document.getElementById('confirm-salvage-btn');
            const selectAllBtn = document.getElementById('select-all-salvage-btn');
            const raritySalvageContainer = document.getElementById('salvage-by-rarity-controls');
            const autoSalvageBtn = document.getElementById('auto-salvage-filter-btn');

            if (salvageBtn && confirmBtn && selectAllBtn && raritySalvageContainer && autoSalvageBtn) {
                if (salvageMode.active) {
                    salvageBtn.textContent = 'Cancel Salvage';
                    salvageBtn.classList.add('active');
                    confirmBtn.classList.remove('hidden');
                    selectAllBtn.classList.remove('hidden');
                    raritySalvageContainer.classList.remove('hidden');
                    autoSalvageBtn.classList.add('hidden');
                } else {
                    salvageBtn.textContent = 'Select to Salvage';
                    salvageBtn.classList.remove('active');
                    confirmBtn.classList.add('hidden');
                    selectAllBtn.classList.add('hidden');
                    raritySalvageContainer.classList.add('hidden');
                    autoSalvageBtn.classList.remove('hidden');
                    salvageMode.selections = [];
                }
            }
            document.body.classList.toggle('salvage-mode-active', salvageMode.active);
            const salvageCountEl = document.getElementById('salvage-count');
            if (salvageCountEl) salvageCountEl.textContent = '0';
            updateAll();
        });

        addTapListener(document.getElementById('select-all-salvage-btn'), () => {
            const equippedIds = player.getAllEquippedItemIds(gameState);
            salvageMode.selections = player.getAllItems(gameState).filter(item => !item.locked && !equippedIds.has(item.id));
            const salvageCountEl = document.getElementById('salvage-count');
            if (salvageCountEl) salvageCountEl.textContent = salvageMode.selections.length.toString();
            updateAll();
        });

        addTapListener(document.getElementById('confirm-salvage-btn'), () => {
            const result = player.salvageSelectedItems(gameState, salvageMode, playerStats);
            if (result.count > 0) {
                logMessage(elements.gameLogEl, `Salvaged ${result.count} items for a total of ${formatNumber(result.scrapGained)} Scrap.`, 'uncommon', isAutoScrollingLog);
            } else {
                logMessage(elements.gameLogEl, "No items selected for salvage.", '', isAutoScrollingLog);
            }

            salvageMode.active = false;
            const salvageBtn = document.getElementById('salvage-mode-btn');
            const confirmBtn = document.getElementById('confirm-salvage-btn');
            const selectAllBtn = document.getElementById('select-all-salvage-btn');
            const raritySalvageContainer = document.getElementById('salvage-by-rarity-controls');
            const autoSalvageBtn = document.getElementById('auto-salvage-filter-btn');

            if (salvageBtn) {
                salvageBtn.textContent = 'Select to Salvage';
                salvageBtn.classList.remove('active');
            }
            if (confirmBtn) confirmBtn.classList.add('hidden');
            if (selectAllBtn) selectAllBtn.classList.add('hidden');
            if(raritySalvageContainer) raritySalvageContainer.classList.add('hidden');
            if(autoSalvageBtn) autoSalvageBtn.classList.remove('hidden');
            
            document.body.classList.remove('salvage-mode-active');
            salvageMode.selections = [];
            updateAll();
            autoSave();
        });

        addTapListener(document.getElementById('salvage-by-rarity-controls'), (e) => {
            if (!(e.target instanceof HTMLElement) || !e.target.dataset.rarity) return;
            const rarity = e.target.dataset.rarity;
            const result = player.salvageByRarity(gameState, rarity, playerStats);
            if (result.count > 0) {
                logMessage(elements.gameLogEl, `Salvaged ${result.count} ${rarity} items for ${formatNumber(result.scrapGained)} Scrap.`, 'uncommon', isAutoScrollingLog);
                updateAll();
                autoSave();
            } else {
                logMessage(elements.gameLogEl, `No unlocked ${rarity} items to salvage.`, '', isAutoScrollingLog);
            }
        });
        
        const gridClickHandler = (event) => {
            if (!(event.target instanceof Element)) return;
            const wrapper = event.target.closest('.item-wrapper, .gem-wrapper');
            if (!(wrapper instanceof HTMLElement)) return;

            const id = wrapper.dataset.id;
            if (!id) return;
            
            const isGem = wrapper.classList.contains('gem-wrapper');
            const item = isGem ? gameState.gems.find(i => String(i.id) === id) : player.findItemFromAllSources(gameState, id);

            if (!item) return;

            if (isGem) {
                const isBulkSelected = bulkCombineSelection.tier && bulkCombineSelection.selectionKey && item.tier === bulkCombineSelection.tier;
                if (isBulkSelected) {
                    if (bulkCombineDeselectedIds.has(item.id)) {
                        bulkCombineDeselectedIds.delete(item.id);
                    } else {
                        bulkCombineDeselectedIds.add(item.id);
                    }
                    updateAll();
                    return;
                }

                if (isShiftPressed) {
                    if (craftingGems.length < 2) {
                         if (craftingGems.length > 0 && craftingGems[0].tier !== item.tier) {
                            logMessage(elements.gameLogEl, "You can only combine gems of the same tier.", "rare", isAutoScrollingLog);
                            return;
                        }
                        craftingGems.push(item);
                        gameState.gems = gameState.gems.filter(g => g.id !== item.id);
                    }
                } else {
                    if (selectedGemForSocketing && selectedGemForSocketing.id === item.id) {
                        selectedGemForSocketing = null;
                        logMessage(elements.gameLogEl, "Deselected gem.", '', isAutoScrollingLog);
                    } else {
                        selectedGemForSocketing = item;
                        logMessage(elements.gameLogEl, `Selected ${item.name}. Click an item with an empty socket to place it.`, 'uncommon', isAutoScrollingLog);
                    }
                }
                updateAll();

            } else {
                if (selectedGemForSocketing && item.sockets && item.sockets.includes(null)) {
                    const gemToSocket = selectedGemForSocketing;
                    const firstEmptySocketIndex = item.sockets.indexOf(null);
                    
                    if (firstEmptySocketIndex > -1) {
                        item.sockets[firstEmptySocketIndex] = gemToSocket;
                        gameState.gems = gameState.gems.filter(g => g.id !== gemToSocket.id);
                        logMessage(elements.gameLogEl, `Socketed ${gemToSocket.name} into ${item.name}.`, 'epic', isAutoScrollingLog);
                        selectedGemForSocketing = null;
                        recalculateStats();
                        updateAll();
                        autoSave();
                        return;
                    }
                }
    
                if (event.target.closest('.lock-icon')) {
                    const message = player.toggleItemLock(gameState, item);
                    if (message) logMessage(elements.gameLogEl, message, '', isAutoScrollingLog);
                } else if (salvageMode.active) {
                    const isEquipped = player.getAllEquippedItemIds(gameState).has(item.id);

                    if (isEquipped) {
                        logMessage(elements.gameLogEl, "Cannot salvage an item that is equipped in any preset.", 'rare', isAutoScrollingLog);
                        return;
                    }
                    if (item.locked) { 
                        logMessage(elements.gameLogEl, "This item is locked and cannot be salvaged.", 'rare', isAutoScrollingLog); 
                        return; 
                    }
                    const selectionIndex = salvageMode.selections.findIndex(sel => sel.id === item.id);
                    if (selectionIndex > -1) {
                        salvageMode.selections.splice(selectionIndex, 1);
                    } else {
                        salvageMode.selections.push(item);
                    }
                    document.getElementById('salvage-count').textContent = salvageMode.selections.length.toString();
                } else {
                    const result = player.equipItem(gameState, item);
                    if (result.success) {
                        if (result.isPendingRing) {
                            pendingRingEquip = result.item;
                            showRingSelectionModal(pendingRingEquip);
                        } else {
                            logMessage(elements.gameLogEl, result.message, '', isAutoScrollingLog);
                            recalculateStats();
                        }
                    } else {
                        logMessage(elements.gameLogEl, result.message, 'rare', isAutoScrollingLog);
                    }
                }
                updateAll();
                autoSave();
            }
        };

        addTapListener(elements.inventorySlotsEl, gridClickHandler);
        addTapListener(elements.gemSlotsEl, gridClickHandler);
        
        addTapListener(document.getElementById('equipment-paperdoll'), (event) => {
            if (!(event.target instanceof Element)) return;
            const slotElement = event.target.closest('.equipment-slot');
            if (!(slotElement instanceof HTMLElement)) return;
            const slotName = slotElement.id.replace('slot-', '');
            
            if (selectedGemForSocketing) {
                const item = gameState.equipment[slotName];
                if (item && item.sockets && item.sockets.includes(null)) {
                    const gemToSocket = selectedGemForSocketing;
                    const firstEmptySocketIndex = item.sockets.indexOf(null);

                    if (firstEmptySocketIndex > -1) {
                        item.sockets[firstEmptySocketIndex] = gemToSocket;
                        gameState.gems = gameState.gems.filter(g => g.id !== gemToSocket.id);
                        logMessage(elements.gameLogEl, `Socketed ${gemToSocket.name} into ${item.name}.`, 'epic', isAutoScrollingLog);
                        selectedGemForSocketing = null;
                        recalculateStats();
                        updateAll();
                        autoSave();
                        return; 
                    }
                }
            }

            player.unequipItem(gameState, slotName);
            recalculateStats();
            updateAll();
            autoSave();
        });

        addTapListener(elements.gemCraftingSlotsContainer, (e) => {
            if (!(e.target instanceof HTMLElement)) return;
            const slot = e.target.closest('.gem-crafting-slot');
            if (!(slot instanceof HTMLElement)) return;
        
            const slotIndexStr = slot.dataset.slot;
            if (slotIndexStr === null || slotIndexStr === undefined) return;
            const slotIndex = parseInt(slotIndexStr, 10);

            const gemInSlot = craftingGems[slotIndex];
        
            if (gemInSlot) {
                gameState.gems.push(gemInSlot);
                craftingGems[slotIndex] = undefined; 
                craftingGems = craftingGems.filter(Boolean);
            } 
            else if (selectedGemForSocketing) {
                if (craftingGems.length < 2) {
                    if (craftingGems.length > 0 && craftingGems[0].tier !== selectedGemForSocketing.tier) {
                        logMessage(elements.gameLogEl, "You can only combine gems of the same tier.", "rare", isAutoScrollingLog);
                        return;
                    }
        
                    craftingGems.push(selectedGemForSocketing);
                    gameState.gems = gameState.gems.filter(g => g.id !== selectedGemForSocketing.id);
                    selectedGemForSocketing = null;
                }
            }
            updateAll();
        });

        addTapListener(elements.gemCraftBtn, () => {
            if (craftingGems.length !== 2) return;
            
            const result = player.combineGems(gameState, craftingGems);
            logMessage(elements.gameLogEl, result.message, result.success && result.newGem ? 'legendary' : 'rare', isAutoScrollingLog);
            craftingGems = [];
            
            recalculateStats();
            updateAll();
            autoSave();
        });

        addTapListener(elements.bulkCombineBtn, () => {
            if (!bulkCombineSelection.tier || !bulkCombineSelection.selectionKey) {
                logMessage(elements.gameLogEl, "Please select a tier and a stat to bulk combine.", "rare", isAutoScrollingLog);
                return;
            }
            const result = player.bulkCombineGems(gameState, bulkCombineSelection.tier, bulkCombineSelection.selectionKey, bulkCombineDeselectedIds);
            logMessage(elements.gameLogEl, result.message, result.success ? 'uncommon' : 'rare', isAutoScrollingLog);
            
            bulkCombineDeselectedIds.clear();
            if (result.success) {
                recalculateStats();
                populateBulkCombineControls(); 
                updateAll();
                autoSave();
            }
        });
        
        elements.bulkCombineTierSelect.addEventListener('change', () => {
            const selectedTier = parseInt((/** @type {HTMLSelectElement} */ (elements.bulkCombineTierSelect)).value, 10);
            bulkCombineSelection.tier = selectedTier || null;
            bulkCombineSelection.selectionKey = null; 
            bulkCombineDeselectedIds.clear();
            populateBulkCombineControls();

            if (lastBulkCombineStatKey) {
                const statSelect = (/** @type {HTMLSelectElement} */ (elements.bulkCombineStatSelect));
                const optionExists = statSelect.querySelector(`option[value="${lastBulkCombineStatKey}"]`);
                if (optionExists) {
                    statSelect.value = lastBulkCombineStatKey;
                    bulkCombineSelection.selectionKey = lastBulkCombineStatKey;
                }
            }
            
            updateAll();
        });

        elements.bulkCombineStatSelect.addEventListener('change', () => {
            bulkCombineSelection.selectionKey = (/** @type {HTMLSelectElement} */ (elements.bulkCombineStatSelect)).value || null;
            lastBulkCombineStatKey = bulkCombineSelection.selectionKey;
            bulkCombineDeselectedIds.clear(); 
            updateAll();
        });

        addTapListener(elements.ringSelectionSlot1, () => {
            if (pendingRingEquip) {
                player.equipRing(gameState, pendingRingEquip, 'ring1');
                recalculateStats();
                updateAll();
                autoSave();
                hideRingSelectionModal();
            }
        });
        addTapListener(elements.ringSelectionSlot2, () => {
            if (pendingRingEquip) {
                player.equipRing(gameState, pendingRingEquip, 'ring2');
                recalculateStats();
                updateAll();
                autoSave();
                hideRingSelectionModal();
            }
        });
        addTapListener(elements.ringSelectionCancelBtn, hideRingSelectionModal);
        addTapListener(elements.ringSelectionModalBackdrop, (e) => {
            if (e.target === elements.ringSelectionModalBackdrop) {
                hideRingSelectionModal();
            }
        });

        elements.ringSelectionSlot1.addEventListener('mouseover', (e) => {
            if (pendingRingEquip && e.currentTarget instanceof HTMLElement) {
                showRingComparisonTooltip(pendingRingEquip, gameState.equipment.ring1, e.currentTarget);
            }
        });
        elements.ringSelectionSlot1.addEventListener('mouseout', onGridMouseOut);
        
        elements.ringSelectionSlot2.addEventListener('mouseover', (e) => {
            if (pendingRingEquip && e.currentTarget instanceof HTMLElement) {
                showRingComparisonTooltip(pendingRingEquip, gameState.equipment.ring2, e.currentTarget);
            }
        });
        elements.ringSelectionSlot2.addEventListener('mouseout', onGridMouseOut);

        addTapListener(elements.offlineProgressCloseBtn, () => {
            elements.offlineProgressModalBackdrop.classList.add('hidden');
        });

        addTapListener(document.getElementById('reset-game-btn'), resetGame);
        addTapListener(elements.modalCloseBtnEl, () => elements.modalBackdropEl.classList.add('hidden'));
        addTapListener(elements.modalBackdropEl, (e) => {
            if (e.target === elements.modalBackdropEl) elements.modalBackdropEl.classList.add('hidden');
        });
        
        document.querySelectorAll('.preset-btn').forEach((btn, index) => {
            addTapListener(btn, () => {
                player.activatePreset(gameState, index);
                logMessage(elements.gameLogEl, `Activated preset: <b>${gameState.presets[index].name}</b>`, '', isAutoScrollingLog);
                recalculateStats();
                updateAll();
                autoSave();
            });

            let pressTimer;
            btn.addEventListener('touchstart', () => {
                pressTimer = window.setTimeout(() => {
                    const currentName = gameState.presets[index].name;
                    const newName = prompt("Enter a new name for the preset:", currentName);
                    if (newName && newName.trim() !== "") {
                        gameState.presets[index].name = newName.trim();
                        logMessage(elements.gameLogEl, `Renamed preset to: <b>${newName.trim()}</b>`, '', isAutoScrollingLog);
                        updateAll();
                        autoSave();
                    }
                }, 1000); 
            }, { passive: true });

            const clearPressTimer = () => clearTimeout(pressTimer);
            btn.addEventListener('touchend', clearPressTimer);
            btn.addEventListener('touchmove', clearPressTimer);
            btn.addEventListener('touchcancel', clearPressTimer);

            btn.addEventListener('dblclick', () => {
                const currentName = gameState.presets[index].name;
                const newName = prompt("Enter a new name for the preset:", currentName);
                if (newName && newName.trim() !== "") {
                    gameState.presets[index].name = newName.trim();
                    logMessage(elements.gameLogEl, `Renamed preset to: <b>${newName.trim()}</b>`, '', isAutoScrollingLog);
                    updateAll();
                    autoSave();
                }
            });
        });
        
        document.querySelectorAll('.tabs').forEach(tabContainer => {
            const tabs = tabContainer.querySelectorAll('.tab-button');
            const parentPanel = tabContainer.parentElement;
            tabs.forEach((tab) => {
                if (!(tab instanceof HTMLElement)) return;
                const viewId = tab.dataset.view;
                if (!viewId) return;

                addTapListener(tab, () => {
                    if (tab.classList.contains('active')) return;
                    if (elements.prestigeView.classList.contains('active')) {
                        logMessage(elements.gameLogEl, "You must confirm or cancel prestige first.", "rare", isAutoScrollingLog);
                        return;
                    }
                    if (viewId === 'gems-view') {
                        populateBulkCombineControls();
                    }
                    if (viewId === 'inventory-view') {
                        ui.populateSalvageFilter(elements, gameState);
                    }
                    if (viewId === 'map-view') {
                        isMapRenderPending = true; // Ensure map is rendered when switching to tab
                    }
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    if (parentPanel) {
                       parentPanel.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
                    }
                    const viewElement = document.getElementById(viewId);
                    if (viewElement) {
                        viewElement.classList.add('active');
                    }
                });
            });
        });

        addTapListener(document.getElementById('toggle-loot-log-btn'), (e) => {
            if (!(e.currentTarget instanceof HTMLButtonElement)) return;

            const btn = e.currentTarget;
            const logView = document.getElementById('game-log-container');
            const lootView = document.getElementById('loot-view');

            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                btn.textContent = 'View Loot';
                logView.classList.remove('hidden');
                lootView.classList.add('hidden');
            } else {
                btn.classList.add('active');
                btn.textContent = 'View Log';
                logView.classList.add('hidden');
                lootView.classList.remove('hidden');
            }
        });
        
        addTapListener(elements.forgeInventorySlotsEl, (e) => {
            if (!(e.target instanceof Element)) return;
            const wrapper = e.target.closest('.item-wrapper');
            if (!(wrapper instanceof HTMLElement)) return;
            
            const id = wrapper.dataset.id;
            if (!id) return;
            
            const item = player.findItemFromAllSources(gameState, id);
            
            if (item && item.stats) {
                selectedItemForForge = item; 
                logMessage(elements.gameLogEl, `Selected <span class="${item.rarity}">${item.name}</span> for rerolling.`, 'uncommon', isAutoScrollingLog);
                updateAll();
            }
        });

        addTapListener(elements.forgeRerollBtn, () => {
            if (!selectedItemForForge) {
                logMessage(elements.gameLogEl, "No item selected to reroll.", 'rare', isAutoScrollingLog);
                return;
            }

            const result = player.rerollItemStats(gameState, selectedItemForForge);
            logMessage(elements.gameLogEl, result.message, result.success ? 'epic' : 'rare', isAutoScrollingLog);
            
            if (result.success) {
                recalculateStats();
                updateAll();
                autoSave();
            }
        });

        addTapListener(elements.permanentUpgradesContainerEl, (e) => {
            if (!(e.target instanceof Element)) return;
            const buyButton = (e.target).closest('.buy-permanent-upgrade-btn');
            if (!buyButton || !(buyButton instanceof HTMLButtonElement) || buyButton.disabled) return;

            const upgradeId = buyButton.dataset.upgradeId;
            if (!upgradeId) return;
            
            if (upgradeId === 'LEGACY_KEEPER') {
                const upgrade = PERMANENT_UPGRADES[upgradeId];
                const currentLevel = gameState.permanentUpgrades[upgradeId] || 0;
                const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costScalar, currentLevel));
                if (gameState.gold >= cost) {
                    pendingLegacyKeeperUpgrade = true;
                    ui.showUnlockSlotModal(elements, gameState.unlockedPrestigeSlots);
                } else {
                    logMessage(elements.gameLogEl, "Not enough gold!", 'rare', isAutoScrollingLog);
                }
                return;
            }

            const result = player.buyPermanentUpgrade(gameState, upgradeId);
            if (result.success) {
                logMessage(elements.gameLogEl, `Purchased Level ${result.newLevel} of ${PERMANENT_UPGRADES[upgradeId].name}!`, 'epic', isAutoScrollingLog);
                recalculateStats();
                updateAll();
                autoSave();
            } else {
                logMessage(elements.gameLogEl, result.message, 'rare', isAutoScrollingLog);
            }
        });
        
        setupLogScrollListeners();
        setupItemTooltipListeners();
        setupGemTooltipListeners();
        setupStatTooltipListeners();
        setupLootTooltipListeners();
        setupRaidListeners();
        setupPrestigeListeners();
        setupLegacyKeeperModalListeners();
        setupSalvageFilterListeners();
        setupViewSlotsListeners();
    }
    
    function setupLogScrollListeners() {
        const logEl = elements.gameLogEl;
        const scrollBtn = elements.scrollToBottomBtn;
    
        const userInteracted = () => {
            if (isAutoScrollingLog) {
                isAutoScrollingLog = false;
                scrollBtn.classList.remove('hidden');
            }
        };

        logEl.addEventListener('wheel', userInteracted);
        logEl.addEventListener('touchmove', userInteracted);
        logEl.addEventListener('mousedown', (e) => {
            if (e instanceof MouseEvent && e.offsetX > logEl.clientWidth) {
                userInteracted();
            }
        });
    
        addTapListener(scrollBtn, () => {
            isAutoScrollingLog = true;
            logEl.scrollTop = logEl.scrollHeight;
            scrollBtn.classList.add('hidden');
        });
    }

    function setupSalvageFilterListeners() {
        const {
            enableSalvageFilter,
            filterKeepRarity,
            filterKeepSockets,
            filterKeepStatsContainer,
            salvageFilterControls,
            enableGemSalvage 
        } = ui.initSalvageFilterDOMElements();
    
        const updateFilter = () => {
            gameState.salvageFilter.enabled = (/** @type {HTMLInputElement} */ (enableSalvageFilter)).checked;
            gameState.salvageFilter.autoSalvageGems = (/** @type {HTMLInputElement} */ (enableGemSalvage)).checked; 
            gameState.salvageFilter.keepRarity = (/** @type {HTMLSelectElement} */ (filterKeepRarity)).value;
            gameState.salvageFilter.keepSockets = parseInt((/** @type {HTMLInputElement} */ (filterKeepSockets)).value, 10) || 0;
            
            const statCheckboxes = filterKeepStatsContainer.querySelectorAll('input[type="checkbox"]');
            statCheckboxes.forEach(checkbox => {
                if (checkbox instanceof HTMLInputElement && checkbox.dataset.statKey) {
                    gameState.salvageFilter.keepStats[checkbox.dataset.statKey] = checkbox.checked;
                }
            });
    
            salvageFilterControls.classList.toggle('hidden', !(/** @type {HTMLInputElement} */ (enableSalvageFilter)).checked);
            autoSave();
        };
    
        enableSalvageFilter.addEventListener('change', updateFilter);
        enableGemSalvage.addEventListener('change', updateFilter);
        filterKeepRarity.addEventListener('change', updateFilter);
        filterKeepSockets.addEventListener('change', updateFilter);
        filterKeepStatsContainer.addEventListener('change', updateFilter);

        const salvageFilterBtn = document.getElementById('auto-salvage-filter-btn');
        const modalBackdrop = document.getElementById('salvage-filter-modal-backdrop');
        const closeBtn = document.getElementById('salvage-filter-close-btn');

        if (salvageFilterBtn && modalBackdrop) {
            addTapListener(salvageFilterBtn, () => {
                modalBackdrop.classList.remove('hidden');
            });
        }
        if (closeBtn && modalBackdrop) {
            addTapListener(closeBtn, () => {
                modalBackdrop.classList.add('hidden');
            });
        }
        if (modalBackdrop) {
            addTapListener(modalBackdrop, (e) => {
                if (e.target === modalBackdrop) {
                    modalBackdrop.classList.add('hidden');
                }
            });
        }
    }
    
    function setupItemTooltipListeners() {
        const onGridMouseOver = (event) => {
            if (!(event.target instanceof Element)) return;
            const wrapper = event.target.closest('.item-wrapper');
            if (!(wrapper instanceof HTMLElement)) return;
            const id = wrapper.dataset.id;
            if (!id) return;

            const item = player.findItemFromAllSources(gameState, id);
            if(item) {
                showItemTooltip(item, wrapper);
            }
        };

        elements.inventorySlotsEl.addEventListener('mouseover', onGridMouseOver);
        elements.inventorySlotsEl.addEventListener('mouseout', onGridMouseOut);
    
        const equipmentSlots = document.getElementById('equipment-paperdoll');
        equipmentSlots.addEventListener('mouseover', (event) => {
            if (!(event.target instanceof Element)) return;
            const slotEl = event.target.closest('.equipment-slot');
            if (!(slotEl instanceof HTMLElement)) return;
            const item = gameState.equipment[slotEl.id.replace('slot-','')];
            showItemTooltip(item, slotEl);
        });
        equipmentSlots.addEventListener('mouseout', onGridMouseOut);
        
        elements.forgeInventorySlotsEl.addEventListener('mouseover', onGridMouseOver);
        elements.forgeInventorySlotsEl.addEventListener('mouseout', onGridMouseOut);
        
        elements.prestigeInventoryDisplay.addEventListener('mouseover', onGridMouseOver);
        elements.prestigeInventoryDisplay.addEventListener('mouseout', onGridMouseOut);
        elements.prestigeEquipmentPaperdoll.addEventListener('mouseover', (event) => {
            if (!(event.target instanceof Element)) return;
            const slotEl = event.target.closest('.equipment-slot');
            if (!(slotEl instanceof HTMLElement)) return;
            const slotName = slotEl.id.replace('prestige-slot-', '');
            const item = gameState.equipment[slotName];
            if (item) showItemTooltip(item, slotEl);
        });
        elements.prestigeEquipmentPaperdoll.addEventListener('mouseout', onGridMouseOut);
    }
    
    function setupGemTooltipListeners(){
        const showGemTooltip = (e) => {
             if (!(e.target instanceof Element)) return;
            const gemWrapper = e.target.closest('div.gem-wrapper');
            if (!(gemWrapper instanceof HTMLElement)) return;

            const gemId = gemWrapper.dataset.id;
            if (!gemId) return;

            const gem = gameState.gems.find(g => String(g.id) === gemId) || craftingGems.find(g => String(g.id) === gemId);
            if (!gem) return;
            
            elements.tooltipEl.className = 'hidden';
            elements.tooltipEl.classList.add('gem-quality');
            elements.tooltipEl.innerHTML = ui.createGemTooltipHTML(gem);

            const rect = gemWrapper.getBoundingClientRect();
            elements.tooltipEl.style.left = `${rect.right + 5}px`;
            elements.tooltipEl.style.top = `${rect.top}px`;
            elements.tooltipEl.classList.remove('hidden');
        };

        elements.gemSlotsEl.addEventListener('mouseover', showGemTooltip);
        elements.gemSlotsEl.addEventListener('mouseout', () => elements.tooltipEl.classList.add('hidden'));
        
        elements.gemCraftingSlotsContainer.addEventListener('mouseover', (e) => {
            if (!(e.target instanceof Element)) return;
            const gemWrapper = e.target.closest('.gem');
            if (!(gemWrapper instanceof HTMLElement)) return; 
            const id = gemWrapper.dataset.gemId;
            const gem = craftingGems.find(g => String(g.id) === id);
            if (!gem) return;

            elements.tooltipEl.className = 'hidden';
            elements.tooltipEl.classList.add('gem-quality');
            elements.tooltipEl.innerHTML = ui.createGemTooltipHTML(gem);

            const rect = gemWrapper.getBoundingClientRect();
            elements.tooltipEl.style.left = `${rect.right + 5}px`;
            elements.tooltipEl.style.top = `${rect.top}px`;
            elements.tooltipEl.classList.remove('hidden');
        });
        elements.gemCraftingSlotsContainer.addEventListener('mouseout', () => elements.tooltipEl.classList.add('hidden'));
    }
    
    function setupStatTooltipListeners() {
        const statTooltipContent = {
            strength: { title: 'Strength', description: 'Increases your raw power. Each point provides:', effects: ['<b>+0.5</b> Flat Click Damage', '<b>+0.2%</b> Total Click Damage'] },
            agility: { title: 'Agility', description: 'Improves your hero\'s combat prowess. Each point provides:', effects: ['<b>+1</b> Flat DPS', '<b>+0.3%</b> Total DPS'] },
            luck: { title: 'Luck', description: 'Increases your fortune in the dungeon. Each point provides:', effects: ['<b>+0.5%</b> Gold Gain'] }
        };
        const attributesArea = document.getElementById('attributes-area');
        attributesArea.addEventListener('mouseover', (event) => {
            if (!(event.target instanceof Element)) return;
            const row = event.target.closest('.attribute-row');
            if (!(row instanceof HTMLElement)) return;
            const attributeKey = row.dataset.attribute;
            if (!attributeKey) return;

            const content = statTooltipContent[attributeKey];
            if (!content) return;
            let html = `<h4>${content.title}</h4><p>${content.description}</p><ul>`;
            content.effects.forEach(effect => { html += `<li>- ${effect}</li>`; });
            html += '</ul>';
            elements.statTooltipEl.innerHTML = html;
            const nameSpan = row.querySelector('span');
            if (!nameSpan) return;
            const rect = nameSpan.getBoundingClientRect();
            elements.statTooltipEl.style.left = `${rect.right + 10}px`;
            elements.statTooltipEl.style.top = `${rect.top}px`;
            elements.statTooltipEl.classList.remove('hidden');
        });
        attributesArea.addEventListener('mouseout', () => elements.statTooltipEl.classList.add('hidden'));
    }

    function setupLootTooltipListeners() {
        const lootTableEl = elements.lootTableDisplayEl;
        lootTableEl.addEventListener('mouseover', (event) => {
            if (!(event.target instanceof Element)) return;
            const entryEl = event.target.closest('.loot-table-entry');
            if (!(entryEl instanceof HTMLElement)) return;
            
            const lootIndexStr = entryEl.dataset.lootIndex;
            if (!lootIndexStr) return;
            const lootIndex = parseInt(lootIndexStr, 10);

            const itemBase = currentMonster.data.lootTable[lootIndex]?.item;
            if (!itemBase) return;
            elements.tooltipEl.className = 'hidden';
            
            if (itemBase.tier >= 1) {
                elements.tooltipEl.innerHTML = ui.createGemTooltipHTML(itemBase);
                elements.tooltipEl.classList.add('gem-quality');
            }
            else if (isShiftPressed) {
                if (itemBase.type === 'ring') {
                    elements.tooltipEl.innerHTML = ui.createLootComparisonTooltipHTML(itemBase, gameState.equipment.ring1, gameState.equipment.ring2);
                } else {
                    const equippedItem = gameState.equipment[itemBase.type];
                    elements.tooltipEl.innerHTML = ui.createLootComparisonTooltipHTML(itemBase, equippedItem);
                }
            } else {
                elements.tooltipEl.innerHTML = ui.createLootTableTooltipHTML(itemBase);
            }
            const rect = entryEl.getBoundingClientRect();
            elements.tooltipEl.style.left = `${rect.right + 10}px`;
            elements.tooltipEl.style.top = `${rect.top}px`;
            elements.tooltipEl.classList.remove('hidden');
        });
        lootTableEl.addEventListener('mouseout', () => {
            elements.tooltipEl.classList.add('hidden');
        });
    }

    function createRaidPanel() {
        if (!socket) return;
        if (document.getElementById('raid-panel')) return;
        const raidContainer = document.getElementById('raid-container');
        if (!raidContainer) return;
        raidContainer.innerHTML = `<div id="raid-panel"><div id="raid-boss-info"><h2 id="raid-boss-name">Loading...</h2><div id="raid-boss-health-bar-container"><div id="raid-boss-health-bar"></div></div><p id="raid-boss-health-text">0 / 0</p></div><div id="raid-main-content"><div id="raid-attack-area"><button id="raid-attack-button">ATTACK!</button></div><div id="raid-player-list"><h3>Participants</h3><ul></ul></div></div></div>`;
        raidPanel = document.getElementById('raid-panel');
        const attackButton = document.getElementById('raid-attack-button');
        if (attackButton) {
            addTapListener(attackButton, () => {
                socket.emit('attackRaidBoss', { damage: playerStats.totalClickDamage });
            });
        }
        socket.emit('joinRaid', { id: raidPlayerId, dps: playerStats.totalDps });
    }

    function destroyRaidPanel() {
        if (raidPanel) {
            raidPanel.remove();
            raidPanel = null;
        }
    }

    function updateRaidUI(raidState) {
        if (!raidPanel) return;
        const boss = raidState.boss;
        const bossNameEl = document.getElementById('raid-boss-name');
        const bossHealthTextEl = document.getElementById('raid-boss-health-text');
        const bossHealthBarEl = document.getElementById('raid-boss-health-bar');
        if (bossNameEl) bossNameEl.textContent = boss.name;
        if (bossHealthTextEl) bossHealthTextEl.textContent = `${formatNumber(Math.ceil(boss.currentHp))} / ${formatNumber(boss.maxHp)}`;
        if (bossHealthBarEl) {
            const healthPercent = (boss.currentHp / boss.maxHp) * 100;
            (/**@type {HTMLElement}*/(bossHealthBarEl)).style.width = `${healthPercent}%`;
        }
        const playerListEl = raidPanel.querySelector('#raid-player-list ul');
        if (playerListEl) {
            playerListEl.innerHTML = '';
            Object.values(raidState.players).forEach(player => {
                const li = document.createElement('li');
                li.textContent = `${player.id} - ${formatNumber(player.dps)} DPS`;
                playerListEl.appendChild(li);
            });
        }
    }
    
    function setupRaidListeners() {
        const raidBtn = document.getElementById('raid-btn');
        if (!socket || !raidBtn) {
            if(raidBtn) raidBtn.style.display = 'none';
            return;
        };

        addTapListener(raidBtn, () => {
            if (raidPanel) {
                destroyRaidPanel();
                socket.disconnect();
                socket.connect();
            } else {
                createRaidPanel();
            }
        });
        socket.on('connect', () => { logMessage(elements.gameLogEl, 'Connected to Raid Server!', 'uncommon', isAutoScrollingLog); });
        socket.on('disconnect', () => { logMessage(elements.gameLogEl, 'Disconnected from Raid Server.', 'rare', isAutoScrollingLog); destroyRaidPanel(); });
        socket.on('raidUpdate', (raidState) => { updateRaidUI(raidState); });
        socket.on('raidOver', (data) => {
            logMessage(elements.gameLogEl, `RAID OVER: ${data.message}`, 'legendary', isAutoScrollingLog);
            const scrapReward = 500;
            gameState.scrap += scrapReward;
            logMessage(elements.gameLogEl, `You received ${formatNumber(scrapReward)} Scrap for participating!`, 'epic', isAutoScrollingLog);
            updateAll();
            destroyRaidPanel();
        });
    }

    function setupPrestigeListeners() {
        addTapListener(elements.prestigeButton, () => {
            document.querySelector('.actions-panel').classList.add('hidden');
            document.querySelector('.upgrades-panel').classList.add('hidden');
            ui.switchView(elements, 'prestige-view');
            updateAll();
        });
    
        addTapListener(elements.cancelPrestigeButton, () => {
            document.querySelector('.actions-panel').classList.remove('hidden');
            document.querySelector('.upgrades-panel').classList.remove('hidden');
            ui.switchView(elements, 'map-view');
            updateAll();
        });
    
        addTapListener(elements.prestigeEquipmentPaperdoll, (event) => {
            if (!(event.target instanceof Element)) return;
            const slotEl = event.target.closest('.equipment-slot');
            if (!(slotEl instanceof HTMLElement)) return;
            const slotName = slotEl.id.replace('prestige-slot-', '');
            player.unequipItem(gameState, slotName);
            recalculateStats();
            updateAll();
            autoSave();
        });

        addTapListener(elements.prestigeInventoryDisplay, (event) => {
            if (!(event.target instanceof Element)) return;
            const wrapper = event.target.closest('.item-wrapper');
            if (!(wrapper instanceof HTMLElement)) return;
            const id = wrapper.dataset.id;
            if (!id) return;

            const itemToEquip = player.findItemFromAllSources(gameState, id);
            if (!itemToEquip) return;

            const result = player.equipItem(gameState, itemToEquip);
            if (result.success) {
                if (result.isPendingRing) {
                    pendingRingEquip = result.item;
                    showRingSelectionModal(pendingRingEquip);
                } else {
                    recalculateStats();
                }
            } else {
                logMessage(elements.gameLogEl, result.message, 'rare', isAutoScrollingLog);
            }
            updateAll();
            autoSave();
        });
    
        addTapListener(elements.confirmPrestigeButton, () => {
            const itemsToAbsorb = gameState.unlockedPrestigeSlots
                .map(slotName => gameState.equipment[slotName])
                .filter(Boolean);
            
            const newAbsorbedStats = {};
            const newAbsorbedSynergies = {}; 
            const newAbsorbedUniqueEffects = {};
    
            for (const item of itemsToAbsorb) {
                const combinedStats = getCombinedItemStats(item);
                for (const statKey in combinedStats) {
                    newAbsorbedStats[statKey] = (newAbsorbedStats[statKey] || 0) + combinedStats[statKey];
                }
                if (item.sockets) {
                    for (const gem of item.sockets) {
                        if (gem && gem.synergy) {
                            const key = `${gem.synergy.source}_to_${gem.synergy.target}`;
                            newAbsorbedSynergies[key] = (newAbsorbedSynergies[key] || 0) + gem.synergy.value;
                        }
                    }
                }
                const itemBase = ITEMS[item.baseId];
                if (itemBase && itemBase.uniqueEffect) {
                    newAbsorbedUniqueEffects[itemBase.uniqueEffect] = (newAbsorbedUniqueEffects[itemBase.uniqueEffect] || 0) + 1;
                }
            }
    
            if (itemsToAbsorb.length > 0) {
                logMessage(elements.gameLogEl, `Absorbed stats from ${itemsToAbsorb.length} equipped item(s)!`, 'epic', isAutoScrollingLog);
            } else {
                logMessage(elements.gameLogEl, `No items were equipped in unlocked slots to absorb.`, 'uncommon', isAutoScrollingLog);
            }
    
            const heroToPrestige = gameState.hero;
            const oldAbsorbedStats = gameState.absorbedStats || {};
            const finalAbsorbedStats = { ...oldAbsorbedStats };
            for (const statKey in newAbsorbedStats) {
                finalAbsorbedStats[statKey] = (finalAbsorbedStats[statKey] || 0) + newAbsorbedStats[statKey];
            }

            const oldAbsorbedSynergies = gameState.absorbedSynergies || {};
            const finalAbsorbedSynergies = { ...oldAbsorbedSynergies };
            for (const key in newAbsorbedSynergies) {
                finalAbsorbedSynergies[key] = (finalAbsorbedSynergies[key] || 0) + newAbsorbedSynergies[key];
            }
    
            const oldAbsorbedUniqueEffects = gameState.absorbedUniqueEffects || {};
            const finalAbsorbedUniqueEffects = { ...oldAbsorbedUniqueEffects };
            for (const [effectKey, count] of Object.entries(newAbsorbedUniqueEffects)) {
                finalAbsorbedUniqueEffects[effectKey] = (finalAbsorbedUniqueEffects[effectKey] || 0) + count;
            }
    
            const spentPoints = heroToPrestige.attributes.strength + heroToPrestige.attributes.agility + heroToPrestige.attributes.luck;
            const newTotalAttributePoints = heroToPrestige.attributePoints + spentPoints;
    
            const prestgedHeroState = {
                ...heroToPrestige,
                attributePoints: newTotalAttributePoints,
                attributes: { strength: 0, agility: 0, luck: 0 }
            };
    
            const oldPrestigeCount = gameState.prestigeCount || 0;
            const currentPrestigeLevel = gameState.nextPrestigeLevel || 100;
            const baseState = getDefaultGameState();
    
            gameState = {
                ...baseState,
                permanentUpgrades: gameState.permanentUpgrades,
                salvageFilter: gameState.salvageFilter, 
                unlockedPrestigeSlots: gameState.unlockedPrestigeSlots,
                absorbedStats: finalAbsorbedStats,
                absorbedSynergies: finalAbsorbedSynergies,
                absorbedUniqueEffects: finalAbsorbedUniqueEffects,
                prestigeCount: oldPrestigeCount + 1,
                completedLevels: gameState.completedLevels, 
                maxLevel: 1,
                nextPrestigeLevel: currentPrestigeLevel + 100,
                hero: prestgedHeroState,
                currentFightingLevel: 1,
                currentRunCompletedLevels: [],
            };
            gameState.equipment = gameState.presets[gameState.activePresetIndex].equipment;

    
            logMessage(elements.gameLogEl, `PRESTIGE! You are reborn with greater power. Your next goal is Level ${gameState.nextPrestigeLevel}.`, 'legendary', isAutoScrollingLog);
            
            document.querySelector('.actions-panel').classList.remove('hidden');
            document.querySelector('.upgrades-panel').classList.remove('hidden');
            ui.switchView(elements, 'map-view');
            recalculateStats();
            startNewMonster();
            updateAll();
            autoSave();
        });
    }

    function showUnlockConfirmationModal(slotName) {
        elements.modalTitleEl.textContent = 'Confirm Unlock';
        elements.modalBodyEl.innerHTML = `<p>Are you sure you want to permanently unlock the <b>${slotName.charAt(0).toUpperCase() + slotName.slice(1)}</b> legacy slot?</p>`;
        elements.modalCloseBtnEl.classList.add('hidden');

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'Confirm';
        confirmBtn.style.background = 'linear-gradient(145deg, #27ae60, #2ecc71)';
        confirmBtn.style.borderBottomColor = '#229954';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.background = '#c0392b';
        cancelBtn.style.borderBottomColor = '#922b21';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '20px';
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        elements.modalBodyEl.appendChild(buttonContainer);

        const closeThisModal = () => {
            elements.modalBackdropEl.classList.add('hidden');
            elements.modalCloseBtnEl.classList.remove('hidden');
        };

        addTapListener(cancelBtn, closeThisModal);

        addTapListener(confirmBtn, () => {
            const upgrade = PERMANENT_UPGRADES.LEGACY_KEEPER;
            const currentLevel = gameState.permanentUpgrades.LEGACY_KEEPER || 0;
            const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costScalar, currentLevel));
            
            gameState.gold -= cost;
            gameState.permanentUpgrades.LEGACY_KEEPER++;
            gameState.unlockedPrestigeSlots.push(slotName);
            
            logMessage(elements.gameLogEl, `You have unlocked the <b class="epic">${slotName.charAt(0).toUpperCase() + slotName.slice(1)}</b> slot for Prestige!`, 'epic', isAutoScrollingLog);
            
            pendingLegacyKeeperUpgrade = false;
            closeThisModal();
            ui.hideUnlockSlotModal(elements);
            recalculateStats();
            updateAll();
            autoSave();
        });

        elements.modalBackdropEl.classList.remove('hidden');
    }

    function setupLegacyKeeperModalListeners() {
        addTapListener(elements.unlockSlotPaperdoll, (e) => {
            if (!pendingLegacyKeeperUpgrade) return;
            if (!(e.target instanceof Element)) return;
            const slotEl = e.target.closest('.equipment-slot');
            if (!(slotEl instanceof HTMLElement) || slotEl.classList.contains('prestige-unlocked')) {
                return;
            }
            const slotName = slotEl.id.replace('unlock-slot-', '');
            showUnlockConfirmationModal(slotName);
        });

        addTapListener(elements.unlockSlotCancelBtn, () => {
            pendingLegacyKeeperUpgrade = false;
            ui.hideUnlockSlotModal(elements);
        });

        addTapListener(elements.unlockSlotModalBackdrop, (e) => {
            if (e.target === elements.unlockSlotModalBackdrop) {
                pendingLegacyKeeperUpgrade = false;
                ui.hideUnlockSlotModal(elements);
            }
        });
    }

    function setupViewSlotsListeners() {
        const { viewPrestigeSlotsBtn, viewSlotsModalBackdrop, viewSlotsCloseBtn } = elements;

        addTapListener(viewPrestigeSlotsBtn, () => {
            ui.showViewSlotsModal(elements, gameState.unlockedPrestigeSlots);
        });

        const close = () => viewSlotsModalBackdrop.classList.add('hidden');

        addTapListener(viewSlotsCloseBtn, close);
        addTapListener(viewSlotsModalBackdrop, (e) => {
            if (e.target === viewSlotsModalBackdrop) {
                close();
            }
        });
    }
    
    function migrateToPresetInventories(loadedState) {
        console.log("Old preset system detected. Migrating to new independent preset inventories...");
        const migratedState = getDefaultGameState();

        Object.keys(migratedState).forEach(key => {
            if (typeof loadedState[key] !== 'undefined' && !['presets', 'equipment', 'inventory'].includes(key)) {
                migratedState[key] = loadedState[key];
            }
        });

        migratedState.presets[0].equipment = { ...loadedState.equipment };

        const looseItems = [...(loadedState.inventory || [])];
        if (loadedState.presets && loadedState.presets.length > 1) {
            for (let i = 1; i < loadedState.presets.length; i++) {
                const oldPreset = loadedState.presets[i];
                if (oldPreset && oldPreset.equipment) {
                    Object.values(oldPreset.equipment).forEach(item => {
                        if (item) looseItems.push(item);
                    });
                }
            }
        }
        migratedState.inventory = looseItems;
        
        migratedState.activePresetIndex = loadedState.activePresetIndex || 0;
        if(migratedState.activePresetIndex >= migratedState.presets.length) {
            migratedState.activePresetIndex = 0;
        }
        migratedState.equipment = migratedState.presets[migratedState.activePresetIndex].equipment;
        
        migratedState.presetSystemMigrated = true;
        
        logMessage(elements.gameLogEl, "Your equipment presets have been updated to a new system! You may need to re-organize your gear.", "uncommon", isAutoScrollingLog);

        return migratedState;
    }

    main();
});