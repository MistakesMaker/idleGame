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

// This is exported for modules that need it. It MUST be at the top level.
export const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

// --- JSDoc Type Definitions ---
/**
 * @typedef {Object<string, HTMLElement|HTMLButtonElement|HTMLInputElement|HTMLImageElement>} DOMElements
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- GAME STATE AND CONFIGURATION ---
    let gameState = {};
    let currentMap = 'world';
    let currentMonster = { name: "Slime", data: MONSTERS.SLIME };
    let playerStats = { baseClickDamage: 1, baseDps: 0, totalClickDamage: 1, totalDps: 0, bonusGold: 0, magicFind: 0 };
    let salvageMode = { active: false, selections: [] };
    let prestigeSelections = [];
    let saveTimeout;

    /** @type {DOMElements} */
    let elements = {};

    // RAID SECTION
    const socket = io('https://idlegame-oqyq.onrender.com');
    let raidPanel = null;
    let raidPlayerId = `Player_${Math.random().toString(36).substr(2, 5)}`;

    // --- CORE GAME LOGIC ---
    const defaultEquipmentState = { sword: null, shield: null, helmet: null, necklace: null, platebody: null, platelegs: null, ring1: null, ring2: null, belt: null };

    function getDefaultGameState() {
        return {
            gold: 0, scrap: 0, upgrades: { clickDamage: 0, dps: 0 }, maxLevel: 1, currentFightingLevel: 1,
            monster: { hp: 10, maxHp: 10 },
            equipment: { ...defaultEquipmentState },
            inventory: [],
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
            currentRealmIndex: 0
        };
    }

    function addStatsFromItem(item) {
        for (const stat in item.stats) {
            const value = item.stats[stat];
            if (stat === STATS.CLICK_DAMAGE.key) playerStats.baseClickDamage += value;
            if (stat === STATS.DPS.key) playerStats.baseDps += value;
            if (stat === STATS.GOLD_GAIN.key) playerStats.bonusGold += value;
        }
    }

    function recalculateStats() {
        const hero = gameState.hero;
        playerStats.baseClickDamage = 1 + (gameState.absorbedStats?.clickDamage || 0);
        playerStats.baseDps = 0 + (gameState.absorbedStats?.dps || 0);
        playerStats.bonusGold = 0;
        playerStats.magicFind = 0;

        const allItems = [...(gameState.legacyItems || []), ...Object.values(gameState.equipment)];
        for (const item of allItems) {
            if (item) {
                addStatsFromItem(item);
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
        playerStats.totalClickDamage = finalClickDamage;

        let finalDps = playerStats.baseDps + dpsUpgradeBonus;
        finalDps *= (1 + (agilityBonusDpsPercent / 100));
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
        ui.updateUI(elements, gameState, playerStats, currentMonster, salvageMode);
        renderMap();
        renderRealmTabs();
    }

    function autoSave() {
        elements.saveIndicatorEl.classList.add('visible');
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            elements.saveIndicatorEl.classList.remove('visible');
        }, 2000);
        localStorage.setItem('idleRPGSaveData', JSON.stringify(gameState));
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

    // --- SETUP AND INITIALIZATION ---
    function setupEventListeners() {
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
            const target = e.target;
            if (!(target instanceof HTMLElement) || !target.dataset.rarity) return;

            const rarity = target.dataset.rarity;
            const result = player.salvageByRarity(gameState, rarity);

            if (result.count > 0) {
                logMessage(elements.gameLogEl, `Salvaged ${result.count} ${rarity} items for ${formatNumber(result.scrapGained)} Scrap.`, 'uncommon');
                updateAll();
                autoSave();
            } else {
                logMessage(elements.gameLogEl, `No unlocked ${rarity} items to salvage.`);
            }
        });

        elements.inventorySlotsEl.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            const wrapper = target.closest('.item-wrapper');
            if (!(wrapper instanceof HTMLElement) || !wrapper.dataset.index) return;

            const index = parseInt(wrapper.dataset.index, 10);
            const item = gameState.inventory[index];
            if (!item) return;

            if (target.classList.contains('lock-icon')) {
                const message = player.toggleItemLock(gameState, index);
                if (message) logMessage(elements.gameLogEl, message);
            } else if (salvageMode.active) {
                if (item.locked) { logMessage(elements.gameLogEl, "This item is locked and cannot be salvaged.", 'rare'); return; }
                const selectionIndex = salvageMode.selections.indexOf(index);
                if (selectionIndex > -1) {
                    salvageMode.selections.splice(selectionIndex, 1);
                } else {
                    salvageMode.selections.push(index);
                }
                document.getElementById('salvage-count').textContent = salvageMode.selections.length.toString();
            } else {
                player.equipItem(gameState, index);
                recalculateStats();
            }
            updateAll();
            autoSave();
        });

        document.getElementById('equipment-paperdoll').addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            const slotElement = target.closest('[data-slot-name]');
            if (slotElement instanceof HTMLElement && slotElement.dataset.slotName) {
                player.unequipItem(gameState, slotElement.dataset.slotName);
                recalculateStats();
                updateAll();
                autoSave();
            }
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
                const viewId = tab.dataset.view || tab.textContent.toLowerCase() + '-view';
                tab.dataset.view = viewId;

                tab.addEventListener('click', () => {
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
        
        setupTooltipListeners();
        setupStatTooltipListeners();
        setupRaidListeners();
        setupPrestigeListeners();
    }
    
    // --- FIX: Change these from assignments back to regular function declarations ---
    function createTooltipHTML(hoveredItem, equippedItem) {
        const headerHTML = `<div class="item-header"><span class="${hoveredItem.rarity}">${hoveredItem.name}</span></div>`;
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

    function setupTooltipListeners() {
        elements.inventorySlotsEl.addEventListener('mouseover', (event) => {
            if (!(event.target instanceof Element)) return;
            const itemWrapper = event.target.closest('.item-wrapper');
            if (!(itemWrapper instanceof HTMLElement) || !itemWrapper.dataset.index) return;
            const index = parseInt(itemWrapper.dataset.index, 10);
            const inventoryItem = gameState.inventory[index];
            if (!inventoryItem) return;
            elements.tooltipEl.className = 'hidden';
            elements.tooltipEl.classList.add(inventoryItem.rarity);
            let slotToCompare = inventoryItem.type;
            if (slotToCompare === 'ring') {
                if (!gameState.equipment.ring1) slotToCompare = 'ring1'; 
                else if (!gameState.equipment.ring2) slotToCompare = 'ring2';
                else slotToCompare = 'ring1';
            }
            const equippedItem = gameState.equipment[slotToCompare];
            const rect = itemWrapper.getBoundingClientRect();
            elements.tooltipEl.style.left = `${rect.right + 10}px`;
            elements.tooltipEl.style.top = `${rect.top}px`;
            elements.tooltipEl.innerHTML = createTooltipHTML(inventoryItem, equippedItem);
            elements.tooltipEl.classList.remove('hidden');
        });
        elements.inventorySlotsEl.addEventListener('mouseout', () => elements.tooltipEl.classList.add('hidden'));
        const equipmentSlots = document.getElementById('equipment-paperdoll');
        equipmentSlots.addEventListener('mouseover', (event) => {
            if (!(event.target instanceof Element)) return;
            const slotEl = event.target.closest('.equipment-slot');
            if (!(slotEl instanceof HTMLElement)) return;
            const slotName = slotEl.id.replace('slot-', '');
            const equippedItem = gameState.equipment[slotName];
            if (!equippedItem) return;
            elements.tooltipEl.className = 'hidden';
            elements.tooltipEl.classList.add(equippedItem.rarity);
            const rect = slotEl.getBoundingClientRect();
            elements.tooltipEl.style.left = `${rect.right + 10}px`;
            elements.tooltipEl.style.top = `${rect.top}px`;
            elements.tooltipEl.innerHTML = createTooltipHTML(equippedItem, null); 
            elements.tooltipEl.classList.remove('hidden');
        });
        equipmentSlots.addEventListener('mouseout', () => elements.tooltipEl.classList.add('hidden'));
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
            if (!(row instanceof HTMLElement) || !row.dataset.attribute) return;
            const attributeKey = row.dataset.attribute;
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
        elements = ui.initDOMElements();

        const savedData = localStorage.getItem('idleRPGSaveData');
        if (savedData) {
            const loadedState = JSON.parse(savedData);
            const baseState = getDefaultGameState();
            gameState = {
                ...baseState, ...loadedState,
                hero: { ...baseState.hero, ...(loadedState.hero || {}), attributes: { ...baseState.hero.attributes, ...(loadedState.hero?.attributes || {}) } },
                upgrades: { ...baseState.upgrades, ...(loadedState.upgrades || {}) },
                equipment: { ...baseState.equipment, ...(loadedState.equipment || {}) },
                absorbedStats: { ...baseState.absorbedStats, ...(loadedState.absorbedStats || {}) },
                monster: { ...baseState.monster, ...(loadedState.monster || {}) },
                presets: loadedState.presets || baseState.presets,
                isAutoProgressing: loadedState.isAutoProgressing !== undefined ? loadedState.isAutoProgressing : true,
                currentRealmIndex: loadedState.currentRealmIndex || 0,
            };
        } else {
            gameState = getDefaultGameState();
        }
        
        setupEventListeners();
        recalculateStats();
        startNewMonster();
        
        logMessage(elements.gameLogEl, savedData ? "Saved game loaded!" : "Welcome! Your progress will be saved automatically.");
        updateAll();
        
        setInterval(autoSave, 30000);
        setInterval(gameLoop, 1000);
    }

    main();
});
// --- END OF FILE game.js ---