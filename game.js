// --- START OF FILE game.js ---

/* global io */
import { REALMS } from './data/realms.js';
import { MONSTERS } from './data/monsters.js';
import { ITEMS } from './data/items.js';
import { STATS } from './data/stat_pools.js';
import { logMessage, formatNumber, getUpgradeCost, findSubZoneByLevel, findFirstLevelOfZone, isBossLevel, isBigBossLevel } from './utils.js';
import * as ui from './ui.js';
import * as player from './player_actions.js';
import * as logic from './game_logic.js';

export const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

/** @typedef {Object<string, HTMLElement|HTMLButtonElement|HTMLInputElement|HTMLImageElement>} DOMElements */

document.addEventListener('DOMContentLoaded', () => {

    let gameState = {};
    let currentMap = 'world';
    let currentMonster = { name: "Slime", data: MONSTERS.SLIME };
    let playerStats = { baseClickDamage: 1, baseDps: 0, totalClickDamage: 1, totalDps: 0, bonusGold: 0, magicFind: 0 };
    let salvageMode = { active: false, selections: [] };
    let prestigeSelections = [];
    let saveTimeout;
    let isShiftPressed = false;
    let lastMousePosition = { x: 0, y: 0 };
    let pendingRingEquip = null;
    let selectedGemForSocketing = null;
    let craftingGems = [];

    /** @type {DOMElements} */
    let elements = {};

    const socket = io('https://idlegame-oqyq.onrender.com');
    let raidPanel = null;
    let raidPlayerId = `Player_${Math.random().toString(36).substr(2, 5)}`;
    
    const defaultEquipmentState = { sword: null, shield: null, helmet: null, necklace: null, platebody: null, platelegs: null, ring1: null, ring2: null, belt: null };

    function getDefaultGameState() {
        return {
            gold: 0, scrap: 0, upgrades: { clickDamage: 0, dps: 0 }, maxLevel: 1, currentFightingLevel: 1,
            monster: { hp: 10, maxHp: 10 },
            equipment: { ...defaultEquipmentState },
            inventory: [],
            gems: [],
            legacyItems: [],
            absorbedStats: { clickDamage: 0, dps: 0 },
            prestigeCount: 0,
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
            isFarming: true,
            isAutoProgressing: true,
            currentRealmIndex: 0,
            lastSaveTimestamp: null
        };
    }

    function addStatsFromItem(item) {
        for (const stat in item.stats) {
            const value = item.stats[stat];
            if (stat === STATS.CLICK_DAMAGE.key) playerStats.baseClickDamage += value;
            if (stat === STATS.DPS.key) playerStats.baseDps += value;
            if (stat === STATS.GOLD_GAIN.key) playerStats.bonusGold += value;
            if (stat === STATS.MAGIC_FIND.key) playerStats.magicFind += value;
        }
    }

    function recalculateStats() {
        const hero = gameState.hero;
        playerStats.baseClickDamage = 1 + (gameState.absorbedStats?.clickDamage || 0);
        playerStats.baseDps = 0 + (gameState.absorbedStats?.dps || 0);
        playerStats.bonusGold = 0;
        playerStats.magicFind = 0;

        const synergyGems = [];

        const allItems = [...(gameState.legacyItems || []), ...Object.values(gameState.equipment)];

        for (const item of allItems) {
            if (item) {
                addStatsFromItem(item);

                if (item.sockets && item.sockets.length > 0) {
                    for (const gem of item.sockets) {
                        if (gem) {
                            if (gem.synergy) {
                                synergyGems.push(gem);
                            }
                            if (gem.stats) {
                                for (const statKey in gem.stats) {
                                    const value = gem.stats[statKey];
                                    switch (statKey) {
                                        case STATS.CLICK_DAMAGE.key:
                                            playerStats.baseClickDamage += value;
                                            break;
                                        case STATS.DPS.key:
                                            playerStats.baseDps += value;
                                            break;
                                        case STATS.GOLD_GAIN.key:
                                            playerStats.bonusGold += value;
                                            break;
                                        case STATS.MAGIC_FIND.key:
                                            playerStats.magicFind += value;
                                            break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        const clickUpgradeBonus = gameState.upgrades.clickDamage * 1.25;
        const dpsUpgradeBonus = gameState.upgrades.dps * 2.5;

        const strengthBonusClickFlat = hero.attributes.strength * 0.5;
        const strengthBonusClickPercent = hero.attributes.strength * 0.2;
        const agilityBonusDpsPercent = hero.attributes.agility * 0.3;
        playerStats.bonusGold += hero.attributes.luck * 0.5;
        playerStats.magicFind += hero.attributes.luck * 0.2;

        let finalClickDamage = playerStats.baseClickDamage + clickUpgradeBonus + strengthBonusClickFlat;
        finalClickDamage *= (1 + (strengthBonusClickPercent / 100));

        let finalDps = playerStats.baseDps + dpsUpgradeBonus;
        finalDps *= (1 + (agilityBonusDpsPercent / 100));

        for (const gem of synergyGems) {
            if (gem.synergy && gem.synergy.source === 'dps' && gem.synergy.target === 'clickDamage') {
                finalClickDamage += finalDps * (gem.synergy.value / 100);
            }
        }

        playerStats.totalClickDamage = finalClickDamage;
        playerStats.totalDps = finalDps;

        if (socket.connected) {
            socket.emit('updatePlayerStats', { dps: playerStats.totalDps });
        }
    }


    function handleMonsterDefeated() {
        const result = logic.monsterDefeated(gameState, playerStats, currentMonster);
        result.logMessages.forEach(msg => logMessage(elements.gameLogEl, msg));
        ui.showGoldPopup(elements.popupContainerEl, result.goldGained);
        const levelUpLogs = player.gainXP(gameState, result.xpGained);
        levelUpLogs.forEach(msg => logMessage(elements.gameLogEl, msg, 'legendary'));
        const nextRealmIndex = gameState.currentRealmIndex + 1;
        if (REALMS[nextRealmIndex] && gameState.maxLevel >= REALMS[nextRealmIndex].requiredLevel && !gameState.completedLevels.includes(REALMS[nextRealmIndex].requiredLevel - 1)) {
            logMessage(elements.gameLogEl, `A new realm has been unlocked: <b>${REALMS[nextRealmIndex].name}</b>!`, 'legendary');
        }
        autoSave();
        setTimeout(() => {
            startNewMonster();
            updateAll();
        }, 300);
    }

    function startNewMonster() {
        const { newMonster, newMonsterState } = logic.generateMonster(gameState.currentFightingLevel);
        currentMonster = newMonster;
        gameState.monster = newMonsterState;
        (/** @type {HTMLImageElement} */ (elements.monsterImageEl)).src = currentMonster.data.image;
        elements.monsterNameEl.textContent = currentMonster.name;
    }

    function clickMonster() {
        if (gameState.monster.hp <= 0) return;
        gameState.monster.hp -= playerStats.totalClickDamage;
        elements.monsterImageEl.classList.add('monster-hit');
        setTimeout(() => elements.monsterImageEl.classList.remove('monster-hit'), 200);
        ui.showDamagePopup(elements.popupContainerEl, playerStats.totalClickDamage);
        if (gameState.monster.hp <= 0) {
            handleMonsterDefeated();
        }
        updateAll();
    }

    function gameLoop() {
        if (playerStats.totalDps > 0 && gameState.monster.hp > 0) {
            gameState.monster.hp -= playerStats.totalDps;
            ui.showDpsPopup(elements.popupContainerEl, playerStats.totalDps);
            if (gameState.monster.hp <= 0) {
                handleMonsterDefeated();
            }
            updateAll();
        }
    }

    function updateAll() {
        ui.updateUI(elements, gameState, playerStats, currentMonster, salvageMode, craftingGems);
        renderMap();
        renderRealmTabs();
        
        if (selectedGemForSocketing) {
            document.querySelectorAll('.selected-gem').forEach(el => el.classList.remove('selected-gem'));
            const gemEl = document.querySelector(`.gem[data-gem-id="${selectedGemForSocketing.id}"]`);
            if (gemEl) gemEl.classList.add('selected-gem');
            
            document.querySelectorAll('.socket-target').forEach(el => el.classList.remove('socket-target'));
            
            gameState.inventory.forEach((item, index) => {
                if (item.sockets && item.sockets.includes(null)) {
                    const itemEl = document.querySelector(`.item-wrapper[data-index="${index}"] .item`);
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
        } else {
            document.querySelectorAll('.selected-gem').forEach(el => el.classList.remove('selected-gem'));
            document.querySelectorAll('.socket-target').forEach(el => el.classList.remove('socket-target'));
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

    function resetGame() {
        if (confirm("Are you sure? This will delete your save permanently.")) {
            localStorage.removeItem('idleRPGSaveData');
            window.location.reload();
        }
    }

    function renderMap() {
        elements.mapContainerEl.innerHTML = '';
        const realm = REALMS[gameState.currentRealmIndex];
        if (!realm) {
            gameState.currentRealmIndex = 0;
            renderMap();
            return;
        }
        if (currentMap === 'world') {
            elements.mapTitleEl.textContent = realm.name;
            elements.backToWorldMapBtnEl.classList.add('hidden');
            elements.mapContainerEl.style.backgroundImage = `url('${realm.mapImage}')`;
            for (const zoneId in realm.zones) {
                const zone = realm.zones[zoneId];
                const isUnlocked = gameState.maxLevel >= findFirstLevelOfZone(zone);
                const node = ui.createMapNode(zone.name, zone.icon, zone.coords, isUnlocked, false, gameState.currentFightingLevel);
                if (isUnlocked) node.onclick = () => { currentMap = zoneId; renderMap(); };
                elements.mapContainerEl.appendChild(node);
            }
        } else {
            const zone = realm.zones[currentMap];
            if (!zone) { currentMap = 'world'; renderMap(); return; }
            elements.mapTitleEl.textContent = zone.name;
            elements.backToWorldMapBtnEl.classList.remove('hidden');
            elements.mapContainerEl.style.backgroundImage = `url('${zone.mapImage}')`;
            for (const subZoneId in zone.subZones) {
                const subZone = zone.subZones[subZoneId];
                const isUnlocked = gameState.maxLevel >= subZone.levelRange[0];
                const isCompleted = gameState.completedLevels.includes(subZone.levelRange[1]);
                const icon = 'images/icons/sword.png';
                const node = ui.createMapNode(subZone.name, icon, subZone.coords, isUnlocked, isCompleted, gameState.currentFightingLevel);
                if (isUnlocked) node.onclick = () => showSubZoneModal(subZone);
                elements.mapContainerEl.appendChild(node);
            }
        }
    }

    function renderRealmTabs() {
        elements.realmTabsContainerEl.innerHTML = '';
        REALMS.forEach((realm, index) => {
            const isUnlocked = gameState.maxLevel >= realm.requiredLevel;
            const tab = document.createElement('button');
            tab.className = 'realm-tab-btn';
            tab.textContent = realm.name;
            tab.disabled = !isUnlocked;
            if (index === gameState.currentRealmIndex) tab.classList.add('active');
            tab.onclick = () => {
                gameState.currentRealmIndex = index;
                currentMap = 'world';
                renderMap();
                renderRealmTabs();
                autoSave();
            };
            elements.realmTabsContainerEl.appendChild(tab);
        });
    }

    function showSubZoneModal(subZone) {
        elements.modalTitleEl.textContent = subZone.name;
        elements.modalBodyEl.innerHTML = '';
        const highestCompleted = ui.getHighestCompletedLevelInSubZone(gameState.completedLevels, subZone);
        const startLevel = subZone.levelRange[0];
        const finalLevel = subZone.levelRange[1];
        let nextLevel = Math.min(highestCompleted + 1, finalLevel);
        const isSingleLevelBoss = startLevel === finalLevel;
        const startCombat = (level, isFarming) => {
            gameState.currentFightingLevel = level;
            gameState.isFarming = isFarming;
            gameState.isAutoProgressing = isFarming ? (/** @type {HTMLInputElement} */ (elements.autoProgressCheckboxEl)).checked : false;
            logMessage(elements.gameLogEl, `Traveling to level ${level}.`);
            elements.modalBackdropEl.classList.add('hidden');
            startNewMonster();
            updateAll();
            autoSave();
            const combatTab = document.querySelector('.tab-button[data-view="combat-view"]');
            if (combatTab instanceof HTMLElement) combatTab.click();
        }
        if (!isSingleLevelBoss) {
            const continueButton = document.createElement('button');
            continueButton.textContent = (highestCompleted < startLevel) ? `Start at Lvl ${startLevel}` : `Continue at Lvl ${nextLevel}`;
            continueButton.onclick = () => startCombat(nextLevel, true);
            elements.modalBodyEl.appendChild(continueButton);
            if (highestCompleted >= startLevel && highestCompleted < finalLevel) {
                const restartButton = document.createElement('button');
                restartButton.textContent = `Restart at Lvl ${startLevel}`;
                restartButton.onclick = () => startCombat(startLevel, true);
                elements.modalBodyEl.appendChild(restartButton);
            }
        }
        const bossLevel = finalLevel;
        if (isBossLevel(bossLevel) || isBigBossLevel(bossLevel)) {
             if (gameState.completedLevels.includes(bossLevel) || isSingleLevelBoss) {
                 const fightBossButton = document.createElement('button');
                 fightBossButton.textContent = gameState.completedLevels.includes(bossLevel) ? `Re-fight Boss (Lvl ${bossLevel})` : `Fight Boss (Lvl ${bossLevel})`;
                 fightBossButton.onclick = () => startCombat(bossLevel, false);
                 elements.modalBodyEl.appendChild(fightBossButton);
             }
        }
        elements.modalBackdropEl.classList.remove('hidden');
    }

    function showRingSelectionModal(pendingRing) {
        const { ringSelectionModalBackdrop, ringSelectionSlot1, ringSelectionSlot2 } = elements;
        
        ringSelectionSlot1.innerHTML = ui.createItemHTML(gameState.equipment.ring1, false);
        ringSelectionSlot2.innerHTML = ui.createItemHTML(gameState.equipment.ring2, false);

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
        const difficultyResetFactor = 4;
        const effectiveLevel = level - (tier * difficultyResetFactor);
        const goldExponent = 1.17;
        const baseGold = 15;
        let goldPerKill = Math.ceil(baseGold * Math.pow(goldExponent, effectiveLevel) * (1 + (playerStats.bonusGold / 100)));
        let xpPerKill = level * 5;
        if (isBigBossLevel(level) || isBossLevel(level)) {
            xpPerKill *= 5;
            goldPerKill *= 5;
        }

        const goldPerSecond = goldPerKill * killsPerSecond;
        const xpPerSecond = xpPerKill * killsPerSecond;

        const AVERAGE_SCRAP_VALUE = 2;
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


    function setupEventListeners() {
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
        
        elements.monsterImageEl.addEventListener('click', clickMonster);
        document.getElementById('buy-loot-crate-btn').addEventListener('click', () => {
            const result = player.buyLootCrate(gameState, logic.generateItem);
            logMessage(elements.gameLogEl, result.message);
            if(result.success && result.item) {
                 logMessage(elements.gameLogEl, `The crate contained: <span class="${result.item.rarity}" style="font-weight:bold;">${result.item.name}</span>`);
            }
            updateAll();
            autoSave();
        });
        document.getElementById('salvage-mode-btn').addEventListener('click', () => {
            salvageMode.active = !salvageMode.active;
            const salvageBtn = document.getElementById('salvage-mode-btn');
            const confirmBtn = document.getElementById('confirm-salvage-btn');
            const selectAllBtn = document.getElementById('select-all-salvage-btn');
            const raritySalvageContainer = document.getElementById('salvage-by-rarity-controls');
            if (salvageMode.active) {
                salvageBtn.textContent = 'Cancel Salvage';
                salvageBtn.classList.add('active');
                confirmBtn.classList.remove('hidden');
                selectAllBtn.classList.remove('hidden');
                raritySalvageContainer.classList.remove('hidden');
            } else {
                salvageBtn.textContent = 'Select to Salvage';
                salvageBtn.classList.remove('active');
                confirmBtn.classList.add('hidden');
                selectAllBtn.classList.add('hidden');
                raritySalvageContainer.classList.add('hidden');
                salvageMode.selections = [];
            }
            document.body.classList.toggle('salvage-mode-active', salvageMode.active);
            document.getElementById('salvage-count').textContent = '0';
            updateAll();
        });
        document.getElementById('select-all-salvage-btn').addEventListener('click', () => {
             salvageMode.selections = [];
             gameState.inventory.forEach((item, index) => { if (!item.locked) salvageMode.selections.push(index); });
             document.getElementById('salvage-count').textContent = salvageMode.selections.length.toString();
             updateAll();
        });
        document.getElementById('confirm-salvage-btn').addEventListener('click', () => {
            const result = player.salvageSelectedItems(gameState, salvageMode);
            if (result.count > 0) {
                 logMessage(elements.gameLogEl, `Salvaged ${result.count} items for a total of ${formatNumber(result.scrapGained)} Scrap.`, 'uncommon');
            } else {
                 logMessage(elements.gameLogEl, "No items selected for salvage.");
            }
            salvageMode.active = false;
            document.getElementById('salvage-mode-btn').textContent = 'Select to Salvage';
            document.getElementById('salvage-mode-btn').classList.remove('active');
            document.getElementById('confirm-salvage-btn').classList.add('hidden');
            document.getElementById('select-all-salvage-btn').classList.add('hidden');
            document.getElementById('salvage-by-rarity-controls').classList.add('hidden');
            document.body.classList.remove('salvage-mode-active');
            salvageMode.selections = [];
            updateAll();
            autoSave();
        });
        document.getElementById('salvage-by-rarity-controls').addEventListener('click', (e) => {
            if (!(e.target instanceof HTMLElement) || !e.target.dataset.rarity) return;
            const rarity = e.target.dataset.rarity;
            const result = player.salvageByRarity(gameState, rarity);
            if (result.count > 0) {
                logMessage(elements.gameLogEl, `Salvaged ${result.count} ${rarity} items for ${formatNumber(result.scrapGained)} Scrap.`, 'uncommon');
                updateAll();
                autoSave();
            } else {
                logMessage(elements.gameLogEl, `No unlocked ${rarity} items to salvage.`);
            }
        });
        
        elements.gemSlotsEl.addEventListener('click', (e) => {
            if (!(e.target instanceof Element)) return;
            const gemWrapper = e.target.closest('div.gem');
            if (!(gemWrapper instanceof HTMLElement)) return;

            const gemId = gemWrapper.dataset.gemId;
            if (!gemId) return;

            const gemInstance = gameState.gems.find(g => String(g.id) === gemId);
            if (!gemInstance) return;

            if (isShiftPressed) {
                if (craftingGems.length < 2) {
                     if (craftingGems.length > 0 && craftingGems[0].tier !== gemInstance.tier) {
                        logMessage(elements.gameLogEl, "You can only combine gems of the same tier.", "rare");
                        return;
                    }
                    craftingGems.push(gemInstance);
                    const indexToRemove = gameState.gems.findIndex(g => g.id === gemInstance.id);
                    if (indexToRemove > -1) gameState.gems.splice(indexToRemove, 1);
                }
            } else {
                if (selectedGemForSocketing && selectedGemForSocketing.id === gemInstance.id) {
                    selectedGemForSocketing = null;
                    logMessage(elements.gameLogEl, "Deselected gem.");
                } else {
                    selectedGemForSocketing = gemInstance;
                    logMessage(elements.gameLogEl, `Selected ${gemInstance.name}. Click an item with an empty socket to place it.`, 'uncommon');
                }
            }
            updateAll();
        });
        
        elements.inventorySlotsEl.addEventListener('click', (event) => {
            if (!(event.target instanceof Element)) return;
            const wrapper = event.target.closest('.item-wrapper');
            if (!(wrapper instanceof HTMLElement)) return;
            
            const itemIndexStr = wrapper.dataset.index;
            if (itemIndexStr === null) return;
            const itemIndex = parseInt(itemIndexStr, 10);

            const item = gameState.inventory[itemIndex];
            if (!item) return;

            if (selectedGemForSocketing && item.sockets && item.sockets.includes(null)) {
                const gemToSocket = selectedGemForSocketing;
                const firstEmptySocketIndex = item.sockets.indexOf(null);
                
                if (firstEmptySocketIndex > -1) {
                    item.sockets[firstEmptySocketIndex] = gemToSocket;
                    
                    const originalGemIndex = gameState.gems.findIndex(g => g.id === gemToSocket.id);
                    if(originalGemIndex > -1) gameState.gems.splice(originalGemIndex, 1);
                    
                    logMessage(elements.gameLogEl, `Socketed ${gemToSocket.name} into ${item.name}.`, 'epic');
                    
                    selectedGemForSocketing = null;
                    
                    recalculateStats();
                    updateAll();
                    autoSave();
                    return;
                }
            }

            if (pendingRingEquip) {
                pendingRingEquip = null;
            }

            if (event.target.closest('.lock-icon')) {
                const message = player.toggleItemLock(gameState, itemIndex);
                if (message) logMessage(elements.gameLogEl, message);
                updateAll();
                autoSave();
            } else if (salvageMode.active) {
                if (item.locked) { logMessage(elements.gameLogEl, "This item is locked and cannot be salvaged.", 'rare'); return; }
                const selectionIndex = salvageMode.selections.indexOf(itemIndex);
                if (selectionIndex > -1) {
                    salvageMode.selections.splice(selectionIndex, 1);
                } else {
                    salvageMode.selections.push(itemIndex);
                }
                document.getElementById('salvage-count').textContent = salvageMode.selections.length.toString();
                updateAll();
            } else {
                const result = player.equipItem(gameState, itemIndex);
                if (result.isPendingRing) {
                    pendingRingEquip = result.item;
                    showRingSelectionModal(pendingRingEquip);
                } else {
                    recalculateStats();
                    updateAll();
                    autoSave();
                }
            }
        });
        
        document.getElementById('equipment-paperdoll').addEventListener('click', (event) => {
            if (!(event.target instanceof Element)) return;
            const slotElement = event.target.closest('.equipment-slot');
            if (!slotElement) return;
            const slotName = slotElement.id.replace('slot-', '');
            
            if (selectedGemForSocketing) {
                const item = gameState.equipment[slotName];
                if (item && item.sockets && item.sockets.includes(null)) {
                    const gemToSocket = selectedGemForSocketing;
                    const firstEmptySocketIndex = item.sockets.indexOf(null);

                    if (firstEmptySocketIndex > -1) {
                        item.sockets[firstEmptySocketIndex] = gemToSocket;
                        
                        const originalGemIndex = gameState.gems.findIndex(g => g.id === gemToSocket.id);
                        if(originalGemIndex > -1) gameState.gems.splice(originalGemIndex, 1);
                        
                        logMessage(elements.gameLogEl, `Socketed ${gemToSocket.name} into ${item.name}.`, 'epic');
                        
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

        elements.gemCraftingSlotsContainer.addEventListener('click', (e) => {
            if (!(e.target instanceof HTMLElement)) return;
            const slot = e.target.closest('.gem-crafting-slot');
            if (!(slot instanceof HTMLElement)) return;
        
            const slotIndexStr = slot.dataset.slot;
            if (!slotIndexStr) return;
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
                        logMessage(elements.gameLogEl, "You can only combine gems of the same tier.", "rare");
                        return;
                    }
        
                    craftingGems.push(selectedGemForSocketing);
                    
                    const indexToRemove = gameState.gems.findIndex(g => g.id === selectedGemForSocketing.id);
                    if (indexToRemove > -1) {
                        gameState.gems.splice(indexToRemove, 1);
                    }
                    
                    selectedGemForSocketing = null;
                }
            }
            updateAll();
        });

        elements.gemCraftBtn.addEventListener('click', () => {
            if (craftingGems.length !== 2) return;
            
            const result = player.combineGems(gameState, craftingGems);
            logMessage(elements.gameLogEl, result.message, result.success && result.newGem ? 'legendary' : 'rare');

            craftingGems = [];
            
            recalculateStats();
            updateAll();
            autoSave();
        });

        elements.ringSelectionSlot1.addEventListener('click', () => {
            if (pendingRingEquip) {
                player.equipRing(gameState, pendingRingEquip, 'ring1');
                recalculateStats();
                updateAll();
                autoSave();
                hideRingSelectionModal();
            }
        });
        elements.ringSelectionSlot2.addEventListener('click', () => {
            if (pendingRingEquip) {
                player.equipRing(gameState, pendingRingEquip, 'ring2');
                recalculateStats();
                updateAll();
                autoSave();
                hideRingSelectionModal();
            }
        });
        elements.ringSelectionCancelBtn.addEventListener('click', hideRingSelectionModal);
        elements.ringSelectionModalBackdrop.addEventListener('click', (e) => {
            if (e.target === elements.ringSelectionModalBackdrop) {
                hideRingSelectionModal();
            }
        });

        elements.offlineProgressCloseBtn.addEventListener('click', () => {
            elements.offlineProgressModalBackdrop.classList.add('hidden');
        });

        document.getElementById('reset-game-btn').addEventListener('click', resetGame);
        elements.backToWorldMapBtnEl.addEventListener('click', () => { currentMap = 'world'; renderMap(); });
        elements.modalCloseBtnEl.addEventListener('click', () => elements.modalBackdropEl.classList.add('hidden'));
        elements.modalBackdropEl.addEventListener('click', (e) => {
            if (e.target === elements.modalBackdropEl) elements.modalBackdropEl.classList.add('hidden');
        });
        elements.autoProgressCheckboxEl.addEventListener('change', () => {
            gameState.isAutoProgressing = (/** @type {HTMLInputElement} */ (elements.autoProgressCheckboxEl)).checked;
            logMessage(elements.gameLogEl, `Auto-progress ${gameState.isAutoProgressing ? 'enabled' : 'disabled'}.`);
            autoSave();
        });
        elements.addStrengthBtn.addEventListener('click', () => { player.spendAttributePoint(gameState, 'strength'); recalculateStats(); updateAll(); autoSave(); });
        elements.addAgilityBtn.addEventListener('click', () => { player.spendAttributePoint(gameState, 'agility'); recalculateStats(); updateAll(); autoSave(); });
        elements.addLuckBtn.addEventListener('click', () => { player.spendAttributePoint(gameState, 'luck'); recalculateStats(); updateAll(); autoSave(); });
        document.getElementById('upgrade-click-damage').addEventListener('click', (e) => {
            if (!(e.target instanceof Element)) return;
            if (e.target.classList.contains('buy-max-btn')) {
                const result = player.buyMaxUpgrade(gameState, 'clickDamage');
                if (result.levelsBought > 0) {
                    logMessage(elements.gameLogEl, `Bought ${result.levelsBought} Click Damage levels!`);
                    recalculateStats();
                    updateAll();
                    autoSave();
                } else {
                    logMessage(elements.gameLogEl, "Not enough gold for even one level!");
                }
            } else {
                const cost = getUpgradeCost('clickDamage', gameState.upgrades.clickDamage);
                const result = player.buyUpgrade(gameState, 'clickDamage', cost);
                logMessage(elements.gameLogEl, result.message);
                if (result.success) { recalculateStats(); updateAll(); autoSave(); }
            }
        });
        document.getElementById('upgrade-dps').addEventListener('click', (e) => {
            if (!(e.target instanceof Element)) return;
            if (e.target.classList.contains('buy-max-btn')) {
                const result = player.buyMaxUpgrade(gameState, 'dps');
                if (result.levelsBought > 0) {
                    logMessage(elements.gameLogEl, `Bought ${result.levelsBought} DPS levels!`);
                    recalculateStats();
                    updateAll();
                    autoSave();
                } else {
                    logMessage(elements.gameLogEl, "Not enough gold for even one level!");
                }
            } else {
                const cost = getUpgradeCost('dps', gameState.upgrades.dps);
                const result = player.buyUpgrade(gameState, 'dps', cost);
                logMessage(elements.gameLogEl, result.message);
                if (result.success) { recalculateStats(); updateAll(); autoSave(); }
            }
        });
        document.querySelectorAll('.preset-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                player.activatePreset(gameState, index);
                logMessage(elements.gameLogEl, `Activated preset: <b>${gameState.presets[index].name}</b>`);
                recalculateStats();
                updateAll();
                autoSave();
            });
            btn.addEventListener('dblclick', () => {
                 const currentName = gameState.presets[index].name;
                 const newName = prompt("Enter a new name for the preset:", currentName);
                 if (newName && newName.trim() !== "") {
                     gameState.presets[index].name = newName.trim();
                     logMessage(elements.gameLogEl, `Renamed preset to: <b>${newName.trim()}</b>`);
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

                tab.addEventListener('click', () => {
                    const itemRelatedViews = ['gems-view', 'inventory-view', 'equipment-view'];
                    if (selectedGemForSocketing !== null && !itemRelatedViews.includes(viewId)) {
                        selectedGemForSocketing = null;
                        logMessage(elements.gameLogEl, "Canceled gem socketing.");
                    }
                    if (craftingGems.length > 0 && viewId !== 'gems-view') {
                        gameState.gems.push(...craftingGems);
                        craftingGems = [];
                        logMessage(elements.gameLogEl, "Returned gems from crafting slots.");
                    }

                    updateAll(); 

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
        
        setupItemTooltipListeners();
        setupGemTooltipListeners();
        setupStatTooltipListeners();
        setupLootTooltipListeners();
        setupRaidListeners();
        setupPrestigeListeners();
    }
    
    function createBlueprintComparisonTooltipHTML(item, itemBase) {
        const headerHTML = `<div class="item-header"><span>${item.name}</span></div>
                            <div class="possible-stats-header">Stat Roll Comparison</div>`;
        let statsHTML = '<ul>';

        for (const statInfo of itemBase.possibleStats) {
            const statKey = statInfo.key;
            const statName = Object.values(STATS).find(s => s.key === statKey)?.name || statKey;
            const min = statInfo.min;
            const max = statInfo.max;

            if (item.stats.hasOwnProperty(statKey)) {
                const currentValue = item.stats[statKey];
                statsHTML += `<li>${statName}: ${formatNumber(currentValue)} (Range: ${formatNumber(min)} - ${formatNumber(max)})</li>`;
            } else {
                statsHTML += `<li>${statName}: <span class="tooltip-shift-hint">Not Rolled</span> (Range: ${formatNumber(min)} - ${formatNumber(max)})</li>`;
            }
        }
        statsHTML += '</ul>';
        return headerHTML + statsHTML;
    }

    function createTooltipHTML(hoveredItem, equippedItem, equippedItem2 = null) {
        const headerHTML = `<div class="item-header"><span>${hoveredItem.name}</span></div>`;
        
        if (hoveredItem.type === 'ring' && (equippedItem || equippedItem2)) {
            let ring1HTML = '<ul>';
            let ring2HTML = '<ul>';
            const allStatKeys = new Set([...Object.keys(hoveredItem.stats)]);
            if(equippedItem) Object.keys(equippedItem.stats).forEach(k => allStatKeys.add(k));
            if(equippedItem2) Object.keys(equippedItem2.stats).forEach(k => allStatKeys.add(k));

            allStatKeys.forEach(statKey => {
                const statInfo = Object.values(STATS).find(s => s.key === statKey);
                const statName = statInfo ? statInfo.name : statKey;
                const hoveredValue = hoveredItem.stats[statKey] || 0;
                
                if (equippedItem) {
                    const diff1 = hoveredValue - (equippedItem.stats[statKey] || 0);
                    const diffClass1 = diff1 > 0 ? 'stat-better' : 'stat-worse';
                    const sign1 = diff1 > 0 ? '+' : '';
                    const diffSpan1 = Math.abs(diff1) > 0.001 ? ` <span class="${diffClass1}">(${sign1}${formatNumber(diff1)})</span>` : '';
                    ring1HTML += `<li>${statName}: ${formatNumber(hoveredValue)}${diffSpan1}</li>`;
                }
                if(equippedItem2) {
                    const diff2 = hoveredValue - (equippedItem2.stats[statKey] || 0);
                    const diffClass2 = diff2 > 0 ? 'stat-better' : 'stat-worse';
                    const sign2 = diff2 > 0 ? '+' : '';
                    const diffSpan2 = Math.abs(diff2) > 0.001 ? ` <span class="${diffClass2}">(${sign2}${formatNumber(diff2)})</span>` : '';
                    ring2HTML += `<li>${statName}: ${formatNumber(hoveredValue)}${diffSpan2}</li>`;
                }
            });
            ring1HTML += '</ul>';
            ring2HTML += '</ul>';
            return `${headerHTML}
                    <div class="tooltip-ring-comparison">
                        <div>
                            <h5>vs. ${equippedItem ? equippedItem.name : "Empty Slot"}</h5>
                            ${equippedItem ? ring1HTML : '<ul><li>-</li></ul>'}
                        </div>
                        <div>
                            <h5>vs. ${equippedItem2 ? equippedItem2.name : "Empty Slot"}</h5>
                            ${equippedItem2 ? ring2HTML : '<ul><li>-</li></ul>'}
                        </div>
                    </div>`;
        }
        
        if (!equippedItem) {
            let statsHTML = '<ul>';
            for (const statKey in hoveredItem.stats) {
                const statInfo = Object.values(STATS).find(s => s.key === statKey);
                const statName = statInfo ? statInfo.name : statKey;
                statsHTML += `<li>+${formatNumber(hoveredItem.stats[statKey])} ${statName}</li>`;
            }
            statsHTML += '</ul>';
            return headerHTML + statsHTML;
        }

        const allStatKeys = new Set([...Object.keys(hoveredItem.stats), ...Object.keys(equippedItem.stats)]);
        let statsHTML = '<ul>';
        allStatKeys.forEach(statKey => {
            const hoveredValue = hoveredItem.stats[statKey] || 0;
            const equippedValue = equippedItem.stats[statKey] || 0;
            const difference = hoveredValue - equippedValue;
            const statInfo = Object.values(STATS).find(s => s.key === statKey);
            const statName = statInfo ? statInfo.name : statKey;
            let diffSpan = '';
            if (Math.abs(difference) > 0.001) { const diffClass = difference > 0 ? 'stat-better' : 'stat-worse'; const sign = difference > 0 ? '+' : ''; diffSpan = ` <span class="${diffClass}">(${sign}${formatNumber(difference)})</span>`; }
            statsHTML += `<li>${statName}: ${formatNumber(hoveredValue)}${diffSpan}</li>`;
        });
        statsHTML += '</ul>';
        return headerHTML + statsHTML;
    }

    function setupItemTooltipListeners() {
        const showTooltip = (item, element) => {
            if (!item) return;

            if (!item.baseId) {
                const baseName = item.name.split(' ').slice(1).join(' ');
                const foundKey = Object.keys(ITEMS).find(key => ITEMS[key].name === baseName);
                if (foundKey) item.baseId = foundKey;
            }

            elements.tooltipEl.className = 'hidden';
            elements.tooltipEl.classList.add(item.rarity);

            if (isShiftPressed && item.baseId) {
                const itemBase = ITEMS[item.baseId];
                if (itemBase) {
                    elements.tooltipEl.innerHTML = ui.createLootTableTooltipHTML(itemBase);
                }
            } else {
                if (item.type === 'ring') {
                    elements.tooltipEl.innerHTML = createTooltipHTML(item, gameState.equipment.ring1, gameState.equipment.ring2);
                } else {
                    const equippedItem = gameState.equipment[item.type];
                    elements.tooltipEl.innerHTML = createTooltipHTML(item, equippedItem);
                }
            }

            const rect = element.getBoundingClientRect();
            elements.tooltipEl.style.left = `${rect.right + 10}px`;
            elements.tooltipEl.style.top = `${rect.top}px`;
            elements.tooltipEl.classList.remove('hidden');
        };

        elements.inventorySlotsEl.addEventListener('mouseover', (event) => {
            if (!(event.target instanceof Element)) return;
            const itemWrapper = event.target.closest('.item-wrapper');
            if (!(itemWrapper instanceof HTMLElement)) return;
            const indexStr = itemWrapper.dataset.index;
            if (indexStr === null) return;
            const index = parseInt(indexStr, 10);
            showTooltip(gameState.inventory[index], itemWrapper);
        });
        elements.inventorySlotsEl.addEventListener('mouseout', () => elements.tooltipEl.classList.add('hidden'));
    
        const equipmentSlots = document.getElementById('equipment-paperdoll');
        equipmentSlots.addEventListener('mouseover', (event) => {
            if (!(event.target instanceof Element)) return;
            const slotEl = event.target.closest('.equipment-slot');
            if (!(slotEl instanceof HTMLElement)) return;
            const slotName = slotEl.id.replace('slot-', '');
            showTooltip(gameState.equipment[slotName], slotEl);
        });
        equipmentSlots.addEventListener('mouseout', () => elements.tooltipEl.classList.add('hidden'));
    }
    
    function setupGemTooltipListeners(){
        const showGemTooltip = (e) => {
             if (!(e.target instanceof Element)) return;
            const gemWrapper = e.target.closest('div.gem');
            if (!(gemWrapper instanceof HTMLElement)) return;

            const gemId = gemWrapper.dataset.gemId;
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
        
        elements.gemCraftingSlotsContainer.addEventListener('mouseover', showGemTooltip);
        elements.gemCraftingSlotsContainer.addEventListener('mouseout', () => elements.tooltipEl.classList.add('hidden'));
    }
    
    function setupStatTooltipListeners() {
        const statTooltipContent = {
            strength: { title: 'Strength', description: 'Increases your raw power. Each point provides:', effects: ['<b>+0.5</b> Flat Click Damage', '<b>+0.2%</b> Total Click Damage'] },
            agility: { title: 'Agility', description: 'Improves your hero\'s combat prowess. Each point provides:', effects: ['<b>+0.3%</b> Total DPS'] },
            luck: { title: 'Luck', description: 'Increases your fortune in the dungeon. Each point provides:', effects: ['<b>+0.5%</b> Gold Gain', '<b>+0.2%</b> Magic Find (better item rarity)'] }
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
        if (document.getElementById('raid-panel')) return;
        const raidContainer = document.getElementById('raid-container');
        if (!raidContainer) return;
        raidContainer.innerHTML = `<div id="raid-panel"><div id="raid-boss-info"><h2 id="raid-boss-name">Loading...</h2><div id="raid-boss-health-bar-container"><div id="raid-boss-health-bar"></div></div><p id="raid-boss-health-text">0 / 0</p></div><div id="raid-main-content"><div id="raid-attack-area"><button id="raid-attack-button">ATTACK!</button></div><div id="raid-player-list"><h3>Participants</h3><ul></ul></div></div></div>`;
        raidPanel = document.getElementById('raid-panel');
        const attackButton = document.getElementById('raid-attack-button');
        if (attackButton) {
            attackButton.addEventListener('click', () => {
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
        if (raidBtn) {
            raidBtn.addEventListener('click', () => {
                if (raidPanel) {
                    destroyRaidPanel();
                    socket.disconnect();
                    socket.connect();
                } else {
                    createRaidPanel();
                }
            });
        }
        socket.on('connect', () => { logMessage(elements.gameLogEl, 'Connected to Raid Server!', 'uncommon'); });
        socket.on('disconnect', () => { logMessage(elements.gameLogEl, 'Disconnected from Raid Server.', 'rare'); destroyRaidPanel(); });
        socket.on('raidUpdate', (raidState) => { updateRaidUI(raidState); });
        socket.on('raidOver', (data) => {
            logMessage(elements.gameLogEl, `RAID OVER: ${data.message}`, 'legendary');
            const scrapReward = 500;
            gameState.scrap += scrapReward;
            logMessage(elements.gameLogEl, `You received ${formatNumber(scrapReward)} Scrap for participating!`, 'epic');
            updateAll();
            destroyRaidPanel();
        });
    }

    function setupPrestigeListeners() {
        elements.prestigeButton.addEventListener('click', () => {
            prestigeSelections = [];
            elements.prestigeSelectionEl.classList.remove('hidden');
            elements.prestigeButton.classList.add('hidden');
            const allItems = [...Object.values(gameState.equipment).filter(i => i), ...gameState.inventory];
            elements.prestigeInventorySlotsEl.innerHTML = '';
            allItems.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.innerHTML = ui.createItemHTML(item, false);
                itemEl.onclick = () => {
                    const itemCard = itemEl.querySelector('.item');
                    if (!itemCard) return;
                    if (prestigeSelections.includes(item.id)) {
                        prestigeSelections = prestigeSelections.filter(id => id !== item.id);
                        itemCard.classList.remove('selected-for-prestige');
                    } else if (prestigeSelections.length < 3) {
                        prestigeSelections.push(item.id);
                        itemCard.classList.add('selected-for-prestige');
                    }
                };
                elements.prestigeInventorySlotsEl.appendChild(itemEl);
            });
        });
        document.getElementById('confirm-prestige-btn').addEventListener('click', () => {
            if (prestigeSelections.length > 3) { alert("You can only select up to 3 items!"); return; }
            const absorbed = { clickDamage: 0, dps: 0 };
            for (const item of Object.values(gameState.equipment)) {
                if (item) {
                    if(item.stats.clickDamage) absorbed.clickDamage += item.stats.clickDamage;
                    if(item.stats.dps) absorbed.dps += item.stats.dps;
                }
            }
            logMessage(elements.gameLogEl, `Absorbed <b>+${absorbed.clickDamage.toFixed(2)}</b> Click Damage and <b>+${absorbed.dps.toFixed(2)}</b> DPS from your gear!`, 'epic');
            const allItems = [...Object.values(gameState.equipment).filter(i => i), ...gameState.inventory];
            const newLegacyItems = allItems.filter(item => prestigeSelections.includes(item.id));
            const oldLegacyItems = gameState.legacyItems || [];
            const oldLevel = gameState.maxLevel;
            const heroToKeep = {
                level: gameState.hero.level,
                xp: gameState.hero.xp,
                attributePoints: (gameState.hero.level - 1) * 5,
                attributes: { strength: 0, agility: 0, luck: 0 }
            };
            logMessage(elements.gameLogEl, `Your attributes have been reset, and <b>${heroToKeep.attributePoints}</b> points have been refunded.`, 'uncommon');
            const oldAbsorbedStats = gameState.absorbedStats || { clickDamage: 0, dps: 0 };
            const oldPrestigeCount = gameState.prestigeCount || 0;
            const baseState = getDefaultGameState();
            gameState = {
                ...baseState,
                absorbedStats: {
                    clickDamage: oldAbsorbedStats.clickDamage + absorbed.clickDamage,
                    dps: oldAbsorbedStats.dps + absorbed.dps
                },
                legacyItems: [...oldLegacyItems, ...newLegacyItems],
                prestigeCount: oldPrestigeCount + 1,
                hero: heroToKeep,
                presets: baseState.presets,
                activePresetIndex: baseState.activePresetIndex
            };
            logMessage(elements.gameLogEl, `PRESTIGE! Restarted from Lvl ${oldLevel}, keeping hero progress, ${newLegacyItems.length} new legacy items, and all absorbed stats.`);
            elements.prestigeSelectionEl.classList.add('hidden');
            elements.prestigeButton.classList.remove('hidden');
            recalculateStats();
            startNewMonster();
            updateAll();
            autoSave();
        });
    }

    function main() {
        const baseElements = ui.initDOMElements();
        elements = {
            ...baseElements,
            ringSelectionModalBackdrop: document.getElementById('ring-selection-modal-backdrop'),
            ringSelectionSlot1: document.getElementById('ring-selection-slot1'),
            ringSelectionSlot2: document.getElementById('ring-selection-slot2'),
            ringSelectionCancelBtn: document.getElementById('ring-selection-cancel-btn'),
            offlineProgressModalBackdrop: document.getElementById('offline-progress-modal-backdrop'),
            offlineProgressCloseBtn: document.getElementById('offline-progress-close-btn'),
            offlineTime: document.getElementById('offline-time'),
            offlineGold: document.getElementById('offline-gold'),
            offlineXp: document.getElementById('offline-xp'),
            offlineScrap: document.getElementById('offline-scrap'),
            offlineRewards: document.getElementById('offline-rewards'),
        };
        
        const savedData = localStorage.getItem('idleRPGSaveData');
        if (savedData) {
            const loadedState = JSON.parse(savedData);
            const baseState = getDefaultGameState();
            gameState = { 
                ...baseState, 
                ...loadedState,
                gems: loadedState.gems || [],
                hero: { ...baseState.hero, ...(loadedState.hero || {}), attributes: { ...baseState.hero.attributes, ...(loadedState.hero?.attributes || {}) } }, 
                upgrades: { ...baseState.upgrades, ...(loadedState.upgrades || {}) }, 
                equipment: { ...baseState.equipment, ...(loadedState.equipment || {}) }, 
                absorbedStats: { ...baseState.absorbedStats, ...(loadedState.absorbedStats || {}) }, 
                monster: { ...baseState.monster, ...(loadedState.monster || {}) }, 
                presets: loadedState.presets || baseState.presets, 
                isAutoProgressing: loadedState.isAutoProgressing !== undefined ? loadedState.isAutoProgressing : true, 
                currentRealmIndex: loadedState.currentRealmIndex || 0,
            };
            calculateOfflineProgress();
        } else {
            gameState = getDefaultGameState();
        }
        
        setupEventListeners();
        recalculateStats();
        startNewMonster();
        logMessage(elements.gameLogEl, savedData ? "Saved game loaded!" : "Welcome! Your progress will be saved automatically.");
        updateAll();
        
        autoSave(); 
        setInterval(autoSave, 30000);
        setInterval(gameLoop, 1000);
    }

    main();
});