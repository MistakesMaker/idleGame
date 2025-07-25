// --- START OF FILE game.js ---

import { REALMS } from './data/realms.js';
import { MONSTERS } from './data/monsters.js';
import { ITEMS } from './data/items.js';
import { GEMS } from './data/gems.js';
import { CONSUMABLES } from './data/consumables.js';
import { STATS } from './data/stat_pools.js';
import { PERMANENT_UPGRADES } from './data/upgrades.js';
import { logMessage, formatNumber, getUpgradeCost, findSubZoneByLevel, findFirstLevelOfZone, isBossLevel, isBigBossLevel, getCombinedItemStats, isMiniBossLevel, findNextAvailableSpot, getRandomInt, getTravelOptionsForHunt } from './utils.js';
import * as ui from './ui.js';
import { showSimpleTooltip } from './ui.js'; 
import * as player from './player_actions.js';
import * as logic from './game_logic.js';
import { HUNT_POOLS } from './data/hunts.js';
import { HUNT_SHOP_INVENTORY } from './data/hunt_shop.js'; 
import { initSounds, playSound, toggleMute, getMuteState, setRealmMusic } from './sound_manager.js';

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
    let isMapRenderPending = false; // Flag to control map re-rendering

    let currentMonster = { name: "Slime", data: MONSTERS.SLIME };
    let playerStats = { baseClickDamage: 1, baseDps: 0, totalClickDamage: 1, totalDps: 0, bonusGold: 0, magicFind: 0, bonusXp: 0 };
    let statBreakdown = {};
    let salvageMode = { active: false, selections: [] };
    let saveTimeout;
    let isShiftPressed = false;
    let lastMousePosition = { x: 0, y: 0 };
    let pendingRingEquip = null;
    let selectedGemForSocketing = null;
    let craftingGems = []; // Will hold temporary, full gem objects, NOT IDs.
    let selectedItemForForge = null;
    let selectedStatToForgeKey = null;
    let isResetting = false; 
    let pendingLegacyKeeperUpgrade = false; 
    let bulkCombineSelection = { tier: null, selectionKey: null };
    let bulkCombineDeselectedIds = new Set();
    let lastBulkCombineStatKey = null;
    let isAutoScrollingLog = true;
    let currentPlayingRealmName = null;
    let wikiFavorites = [];
    let wikiShowFavorites = false;
    let wikiShowUpgradesOnly = false;
    let gemSortPreference = 'tier_desc';
    let heldKeys = new Set();
    let activeTargetedConsumable = null; 
    const MODIFIER_KEYS = ['q', 'w', 'e', 'r'];

    /** @type {DOMElements} */
    let elements = {};

    // --- BESTIARY STATE ---
    let wikiState = {
        data: [],
        filters: {
            searchText: '',
            type: '',
            sockets: null,
            stats: new Map(),
        }
    };
    
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
            firstKillCompleted: false,
            equipment: { ...defaultEquipmentState }, // This will be a REFERENCE to the active preset's equipment
            inventory: [],
            consumables: [],
            activeBuffs: [],
            gems: [],
            monsterKillCounts: {},
            unlockedPrestigeSlots: ['sword'], 
            goldenSlimeStreak: { max: 0, maxGold: 0 },
            absorbedStats: {},
            absorbedSynergies: {},
            absorbedUniqueEffects: {},
            // --- NEW PROPERTIES START HERE ---
            permanentStatBonuses: { totalClickDamage: 0, totalDps: 0 }, // For Tomes
            purchasedOneTimeShopItems: [], // For tracking one-time shop buys
            activeTargetedConsumable: null, // For tracking items like the Artisan's Drill
            // --- NEW PROPERTIES END HERE ---
            wisdomOfTheOverworldDropped: false,
            wisdomOfTheOverworldUsed: false,
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
            },
            wikiFavorites: [],
            tutorialCompleted: false,
            unlockedFeatures: {
                inventory: false,
                equipment: false,
                gems: false,
                forge: false,
                prestige: false,
                wiki: false,
                consumables: false,
                hunts: false,
                huntTravel: false,
            },
            pendingSubTabViewFlash: null,
            hunts: {
                dailyRerollsLeft: 5,
                lastRerollTimestamp: null,
                available: [null, null, null],
                active: null,
                progress: 0,
                completionCounts: {},
                tokens: 0,
                totalCompleted: 0,
            },
        };
    }

    function updateRealmMusic() {
        const subZone = findSubZoneByLevel(gameState.currentFightingLevel);
        const realm = subZone ? REALMS.find(r => Object.values(r.zones).includes(subZone.parentZone)) : null;
        const newRealmName = realm ? realm.name : null;
    
        if (newRealmName !== currentPlayingRealmName) {
            console.log(`Realm changed. Playing music for: ${newRealmName}`);
            currentPlayingRealmName = newRealmName;
            setRealmMusic(newRealmName);
        }
    }

    function recalculateStats() {
    statBreakdown = {
        clickDamage: { sources: [], multipliers: [], synergy: 0 },
        dps: { sources: [], multipliers: [], synergy: 0 },
        goldGain: { sources: [] },
        magicFind: { sources: [] }
    };

    const hero = gameState.hero;
    const absorbed = gameState.absorbedStats || {};
    const permUpgrades = gameState.permanentUpgrades || {};
    const permUpgradeDefs = PERMANENT_UPGRADES;
    const permStatBonuses = gameState.permanentStatBonuses || { totalClickDamage: 0, totalDps: 0, magicFind: 0 };

    const permanentUpgradeBonuses = {
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

    let baseClickDamage = 1;
    let baseDps = 0;
    let bonusGold = 0;
    let magicFind = 0;
    let bonusXp = 0;

    // --- NEW POTION BUFFS ---
    let bonusBossDamagePercent = 0;
    let bonusCritChance = 0;
    let bonusCritDamage = 0;
    let dpsToClickDamagePercent = 0;
    let bonusClickDamagePercent = 0;

    statBreakdown.clickDamage.sources.push({ label: 'Base', value: 1 });
    
    if (gameState.activeBuffs) {
        gameState.activeBuffs.forEach(buff => {
            if (buff.stats) {
                bonusGold += buff.stats.bonusGold || 0;
                magicFind += buff.stats.magicFind || 0;
                bonusXp += buff.stats.bonusXp || 0;
                bonusBossDamagePercent += buff.stats.bonusBossDamagePercent || 0;
                bonusCritChance += buff.stats.bonusCritChance || 0;
                bonusCritDamage += buff.stats.bonusCritDamage || 0;
                dpsToClickDamagePercent += buff.stats.dpsToClickDamagePercent || 0;
                bonusClickDamagePercent += buff.stats.bonusClickDamagePercent || 0;
            }
        });
    }
    
    // --- Prestige Stats (separated for clarity) ---
    if (absorbed.clickDamage) {
        const rawValue = absorbed.clickDamage;
        const totalValue = rawValue * prestigeMultiplier;
        const powerBonus = totalValue - rawValue;
        baseClickDamage += totalValue;
        statBreakdown.clickDamage.sources.push({ label: 'From Prestige', value: rawValue });
        if (powerBonus > 0) {
            statBreakdown.clickDamage.sources.push({ label: 'From Prestige Power', value: powerBonus });
        }
    }
    if (absorbed.dps) {
        const rawValue = absorbed.dps;
        const totalValue = rawValue * prestigeMultiplier;
        const powerBonus = totalValue - rawValue;
        baseDps += totalValue;
        statBreakdown.dps.sources.push({ label: 'From Prestige', value: rawValue });
        if (powerBonus > 0) {
            statBreakdown.dps.sources.push({ label: 'From Prestige Power', value: powerBonus });
        }
    }
    if (absorbed.goldGain) {
        const rawValue = absorbed.goldGain;
        const totalValue = rawValue * prestigeMultiplier;
        const powerBonus = totalValue - rawValue;
        bonusGold += totalValue;
        statBreakdown.goldGain.sources.push({ label: 'From Prestige', value: rawValue, isPercent: true });
        if (powerBonus > 0) {
            statBreakdown.goldGain.sources.push({ label: 'From Prestige Power', value: powerBonus, isPercent: true });
        }
    }
    if (absorbed.magicFind) {
        const rawValue = absorbed.magicFind;
        const totalValue = rawValue * prestigeMultiplier;
        const powerBonus = totalValue - rawValue;
        magicFind += totalValue;
        statBreakdown.magicFind.sources.push({ label: 'From Prestige', value: rawValue, isPercent: true });
        if (powerBonus > 0) {
            statBreakdown.magicFind.sources.push({ label: 'From Prestige Power', value: powerBonus, isPercent: true });
        }
    }
    
    // --- Gear Stats ---
    let clickFromGear = 0, dpsFromGear = 0, goldFromGear = 0, magicFromGear = 0;
    let synergyFromGems = 0;
    for (const item of Object.values(gameState.equipment)) {
        if (item) {
            const combinedStats = getCombinedItemStats(item);
            clickFromGear += combinedStats.clickDamage || 0;
            dpsFromGear += combinedStats.dps || 0;
            goldFromGear += combinedStats.goldGain || 0;
            magicFromGear += combinedStats.magicFind || 0;
            
            if (item.sockets) {
                for (const gem of item.sockets) {
                    if (gem && gem.synergy) synergyFromGems += gem.synergy.value;
                }
            }
        }
    }
    baseClickDamage += clickFromGear;
    baseDps += dpsFromGear;
    bonusGold += goldFromGear;
    magicFind += magicFromGear;
    statBreakdown.clickDamage.sources.push({ label: 'From Gear', value: clickFromGear });
    statBreakdown.dps.sources.push({ label: 'From Gear', value: dpsFromGear });
    statBreakdown.goldGain.sources.push({ label: 'From Gear', value: goldFromGear, isPercent: true });
    statBreakdown.magicFind.sources.push({ label: 'From Gear', value: magicFromGear, isPercent: true });
    
    // --- Attribute Bonuses ---
    const strengthBonusClickFlat = hero.attributes.strength * 5;
    const strengthBonusClickPercent = hero.attributes.strength * 0.2;
    baseClickDamage += strengthBonusClickFlat;
    statBreakdown.clickDamage.sources.push({ label: 'From Strength', value: strengthBonusClickFlat });
    statBreakdown.clickDamage.multipliers.push({ label: 'From Strength', value: strengthBonusClickPercent });

    const agilityBonusDpsFlat = hero.attributes.agility * 10;
    const agilityBonusDpsPercent = hero.attributes.agility * 0.8;
    baseDps += agilityBonusDpsFlat;
    statBreakdown.dps.sources.push({ label: 'From Agility', value: agilityBonusDpsFlat });
    statBreakdown.dps.multipliers.push({ label: 'From Agility', value: agilityBonusDpsPercent });
    
    const luckBonusGold = hero.attributes.luck * 1;
    bonusGold += luckBonusGold;
    statBreakdown.goldGain.sources.push({ label: 'From Luck', value: luckBonusGold, isPercent: true });
    
    const luckBonusMagicFind = hero.attributes.luck * 0.1;
    magicFind += luckBonusMagicFind;
    statBreakdown.magicFind.sources.push({ label: 'From Luck', value: luckBonusMagicFind, isPercent: true });

    // --- Permanent Upgrades & Bonuses ---
    magicFind += permanentUpgradeBonuses.magicFind;
    statBreakdown.magicFind.sources.push({ label: 'From Upgrades', value: permanentUpgradeBonuses.magicFind, isPercent: true });

    if (permStatBonuses.magicFind > 0) {
        magicFind += permStatBonuses.magicFind;
        statBreakdown.magicFind.sources.push({ label: 'From Tomes', value: permStatBonuses.magicFind, isPercent: true });
    }
    
    // --- Multipliers ---
    let finalClickDamage = baseClickDamage * (1 + (strengthBonusClickPercent / 100));
    let finalDps = baseDps * (1 + (agilityBonusDpsPercent / 100));

    const clickUpgradeBonusPercent = gameState.upgrades.clickDamage * 1;
    finalClickDamage *= (1 + (clickUpgradeBonusPercent / 100));
    statBreakdown.clickDamage.multipliers.push({ label: 'From Gold Upgrades', value: clickUpgradeBonusPercent });
    
    const dpsUpgradeBonusPercent = gameState.upgrades.dps * 1;
    finalDps *= (1 + (dpsUpgradeBonusPercent / 100));
    statBreakdown.dps.multipliers.push({ label: 'From Gold Upgrades', value: dpsUpgradeBonusPercent });
    
    // --- Synergy & Potion Click Damage ---
    const dpsToClickSynergyValue = (gameState.absorbedSynergies && gameState.absorbedSynergies['dps_to_clickDamage']) || 0;
    const totalSynergy = synergyFromGems + (dpsToClickSynergyValue * prestigeMultiplier);
    
    const totalDpsToClickPercent = totalSynergy + (dpsToClickDamagePercent / 100);
    if (totalDpsToClickPercent > 0) {
        const synergyBonus = finalDps * totalDpsToClickPercent;
        finalClickDamage += synergyBonus;
        statBreakdown.clickDamage.synergy = synergyBonus;
    }

    // --- NEW POTION BUFFS (Multiplicative) ---
    if (bonusClickDamagePercent > 0) {
        finalClickDamage *= (1 + (bonusClickDamagePercent / 100));
    }

    // --- FINAL MULTIPLIERS FROM TOMES ---
    if (permStatBonuses.totalClickDamage > 0) {
        const tomeMultiplier = 1 + (permStatBonuses.totalClickDamage / 100);
        finalClickDamage *= tomeMultiplier;
        statBreakdown.clickDamage.multipliers.push({ label: 'From Tomes', value: permStatBonuses.totalClickDamage });
    }
    if (permStatBonuses.totalDps > 0) {
        const tomeMultiplier = 1 + (permStatBonuses.totalDps / 100);
        finalDps *= tomeMultiplier;
        statBreakdown.dps.multipliers.push({ label: 'From Tomes', value: permStatBonuses.totalDps });
    }


    playerStats = {
        baseClickDamage: baseClickDamage,
        baseDps: baseDps,
        totalClickDamage: finalClickDamage,
        totalDps: finalDps,
        bonusGold: bonusGold,
        magicFind: magicFind,
        bonusXp: bonusXp,
        critChance: permanentUpgradeBonuses.critChance + bonusCritChance,
        critDamage: 1.5 + ((permanentUpgradeBonuses.critDamage + bonusCritDamage) / 100),
        multiStrikeChance: permanentUpgradeBonuses.multiStrike,
        bossDamageBonus: 1 + ((permanentUpgradeBonuses.bossDamage + bonusBossDamagePercent) / 100),
        scrapBonus: 1 + (permanentUpgradeBonuses.scrap / 100),
        gemFindChance: permanentUpgradeBonuses.gemFind,
        legacyKeeperBonus: permanentUpgradeBonuses.legacyKeeper,
    };
}
    /**
     * Helper function to refresh the gem view if it's currently active.
     */
    function refreshGemViewIfActive() {
        const inventoryView = document.getElementById('inventory-view');
        if (inventoryView && inventoryView.classList.contains('active')) {
            const gemsSubView = document.getElementById('inventory-gems-view');
            if (gemsSubView && gemsSubView.classList.contains('active')) {
                ui.populateGemSortOptions(elements, gameState.gems, gemSortPreference);
                sortAndRenderGems();
            }
        }
    }

    function handleMonsterDefeated() {
    playSound('monster_defeat');
    
    // NOTE: The Hunts UI update logic was moved from here...

    const oldSubZone = findSubZoneByLevel(gameState.currentFightingLevel);
    const oldRealmIndex = oldSubZone ? REALMS.findIndex(r => Object.values(r.zones).some(z => z === oldSubZone.parentZone)) : -1;

    const result = logic.monsterDefeated(gameState, playerStats, currentMonster);

    // ...to here. This ensures the UI is rendered AFTER the gameState (hunt progress) has been updated.
    const huntsModal = document.getElementById('hunts-modal-backdrop');
    if (huntsModal && !huntsModal.classList.contains('hidden')) {
        ui.renderHuntsView(elements, gameState);
    }
    ui.updateHuntsButtonGlow(gameState);

    result.logMessages.forEach(msg => {
        logMessage(elements.gameLogEl, msg.message, msg.class, isAutoScrollingLog);
    });
    if (result.events && result.events.includes('gemFind')) {
        ui.showInfoPopup(elements.popupContainerEl, 'Double Gem!', { top: '10%', fontSize: '3.5em' });
    }
    ui.showGoldPopup(elements.popupContainerEl, result.goldGained);

    if (result.droppedItems && result.droppedItems.length > 0) {
        result.droppedItems.forEach((item, index) => {
            ui.showItemDropAnimation(elements.popupContainerEl, item, index);
            
            if (item.type === 'consumable') {
                ui.renderGrid(elements.consumablesSlotsEl, gameState.consumables, { calculatePositions: true, showLockIcon: false });
                if (!gameState.unlockedFeatures.consumables) {
                    gameState.unlockedFeatures.consumables = true;
                    logMessage(elements.gameLogEl, '<b>Consumables Unlocked!</b> You can now use special one-time-use items from a new tab in your inventory.', 'legendary', isAutoScrollingLog);
                    ui.updateTabVisibility(gameState);
                    ui.flashTab('inventory-view');
                    gameState.pendingSubTabViewFlash = 'inventory-consumables-view';

                    if (document.getElementById('inventory-view')?.classList.contains('active')) {
                        ui.switchInventorySubView('inventory-consumables-view');
                        const subTabButton = document.querySelector(`.sub-tab-button[data-subview="inventory-consumables-view"]`);
                        if (subTabButton) {
                            subTabButton.classList.add('newly-unlocked-flash');
                            setTimeout(() => subTabButton.classList.remove('newly-unlocked-flash'), 5000);
                        }
                        gameState.pendingSubTabViewFlash = null;
                    }
                }
            } else {
                ui.addItemToGrid(elements.inventorySlotsEl, item);
                if (!gameState.unlockedFeatures.inventory) {
                    gameState.unlockedFeatures.inventory = true;
                    logMessage(elements.gameLogEl, '<b>Inventory Unlocked!</b> You can now view and manage your items.', 'legendary', isAutoScrollingLog);
                    ui.updateTabVisibility(gameState);
                    ui.flashTab('inventory-view');
                }
            }
            
            if (item.sockets && item.sockets.length > 0 && !gameState.unlockedFeatures.gems) {
                 logMessage(elements.gameLogEl, 'You found an item with strange, empty sockets. Perhaps there are special stones that could fit inside...', 'uncommon', isAutoScrollingLog);
            }
        });
    }
    
    if (result.droppedGems && result.droppedGems.length > 0) {
        result.droppedGems.forEach((gemStack, index) => {
            ui.showItemDropAnimation(elements.popupContainerEl, gemStack, index);
             if (!gameState.unlockedFeatures.gems) {
                gameState.unlockedFeatures.gems = true;
                logMessage(elements.gameLogEl, '<b>Gems Unlocked!</b> You can now view and socket powerful gems from a new tab in your inventory.', 'legendary', isAutoScrollingLog);
                ui.updateTabVisibility(gameState);
                ui.flashTab('inventory-view');
                gameState.pendingSubTabViewFlash = 'inventory-gems-view';
                
                if (document.getElementById('inventory-view')?.classList.contains('active')) {
                    ui.switchInventorySubView('inventory-gems-view');
                    const subTabButton = document.querySelector(`.sub-tab-button[data-subview="inventory-gems-view"]`);
                    if (subTabButton) {
                        subTabButton.classList.add('newly-unlocked-flash');
                        setTimeout(() => subTabButton.classList.remove('newly-unlocked-flash'), 5000);
                    }
                    gameState.pendingSubTabViewFlash = null;
                }
            }
        });
        refreshGemViewIfActive();
    }

    const wasBossDefeated = isBigBossLevel(gameState.currentFightingLevel) || isBossLevel(gameState.currentFightingLevel);
    if (wasBossDefeated && gameState.currentFightingLevel === gameState.nextPrestigeLevel) {
        if (!gameState.unlockedFeatures.prestige) {
            gameState.unlockedFeatures.prestige = true;
            logMessage(elements.gameLogEl, '<b>Prestige Unlocked!</b> You can now reset your progress for powerful permanent bonuses.', 'legendary', isAutoScrollingLog);
            ui.updatePrestigeUI(elements, gameState);
        }
    }

    const levelUpLogs = player.gainXP(gameState, result.xpGained, playerStats.bonusXp);
    if (levelUpLogs.length > 0) {
        levelUpLogs.forEach(msg => logMessage(elements.gameLogEl, msg, 'legendary', isAutoScrollingLog));
        recalculateStats();
    }

    ui.updateHeroPanel(elements, gameState, heldKeys);
    ui.updatePrestigeUI(elements, gameState);
    ui.updateCurrency(elements, gameState);
    ui.updateUpgrades(elements, gameState);
    ui.renderPermanentUpgrades(elements, gameState);

    if (result.encounterEnded) {
        gameState.specialEncounter = null;
    }

    if (gameState.isAutoProgressing) {
        const newSubZone = findSubZoneByLevel(gameState.currentFightingLevel);
        if (newSubZone) {
            const newRealmIndex = REALMS.findIndex(r => Object.values(r.zones).some(z => z === newSubZone.parentZone));
            if (newRealmIndex !== -1 && (newRealmIndex !== oldRealmIndex || (oldSubZone && newSubZone.name !== oldSubZone.name))) {
                const newZoneId = Object.keys(REALMS[newRealmIndex].zones).find(id => REALMS[newRealmIndex].zones[id] === newSubZone.parentZone);
                currentViewingRealmIndex = newRealmIndex;
                currentViewingZoneId = newZoneId || 'world';
                isMapRenderPending = true;
            }
        }
    }
    
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
        isMapRenderPending = true;
    }

    autoSave();

    setTimeout(() => {
        startNewMonster();
        ui.updateMonsterUI(elements, gameState, currentMonster);
        ui.updateLootPanel(elements, currentMonster, gameState);
        if (isMapRenderPending) {
            renderMapAccordion();
            isMapRenderPending = false;
        }
    }, 300);
    updateRealmMusic();
}

function startNewMonster() {
    const { newMonster, newMonsterState } = logic.generateMonster(gameState.currentFightingLevel, gameState.specialEncounter);
    currentMonster = newMonster;
    gameState.monster = newMonsterState;
    ui.updateMonsterUI(elements, gameState, newMonster);

    if (!gameState.unlockedFeatures.wiki && gameState.currentFightingLevel === 25) {
        gameState.unlockedFeatures.wiki = true;
        logMessage(elements.gameLogEl, '<b>Item Wiki Unlocked!</b> You can now research items and their drop locations.', 'legendary', isAutoScrollingLog);
        ui.updateTabVisibility(gameState);
        ui.flashTab('wiki-view');
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

    // --- START OF MODIFICATION ---
    const isRagingAutomatonActive = !isClick && gameState.activeBuffs.some(b => b.specialEffect === 'guaranteedDpsCrit');
    const isCrit = isRagingAutomatonActive || (Math.random() * 100 < playerStats.critChance);
    // --- END OF MODIFICATION ---

    if (isCrit) {
        finalDamage *= playerStats.critDamage;
        if (isClick) {
            playSound('crit_hit');
        }
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
        playSound('monster_hit');
        attack(playerStats.totalClickDamage, true);
        elements.monsterImageEl.classList.add('monster-hit');
        setTimeout(() => elements.monsterImageEl.classList.remove('monster-hit'), 200);
        if (gameState.monster.hp <= 0) {
            handleMonsterDefeated();
        }
        ui.updateMonsterHealthBar(elements, gameState.monster);
    }

    function updateActiveBuffs() {
    if (!gameState.activeBuffs || gameState.activeBuffs.length === 0) {
        ui.updateActiveBuffsUI(elements, gameState.activeBuffs);
        return;
    }

    const now = Date.now();
    const expiredBuffs = gameState.activeBuffs.filter(buff => now >= buff.expiresAt);
    
    if (expiredBuffs.length > 0) {
        gameState.activeBuffs = gameState.activeBuffs.filter(buff => now < buff.expiresAt);
        expiredBuffs.forEach(buff => {
            logMessage(elements.gameLogEl, `Your <b>${buff.name}</b> buff has worn off.`, 'rare', isAutoScrollingLog);
        });
        
        recalculateStats();
        ui.updateStatsPanel(elements, playerStats);
    }

    ui.updateActiveBuffsUI(elements, gameState.activeBuffs);
}

    function gameLoop() {
        if (playerStats.totalDps > 0 && gameState.monster.hp > 0) {
            attack(playerStats.totalDps, false);
            if (gameState.monster.hp <= 0) {
                handleMonsterDefeated();
            }
            ui.updateMonsterHealthBar(elements, gameState.monster);
        }
        updateActiveBuffs();
    }

    function fullUIRender() {
        ui.updateTabVisibility(gameState);
        ui.updateUI(elements, gameState, playerStats, currentMonster, salvageMode, craftingGems, selectedItemForForge, bulkCombineSelection, bulkCombineDeselectedIds);
        renderMapAccordion();
        ui.renderPermanentUpgrades(elements, gameState);
        ui.updateActiveBuffsUI(elements, gameState.activeBuffs);
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
            localStorage.removeItem('idleRPG_isMuted'); // Also clear mute preference
            window.location.reload();
        }
    }

    function renderMapAccordion(animate = false) { // Add animate parameter, default to false
        const fightingSubZone = findSubZoneByLevel(gameState.currentFightingLevel);
        const fightingRealmIndex = fightingSubZone ? REALMS.findIndex(r => Object.values(r.zones).some(z => z === fightingSubZone.parentZone)) : -1;
        const fightingZoneId = fightingSubZone && fightingRealmIndex !== -1 ? Object.keys(REALMS[fightingRealmIndex].zones).find(id => REALMS[fightingRealmIndex].zones[id] === fightingSubZone.parentZone) : null;

        const callbacks = {
            onRealmHeaderClick: handleRealmHeaderClick,
            onZoneNodeClick: handleZoneNodeClick,
            onSubZoneNodeClick: handleSubZoneNodeClick,
            onBackToWorldClick: handleBackToWorldClick,
        };
    // Pass the animate flag down to the UI function
        ui.renderMapAccordion(elements, gameState, currentViewingRealmIndex, currentViewingZoneId, fightingRealmIndex, fightingZoneId, callbacks, animate);
    }
    
    function handleRealmHeaderClick(realmIndex) {
        if (currentViewingRealmIndex === realmIndex) {
            currentViewingRealmIndex = -1;
        } else {
            currentViewingRealmIndex = realmIndex;
        }
        currentViewingZoneId = 'world';
        renderMapAccordion(true); // Animate this change
    }
     function handleZoneNodeClick(realmIndex, zoneId) {
        currentViewingRealmIndex = realmIndex;
        currentViewingZoneId = zoneId;

        const activeContentPanel = elements.mapAccordionContainerEl.querySelector('.accordion-header.active + .accordion-content');
        if (activeContentPanel) {
            const fightingSubZone = findSubZoneByLevel(gameState.currentFightingLevel);
            const fightingRealmIndex = fightingSubZone ? REALMS.findIndex(r => Object.values(r.zones).some(z => z === fightingSubZone.parentZone)) : -1;
            const fightingZoneId = fightingSubZone && fightingRealmIndex !== -1 ? Object.keys(REALMS[fightingRealmIndex].zones).find(id => REALMS[fightingRealmIndex].zones[id] === fightingSubZone.parentZone) : null;
            const callbacks = { onZoneNodeClick: handleZoneNodeClick, onSubZoneNodeClick: handleSubZoneNodeClick, onBackToWorldClick: handleBackToWorldClick };
            
            ui.updateMapContentSurgically(/** @type {HTMLElement} */ (activeContentPanel), REALMS[realmIndex], zoneId, gameState, fightingZoneId, callbacks);
        }
    }
    
    function handleSubZoneNodeClick(subZone) {
        showSubZoneModal(subZone);
    }

    function handleBackToWorldClick(realmIndex) {
        currentViewingRealmIndex = realmIndex;
        currentViewingZoneId = 'world';
        
        const activeContentPanel = elements.mapAccordionContainerEl.querySelector('.accordion-header.active + .accordion-content');
        if (activeContentPanel) {
            const fightingSubZone = findSubZoneByLevel(gameState.currentFightingLevel);
            const fightingRealmIndex = fightingSubZone ? REALMS.findIndex(r => Object.values(r.zones).some(z => z === fightingSubZone.parentZone)) : -1;
            const fightingZoneId = fightingSubZone && fightingRealmIndex !== -1 ? Object.keys(REALMS[fightingRealmIndex].zones).find(id => REALMS[fightingRealmIndex].zones[id] === fightingSubZone.parentZone) : null;
            const callbacks = { onZoneNodeClick: handleZoneNodeClick, onSubZoneNodeClick: handleSubZoneNodeClick, onBackToWorldClick: handleBackToWorldClick };
            
            ui.updateMapContentSurgically(/** @type {HTMLElement} */ (activeContentPanel), REALMS[realmIndex], 'world', gameState, fightingZoneId, callbacks);
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
    }    
    
    function showSubZoneModal(subZone) {
    elements.modalTitleEl.textContent = subZone.name;
    elements.modalBodyEl.innerHTML = '';
    elements.modalCloseBtnEl.classList.remove('hidden');

    const startLevel = subZone.levelRange[0];
    const finalLevel = subZone.levelRange[1];
    const isSingleLevelZone = startLevel === finalLevel;

    // --- START OF NEW LOGIC ---
    // First, determine the player's absolute highest progress point for this run.
    const highestCompletedOverall = gameState.currentRunCompletedLevels.length > 0 ? Math.max(...gameState.currentRunCompletedLevels) : 0;
    const highestReachedOverall = highestCompletedOverall + 1;
    const peakSubZone = findSubZoneByLevel(highestReachedOverall);
    // --- END OF NEW LOGIC ---

    const startCombat = (level, isFarming, isContinuingAtPeak) => {
        gameState.currentFightingLevel = level;
        gameState.isFarming = isFarming;
        
        gameState.isAutoProgressing = isContinuingAtPeak;

        const newSubZone = findSubZoneByLevel(gameState.currentFightingLevel);
        if (newSubZone) {
            const newRealmIndex = REALMS.findIndex(r => Object.values(r.zones).some(z => z === newSubZone.parentZone));
            if (newRealmIndex !== -1) {
                const newZoneId = Object.keys(REALMS[newRealmIndex].zones).find(id => REALMS[newRealmIndex].zones[id] === newSubZone.parentZone);
                currentViewingRealmIndex = newRealmIndex;
                currentViewingZoneId = newZoneId || 'world';
                isMapRenderPending = true;
            }
        }

        logMessage(elements.gameLogEl, `Traveling to level ${level}.`, '', isAutoScrollingLog);
        elements.modalBackdropEl.classList.add('hidden');
        startNewMonster();

        ui.updateMonsterUI(elements, gameState, currentMonster);
        ui.updateLootPanel(elements, currentMonster, gameState);
        ui.updateAutoProgressToggle(elements, gameState.isAutoProgressing);
        if (isMapRenderPending) {
            renderMapAccordion();
            isMapRenderPending = false;
        }
        autoSave();
        updateRealmMusic();
    };

    if (isSingleLevelZone) {
        const bossLevel = startLevel;
        const fightBossButton = document.createElement('button');
        fightBossButton.textContent = gameState.completedLevels.includes(bossLevel) ? `Re-fight Boss (Lvl ${bossLevel})` : `Fight Boss (Lvl ${bossLevel})`;
        addTapListener(fightBossButton, () => startCombat(bossLevel, false, false));
        elements.modalBodyEl.appendChild(fightBossButton);

    } else {
        // This is progress *within this specific sub-zone only*.
        const highestCompletedInThisZone = ui.getHighestCompletedLevelInSubZone(gameState.currentRunCompletedLevels, subZone);
        
        const nextLevelToTry = Math.min(highestCompletedInThisZone + 1, finalLevel);
        const isNewZone = highestCompletedInThisZone < startLevel;
        const levelToStart = isNewZone ? startLevel : nextLevelToTry;

        const continueButton = document.createElement('button');
        continueButton.textContent = isNewZone ? `Start at Lvl ${startLevel}` : `Continue at Lvl ${levelToStart}`;
        
        // --- MODIFICATION: The crucial check is now here ---
        // isContinuingAtPeak is only true if this sub-zone is the player's current peak sub-zone.
        const isContinuingAtPeak = (peakSubZone === subZone);
        addTapListener(continueButton, () => startCombat(levelToStart, true, isContinuingAtPeak));
        elements.modalBodyEl.appendChild(continueButton);

        if (!isNewZone && highestCompletedInThisZone < finalLevel) {
            const restartButton = document.createElement('button');
            restartButton.textContent = `Restart at Lvl ${startLevel}`;
            addTapListener(restartButton, () => startCombat(startLevel, true, false));
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

    /**
     * Handles the core logic of placing a selected gem into an item's socket.
     * @param {object} itemToSocketInto The item receiving the gem.
     * @param {object} gemStackToSocket The gem stack being placed.
     */
    function performSocketing(itemToSocketInto, gemStackToSocket) {
        if (!itemToSocketInto || !gemStackToSocket || !itemToSocketInto.sockets || !itemToSocketInto.sockets.includes(null)) {
            logMessage(elements.gameLogEl, "Socketing action failed. Please try again.", "rare", isAutoScrollingLog);
            return; 
        }

        const firstEmptySocketIndex = itemToSocketInto.sockets.indexOf(null);
        if (firstEmptySocketIndex > -1) {
            const singleGemToSocket = { ...gemStackToSocket, quantity: 1 };
            
            itemToSocketInto.sockets[firstEmptySocketIndex] = singleGemToSocket;
            
            gemStackToSocket.quantity--;
            if (gemStackToSocket.quantity <= 0) {
                gameState.gems = gameState.gems.filter(g => g.id !== gemStackToSocket.id);
            }
            
            playSound('socket_gem');
            recalculateStats();
            logMessage(elements.gameLogEl, `Socketed <b>${singleGemToSocket.name}</b> into <b>${itemToSocketInto.name}</b>.`, 'epic', isAutoScrollingLog);
            
            refreshGemViewIfActive();

            const inventoryGridItem = elements.inventorySlotsEl.querySelector(`.item-wrapper[data-id="${itemToSocketInto.id}"]`);
            if (inventoryGridItem) {
                ui.updateItemInGrid(elements.inventorySlotsEl, itemToSocketInto, { forceRedraw: true });
            }
            
            ui.updateStatsPanel(elements, playerStats);
            ui.renderPaperdoll(elements, gameState);
            autoSave();
        }
    }

    function calculateOfflineProgress() {
        if (!gameState.lastSaveTimestamp) return;

        const offlineDurationSeconds = (Date.now() - gameState.lastSaveTimestamp) / 1000;
        if (offlineDurationSeconds < 10) return;

        recalculateStats();
        if (playerStats.totalDps <= 0) return;

        let totalGoldGained = 0;
        let totalXPGained = 0;
        let totalScrapGained = 0;

        if (!gameState.isAutoProgressing) {
            // --- "CAMPING" MODE ---
            // Player was farming a single level.
            const level = gameState.currentFightingLevel;
            const { newMonster, newMonsterState } = logic.generateMonster(level);
            
            // This is the core fix: timeToKill can't be less than 1 second.
            const timeToKill = Math.max(1, newMonsterState.maxHp / playerStats.totalDps);
            const totalKills = Math.floor(offlineDurationSeconds / timeToKill);

            if (totalKills > 0) {
                // Calculate rewards for a single kill and then multiply.
                const tier = Math.floor((level - 1) / 10);
                const effectiveLevel = level - (tier * 1);
                let baseGoldDrop = 10 + (3 * Math.pow(effectiveLevel, 2.1));
                let xpPerKill = 20 * Math.pow(level, 1.2);
                
                if (isBigBossLevel(level)) { xpPerKill *= 3; baseGoldDrop *= 3; } 
                else if (isBossLevel(level)) { xpPerKill *= 2; baseGoldDrop *= 2; } 
                else if (isMiniBossLevel(level)) { xpPerKill *= 1.5; baseGoldDrop *= 1.5; }
                
                const goldMasteryLevel = gameState.permanentUpgrades.GOLD_MASTERY || 0;
                const goldMasteryBonus = PERMANENT_UPGRADES.GOLD_MASTERY.bonusPerLevel * goldMasteryLevel;
                const goldAfterMastery = baseGoldDrop * (1 + (goldMasteryBonus / 100));

                const finalGoldPerKill = Math.ceil(goldAfterMastery * (1 + (playerStats.bonusGold / 100)));
                xpPerKill = Math.ceil(xpPerKill * (1 + (playerStats.bonusXp / 100)));

                const dropsPerKill = (newMonster.data.dropChance / 100);
                const scrapPerKill = dropsPerKill * (2 * playerStats.scrapBonus);

                totalGoldGained = Math.floor(finalGoldPerKill * totalKills);
                totalXPGained = Math.floor(xpPerKill * totalKills);
                totalScrapGained = Math.floor(scrapPerKill * totalKills);
            }
        } else {
            // --- "PROGRESSING" MODE ---
            // Player was auto-progressing. Simulate level by level.
            let remainingTime = offlineDurationSeconds;
            let currentSimLevel = gameState.currentFightingLevel;
            let lastLevelBeforeStop = gameState.currentFightingLevel;

            while (remainingTime > 1) {
                const { newMonster, newMonsterState } = logic.generateMonster(currentSimLevel);
                
                // This is the core fix: timeToKill can't be less than 1 second.
                const timeToKill = Math.max(1, newMonsterState.maxHp / playerStats.totalDps);

                if (remainingTime < timeToKill) break;
                
                remainingTime -= timeToKill;
                lastLevelBeforeStop = currentSimLevel;

                // Calculate rewards for this specific kill.
                const tier = Math.floor((currentSimLevel - 1) / 10);
                const effectiveLevel = currentSimLevel - (tier * 1);
                let baseGoldDrop = 10 + (3 * Math.pow(effectiveLevel, 2.1));
                let xpPerKill = 20 * Math.pow(currentSimLevel, 1.2);
                
                if (isBigBossLevel(currentSimLevel)) { xpPerKill *= 3; baseGoldDrop *= 3; } 
                else if (isBossLevel(currentSimLevel)) { xpPerKill *= 2; baseGoldDrop *= 2; }
                else if (isMiniBossLevel(currentSimLevel)) { xpPerKill *= 1.5; baseGoldDrop *= 1.5; }
                
                const goldMasteryLevel = gameState.permanentUpgrades.GOLD_MASTERY || 0;
                const goldMasteryBonus = PERMANENT_UPGRADES.GOLD_MASTERY.bonusPerLevel * goldMasteryLevel;
                const goldAfterMastery = baseGoldDrop * (1 + (goldMasteryBonus / 100));

                const finalGoldPerKill = Math.ceil(goldAfterMastery * (1 + (playerStats.bonusGold / 100)));
                xpPerKill = Math.ceil(xpPerKill * (1 + (playerStats.bonusXp / 100)));

                const dropsPerKill = (newMonster.data.dropChance / 100);
                const scrapPerKill = dropsPerKill * (2 * playerStats.scrapBonus);

                totalGoldGained += Math.floor(finalGoldPerKill);
                totalXPGained += Math.floor(xpPerKill);
                totalScrapGained += Math.floor(scrapPerKill);

                currentSimLevel++;
            }
             // Update player's level to where they progressed to offline.
            gameState.currentFightingLevel = lastLevelBeforeStop;
        }

        // --- APPLY REWARDS AND SHOW MODAL (This part is the same as before) ---
        if (totalGoldGained === 0 && totalXPGained === 0 && totalScrapGained === 0) return;

        const startingLevel = gameState.hero.level;
        gameState.gold += totalGoldGained;
        gameState.scrap += totalScrapGained;
        player.gainXP(gameState, totalXPGained, playerStats.bonusXp);
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
    
    function showItemTooltip(item, element) {
        if (!item) return;

        elements.tooltipEl.className = 'hidden';
        const rarity = item.rarity || (item.tier >= 1 ? 'gem-quality' : 'common');
        elements.tooltipEl.classList.add(rarity);
    
        if (isShiftPressed && item.baseId && ITEMS[item.baseId]) {
            const itemBase = ITEMS[item.baseId];
            elements.tooltipEl.innerHTML = ui.createLootTableTooltipHTML(itemBase);
        } else if (item.tier >= 1) { // It's a gem stack
            elements.tooltipEl.innerHTML = ui.createGemTooltipHTML(item);
        } else if (item.type === 'consumable') {
            const consumableBase = CONSUMABLES[item.baseId];
            if (consumableBase) {
                elements.tooltipEl.innerHTML = `
                    <div class="item-header"><span class="legendary">${consumableBase.name}</span></div>
                    <ul><li>${consumableBase.description}</li></ul>
                `;
            }
        } else if (item.type === 'ring') {
            elements.tooltipEl.innerHTML = ui.createItemComparisonTooltipHTML(item, gameState.equipment.ring1, gameState.equipment.ring2);
        } else {
            const equippedItem = gameState.equipment[item.type];
            elements.tooltipEl.innerHTML = ui.createItemComparisonTooltipHTML(item, equippedItem);
        }
    
        const rect = element.getBoundingClientRect();
        elements.tooltipEl.style.left = `${rect.right + 10}px`;
        elements.tooltipEl.style.top = `${rect.top}px`;
        elements.tooltipEl.classList.remove('hidden');
    }
    
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
    
    // --- BESTIARY LOGIC ---
    function buildWikiDatabase() {
        wikiState.data = [];
        const allItemBases = { ...ITEMS, ...GEMS, ...CONSUMABLES };
    
        for (const itemKey in allItemBases) {
            const itemBase = allItemBases[itemKey];
            const itemEntry = {
                id: itemBase.id,
                base: itemBase,
                dropSources: []
            };
    
            for (const monsterKey in MONSTERS) {
                const monster = MONSTERS[monsterKey];
                if (monster.lootTable && monster.lootTable.length > 0) {
                    const totalWeight = monster.lootTable.reduce((sum, entry) => sum + entry.weight, 0);
                    for (const lootEntry of monster.lootTable) {
                        if (lootEntry.item.id === itemBase.id) {
                            for (let i = 0; i < REALMS.length; i++) {
                                const realm = REALMS[i];
                                for (const zoneKey in realm.zones) {
                                    const zone = realm.zones[zoneKey];
                                    for (const subZoneKey in zone.subZones) {
                                        const subZone = zone.subZones[subZoneKey];
                                        if (subZone.monsterPool.some(m => m.name === monster.name)) {
                                            itemEntry.dropSources.push({
                                                monster: monster,
                                                chance: (lootEntry.weight / totalWeight) * monster.dropChance,
                                                location: `${zone.name} - Lvl ${subZone.levelRange[0]}`,
                                                level: subZone.levelRange[0],
                                                realmIndex: i
                                            });
                                            break; 
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (const tier of HUNT_POOLS) {
                for (const hunt of tier.hunts) {
                    if (hunt.rewardIds.includes(itemBase.id)) {
                        itemEntry.dropSources.push({
                            monster: { name: "Hunter's Board" },
                            chance: 100,
                            location: `Tier ${tier.requiredLevel}+ Hunts`,
                            level: tier.requiredLevel,
                            realmIndex: 0,
                            isHunt: true,
                        });
                        break; 
                    }
                }
            }
            wikiState.data.push(itemEntry);
        }
    }

    function getUpgradeComparison(potentialItemBase, equippedItem) {
        if (!equippedItem) {
            return { isUpgrade: true, diffs: {} };
        }
    
        const equippedItemBase = ITEMS[equippedItem.baseId];
        if (!equippedItemBase || potentialItemBase.id === equippedItemBase.id) {
            return null;
        }
    
        const potentialStats = new Map(potentialItemBase.possibleStats.map(s => [s.key, s.max]));
        const equippedStats = new Map(equippedItemBase.possibleStats.map(s => [s.key, s.max]));
        
        const diffs = {};
        let hasImprovement = false;
        
        const allStatKeys = new Set([...potentialStats.keys(), ...equippedStats.keys()]);

        for (const statKey of allStatKeys) {
            const potentialMax = potentialStats.get(statKey) || 0;
            const equippedMax = equippedStats.get(statKey) || 0;
            const diff = potentialMax - equippedMax;
    
            if (Math.abs(diff) > 0.001) {
                diffs[statKey] = diff;
            }
            if (diff > 0.001) {
                hasImprovement = true;
            }
        }
        
        const potentialSockets = potentialItemBase.maxSockets || 0;
        const equippedSockets = equippedItemBase.maxSockets || 0;
        const socketDiff = potentialSockets - equippedSockets;
        if (socketDiff !== 0) {
            diffs['sockets'] = socketDiff;
        }
        if (socketDiff > 0) {
            hasImprovement = true;
        }
        
        if (hasImprovement) {
            return { isUpgrade: true, diffs };
        }
    
        return null;
    }


    function applyWikiFilters() {
        const highestLevelEverReached = gameState.completedLevels.length > 0 ? Math.max(...gameState.completedLevels) : 0;
        const highestUnlockedRealm = REALMS.slice().reverse().find(realm => highestLevelEverReached >= realm.requiredLevel);
        const maxRealmIndex = highestUnlockedRealm ? REALMS.indexOf(highestUnlockedRealm) : -1;
    
        let results = [];
    
        if (wikiShowUpgradesOnly) {
            const potentialUpgrades = [];
            
            const slotsToCheck = new Set();
            if (wikiState.filters.type) {
                if (wikiState.filters.type === 'ring') {
                    slotsToCheck.add('ring1');
                    slotsToCheck.add('ring2');
                } else {
                    slotsToCheck.add(wikiState.filters.type);
                }
            } else {
                Object.keys(gameState.equipment).forEach(slot => {
                    if (gameState.equipment[slot]) {
                        slotsToCheck.add(slot);
                    }
                });
            }

            wikiState.data.forEach(itemData => {
                const potentialItemBase = itemData.base;
                if (potentialItemBase.type === 'consumable' || GEMS[potentialItemBase.id]) return;

                const itemType = potentialItemBase.type;

                const checkItem = (equippedItem) => {
                    if (!equippedItem || itemType !== equippedItem.type.replace(/\d/g, '')) return null;
                    return getUpgradeComparison(potentialItemBase, equippedItem);
                };

                let comparison = null;
                if (itemType === 'ring') {
                    if (!slotsToCheck.has('ring1') && !slotsToCheck.has('ring2')) return;
                    const comp1 = slotsToCheck.has('ring1') ? checkItem(gameState.equipment.ring1) : null;
                    const comp2 = slotsToCheck.has('ring2') ? checkItem(gameState.equipment.ring2) : null;
                    
                    let bestComp = null;
                    if (comp1?.isUpgrade) bestComp = comp1;
                    if (comp2?.isUpgrade) {
                        const sumDiff1 = bestComp ? Object.values(bestComp.diffs).reduce((a, b) => a + b, 0) : -Infinity;
                        const sumDiff2 = Object.values(comp2.diffs).reduce((a, b) => a + b, 0);
                        if (sumDiff2 > sumDiff1) bestComp = comp2;
                    }
                    comparison = bestComp;
                } else {
                    if (!slotsToCheck.has(itemType)) return;
                    comparison = checkItem(gameState.equipment[itemType]);
                }

                if (comparison?.isUpgrade) {
                    const hasActiveStatFilters = wikiState.filters.stats.size > 0;
                    if (hasActiveStatFilters) {
                        let hasFilteredStatUpgrade = false;
                        for (const [statKey] of wikiState.filters.stats.entries()) {
                            if (comparison.diffs[statKey] > 0) {
                                hasFilteredStatUpgrade = true;
                                break;
                            }
                        }
                        if (hasFilteredStatUpgrade) {
                            potentialUpgrades.push({ itemData, comparison });
                        }
                    } else {
                        potentialUpgrades.push({ itemData, comparison });
                    }
                }
            });
            results = potentialUpgrades;
        } else {
            results = wikiState.data.map(itemData => ({ itemData, comparison: null }));
        }
    
        const finalFiltered = results.filter(data => {
            const { itemData } = data;
            const isAccessible = itemData.dropSources.length === 0 || itemData.dropSources.some(source => source.realmIndex <= maxRealmIndex);
            if (!isAccessible) return false;
    
            if (wikiShowFavorites && !gameState.wikiFavorites.includes(itemData.id)) {
                return false;
            }
            if (wikiState.filters.searchText && !itemData.base.name.toLowerCase().includes(wikiState.filters.searchText)) {
                return false;
            }
             if (wikiState.filters.type && itemData.base.type !== wikiState.filters.type) {
                return false;
            }
            if (wikiState.filters.sockets !== null && (itemData.base.maxSockets || 0) < wikiState.filters.sockets) {
                return false;
            }
            for (const [statKey] of wikiState.filters.stats.entries()) {
                const hasStat = itemData.base.possibleStats?.some(stat => stat.key === statKey);
                if (!hasStat) {
                    return false;
                }
            }
            return true;
        });
    
        ui.renderWikiResults(elements.wikiResultsContainer, finalFiltered, gameState.wikiFavorites, wikiShowFavorites, wikiShowUpgradesOnly);
    }
    
    function sortAndRenderGems() {
        const sortKey = gemSortPreference;
        const sortedGems = [...gameState.gems]; 

        sortedGems.sort((a, b) => {
            if (sortKey === 'tier_desc') {
                return (b.tier || 0) - (a.tier || 0);
            }
            if (sortKey === 'tier_asc') {
                return (a.tier || 0) - (b.tier || 0);
            }
            if (sortKey === 'synergy') {
                const valA = a.synergy?.value || 0;
                const valB = b.synergy?.value || 0;
                return valB - valA;
            }
            const valA = a.stats?.[sortKey] || 0;
            const valB = b.stats?.[sortKey] || 0;
            return valB - valA;
        });

        // Re-calculate grid positions after sorting
        const placedGems = [];
        sortedGems.forEach(gem => {
            const spot = findNextAvailableSpot(gem.width, gem.height, placedGems);
            if (spot) {
                gem.x = spot.x;
                gem.y = spot.y;
                placedGems.push(gem); 
            } else {
                gem.x = -1; 
                gem.y = -1;
            }
        });

        gameState.gems = sortedGems;
        
        ui.renderGrid(elements.gemSlotsEl, gameState.gems, {
            type: 'gem',
            calculatePositions: false, // Positions are now pre-calculated
            bulkCombineSelection,
            bulkCombineDeselectedIds,
            selectedGemId: selectedGemForSocketing ? selectedGemForSocketing.id : null,
            craftingGemIds: craftingGems.map(g => g.sourceStackId)
        });
    }

    // --- HUNTS LOGIC ---
    function generateNewHunt(indexToReplace) {
        player.generateNewHunt(gameState, indexToReplace, HUNT_POOLS);
    }
    
    function populateInitialHunts() {
        for (let i = 0; i < gameState.hunts.available.length; i++) {
            if (gameState.hunts.available[i] === null) {
                generateNewHunt(i);
            }
        }
    }

    function acceptHunt(index) {
        if(player.acceptHunt(gameState, index)) {
            generateNewHunt(index); 
            ui.renderHuntsView(elements, gameState);
            autoSave();
        }
    }

    function handleHuntCompletion() {
        const result = player.completeHunt(gameState);
        if (result.reward) {
            playSound('hunt_reward');
            let logText = `Hunt complete! You received a <span class="legendary">${result.reward.name}</span> and <span style="color: #f1c40f;">${result.tokens} Hunt Tokens</span>!`;
            logMessage(elements.gameLogEl, logText, '', isAutoScrollingLog);

            // --- START MODIFICATION ---
            if (result.justUnlockedTravel) {
                logMessage(elements.gameLogEl, `<b>Fast Travel Unlocked!</b> You can now use the 'Travel' button on active bounties.`, 'legendary', isAutoScrollingLog);
            }
            // --- END MODIFICATION ---
            
            const indexToReplace = gameState.hunts.available.findIndex(h => h === null);
            if (indexToReplace !== -1) {
                generateNewHunt(indexToReplace);
            }
            ui.renderHuntsView(elements, gameState);
            ui.updateHuntsButtonGlow(gameState);
            
            // --- START OF FIX: Always refresh the consumables grid after a hunt ---
            const consumablesView = document.getElementById('inventory-consumables-view');
            if (consumablesView) { // Check if the element exists
                ui.renderGrid(elements.consumablesSlotsEl, gameState.consumables, { type: 'consumable', showLockIcon: false });
            }
            // --- END OF FIX ---

            autoSave();
        }
    }

    function handleHuntTravel() {
        if (!gameState.hunts.active) return;
        
        const travelOptions = getTravelOptionsForHunt(gameState.hunts.active, gameState);
        
        const travelCallback = (level) => {
            // This is the action performed when a travel button is clicked
            gameState.isAutoProgressing = false; // Disable auto-progress when traveling
            elements.modalBackdropEl.classList.add('hidden'); // Close the travel modal
            const { huntsModalBackdrop } = ui.initHuntsDOMElements();
            huntsModalBackdrop.classList.add('hidden'); // Also close the hunts modal
            
            logMessage(elements.gameLogEl, `Traveling to level ${level} for your hunt.`, 'uncommon', isAutoScrollingLog);
            
            gameState.currentFightingLevel = level;
            startNewMonster();
            
            recalculateStats();
            ui.updateMonsterUI(elements, gameState, currentMonster);
            ui.updateAutoProgressToggle(elements, gameState.isAutoProgressing);
            ui.updateLootPanel(elements, currentMonster, gameState);
            updateRealmMusic();
            autoSave();
        };
        
        if (travelOptions && travelOptions.length > 0) {
            // If there's one or more options, always show the selection modal.
            ui.showHuntTravelModal(elements, travelOptions, gameState.maxLevel, travelCallback);
        } else {
            // If no options are found.
            logMessage(elements.gameLogEl, "Could not determine a specific travel location for this hunt.", "rare", isAutoScrollingLog);
        }
    }

    function rerollHunts() {
        if(player.rerollHunts(gameState)) {
            logMessage(elements.gameLogEl, 'Bounties rerolled!', 'uncommon', isAutoScrollingLog);
            ui.renderHuntsView(elements, gameState);
            autoSave();
        }
    }

    function checkDailyResets() {
        player.checkDailyResets(gameState);
    }
    function main() {
        elements = ui.initDOMElements();
        initSounds(); // Initialize the sound manager
        
        const savedData = localStorage.getItem('idleRPGSaveData');
        if (savedData) {
            let loadedState = JSON.parse(savedData);
    
            const baseState = getDefaultGameState();

            gameState = { 
                ...baseState, 
                ...loadedState,
                upgrades: { ...baseState.upgrades, ...(loadedState.upgrades || {}) },
                hero: {
                    ...baseState.hero,
                    ...(loadedState.hero || {}),
                    attributes: {
                        ...baseState.hero.attributes,
                        ...((loadedState.hero || {}).attributes || {})
                    }
                },
                permanentUpgrades: { 
                    ...baseState.permanentUpgrades,
                    ...(loadedState.permanentUpgrades || {})
                },
                // --- NEW PROPERTIES TO LOAD SAFELY ---
                permanentStatBonuses: {
                    ...baseState.permanentStatBonuses,
                    ...(loadedState.permanentStatBonuses || {})
                },
                purchasedOneTimeShopItems: loadedState.purchasedOneTimeShopItems || [],
                activeTargetedConsumable: loadedState.activeTargetedConsumable || null,
                // --- END NEW PROPERTIES ---
                salvageFilter: {
                    ...baseState.salvageFilter,
                    ...(loadedState.salvageFilter || {}),
                    keepStats: {
                        ...baseState.salvageFilter.keepStats,
                        ...((loadedState.salvageFilter || {}).keepStats || {})
                    }
                },
                unlockedFeatures: {
                    ...baseState.unlockedFeatures,
                    ...(loadedState.unlockedFeatures || {})
                },
                inventory: loadedState.inventory || [],
                consumables: loadedState.consumables || [],
                activeBuffs: loadedState.activeBuffs || [],
                gems: loadedState.gems || [],
                presets: loadedState.presets || baseState.presets,
                absorbedStats: loadedState.absorbedStats || {},
                absorbedSynergies: (typeof loadedState.absorbedSynergies === 'object' && !Array.isArray(loadedState.absorbedSynergies)) ? loadedState.absorbedSynergies : {},
                absorbedUniqueEffects: loadedState.absorbedUniqueEffects || {},
                wikiFavorites: loadedState.wikiFavorites || [],
                goldenSlimeStreak: loadedState.goldenSlimeStreak && typeof loadedState.goldenSlimeStreak === 'object' ? loadedState.goldenSlimeStreak : baseState.goldenSlimeStreak,
                tutorialCompleted: loadedState.tutorialCompleted || false,
                wisdomOfTheOverworldDropped: loadedState.wisdomOfTheOverworldDropped || false,
                wisdomOfTheOverworldUsed: loadedState.wisdomOfTheOverworldUsed || false,
                firstKillCompleted: loadedState.firstKillCompleted || false,
                pendingSubTabViewFlash: loadedState.pendingSubTabViewFlash || null,
                hunts: {
                    ...baseState.hunts,
                    ...(loadedState.hunts || {}),
                    completionCounts: (loadedState.hunts && loadedState.hunts.completionCounts) ? loadedState.hunts.completionCounts : {},
                    // --- NEW HUNT PROPERTIES TO LOAD ---
                    tokens: loadedState.hunts?.tokens || 0,
                    totalCompleted: loadedState.hunts?.totalCompleted || 0,
                }
            };
            
            if (loadedState.artisanChiselDropped) {
                gameState.wisdomOfTheOverworldDropped = true;
            }
            if (loadedState.artisanChiselUsed) {
                gameState.wisdomOfTheOverworldUsed = true;
            }

            if (!gameState.presetSystemMigrated) {
                gameState = migrateToPresetInventories(gameState);
            }
            
            gameState.equipment = gameState.presets[gameState.activePresetIndex].equipment;
            
            if (!gameState.tutorialCompleted) {
                if (gameState.inventory.length > 0) gameState.unlockedFeatures.inventory = true;
                if (Object.values(gameState.equipment).some(item => item !== null)) gameState.unlockedFeatures.equipment = true;
                if (gameState.gems.length > 0) gameState.unlockedFeatures.gems = true;
                if (gameState.scrap > 0) gameState.unlockedFeatures.forge = true;
                if (gameState.consumables.length > 0) gameState.unlockedFeatures.consumables = true;
                if (gameState.prestigeCount > 0) gameState.unlockedFeatures.hunts = true;
                if (gameState.maxLevel >= 100) {
                    gameState.unlockedFeatures.prestige = true;
                    gameState.unlockedFeatures.wiki = true;
                }
                gameState.tutorialCompleted = true;
                console.log("Veteran player detected. Unlocking all relevant features.");
            }

            calculateOfflineProgress();
        } else {
            gameState = getDefaultGameState();
            gameState.equipment = gameState.presets[gameState.activePresetIndex].equipment;
        }

        const allGems = gameState.gems;
        const gemsToPlace = allGems.filter(g => g.x === undefined || g.y === undefined || g.x === -1);
        if (gemsToPlace.length > 0) {
            console.log(`Migrating ${gemsToPlace.length} gems to the new positioning system.`);
            const alreadyPlacedGems = allGems.filter(g => g.x !== undefined && g.y !== undefined && g.x !== -1);

            gemsToPlace.forEach(gem => {
                const gemWidth = gem.width || 1;
                const gemHeight = gem.height || 1;

                const spot = findNextAvailableSpot(gemWidth, gemHeight, alreadyPlacedGems);
                if (spot) {
                    gem.x = spot.x;
                    gem.y = spot.y;
                    alreadyPlacedGems.push(gem); 
                } else {
                    console.error("Migration failed: no space for gem", gem);
                    gem.x = -1;
                    gem.y = -1;
                }
            });
        }
        migrateStackablePositions(gameState.gems);
        migrateStackablePositions(gameState.consumables);
        buildWikiDatabase();
        const allItemTypes = new Set(wikiState.data.map(d => d.base.type).filter(Boolean));
        const allStatKeys = new Set();
        wikiState.data.forEach(d => {
            d.base.possibleStats?.forEach(stat => allStatKeys.add(stat.key));
            if (d.base.synergy) allStatKeys.add('synergy');
        });
        ui.populateWikiFilters(elements, allItemTypes, allStatKeys);
        applyWikiFilters(); 
        
        const fightingSubZone = findSubZoneByLevel(gameState.currentFightingLevel);
        const fightingRealmIndex = fightingSubZone ? REALMS.findIndex(r => Object.values(r.zones).some(z => z === fightingSubZone.parentZone)) : -1;
        const fightingZoneId = fightingSubZone && fightingRealmIndex !== -1 ? Object.keys(REALMS[fightingRealmIndex].zones).find(id => REALMS[fightingRealmIndex].zones[id] === fightingSubZone.parentZone) : null;

        if (fightingRealmIndex !== -1) {
            currentViewingRealmIndex = fightingRealmIndex;
            currentViewingZoneId = fightingZoneId || 'world';
        } else {
            currentViewingRealmIndex = 0;
            currentViewingZoneId = 'world';
        }
        
        checkDailyResets();
        if (gameState.unlockedFeatures.hunts) {
            populateInitialHunts();
        }
        ui.updateHuntsButtonGlow(gameState);
        setupEventListeners();
        recalculateStats();
        startNewMonster();
        logMessage(elements.gameLogEl, savedData ? "Saved game loaded!" : "Welcome! Your progress will be saved automatically.", '', isAutoScrollingLog);
        
        fullUIRender();
        
        autoSave(); 
        setInterval(autoSave, 30000);
        setInterval(gameLoop, 1000);
        setInterval(checkDailyResets, 60000);
        updateRealmMusic();

        (/** @type {any} */ (window)).resetHunts = function() {
            if (gameState && gameState.hunts) {
                console.log("Resetting hunts...");
                gameState.hunts.available = [null, null, null];
                gameState.hunts.active = null;
                // Use the game's own save function to ensure consistency
                autoSave();
                console.log("Hunts reset and game saved. Reloading now...");
                // Reload the page to apply changes
                location.reload();
            } else {
                console.error("GameState not ready. Cannot reset hunts.");
            }
        }
    }
    
    // ... This is where the file resumes from the previous response ...
    
    function setupEventListeners() {
        const muteBtn = document.getElementById('mute-btn');
        if (muteBtn) {
            const updateMuteIcon = () => {
                const icon = muteBtn.querySelector('i');
                if (icon) {
                    icon.className = getMuteState() ? 'fas fa-volume-mute' : 'fas fa-volume-up';
                }
            };
            addTapListener(muteBtn, () => {
                toggleMute();
                updateMuteIcon();
            });
            updateMuteIcon(); // Set initial state
        }
        
        window.addEventListener('beforeunload', saveOnExit);
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (MODIFIER_KEYS.includes(key) && !heldKeys.has(key)) {
                heldKeys.add(key);
                ui.updateHeroPanel(elements, gameState, heldKeys);
            }

            if (e.key === 'Shift' && !isShiftPressed) {
                isShiftPressed = true;
                const elementUnderMouse = document.elementFromPoint(lastMousePosition.x, lastMousePosition.y);
                if (elementUnderMouse) {
                    elementUnderMouse.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (MODIFIER_KEYS.includes(key)) {
                heldKeys.delete(key);
                ui.updateHeroPanel(elements, gameState, heldKeys);
            }

            if (e.key === 'Shift') {
                isShiftPressed = false;
                const elementUnderMouse = document.elementFromPoint(lastMousePosition.x, lastMousePosition.y);
                 if (elementUnderMouse) {
                    elementUnderMouse.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                }
            }
        });

        window.addEventListener('blur', () => { 
            isShiftPressed = false; 
            if (heldKeys.size > 0) {
                heldKeys.clear();
                ui.updateHeroPanel(elements, gameState, heldKeys);
            }
        });
        
        window.addEventListener('mousemove', (e) => {
            lastMousePosition.x = e.clientX;
            lastMousePosition.y = e.clientY;
        });
        
        document.body.addEventListener('mouseover', (e) => {
            if (!(e.target instanceof HTMLElement)) return;
    
            const huntsBtn = e.target.closest('#hunts-btn');
            if (huntsBtn && (/** @type {HTMLButtonElement} */ (huntsBtn)).disabled) {
                elements.tooltipEl.className = 'hidden';
                elements.tooltipEl.innerHTML = `
                    <div class="item-header" style="color: #f1c40f;">Unlock Hunts</div>
                    <p style="margin: 5px 0 0 0; font-size: 0.9em;">Complete your first Prestige to unlock the Hunter's Board.</p>
                `;
                const rect = huntsBtn.getBoundingClientRect();
                elements.tooltipEl.style.left = `${rect.left}px`;
                elements.tooltipEl.style.top = `${rect.bottom + 5}px`;
                elements.tooltipEl.classList.remove('hidden');
                return;
            }
        });
    
        document.body.addEventListener('mouseout', (e) => {
            if (!(e.target instanceof HTMLElement)) return;
            const huntsBtn = e.target.closest('#hunts-btn');
            if (huntsBtn && (/** @type {HTMLButtonElement} */ (huntsBtn)).disabled) {
                elements.tooltipEl.classList.add('hidden');
            }
        });
        
        addTapListener(document.getElementById('attributes-area'), (e) => {
            if (!(e.target instanceof Element)) return;
            const button = e.target.closest('.attribute-buy-btn');
            if (button instanceof HTMLButtonElement && !button.disabled) {
                const attribute = button.dataset.attribute;
                if (!attribute) return;
                
                /** @type {number | 'max'} */
                let spendAmount = 1;
                if (heldKeys.has('r')) spendAmount = 'max';
                else if (heldKeys.has('e')) spendAmount = 1000;
                else if (heldKeys.has('w')) spendAmount = 100;
                else if (heldKeys.has('q')) spendAmount = 10;
                
                player.spendMultipleAttributePoints(gameState, attribute, spendAmount);
                recalculateStats();
                ui.updateHeroPanel(elements, gameState, heldKeys);
                ui.updateStatsPanel(elements, playerStats);
                autoSave();
            }
        });

        addTapListener(elements.absorbedStatsListEl, (e) => {
            if (!(e.target instanceof Element)) return;
            const toggleButton = e.target.closest('.slime-split-toggle-img');
            if (toggleButton) {
                gameState.isSlimeSplitEnabled = !gameState.isSlimeSplitEnabled;
                logMessage(elements.gameLogEl, `Slime Split effect is now <b>${gameState.isSlimeSplitEnabled ? 'ON' : 'OFF'}</b>.`, 'legendary', isAutoScrollingLog);
                ui.updatePrestigeUI(elements, gameState);
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
                ui.updateCurrency(elements, gameState);
                ui.updateUpgrades(elements, gameState);
                ui.updateStatsPanel(elements, playerStats);
                ui.renderPermanentUpgrades(elements, gameState);
                autoSave();
            }
        });
        
        addTapListener(elements.monsterImageEl, clickMonster);

        addTapListener(document.getElementById('salvage-mode-btn'), () => {
            salvageMode.active = !salvageMode.active;
            ui.toggleSalvageMode(elements, salvageMode.active);
            if (!salvageMode.active) {
                salvageMode.selections = [];
                ui.renderGrid(elements.inventorySlotsEl, gameState.inventory, { calculatePositions: true, salvageSelections: [], showLockIcon: true });
            }
        });

        addTapListener(document.getElementById('select-all-salvage-btn'), () => {
            const equippedIds = player.getAllEquippedItemIds(gameState);
            salvageMode.selections = player.getAllItems(gameState).filter(item => !item.locked && !equippedIds.has(item.id));
            ui.updateSalvageCount(elements, salvageMode.selections.length);
            ui.renderGrid(elements.inventorySlotsEl, gameState.inventory, { calculatePositions: true, salvageSelections: salvageMode.selections, showLockIcon: true });
        });

        addTapListener(document.getElementById('confirm-salvage-btn'), () => {
            const result = player.salvageSelectedItems(gameState, salvageMode, playerStats);
            if (result.count > 0) {
                playSound('salvage');
                logMessage(elements.gameLogEl, `Salvaged ${result.count} items for a total of ${formatNumber(result.scrapGained)} Scrap.`, 'uncommon', isAutoScrollingLog);
                 if (!gameState.unlockedFeatures.forge) {
                    gameState.unlockedFeatures.forge = true;
                    logMessage(elements.gameLogEl, '<b>The Forge is Unlocked!</b> You can now use Scrap to reroll item stats.', 'legendary', isAutoScrollingLog);
                    ui.updateTabVisibility(gameState);
                    ui.flashTab('forge-view');
                }
            } else {
                logMessage(elements.gameLogEl, "No items selected for salvage.", '', isAutoScrollingLog);
            }

            salvageMode.active = false;
            salvageMode.selections = [];
            
            ui.toggleSalvageMode(elements, false);
            ui.updateCurrency(elements, gameState);
            ui.renderGrid(elements.inventorySlotsEl, gameState.inventory, { calculatePositions: false });
            autoSave();
        });

        addTapListener(document.getElementById('salvage-by-rarity-controls'), (e) => {
            if (!(e.target instanceof HTMLElement) || !e.target.dataset.rarity) return;
            const rarity = e.target.dataset.rarity;
            const result = player.salvageByRarity(gameState, rarity, playerStats);
            if (result.count > 0) {
                playSound('salvage');
                logMessage(elements.gameLogEl, `Salvaged ${result.count} ${rarity} items for ${formatNumber(result.scrapGained)} Scrap.`, 'uncommon', isAutoScrollingLog);
                if (!gameState.unlockedFeatures.forge) {
                    gameState.unlockedFeatures.forge = true;
                    logMessage(elements.gameLogEl, '<b>The Forge is Unlocked!</b> You can now use Scrap to reroll item stats.', 'legendary', isAutoScrollingLog);
                    ui.updateTabVisibility(gameState);
                    ui.flashTab('forge-view');
                }
                ui.renderGrid(elements.inventorySlotsEl, gameState.inventory, { calculatePositions: false });
                ui.updateCurrency(elements, gameState);
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
            const itemOrStack = isGem ? gameState.gems.find(i => String(i.id) === id) : player.findItemFromAllSources(gameState, id);
        
            if (!itemOrStack) return;
        
            if (isGem) {
                const gemStack = itemOrStack;
        
                if (isShiftPressed) {
                    if (bulkCombineSelection.tier || bulkCombineSelection.selectionKey) {
                        bulkCombineSelection.tier = null;
                        bulkCombineSelection.selectionKey = null;
                        bulkCombineDeselectedIds.clear();
                        
                        (/** @type {HTMLSelectElement} */ (elements.bulkCombineTierSelect)).value = "";
                        elements.bulkCombineStatSelect.innerHTML = '<option value="">Select Stat</option>';
                        (/** @type {HTMLSelectElement} */ (elements.bulkCombineStatSelect)).disabled = true;

                        ui.updateBulkCombineHighlights(elements, gameState, bulkCombineSelection, bulkCombineDeselectedIds);
                    }

                    if (craftingGems.length < 2) {
                        const firstCraftingGem = craftingGems[0];
                        if (firstCraftingGem && firstCraftingGem.tier !== gemStack.tier) {
                            logMessage(elements.gameLogEl, "You can only combine gems of the same tier.", "rare", isAutoScrollingLog);
                            return;
                        }
        
                        const tempGem = { ...gemStack, quantity: 1, sourceStackId: gemStack.id };
                        delete tempGem.id;
                        craftingGems.push(tempGem);
        
                        gemStack.quantity--;
                        if (gemStack.quantity <= 0) {
                            gameState.gems = gameState.gems.filter(g => g.id !== gemStack.id);
                        }
        
                        ui.updateGemCraftingUI(elements, craftingGems, gameState);
                        refreshGemViewIfActive();
                    }
                    return;
                }
        
                const isBulkSelected = bulkCombineSelection.tier && bulkCombineSelection.selectionKey && gemStack.tier === bulkCombineSelection.tier;
                if (isBulkSelected) {
                    if (bulkCombineDeselectedIds.has(gemStack.id)) {
                        bulkCombineDeselectedIds.delete(gemStack.id);
                    } else {
                        bulkCombineDeselectedIds.add(gemStack.id);
                    }
                    ui.updateBulkCombineHighlights(elements, gameState, bulkCombineSelection, bulkCombineDeselectedIds);
                    return;
                }
        
                if (selectedGemForSocketing && selectedGemForSocketing.id === gemStack.id) {
                    selectedGemForSocketing = null;
                    logMessage(elements.gameLogEl, "Deselected gem.", '', isAutoScrollingLog);
                } else {
                    selectedGemForSocketing = gemStack;
                    logMessage(elements.gameLogEl, `Selected <b>${gemStack.name}</b>. Click an item with an empty socket to place it.`, 'uncommon', isAutoScrollingLog);
                }
                ui.updateSocketingHighlights(elements, selectedGemForSocketing, gameState);
            } else {
                const item = itemOrStack;
                // --- START MODIFICATION for Targeted Consumables ---
                if (item.type === 'consumable') {
                    if (gameState.activeTargetedConsumable) {
                        logMessage(elements.gameLogEl, "You cannot use another item while targeting.", "rare", isAutoScrollingLog);
                        return;
                    }
                    ui.showConfirmationModal(
                        elements,
                        `Use ${item.name}?`,
                        `<p>${item.description}</p><p>This action is irreversible.</p>`,
                        () => {
                            const result = player.consumeItem(gameState, item.id);
                            logMessage(elements.gameLogEl, result.message, 'legendary', isAutoScrollingLog);
                            if (result.success) {
                                // If the item puts us in targeting mode, update highlights
                                if (gameState.activeTargetedConsumable) {
                                    ui.updateTargetingHighlights(elements, gameState);
                                }
                                fullUIRender();
                                recalculateStats();
                                autoSave();
                            }
                        }
                    );
                    return;
                }

                if (gameState.activeTargetedConsumable) {
                    const result = player.applyTargetedConsumable(gameState, item);
                    logMessage(elements.gameLogEl, result.message, result.success ? 'epic' : 'rare', isAutoScrollingLog);
                    if(result.success) {
                        recalculateStats();
                        fullUIRender(); // Full render to update all views
                        autoSave();
                    }
                    ui.updateTargetingHighlights(elements, gameState); // Clear highlights after use
                    return; // Exit after attempting to apply
                }
                // --- END MODIFICATION ---
        
                if (selectedGemForSocketing) {
                    if (item.sockets && item.sockets.includes(null)) {
                        const gemToSocket = selectedGemForSocketing;
                        
                        ui.showConfirmationModal(
                            elements,
                            'Confirm Socket',
                            `<p>Are you sure you want to insert:</p>
                             <p><span class="gem-quality">${gemToSocket.name}</span></p>
                             <p>into</p>
                             <p><span class="${item.rarity}">${item.name}</span>?</p>`,
                            () => {
                                performSocketing(item, gemToSocket);
                            }
                        );
                        
                    } else {
                        logMessage(elements.gameLogEl, `The item <b>${item.name}</b> has no available sockets.`, 'rare', isAutoScrollingLog);
                    }
                    
                    selectedGemForSocketing = null; 
                    ui.updateSocketingHighlights(elements, null, gameState);
                    return;
                }
        
                if (event.target.closest('.lock-icon')) {
                    const message = player.toggleItemLock(gameState, item);
                    if (message) logMessage(elements.gameLogEl, message, '', isAutoScrollingLog);
                    ui.updateItemInGrid(elements.inventorySlotsEl, item);
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
                    ui.updateSalvageCount(elements, salvageMode.selections.length);
                    ui.updateItemInGrid(elements.inventorySlotsEl, item, { salvageSelections: salvageMode.selections });
                } else {
                    const result = player.equipItem(gameState, item);
                    if (result.success) {
                        if (result.isPendingRing) {
                            pendingRingEquip = result.item;
                            showRingSelectionModal(pendingRingEquip);
                        } else {
                            if (!gameState.unlockedFeatures.equipment) {
                                gameState.unlockedFeatures.equipment = true;
                                logMessage(elements.gameLogEl, '<b>Equipment Unlocked!</b> You can now see your equipped gear.', 'legendary', isAutoScrollingLog);
                                ui.updateTabVisibility(gameState);
                                ui.flashTab('equipment-view');
                            }
                            logMessage(elements.gameLogEl, result.message, '', isAutoScrollingLog);
                            recalculateStats();
                            ui.renderGrid(elements.inventorySlotsEl, gameState.inventory, { calculatePositions: false });
                            ui.renderPaperdoll(elements, gameState);
                            ui.updateStatsPanel(elements, playerStats);
                        }
                    } else {
                        logMessage(elements.gameLogEl, result.message, 'rare', isAutoScrollingLog);
                    }
                }
                autoSave();
            }
        };

        addTapListener(elements.inventorySlotsEl, gridClickHandler);
        addTapListener(elements.gemSlotsEl, gridClickHandler);
        addTapListener(elements.consumablesSlotsEl, gridClickHandler);
                addTapListener(document.getElementById('equipment-paperdoll'), (event) => {
            if (!(event.target instanceof Element)) return;
            const slotElement = event.target.closest('.equipment-slot');
            if (!(slotElement instanceof HTMLElement)) return;
            const slotName = slotElement.id.replace('slot-', '');
            
            const item = gameState.equipment[slotName];
            if (!item) return;

            // --- START MODIFICATION for Targeted Consumables ---
            if (gameState.activeTargetedConsumable) {
                const result = player.applyTargetedConsumable(gameState, item);
                logMessage(elements.gameLogEl, result.message, result.success ? 'epic' : 'rare', isAutoScrollingLog);
                if(result.success) {
                    recalculateStats();
                    fullUIRender();
                    autoSave();
                }
                ui.updateTargetingHighlights(elements, gameState); // Clear highlights
                return;
            }
            // --- END MODIFICATION ---

            if (selectedGemForSocketing) {
                if (item && item.sockets && item.sockets.includes(null)) {
                    const gemToSocket = selectedGemForSocketing;
                    
                    ui.showConfirmationModal(
                        elements,
                        'Confirm Socket',
                        `<p>Are you sure you want to insert:</p>
                         <p><span class="gem-quality">${gemToSocket.name}</span></p>
                         <p>into</p>
                         <p><span class="${item.rarity}">${item.name}</span>?</p>`,
                        () => {
                            performSocketing(item, gemToSocket);
                        }
                    );

                } else if (item) {
                    logMessage(elements.gameLogEl, `The item <b>${item.name}</b> has no available sockets.`, 'rare', isAutoScrollingLog);
                }
                
                selectedGemForSocketing = null;
                ui.updateSocketingHighlights(elements, null, gameState);
                return;
            }

            player.unequipItem(gameState, slotName);
            recalculateStats();
            ui.renderPaperdoll(elements, gameState);
            // This is the key change: force a full, re-compacting grid render
            // instead of just adding one item.
            ui.renderGrid(elements.inventorySlotsEl, gameState.inventory, { calculatePositions: true });
            ui.updateStatsPanel(elements, playerStats);
            autoSave();
        });

        addTapListener(elements.gemCraftingSlotsContainer, (e) => {
            if (!(e.target instanceof Element)) return;
            const slot = e.target.closest('.gem-crafting-slot');
            if (!(slot instanceof HTMLElement)) return;
        
            const slotIndexStr = slot.dataset.slot;
            if (slotIndexStr === null || slotIndexStr === undefined) return;
            const slotIndex = parseInt(slotIndexStr, 10);

            const gemInSlot = craftingGems[slotIndex];
        
            if (gemInSlot) {
                craftingGems.splice(slotIndex, 1);
                player.addToPlayerStacks(gameState, gemInSlot, 'gems');
                refreshGemViewIfActive();
            } 
            
            ui.updateGemCraftingUI(elements, craftingGems, gameState);
        });

        addTapListener(elements.gemCraftBtn, () => {
            if (craftingGems.length !== 2) return;
            
            const result = player.combineGems(gameState, craftingGems[0], craftingGems[1]);
            logMessage(elements.gameLogEl, result.message, result.success && result.newGem ? 'legendary' : 'rare', isAutoScrollingLog);
            
            craftingGems = [];
            ui.updateGemCraftingUI(elements, craftingGems, gameState);
            refreshGemViewIfActive();

            if (result.success) {
                recalculateStats();
                ui.updateStatsPanel(elements, playerStats);
                autoSave();
            }
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
                refreshGemViewIfActive();
                ui.updateCurrency(elements, gameState);
                ui.updateStatsPanel(elements, playerStats);
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
            ui.updateBulkCombineHighlights(elements, gameState, bulkCombineSelection, bulkCombineDeselectedIds);
        });

        elements.bulkCombineStatSelect.addEventListener('change', () => {
            bulkCombineSelection.selectionKey = (/** @type {HTMLSelectElement} */ (elements.bulkCombineStatSelect)).value || null;
            lastBulkCombineStatKey = bulkCombineSelection.selectionKey;
            bulkCombineDeselectedIds.clear(); 
            ui.updateBulkCombineHighlights(elements, gameState, bulkCombineSelection, bulkCombineDeselectedIds);
        });

        addTapListener(elements.ringSelectionSlot1, () => {
            if (pendingRingEquip) {
                player.equipRing(gameState, pendingRingEquip, 'ring1');
                if (!gameState.unlockedFeatures.equipment) {
                    gameState.unlockedFeatures.equipment = true;
                    logMessage(elements.gameLogEl, '<b>Equipment Unlocked!</b> You can now see your equipped gear.', 'legendary', isAutoScrollingLog);
                    ui.updateTabVisibility(gameState);
                    ui.flashTab('equipment-view');
                }
                recalculateStats();
                ui.renderGrid(elements.inventorySlotsEl, gameState.inventory, { calculatePositions: false });
                ui.renderPaperdoll(elements, gameState);
                ui.updateStatsPanel(elements, playerStats);
                autoSave();
                hideRingSelectionModal();
            }
        });
        addTapListener(elements.ringSelectionSlot2, () => {
            if (pendingRingEquip) {
                player.equipRing(gameState, pendingRingEquip, 'ring2');
                 if (!gameState.unlockedFeatures.equipment) {
                    gameState.unlockedFeatures.equipment = true;
                    logMessage(elements.gameLogEl, '<b>Equipment Unlocked!</b> You can now see your equipped gear.', 'legendary', isAutoScrollingLog);
                    ui.updateTabVisibility(gameState);
                    ui.flashTab('equipment-view');
                }
                recalculateStats();
                ui.renderGrid(elements.inventorySlotsEl, gameState.inventory, { calculatePositions: false });
                ui.renderPaperdoll(elements, gameState);
                ui.updateStatsPanel(elements, playerStats);
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

        addTapListener(elements.autoProgressToggleEl, () => {
            gameState.isAutoProgressing = !gameState.isAutoProgressing;
            logMessage(elements.gameLogEl, `Auto-progress ${gameState.isAutoProgressing ? 'enabled' : 'disabled'}.`, '', isAutoScrollingLog);
            autoSave();
            ui.updateAutoProgressToggle(elements, gameState.isAutoProgressing);
        });
        
        document.querySelectorAll('.preset-btn').forEach((btn, index) => {
            addTapListener(btn, () => {
                player.activatePreset(gameState, index);
                logMessage(elements.gameLogEl, `Activated preset: <b>${gameState.presets[index].name}</b>`, '', isAutoScrollingLog);
                recalculateStats();
                ui.updateActivePresetButton(elements, gameState);
                ui.renderPaperdoll(elements, gameState);
                ui.updateStatsPanel(elements, playerStats);
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
                        ui.updateActivePresetButton(elements, gameState);
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
                    ui.updateActivePresetButton(elements, gameState);
                    autoSave();
                }
            });
        });

            const buffsContainer = document.getElementById('active-buffs-container');
            if (buffsContainer) {
                buffsContainer.addEventListener('mouseover', (e) => {
                    if (!(e.target instanceof Element)) return;
                    const buffEl = e.target.closest('.active-buff');
                    if (!(buffEl instanceof HTMLElement)) return;

                    const imgEl = buffEl.querySelector('img');
                    if (!imgEl) return;

                    const buffName = imgEl.alt;
                    const consumableBase = Object.values(CONSUMABLES).find(c => c.effect && c.effect.name === buffName);

                    if (consumableBase) {
                        elements.tooltipEl.className = 'hidden'; // Reset
                        elements.tooltipEl.classList.add('legendary'); // All buffs are from legendary consumables
                        elements.tooltipEl.innerHTML = `
                            <div class="item-header"><span class="legendary">${consumableBase.name}</span></div>
                            <ul><li>${consumableBase.description}</li></ul>
                        `;

                        const rect = buffEl.getBoundingClientRect();
                        elements.tooltipEl.style.left = `${rect.right + 10}px`;
                        elements.tooltipEl.style.top = `${rect.top}px`;
                        elements.tooltipEl.classList.remove('hidden');
                    }
                });

                buffsContainer.addEventListener('mouseout', (e) => {
                    if (!(e.target instanceof Element)) return;
                    const buffEl = e.target.closest('.active-buff');
                    if (buffEl) {
                        elements.tooltipEl.classList.add('hidden');
                    }
                });
            }
        
        document.querySelectorAll('.tabs').forEach(tabContainer => {
            const tabs = tabContainer.querySelectorAll('.tab-button');
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

                    const currentView = document.querySelector('.view.active')?.id;
                    if (currentView === 'inventory-view' && viewId !== 'inventory-view' && craftingGems.length > 0) {
                        craftingGems.forEach(gem => player.addToPlayerStacks(gameState, gem, 'gems'));
                        craftingGems = [];
                        logMessage(elements.gameLogEl, "Returned gems from crafting slots to inventory.", "uncommon", isAutoScrollingLog);
                    }
                    
                    ui.switchView(elements, viewId, gameState);

                    switch(viewId) {
                        case 'map-view':
                            renderMapAccordion();
                            break;
                        case 'hero-view':
                            ui.updateHeroPanel(elements, gameState, heldKeys);
                            ui.updateStatsPanel(elements, playerStats);
                            break;
                        case 'equipment-view':
                            ui.renderPaperdoll(elements, gameState);
                            ui.updateActivePresetButton(elements, gameState);
                            break;
                        case 'inventory-view':
                            if (gameState.pendingSubTabViewFlash) {
                                const subViewToFlash = gameState.pendingSubTabViewFlash;
                                ui.switchInventorySubView(subViewToFlash);
                                const subTabButton = document.querySelector(`.sub-tab-button[data-subview="${subViewToFlash}"]`);
                                if(subTabButton) {
                                    subTabButton.classList.add('newly-unlocked-flash');
                                    setTimeout(() => subTabButton.classList.remove('newly-unlocked-flash'), 5000);
                                }
                                gameState.pendingSubTabViewFlash = null;
                            } else {
                                ui.switchInventorySubView('inventory-gear-view');
                            }
                            
                            ui.populateSalvageFilter(elements, gameState);
                            ui.renderGrid(elements.inventorySlotsEl, gameState.inventory, { calculatePositions: false, salvageSelections: salvageMode.selections, showLockIcon: true });
                            ui.updateSocketingHighlights(elements, selectedGemForSocketing, gameState);
                            const salvageFilterBtn = document.getElementById('auto-salvage-filter-btn');
                            if (salvageFilterBtn) {
                                salvageFilterBtn.classList.toggle('btn-pressed', gameState.salvageFilter.enabled);
                            }
                            break;
                        case 'forge-view':
                            ui.renderForgeInventory(elements.forgeInventorySlotsEl, player.getAllItems(gameState), { selectedItem: selectedItemForForge, showLockIcon: false });
                            ui.updateForge(elements, selectedItemForForge, selectedStatToForgeKey, gameState.scrap);
                            break;
                        case 'wiki-view':
                            applyWikiFilters();
                            break;
                    }
                });
            });
        });

        document.querySelector('.sub-tabs')?.addEventListener('click', (e) => {
            if (!(e.target instanceof HTMLElement) || !e.target.matches('.sub-tab-button')) return;
        
            const subViewId = e.target.dataset.subview;
            if (!subViewId) return;

            const currentSubView = document.querySelector('.sub-view.active')?.id;
            if (currentSubView === 'inventory-gems-view' && subViewId !== 'inventory-gems-view' && craftingGems.length > 0) {
                craftingGems.forEach(gem => player.addToPlayerStacks(gameState, gem, 'gems'));
                craftingGems = [];
                logMessage(elements.gameLogEl, "Returned gems from crafting slots to inventory.", "uncommon", isAutoScrollingLog);
            }
        
            const featureMap = {
                'inventory-gems-view': { flag: gameState.unlockedFeatures.gems, title: 'Gems Locked', message: 'Find a Gem to unlock the Gemcutting bench.', icon: 'fa-gem' },
                'inventory-consumables-view': { flag: gameState.unlockedFeatures.consumables, title: 'Consumables Locked', message: 'Find a special consumable item to unlock this pouch.', icon: 'fa-flask' }
            };
        
            const config = featureMap[subViewId];
        
            if (config && !config.flag) {
                ui.showLockedInventorySubView(elements, config);
            } else {
                ui.switchInventorySubView(subViewId);
        
                switch(subViewId) {
                    case 'inventory-gear-view':
                        ui.renderGrid(elements.inventorySlotsEl, gameState.inventory, { calculatePositions: false, salvageSelections: salvageMode.selections, showLockIcon: true });
                        break;
                    case 'inventory-gems-view':
                        refreshGemViewIfActive();
                        populateBulkCombineControls();
                        ui.updateGemCraftingUI(elements, craftingGems, gameState);
                        break;
                    case 'inventory-consumables-view':
                        ui.renderGrid(elements.consumablesSlotsEl, gameState.consumables, { calculatePositions: true, showLockIcon: false });
                        break;
                }
            }
        });

        if (elements.gemSortSelect) {
            elements.gemSortSelect.addEventListener('change', (e) => {
                if (e.target instanceof HTMLSelectElement) {
                    gemSortPreference = e.target.value;
                    sortAndRenderGems();
                }
            });
        }


        addTapListener(document.getElementById('toggle-loot-log-btn'), (e) => {
            if (!(e.currentTarget instanceof HTMLButtonElement)) return;
            ui.toggleLootLog(e.currentTarget, document.getElementById('game-log-container'), document.getElementById('loot-view'));
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
                selectedStatToForgeKey = null; // Reset selected stat when new item is chosen
                ui.updateForge(elements, selectedItemForForge, selectedStatToForgeKey, gameState.scrap);
            }
        });

        addTapListener(elements.forgeStatListEl, (e) => {
            if (!(e.target instanceof Element)) return;
            const statEntry = e.target.closest('.forge-stat-entry');
            if (!(statEntry instanceof HTMLElement) || !statEntry.dataset.statKey) return;
            
            selectedStatToForgeKey = statEntry.dataset.statKey;
            ui.updateForge(elements, selectedItemForForge, selectedStatToForgeKey, gameState.scrap);
        });

        addTapListener(elements.forgeRerollBtn, () => {
            if (!selectedItemForForge || !selectedStatToForgeKey) {
                logMessage(elements.gameLogEl, "No item or stat selected to enhance.", 'rare', isAutoScrollingLog);
                return;
            }
        
            const result = player.rerollItemStats(gameState, selectedItemForForge, selectedStatToForgeKey);
        
            if (result.success) {
                if (result.improvement > 0) {
                    const statInfo = Object.values(STATS).find(s => s.key === selectedStatToForgeKey) || { key: 'unknown', name: 'Unknown', type: 'flat' };
                    const isPercent = statInfo.type === 'percent';
                    
                    const logImprovementText = isPercent ? `${result.improvement.toFixed(2)}%` : formatNumber(Math.max(1, result.improvement));
                    const logText = `Successfully enhanced <b>${selectedItemForForge.name}</b>! ${statInfo.name} increased by <b>+${logImprovementText}</b>.`;

                    let popupText;
                    if(isPercent) {
                        popupText = (result.improvement < 0.01) ? `< 0.01%` : `+${result.improvement.toFixed(2)}%`;
                    } else {
                        popupText = `+${formatNumber(Math.max(1, result.improvement))}`;
                    }

                    logMessage(elements.gameLogEl, logText, 'epic', isAutoScrollingLog);
                    ui.showForgeImprovement(elements, selectedStatToForgeKey, popupText);
                } else {
                    logMessage(elements.gameLogEl, "The enhancement failed. The stat remains unchanged.", 'uncommon', isAutoScrollingLog);
                }
        
                recalculateStats();
                ui.updateForge(elements, selectedItemForForge, selectedStatToForgeKey, gameState.scrap);
                ui.updateCurrency(elements, gameState);
                ui.updateStatsPanel(elements, playerStats);
                ui.updateItemInGrid(elements.inventorySlotsEl, selectedItemForForge);
                ui.renderPaperdoll(elements, gameState);
                autoSave();
            } else {
                logMessage(elements.gameLogEl, "Enhancement failed. Stat may be at its maximum value for this rarity.", 'rare', isAutoScrollingLog);
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
                logMessage(elements.gameLogEl, `Purchased Level ${result.newLevel} of <b>${PERMANENT_UPGRADES[upgradeId].name}</b>!`, 'epic', isAutoScrollingLog);
                recalculateStats();
                ui.renderPermanentUpgrades(elements, gameState);
                ui.updateCurrency(elements, gameState);
                ui.updateStatsPanel(elements, playerStats);
                ui.updateUpgrades(elements, gameState);
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
        setupPrestigeListeners();
        setupLegacyKeeperModalListeners();
        setupSalvageFilterListeners();
        setupViewSlotsListeners();
        setupWikiListeners();
        setupHuntsListeners();
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
            
            const salvageFilterBtn = document.getElementById('auto-salvage-filter-btn');
            if (salvageFilterBtn) {
                salvageFilterBtn.classList.toggle('btn-pressed', gameState.salvageFilter.enabled);
            }

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
            const wrapper = event.target.closest('.item-wrapper, .gem-wrapper');
            if (!(wrapper instanceof HTMLElement)) return;
            const id = wrapper.dataset.id;
            if (!id) return;

            const item = player.findItemFromAllSources(gameState, id) || gameState.consumables.find(c => String(c.id) === id) || gameState.gems.find(g => String(g.id) === id);
            if(item) {
                showItemTooltip(item, wrapper);
            }
        };

        elements.inventorySlotsEl.addEventListener('mouseover', onGridMouseOver);
        elements.inventorySlotsEl.addEventListener('mouseout', onGridMouseOut);
    
        if (elements.consumablesSlotsEl) {
            elements.consumablesSlotsEl.addEventListener('mouseover', onGridMouseOver);
            elements.consumablesSlotsEl.addEventListener('mouseout', onGridMouseOut);
        }

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

        elements.forgeSelectedItemEl.addEventListener('mouseover', (event) => {
            if (selectedItemForForge && event.currentTarget instanceof HTMLElement) {
                showItemTooltip(selectedItemForForge, event.currentTarget);
            }
        });
        elements.forgeSelectedItemEl.addEventListener('mouseout', onGridMouseOut);
    }
    
    function setupGemTooltipListeners(){
        const showGemTooltip = (e, gem, gemWrapper) => { // Add gemWrapper as an argument
            if (!gemWrapper || !gem) return;
            
            elements.tooltipEl.className = 'hidden';
            elements.tooltipEl.classList.add('gem-quality');
            elements.tooltipEl.innerHTML = ui.createGemTooltipHTML(gem);
    
            const rect = gemWrapper.getBoundingClientRect(); // Use the wrapper's coordinates
            elements.tooltipEl.style.left = `${rect.right + 5}px`;
            elements.tooltipEl.style.top = `${rect.top}px`;
            elements.tooltipEl.classList.remove('hidden');
        };
    
        const hideGemTooltip = () => elements.tooltipEl.classList.add('hidden');
    
        // Listener for the main gem grid
        elements.gemSlotsEl.addEventListener('mouseover', (e) => {
            if (!(e.target instanceof Element)) return;
            const gemWrapper = e.target.closest('div.gem-wrapper');
            if (!(gemWrapper instanceof HTMLElement)) return;
    
            const gemId = gemWrapper.dataset.id;
            if (!gemId) return;
    
            const gem = gameState.gems.find(g => String(g.id) === gemId);
            showGemTooltip(e, gem, gemWrapper); // Pass the wrapper to the function
        });
        elements.gemSlotsEl.addEventListener('mouseout', hideGemTooltip);
        
        // Listener for the crafting slots
        elements.gemCraftingSlotsContainer.addEventListener('mouseover', (e) => {
            if (!(e.target instanceof Element)) return;
            const craftingSlot = e.target.closest('.gem-crafting-slot');
            if (!(craftingSlot instanceof HTMLElement) || !craftingSlot.hasChildNodes()) return;
    
            const slotIndexStr = craftingSlot.dataset.slot;
            if (!slotIndexStr) return;
            
            const gem = craftingGems[parseInt(slotIndexStr, 10)];
            showGemTooltip(e, gem, craftingSlot); // Pass the crafting slot itself as the wrapper
        });
        elements.gemCraftingSlotsContainer.addEventListener('mouseout', hideGemTooltip);
    }
    
    function setupStatTooltipListeners() {
        const statTooltipContent = {
            strength: { title: 'Strength', description: 'Increases your raw power. Each point provides:', effects: ['<b>+5</b> Flat Click Damage', '<b>+0.2%</b> Total Click Damage'] },
            agility: { title: 'Agility', description: 'Improves your hero\'s combat prowess. Each point provides:', effects: ['<b>+10</b> Flat DPS', '<b>+0.8%</b> Total DPS'] },
            luck: { title: 'Luck', description: 'Increases your fortune in the dungeon. Each point provides:', effects: ['<b>+1%</b> Gold Gain', '<b>+0.1%</b> Magic Find'] }
        };
        const attributesArea = document.getElementById('attributes-area');
        
        attributesArea.addEventListener('mouseover', (event) => {
            if (!(event.target instanceof Element)) return;

            const statSpan = event.target.closest('.attribute-row > span');
            if (!statSpan) return;

            const row = statSpan.closest('.attribute-row');
            if (!(row instanceof HTMLElement)) return;

            const attributeKey = row.dataset.attribute;
            if (!attributeKey) return;
            
            const content = statTooltipContent[attributeKey];
            if (!content) return;
            
            let html = `<h4>${content.title}</h4><p>${content.description}</p><ul>`;
            content.effects.forEach(effect => { html += `<li>- ${effect}</li>`; });
            html += '</ul>';
            
            elements.statTooltipEl.innerHTML = html;
            const rect = statSpan.getBoundingClientRect();
            elements.statTooltipEl.style.left = `${rect.right + 10}px`;
            elements.statTooltipEl.style.top = `${rect.top}px`;
            elements.statTooltipEl.classList.remove('hidden');
        });
        attributesArea.addEventListener('mouseout', (event) => {
            if (!(event.target instanceof Element)) return;
            const statSpan = event.target.closest('.attribute-row > span');
            if (statSpan) {
                elements.statTooltipEl.classList.add('hidden');
            }
        });
        addTapListener(elements.resetAttributesBtn, () => {
            const { strength, agility, luck } = gameState.hero.attributes;
            const totalSpentPoints = strength + agility + luck;

            if (totalSpentPoints === 0) {
                logMessage(elements.gameLogEl, "You have no attribute points to reset.", 'uncommon', isAutoScrollingLog);
                return;
            }

            const cost = totalSpentPoints * 100;

            ui.showConfirmationModal(
                elements,
                'Reset Attributes?',
                `<p>This will refund <b>${totalSpentPoints}</b> attribute points.</p>
                 <p>Cost: <span style="color: #ffd700;">${formatNumber(cost)}</span> Scrap.</p>
                 <p>Are you sure?</p>`,
                () => {
                    const result = player.resetAttributes(gameState);
                    logMessage(elements.gameLogEl, result.message, result.success ? 'epic' : 'rare', isAutoScrollingLog);
                    if (result.success) {
                        recalculateStats();
                        ui.updateHeroPanel(elements, gameState, heldKeys);
                        ui.updateStatsPanel(elements, playerStats);
                        ui.updateCurrency(elements, gameState);
                        autoSave();
                    }
                }
            );
        });


        const derivedStatsArea = document.getElementById('derived-stats-area');
        derivedStatsArea.addEventListener('mouseover', (event) => {
            if (!(event.target instanceof Element)) return;
            const p = event.target.closest('p');
            if (!p) return;

            let statKey;
            if (p.querySelector('#click-damage-stat')) statKey = 'clickDamage';
            else if (p.querySelector('#dps-stat')) statKey = 'dps';
            else if (p.querySelector('#bonus-gold-stat')) statKey = 'goldGain';
            else if (p.querySelector('#magic-find-stat')) statKey = 'magicFind';
            else return;

            ui.showStatBreakdownTooltip(elements, statKey, statBreakdown, gameState);
            const rect = p.getBoundingClientRect();
            elements.statTooltipEl.style.left = `${rect.left}px`;
            elements.statTooltipEl.style.top = `${rect.bottom + 5}px`;
            elements.statTooltipEl.classList.remove('hidden');
        });
        derivedStatsArea.addEventListener('mouseout', () => {
            elements.statTooltipEl.classList.add('hidden');
        });
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

            if (itemBase.type === 'consumable') {
                elements.tooltipEl.classList.add('legendary');
                elements.tooltipEl.innerHTML = `
                    <div class="item-header"><span class="legendary">${itemBase.name}</span></div>
                    <ul><li>${itemBase.description}</li></ul>
                `;
            } else {
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

    function setupPrestigeListeners() {
        addTapListener(elements.prestigeButton, () => {
            document.querySelector('.actions-panel').classList.add('hidden');
            document.querySelector('.upgrades-panel').classList.add('hidden');
            ui.switchView(elements, 'prestige-view', gameState);
            fullUIRender();
        });
    
        addTapListener(elements.cancelPrestigeButton, () => {
            document.querySelector('.actions-panel').classList.remove('hidden');
            document.querySelector('.upgrades-panel').classList.remove('hidden');
            ui.switchView(elements, 'map-view', gameState);
            fullUIRender();
        });
    
        addTapListener(elements.prestigeEquipmentPaperdoll, (event) => {
            if (!(event.target instanceof Element)) return;
            const slotEl = event.target.closest('.equipment-slot');
            if (!(slotEl instanceof HTMLElement)) return;
            const slotName = slotEl.id.replace('prestige-slot-', '');
            player.unequipItem(gameState, slotName);
            recalculateStats();
            fullUIRender();
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
            fullUIRender();
            autoSave();
        });
    
        addTapListener(elements.confirmPrestigeButton, () => {
            selectedItemForForge = null;
            selectedGemForSocketing = null;

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
                            newAbsorbedSynergies[key] = (newAbsorbedSynergies[key] || 0) + newAbsorbedSynergies[key];
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
    
            const oldPresetNames = gameState.presets.map(p => p.name);
    
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
                wisdomOfTheOverworldDropped: gameState.wisdomOfTheOverworldDropped,
                wisdomOfTheOverworldUsed: gameState.wisdomOfTheOverworldUsed,
                unlockedFeatures: {
                    ...gameState.unlockedFeatures,
                    hunts: true,
                },
                tutorialCompleted: gameState.tutorialCompleted,
                permanentUpgrades: gameState.permanentUpgrades,
                permanentStatBonuses: gameState.permanentStatBonuses, // Keep Tome bonuses
                purchasedOneTimeShopItems: gameState.purchasedOneTimeShopItems, // Keep one-time purchases
                salvageFilter: gameState.salvageFilter,
                wikiFavorites: gameState.wikiFavorites, 
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
                hunts: {
                    ...baseState.hunts, // Resets daily rerolls, active, available
                    completionCounts: gameState.hunts.completionCounts || {}, // Keep permanent counts
                    totalCompleted: gameState.hunts.totalCompleted || 0, // Keep permanent total
                    tokens: 0, // <-- RESET TOKENS
                },
            };
            gameState.equipment = gameState.presets[gameState.activePresetIndex].equipment;
    
            if (oldPresetNames) {
                gameState.presets.forEach((preset, index) => {
                    if (oldPresetNames[index]) {
                        preset.name = oldPresetNames[index];
                    }
                });
            }

            populateInitialHunts();
    
            logMessage(elements.gameLogEl, `PRESTIGE! You are reborn with greater power. Your next goal is Level ${gameState.nextPrestigeLevel}.`, 'legendary', isAutoScrollingLog);
            
            document.querySelector('.actions-panel').classList.remove('hidden');
            document.querySelector('.upgrades-panel').classList.remove('hidden');
            ui.switchView(elements, 'map-view', gameState);
            recalculateStats();
            startNewMonster();
            fullUIRender();
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
            
            logMessage(elements.gameLogEl, `You have unlocked the <b>${slotName.charAt(0).toUpperCase() + slotName.slice(1)}</b> slot for Prestige!`, 'epic', isAutoScrollingLog);
            
            pendingLegacyKeeperUpgrade = false;
            closeThisModal();
            ui.hideUnlockSlotModal(elements);
            recalculateStats();
            ui.renderPermanentUpgrades(elements, gameState);
            ui.updateCurrency(elements, gameState);
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
    
    function handleWikiTravel(level) {
        gameState.isAutoProgressing = false;
        elements.modalBackdropEl.classList.add('hidden');
        
        logMessage(elements.gameLogEl, `Traveling to fight monsters at level ${level}.`, 'uncommon', isAutoScrollingLog);
        
        gameState.currentFightingLevel = level;
        startNewMonster();
        
        recalculateStats();
        ui.updateMonsterUI(elements, gameState, currentMonster);
        ui.updateAutoProgressToggle(elements, gameState.isAutoProgressing);
        ui.updateLootPanel(elements, currentMonster, gameState);
        autoSave();
    }

    function setupWikiListeners() {
        const {
            wikiSearchInput,
            wikiTypeFilter,
            wikiSocketsFilter,
            wikiStatsFilterContainer,
            wikiResetFiltersBtn,
            wikiResultsContainer,
            wikiShowFavoritesBtn,
            wikiShowUpgradesBtn,
            wikiDevToolBtn,
            devToolModalBackdrop,
            devToolCloseBtn
        } = elements;
    
        const updateAndApplyFilters = () => {
            wikiState.filters.searchText = (/** @type {HTMLInputElement} */ (wikiSearchInput)).value.toLowerCase();
            wikiState.filters.type = (/** @type {HTMLSelectElement} */ (wikiTypeFilter)).value;
            const socketsValue = parseInt((/** @type {HTMLInputElement} */ (wikiSocketsFilter)).value, 10);
            wikiState.filters.sockets = isNaN(socketsValue) || socketsValue < 0 ? null : socketsValue;
    
            wikiState.filters.stats.clear();
            wikiStatsFilterContainer.querySelectorAll('.wiki-stat-filter').forEach(filterDiv => {
                const checkbox = /** @type {HTMLInputElement | null} */ (filterDiv.querySelector('input[type="checkbox"]'));
                if (checkbox?.checked && checkbox.dataset.statKey) {
                    const valueInput = /** @type {HTMLInputElement | null} */ (filterDiv.querySelector('input[type="number"]'));
                    const minValue = valueInput ? parseFloat(valueInput.value) : 0;
                    wikiState.filters.stats.set(checkbox.dataset.statKey, isNaN(minValue) ? 0 : minValue);
                }
            });
            applyWikiFilters();
        };
    
        wikiSearchInput.addEventListener('input', updateAndApplyFilters);
        wikiTypeFilter.addEventListener('change', updateAndApplyFilters);
        wikiSocketsFilter.addEventListener('input', updateAndApplyFilters);
        wikiStatsFilterContainer.addEventListener('change', updateAndApplyFilters);
        
        addTapListener(wikiResetFiltersBtn, () => {
            (/** @type {HTMLInputElement} */ (wikiSearchInput)).value = '';
            (/** @type {HTMLSelectElement} */ (wikiTypeFilter)).value = '';
            (/** @type {HTMLInputElement} */ (wikiSocketsFilter)).value = '';
            wikiStatsFilterContainer.querySelectorAll('.wiki-stat-filter').forEach(filterDiv => {
                const checkbox = /** @type {HTMLInputElement | null} */ (filterDiv.querySelector('input[type="checkbox"]'));
                const valueInput = /** @type {HTMLInputElement | null} */ (filterDiv.querySelector('input[type="number"]'));
                if (checkbox) checkbox.checked = false;
                if (valueInput) {
                    valueInput.value = '';
                    valueInput.classList.add('hidden');
                }
            });
            updateAndApplyFilters();
        });
    
        addTapListener(wikiShowFavoritesBtn, () => {
            wikiShowFavorites = !wikiShowFavorites;
            if (wikiShowFavorites) {
                wikiShowUpgradesOnly = false;
                wikiShowUpgradesBtn.classList.remove('active');
            }
            wikiShowFavoritesBtn.classList.toggle('active', wikiShowFavorites);
            applyWikiFilters();
        });

        addTapListener(wikiShowUpgradesBtn, () => {
            wikiShowUpgradesOnly = !wikiShowUpgradesOnly;
            if (wikiShowUpgradesOnly) {
                wikiShowFavorites = false;
                wikiShowFavoritesBtn.classList.remove('active');
            }
            wikiShowUpgradesBtn.classList.toggle('active', wikiShowUpgradesOnly);
            applyWikiFilters();
        });
    
        addTapListener(wikiResultsContainer, (e) => {
            if (!(e.target instanceof HTMLElement)) return;

            const star = e.target.closest('.wiki-favorite-star');
            if (star instanceof HTMLElement && star.dataset.itemId) {
                e.stopPropagation();
                const itemId = star.dataset.itemId;
                const favIndex = gameState.wikiFavorites.indexOf(itemId);

                if (favIndex > -1) {
                    gameState.wikiFavorites.splice(favIndex, 1);
                    star.classList.remove('fas', 'favorited');
                    star.classList.add('far');
                } else {
                    gameState.wikiFavorites.push(itemId);
                    star.classList.remove('far');
                    star.classList.add('fas', 'favorited');
                }
                
                if (wikiShowFavorites) {
                    applyWikiFilters();
                }

                autoSave();
                return;
            }

            const card = e.target.closest('.wiki-item-header, .wiki-item-details');
            if (card) {
                const parentCard = card.closest('.wiki-item-card');
                if (parentCard instanceof HTMLElement && parentCard.dataset.itemId) {
                     const itemData = wikiState.data.find(item => item.id === parentCard.dataset.itemId);
                    if (itemData && itemData.dropSources.length > 0) {
                        ui.showWikiTravelModal(elements, itemData.dropSources, gameState.maxLevel, handleWikiTravel);
                    }
                }
            }
        });
    
        addTapListener(wikiDevToolBtn, () => {
            ui.showDevToolModal(elements, wikiState.data);
        });
    
        addTapListener(devToolCloseBtn, () => {
            devToolModalBackdrop.classList.add('hidden');
        });
    
        addTapListener(devToolModalBackdrop, (e) => {
            if (e.target === devToolModalBackdrop) {
                devToolModalBackdrop.classList.add('hidden');
            }
        });
    }

    function setupHuntsListeners() {
    const { huntsBtn, huntsModalBackdrop, huntsCloseBtn, rerollHuntsBtn, availableHuntsContainer, activeHuntSection, totalHuntsDisplay, huntTokensDisplay } = ui.initHuntsDOMElements();

    addTapListener(huntsBtn, () => {
        ui.renderHuntsView(elements, gameState);
        huntsModalBackdrop.classList.remove('hidden');
    });

    const close = () => huntsModalBackdrop.classList.add('hidden');
    addTapListener(huntsCloseBtn, close);
    addTapListener(huntsModalBackdrop, e => {
        if (e.target === huntsModalBackdrop) close();
    });

    addTapListener(rerollHuntsBtn, rerollHunts);

    addTapListener(availableHuntsContainer, e => {
        if (!(e.target instanceof HTMLElement)) return;
        const button = e.target.closest('button');
        if (button && button.dataset.index) {
            acceptHunt(parseInt(button.dataset.index, 10));
        }
    });

    addTapListener(activeHuntSection, e => {
        if (!(e.target instanceof HTMLElement)) return;
        const button = e.target.closest('button');
        if (!button) return;

        if (button.id === 'complete-hunt-btn') {
            handleHuntCompletion();
        } else if (button.id === 'travel-to-hunt-btn') {
            handleHuntTravel();
        }
    });

    activeHuntSection.addEventListener('mouseover', (e) => {
        if (!(e.target instanceof HTMLElement)) return;
        const lockedButton = e.target.closest('button.hunt-travel-locked');
        if (lockedButton) {
            elements.tooltipEl.className = 'hidden';
            elements.tooltipEl.innerHTML = `
                <div class="item-header" style="color: #f1c40f;">Unlock Fast Travel</div>
                <p style="margin: 5px 0 0 0; font-size: 0.9em;">Complete 5 total bounties to unlock fast travel.</p>
            `;
            const rect = lockedButton.getBoundingClientRect();
            elements.tooltipEl.style.left = `${rect.left}px`;
            elements.tooltipEl.style.top = `${rect.bottom + 5}px`;
            elements.tooltipEl.classList.remove('hidden');
        }
    });
    activeHuntSection.addEventListener('mouseout', (e) => {
        if (!(e.target instanceof HTMLElement)) return;
        const lockedButton = e.target.closest('button.hunt-travel-locked');
        if (lockedButton) {
            elements.tooltipEl.classList.add('hidden');
        }
    });

    huntsModalBackdrop.addEventListener('mouseover', (e) => {
        if (!(e.target instanceof HTMLElement)) return;
        
        // Handle currency tooltips
        const totalHuntsEl = e.target.closest('#total-hunts-display');
        if (totalHuntsEl instanceof HTMLElement) { // <-- THIS IS THE FIX
            showSimpleTooltip(elements, totalHuntsEl, "Total Hunts Completed");
            return; 
        }
        
        const huntTokensEl = e.target.closest('#hunt-tokens-display');
        if (huntTokensEl instanceof HTMLElement) { // <-- THIS IS THE FIX
            showSimpleTooltip(elements, huntTokensEl, "Hunt Tokens");
            return;
        }

        // Handle reward tooltips (existing logic)
        const rewardEl = e.target.closest('.hunt-reward');
        if (rewardEl instanceof HTMLElement && rewardEl.dataset.rewardId) {
            const rewardId = rewardEl.dataset.rewardId;
            const consumableBase = CONSUMABLES[rewardId];
            if (consumableBase) {
                elements.tooltipEl.className = 'hidden';
                elements.tooltipEl.classList.add('legendary');
                elements.tooltipEl.innerHTML = `
                    <div class="item-header"><span class="legendary">${consumableBase.name}</span></div>
                    <ul><li>${consumableBase.description}</li></ul>
                `;
                const rect = rewardEl.getBoundingClientRect();
                elements.tooltipEl.style.left = `${rect.right + 10}px`;
                elements.tooltipEl.style.top = `${rect.top}px`;
                elements.tooltipEl.classList.remove('hidden');
            }
        }
    });

    huntsModalBackdrop.addEventListener('mouseout', (e) => {
        if (!(e.target instanceof HTMLElement)) return;

        if (e.target.closest('#total-hunts-display, #hunt-tokens-display, .hunt-reward')) {
            elements.tooltipEl.classList.add('hidden');
        }
    });
    
    const huntsModal = document.getElementById('hunts-modal');
    if (huntsModal) {
        addTapListener(huntsModal, (e) => {
            if (!(e.target instanceof HTMLElement)) return;

            if (e.target.matches('.tab-button') && e.target.dataset.huntsView) {
                huntsModal.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
                huntsModal.querySelectorAll('.hunts-main-view').forEach(v => v.classList.remove('active'));
                e.target.classList.add('active');
                const viewId = e.target.dataset.huntsView;
                const viewToShow = document.getElementById(viewId);
                if (viewToShow) viewToShow.classList.add('active');
                ui.renderHuntsView(elements, gameState);
            }

            if (e.target.matches('.sub-tab-button') && e.target.dataset.shopCategory) {
                huntsModal.querySelectorAll('#shop-sub-tabs .sub-tab-button').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                ui.renderHuntsView(elements, gameState);
            }
        });
    }

    const shopContainer = document.getElementById('hunt-shop-container');
    if (shopContainer) {
        addTapListener(shopContainer, (e) => {
            if (!(e.target instanceof HTMLElement)) return;
            const buyButton = e.target.closest('.shop-item-buy-btn');
            if (buyButton instanceof HTMLButtonElement && !buyButton.disabled && buyButton.dataset.itemId) {
                purchaseHuntShopItem(buyButton.dataset.itemId);
            }
        });
    }
}

    function purchaseHuntShopItem(itemId) {
        const result = player.purchaseHuntShopItem(gameState, itemId);
        logMessage(elements.gameLogEl, result.message, result.success ? 'legendary' : 'rare', isAutoScrollingLog);

        if (result.success) {
            // Rerender the shop to update button states (e.g., for one-time purchases) and token count
            const huntsModal = document.getElementById('hunts-modal-backdrop');
            if (huntsModal && !huntsModal.classList.contains('hidden')) {
                ui.renderHuntsView(elements, gameState);
            }

            fullUIRender(); // This one call correctly handles all UI updates.

            recalculateStats();
            ui.updateStatsPanel(elements, playerStats);
            autoSave();
        }
    }

    function cancelActiveHunt() {
        const result = player.cancelActiveHunt(gameState);
        logMessage(elements.gameLogEl, result.message, result.success ? 'uncommon' : 'rare', isAutoScrollingLog);
        if (result.success) {
            const huntsModal = document.getElementById('hunts-modal-backdrop');
            if (huntsModal && !huntsModal.classList.contains('hidden')) {
                ui.renderHuntsView(elements, gameState);
            }
            autoSave();
        }
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

/**
 * A one-time migration function to fix stackable items (gems, consumables)
 * in older save files that are missing x/y coordinates.
 * @param {Array<object>} itemsArray The array to fix (e.g., gameState.gems).
 */
function migrateStackablePositions(itemsArray) {
    if (!itemsArray || itemsArray.length === 0) return;

    const positionedItems = itemsArray.filter(item => typeof item.x === 'number' && typeof item.y === 'number' && item.x !== -1);
    const itemsToPlace = itemsArray.filter(item => typeof item.x !== 'number' || typeof item.y !== 'number' || item.x === -1);

    if (itemsToPlace.length > 0) {
        console.log(`Migrating positions for ${itemsToPlace.length} stackable items.`);
        itemsToPlace.forEach(item => {
            const spot = findNextAvailableSpot(item.width || 1, item.height || 1, positionedItems);
            if (spot) {
                item.x = spot.x;
                item.y = spot.y;
                positionedItems.push(item);
            } else {
                console.error("Migration failed: No space found for item", item);
                item.x = -1;
                item.y = -1;
            }
        });
    }
}    

    main();
});