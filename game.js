/* global io */
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
    let selectedItemForForge = null;
    let isResetting = false; 

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

        return {
            gold: 0, scrap: 0, upgrades: { clickDamage: 0, dps: 0 }, maxLevel: 1, currentFightingLevel: 1,
            monster: { hp: 10, maxHp: 10 },
            equipment: { ...defaultEquipmentState },
            inventory: [],
            inventoryGridInitialized: true,
            gems: [],
            legacyItems: [],
            absorbedStats: {},
            absorbedSynergies: [],
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
            currentRealmIndex: 0,
            lastSaveTimestamp: null,
            permanentUpgrades: defaultPermUpgrades,
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
            magicFind: (permUpgrades.LOOT_HOARDER || 0) * permUpgradeDefs.LOOT_HOARDER.bonusPerLevel,
            critChance: (permUpgrades.CRITICAL_POWER || 0) * permUpgradeDefs.CRITICAL_POWER.bonusPerLevel,
            critDamage: (permUpgrades.CRITICAL_DAMAGE || 0) * permUpgradeDefs.CRITICAL_DAMAGE.bonusPerLevel,
            prestigePower: (permUpgrades.PRESTIGE_POWER || 0) * permUpgradeDefs.PRESTIGE_POWER.bonusPerLevel,
            scrap: (permUpgrades.SCRAP_SCAVENGER || 0) * permUpgradeDefs.SCRAP_SCAVENGER.bonusPerLevel,
            gemFind: (permUpgrades.GEM_FIND || 0) * permUpgradeDefs.GEM_FIND.bonusPerLevel,
            bossDamage: (permUpgrades.BOSS_HUNTER || 0) * permUpgradeDefs.BOSS_HUNTER.bonusPerLevel,
            multiStrike: (permUpgrades.SWIFT_STRIKES || 0) * permUpgradeDefs.SWIFT_STRIKES.bonusPerLevel,
            legacyKeeper: (permUpgrades.LEGACY_KEEPER || 0) * permUpgradeDefs.LEGACY_KEEPER.bonusPerLevel,
        };

        const newCalculatedStats = {
            baseClickDamage: 1,
            baseDps: 0,
            bonusGold: permanentUpgradeBonuses.gold,
            magicFind: permanentUpgradeBonuses.magicFind,
        };

        for (const statKey in absorbed) {
            if (STATS.CLICK_DAMAGE.key === statKey) newCalculatedStats.baseClickDamage += absorbed[statKey];
            if (STATS.DPS.key === statKey) newCalculatedStats.baseDps += absorbed[statKey];
            if (STATS.GOLD_GAIN.key === statKey) newCalculatedStats.bonusGold += absorbed[statKey];
            if (STATS.MAGIC_FIND.key === statKey) newCalculatedStats.magicFind += absorbed[statKey];
        }

        const equippedSynergyGems = [];
        const allItems = [...(gameState.legacyItems || []), ...Object.values(gameState.equipment)];

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
                        if (gem && gem.synergy) equippedSynergyGems.push(gem.synergy);
                    }
                }
            }
        }
        
        const strengthBonusClickFlat = hero.attributes.strength * 0.5;
        const strengthBonusClickPercent = hero.attributes.strength * 0.2;
        const agilityBonusDpsFlat = hero.attributes.agility * 1; // --- CHANGE: Agility now adds flat DPS
        const agilityBonusDpsPercent = hero.attributes.agility * 0.3;

        let clickDamageSubtotal = newCalculatedStats.baseClickDamage + strengthBonusClickFlat;
        clickDamageSubtotal *= (1 + (strengthBonusClickPercent / 100));

        let dpsSubtotal = newCalculatedStats.baseDps + agilityBonusDpsFlat; // --- CHANGE: Agility flat DPS added here
        dpsSubtotal *= (1 + (agilityBonusDpsPercent / 100));

        const clickUpgradeBonusPercent = gameState.upgrades.clickDamage * 1;
        let finalClickDamage = clickDamageSubtotal * (1 + (clickUpgradeBonusPercent / 100));
        
        const dpsUpgradeBonusPercent = gameState.upgrades.dps * 1;
        let finalDps = dpsSubtotal * (1 + (dpsUpgradeBonusPercent / 100));

        const luckBonusGold = hero.attributes.luck * 0.5;
        // const luckBonusMagicFind = hero.attributes.luck * 0.2; // --- CHANGE: Removed Magic Find from Luck
        const finalBonusGold = newCalculatedStats.bonusGold + luckBonusGold;
        const finalMagicFind = newCalculatedStats.magicFind; // Magic Find is no longer affected by Luck

        // Apply prestige power bonus
        const prestigeMultiplier = 1 + ((permanentUpgradeBonuses.prestigePower * (gameState.prestigeCount || 0)) / 100);
        finalClickDamage *= prestigeMultiplier;
        finalDps *= prestigeMultiplier;

        let totalSynergyValue = 0;
        const allSynergies = [...equippedSynergyGems, ...(gameState.absorbedSynergies || [])];
        for (const synergy of allSynergies) {
             if (synergy && synergy.source === 'dps' && synergy.target === 'clickDamage') {
                totalSynergyValue += synergy.value;
            }
        }
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
            // Add new permanent stats
            critChance: permanentUpgradeBonuses.critChance,
            critDamage: 1 + (permanentUpgradeBonuses.critDamage / 100), // Store as multiplier, e.g., 1.5 for 50%
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
            const scrollPositions = {
                inventory: elements.inventorySlotsEl.parentElement.scrollTop,
                forge: elements.forgeInventorySlotsEl.parentElement.scrollTop,
                gems: elements.gemSlotsEl.parentElement.scrollTop,
                rightPanel: document.querySelector('.right-panel')?.scrollTop || 0
            };

            startNewMonster();
            updateAll();
            
            elements.inventorySlotsEl.parentElement.scrollTop = scrollPositions.inventory;
            elements.forgeInventorySlotsEl.parentElement.scrollTop = scrollPositions.forge;
            elements.gemSlotsEl.parentElement.scrollTop = scrollPositions.gems;
            const rightPanel = document.querySelector('.right-panel');
            if (rightPanel) {
                rightPanel.scrollTop = scrollPositions.rightPanel;
            }
        }, 300);
    }

    function startNewMonster() {
        const { newMonster, newMonsterState } = logic.generateMonster(gameState.currentFightingLevel, gameState.specialEncounter);
        currentMonster = newMonster;
        gameState.monster = newMonsterState;
        (/** @type {HTMLImageElement} */ (elements.monsterImageEl)).src = currentMonster.data.image;
        elements.monsterNameEl.textContent = currentMonster.name;

        // Set zone-specific background
        if (currentMonster.data.isSpecial) {
            elements.monsterAreaEl.style.backgroundImage = `url('images/backgrounds/bg_treasure_realm.png')`;
        } else {
            const subZone = findSubZoneByLevel(gameState.currentFightingLevel);
            if (subZone && subZone.parentZone) {
                elements.monsterAreaEl.style.backgroundImage = `url('${subZone.parentZone.monsterAreaBg}')`;
            } else {
                 // Fallback for the very first level or if something goes wrong
                elements.monsterAreaEl.style.backgroundImage = `url('${REALMS[0].zones.green_meadows.monsterAreaBg}')`;
            }
        }
    }

    function attack(baseDamage, isClick = false) {
        if (gameState.monster.hp <= 0) return;

        let finalDamage = baseDamage;
        const level = gameState.currentFightingLevel;
        const isAnyBoss = isBossLevel(level) || isBigBossLevel(level) || isMiniBossLevel(level);

        // Apply boss damage bonus
        if (isAnyBoss) {
            finalDamage *= playerStats.bossDamageBonus;
        }

        // Roll for crit
        const isCrit = Math.random() * 100 < playerStats.critChance;
        if (isCrit) {
            finalDamage *= playerStats.critDamage;
        }
        
        // Apply damage
        gameState.monster.hp -= finalDamage;

        if (isClick) {
            ui.showDamagePopup(elements.popupContainerEl, finalDamage, isCrit);
        } else {
            ui.showDpsPopup(elements.popupContainerEl, finalDamage, isCrit);
        }

        // Roll for multi-strike
        if (Math.random() * 100 < playerStats.multiStrikeChance) {
            // Apply a second, identical hit
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
        ui.updateUI(elements, gameState, playerStats, currentMonster, salvageMode, craftingGems, selectedItemForForge, prestigeSelections);
        renderMap();
        renderRealmTabs();
        renderPermanentUpgrades();
        
        if (selectedGemForSocketing) {
            document.querySelectorAll('.selected-gem').forEach(el => el.classList.remove('selected-gem'));
            const gemEl = document.querySelector(`.gem-wrapper[data-id="${selectedGemForSocketing.id}"]`);
            if (gemEl) gemEl.classList.add('selected-gem');
            
            document.querySelectorAll('.socket-target').forEach(el => el.classList.remove('socket-target'));
            
            gameState.inventory.forEach((item) => {
                if (item.sockets && item.sockets.includes(null)) {
                    const itemEl = document.querySelector(`.item-wrapper[data-id="${item.id}"] .item`);
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
                const node = ui.createMapNode(zone.name, zone.icon, zone.coords, isUnlocked, false, gameState.currentFightingLevel, zone.subZones[Object.keys(zone.subZones)[0]].levelRange);
                if (isUnlocked) node.onclick = () => { currentMap = zoneId; renderMap(); };
                elements.mapContainerEl.appendChild(node);
            }
        } else {
            const zone = realm.zones[currentMap];
            if (!zone) { currentMap = 'world'; renderMap(); return; }
            elements.mapTitleEl.textContent = zone.name;
            elements.backToWorldMapBtnEl.classList.remove('hidden');
            elements.mapContainerEl.style.backgroundImage = `url('${zone.mapImage}')`;
            
            const subZonesArray = Object.values(zone.subZones).sort((a, b) => a.levelRange[0] - b.levelRange[0]);
            
            const unlockedNodes = subZonesArray.filter(sz => gameState.maxLevel >= sz.levelRange[0]);

            if (unlockedNodes.length > 1) {
                const mapWidth = elements.mapContainerEl.clientWidth;
                const mapHeight = elements.mapContainerEl.clientHeight;
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

                elements.mapContainerEl.appendChild(svgEl);
            }

            for (const subZone of subZonesArray) {
                const isUnlocked = gameState.maxLevel >= subZone.levelRange[0];
                const isCompleted = gameState.completedLevels.includes(subZone.levelRange[1]);
                const icon = 'images/icons/sword.png';
                const node = ui.createMapNode(subZone.name, icon, subZone.coords, isUnlocked, isCompleted, gameState.currentFightingLevel, subZone.levelRange, subZone.isBoss);
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
                startNewMonster(); // Update background when changing realms
                autoSave();
            };
            elements.realmTabsContainerEl.appendChild(tab);
        });
    }

    function renderPermanentUpgrades() {
        const container = elements.permanentUpgradesContainerEl;
        container.innerHTML = '';

        for (const key in PERMANENT_UPGRADES) {
            const upgrade = PERMANENT_UPGRADES[key];
            const currentLevel = gameState.permanentUpgrades[key] || 0;
            const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costScalar, currentLevel));
            const isMaxed = currentLevel >= upgrade.maxLevel;
            
            let bonus = upgrade.bonusPerLevel * currentLevel;
            if (upgrade.id === 'PRESTIGE_POWER') {
                bonus *= (gameState.prestigeCount || 0);
            }
            
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
                    <div class="upgrade-level">Level: ${currentLevel} / ${upgrade.maxLevel}</div>
                </div>
                <div class="upgrade-buy-section">
                    ${isMaxed ? 'MAXED' : `<div class="upgrade-cost">${formatNumber(cost)} Gold</div>`}
                    <button class="buy-permanent-upgrade-btn" data-upgrade-id="${upgrade.id}" ${gameState.gold < cost || isMaxed ? 'disabled' : ''}>Buy</button>
                </div>
            `;
            container.appendChild(card);
        }
    }

    function showSubZoneModal(subZone) {
        elements.modalTitleEl.textContent = subZone.name;
        elements.modalBodyEl.innerHTML = '';

        const startLevel = subZone.levelRange[0];
        const finalLevel = subZone.levelRange[1];
        const isSingleLevelZone = startLevel === finalLevel;

        const startCombat = (level, isFarming) => {
            gameState.currentFightingLevel = level;
            gameState.isFarming = isFarming;
            gameState.isAutoProgressing = isFarming ? (/** @type {HTMLInputElement} */ (elements.autoProgressCheckboxEl)).checked : false;
            logMessage(elements.gameLogEl, `Traveling to level ${level}.`);
            elements.modalBackdropEl.classList.add('hidden');
            startNewMonster();
            updateAll();
            autoSave();
        };

        if (isSingleLevelZone) {
            const bossLevel = startLevel;
            const fightBossButton = document.createElement('button');
            fightBossButton.textContent = gameState.completedLevels.includes(bossLevel) ? `Re-fight Boss (Lvl ${bossLevel})` : `Fight Boss (Lvl ${bossLevel})`;
            fightBossButton.onclick = () => startCombat(bossLevel, false);
            elements.modalBodyEl.appendChild(fightBossButton);

        } else {
            const highestCompleted = ui.getHighestCompletedLevelInSubZone(gameState.completedLevels, subZone);
            
            const nextLevelToTry = Math.min(highestCompleted + 1, finalLevel);
            const isNewZone = highestCompleted < startLevel;
            const levelToStart = isNewZone ? startLevel : nextLevelToTry;

            const continueButton = document.createElement('button');
            continueButton.textContent = isNewZone ? `Start at Lvl ${startLevel}` : `Continue at Lvl ${levelToStart}`;
            continueButton.onclick = () => startCombat(levelToStart, true);
            elements.modalBodyEl.appendChild(continueButton);

            if (!isNewZone && highestCompleted < finalLevel) {
                const restartButton = document.createElement('button');
                restartButton.textContent = `Restart at Lvl ${startLevel}`;
                restartButton.onclick = () => startCombat(startLevel, true);
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
        const difficultyResetFactor = 4;
        const effectiveLevel = level - (tier * difficultyResetFactor);
        const goldExponent = 1.17;
        const baseGold = 15;
        let goldPerKill = Math.ceil(baseGold * Math.pow(goldExponent, effectiveLevel) * (1 + (playerStats.bonusGold / 100)));
        let xpPerKill = level * 5;

        if (isBigBossLevel(level)) {
            xpPerKill *= 5;
            goldPerKill *= 5;
        } else if (isBossLevel(level)) {
            xpPerKill *= 3;
            goldPerKill *= 3;
        } else if(isMiniBossLevel(level)) {
            xpPerKill *= 2;
            goldPerKill *= 2;
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

    function setupEventListeners() {
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
            if (salvageBtn && confirmBtn && selectAllBtn && raritySalvageContainer) {
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
            }
            document.body.classList.toggle('salvage-mode-active', salvageMode.active);
            const salvageCountEl = document.getElementById('salvage-count');
            if (salvageCountEl) salvageCountEl.textContent = '0';
            updateAll();
        });
        document.getElementById('select-all-salvage-btn').addEventListener('click', () => {
             salvageMode.selections = gameState.inventory.filter(item => !item.locked);
             const salvageCountEl = document.getElementById('salvage-count');
             if (salvageCountEl) salvageCountEl.textContent = salvageMode.selections.length.toString();
             updateAll();
        });
        document.getElementById('confirm-salvage-btn').addEventListener('click', () => {
            const result = player.salvageSelectedItems(gameState, salvageMode, playerStats);
            if (result.count > 0) {
                 logMessage(elements.gameLogEl, `Salvaged ${result.count} items for a total of ${formatNumber(result.scrapGained)} Scrap.`, 'uncommon');
            } else {
                 logMessage(elements.gameLogEl, "No items selected for salvage.");
            }
            salvageMode.active = false;
            const salvageBtn = document.getElementById('salvage-mode-btn');
            const confirmBtn = document.getElementById('confirm-salvage-btn');
            const selectAllBtn = document.getElementById('select-all-salvage-btn');
            const raritySalvageContainer = document.getElementById('salvage-by-rarity-controls');
            if (salvageBtn) {
                salvageBtn.textContent = 'Select to Salvage';
                salvageBtn.classList.remove('active');
            }
            if (confirmBtn) confirmBtn.classList.add('hidden');
            if (selectAllBtn) selectAllBtn.classList.add('hidden');
            if(raritySalvageContainer) raritySalvageContainer.classList.add('hidden');
            document.body.classList.remove('salvage-mode-active');
            salvageMode.selections = [];
            updateAll();
            autoSave();
        });
        document.getElementById('salvage-by-rarity-controls').addEventListener('click', (e) => {
            if (!(e.target instanceof HTMLElement) || !e.target.dataset.rarity) return;
            const rarity = e.target.dataset.rarity;
            const result = player.salvageByRarity(gameState, rarity, playerStats);
            if (result.count > 0) {
                logMessage(elements.gameLogEl, `Salvaged ${result.count} ${rarity} items for ${formatNumber(result.scrapGained)} Scrap.`, 'uncommon');
                updateAll();
                autoSave();
            } else {
                logMessage(elements.gameLogEl, `No unlocked ${rarity} items to salvage.`);
            }
        });
        
        const gridClickHandler = (event) => {
            if (!(event.target instanceof Element)) return;
            const wrapper = event.target.closest('.item-wrapper, .gem-wrapper');
            if (!(wrapper instanceof HTMLElement)) return;

            const id = wrapper.dataset.id;
            if (!id) return;
            
            const isGem = wrapper.classList.contains('gem-wrapper');
            const item = isGem ? gameState.gems.find(i => String(i.id) === id) : gameState.inventory.find(i => String(i.id) === id);

            if (!item) return;

            if (isGem) {
                if (isShiftPressed) {
                    if (craftingGems.length < 2) {
                         if (craftingGems.length > 0 && craftingGems[0].tier !== item.tier) {
                            logMessage(elements.gameLogEl, "You can only combine gems of the same tier.", "rare");
                            return;
                        }
                        craftingGems.push(item);
                        gameState.gems = gameState.gems.filter(g => g.id !== item.id);
                    }
                } else {
                    if (selectedGemForSocketing && selectedGemForSocketing.id === item.id) {
                        selectedGemForSocketing = null;
                        logMessage(elements.gameLogEl, "Deselected gem.");
                    } else {
                        selectedGemForSocketing = item;
                        logMessage(elements.gameLogEl, `Selected ${item.name}. Click an item with an empty socket to place it.`, 'uncommon');
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
                        logMessage(elements.gameLogEl, `Socketed ${gemToSocket.name} into ${item.name}.`, 'epic');
                        selectedGemForSocketing = null;
                        recalculateStats();
                        updateAll();
                        autoSave();
                        return;
                    }
                }
    
                if (event.target.closest('.lock-icon')) {
                    const message = player.toggleItemLock(gameState, item);
                    if (message) logMessage(elements.gameLogEl, message);
                } else if (salvageMode.active) {
                    if (item.locked) { logMessage(elements.gameLogEl, "This item is locked and cannot be salvaged.", 'rare'); return; }
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
                            logMessage(elements.gameLogEl, result.message);
                            recalculateStats();
                        }
                    } else {
                        logMessage(elements.gameLogEl, result.message, 'rare');
                    }
                }
                updateAll();
                autoSave();
            }
        };

        elements.inventorySlotsEl.addEventListener('click', gridClickHandler);
        elements.gemSlotsEl.addEventListener('click', gridClickHandler);
        
        document.getElementById('equipment-paperdoll').addEventListener('click', (event) => {
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
                        logMessage(elements.gameLogEl, "You can only combine gems of the same tier.", "rare");
                        return;
                    }
        
                    craftingGems.push(selectedGemForSocketing);
                    gameState.gems = gameState.gems.filter(g => g.id !== selectedGemForSocketing.id);
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

        document.getElementById('toggle-loot-log-btn').addEventListener('click', (e) => {
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
        
        elements.forgeInventorySlotsEl.addEventListener('click', (e) => {
            if (!(e.target instanceof Element)) return;
            const wrapper = e.target.closest('.item-wrapper');
            if (!(wrapper instanceof HTMLElement)) return;
            
            const id = wrapper.dataset.id;
            if (!id) return;
            
            const item = [...Object.values(gameState.equipment), ...gameState.inventory].find(i => i && String(i.id) === id);
            
            if (item && item.stats) {
                selectedItemForForge = item; 
                logMessage(elements.gameLogEl, `Selected <span class="${item.rarity}">${item.name}</span> for rerolling.`, 'uncommon');
                updateAll();
            }
        });

        elements.forgeRerollBtn.addEventListener('click', () => {
            if (!selectedItemForForge) {
                logMessage(elements.gameLogEl, "No item selected to reroll.", 'rare');
                return;
            }

            const result = player.rerollItemStats(gameState, selectedItemForForge);
            logMessage(elements.gameLogEl, result.message, result.success ? 'epic' : 'rare');
            
            if (result.success) {
                recalculateStats();
                updateAll();
                autoSave();
            }
        });

        elements.permanentUpgradesContainerEl.addEventListener('click', (e) => {
            if (!(e.target instanceof Element)) return;
            const buyButton = (e.target).closest('.buy-permanent-upgrade-btn');
            if (!buyButton || !(buyButton instanceof HTMLButtonElement) || buyButton.disabled) return;

            const upgradeId = buyButton.dataset.upgradeId;
            if (!upgradeId) return;

            const result = player.buyPermanentUpgrade(gameState, upgradeId);

            if (result.success) {
                logMessage(elements.gameLogEl, `Purchased Level ${result.newLevel} of ${PERMANENT_UPGRADES[upgradeId].name}!`, 'epic');
                recalculateStats();
                updateAll();
                autoSave();
            } else {
                logMessage(elements.gameLogEl, result.message, 'rare');
            }
        });

        setupItemTooltipListeners();
        setupGemTooltipListeners();
        setupStatTooltipListeners();
        setupLootTooltipListeners();
        setupRaidListeners();
        setupPrestigeListeners();
    }
    
    // This is a helper function to create comparison tooltips for existing items
    function createItemComparisonTooltipHTML(hoveredItem, equippedItem, equippedItem2 = null) {
        let headerHTML = `<div class="item-header"><span class="${hoveredItem.rarity}">${hoveredItem.name}</span></div>`;

        const createComparisonHTML = (equipped) => {
            if (!equipped) return '<ul><li>(Empty Slot)</li></ul>';
            
            const combinedHoveredStats = getCombinedItemStats(hoveredItem);
            const combinedEquippedStats = getCombinedItemStats(equipped);
            const allStatKeys = new Set([...Object.keys(combinedHoveredStats), ...Object.keys(combinedEquippedStats)]);
            let html = '<ul>';

            allStatKeys.forEach(statKey => {
                const hoveredValue = combinedHoveredStats[statKey] || 0;
                const equippedValue = combinedEquippedStats[statKey] || 0;
                const diff = hoveredValue - equippedValue;

                const statInfo = Object.values(STATS).find(s => s.key === statKey) || { name: statKey, type: 'flat' };
                const statName = statInfo.name;
                const isPercent = statInfo.type === 'percent';

                const valueStr = isPercent ? `${hoveredValue.toFixed(1)}%` : formatNumber(hoveredValue);
                
                let diffSpan = '';
                if (Math.abs(diff) > 0.001) {
                    const diffClass = diff > 0 ? 'stat-better' : 'stat-worse';
                    const sign = diff > 0 ? '+' : '';
                    const diffStr = isPercent ? `${diff.toFixed(1)}%` : formatNumber(diff);
                    diffSpan = ` <span class="${diffClass}">(${sign}${diffStr})</span>`;
                }
                html += `<li>${statName}: ${valueStr}${diffSpan}</li>`;
            });
            html += '</ul>';
            return html;
        }

        if (hoveredItem.type === 'ring') {
            const ring1HTML = createComparisonHTML(equippedItem);
            const ring2HTML = createComparisonHTML(equippedItem2);
            return `${headerHTML}
                    <div class="tooltip-ring-comparison">
                        <div>
                            <h5>vs. ${equippedItem ? equippedItem.name : "Ring 1"}</h5>
                            ${ring1HTML}
                        </div>
                        <div>
                            <h5>vs. ${equippedItem2 ? equippedItem2.name : "Ring 2"}</h5>
                            ${ring2HTML}
                        </div>
                    </div>`;
        } else {
             return `${headerHTML}${createComparisonHTML(equippedItem)}`;
        }
    }
    
    function setupItemTooltipListeners() {
        const showTooltip = (item, element) => {
            if (!item) return;

            elements.tooltipEl.className = 'hidden';
            elements.tooltipEl.classList.add(item.rarity);

            if (isShiftPressed) {
                // When shift is held, show the base stat ranges for the item type
                const itemBase = ITEMS[item.baseId];
                if(itemBase) {
                     elements.tooltipEl.innerHTML = ui.createLootTableTooltipHTML(itemBase);
                } else {
                     elements.tooltipEl.innerHTML = ui.createTooltipHTML(item);
                }
            } else {
                // Default behavior: show comparison tooltip
                if (item.type === 'ring') {
                    elements.tooltipEl.innerHTML = createItemComparisonTooltipHTML(item, gameState.equipment.ring1, gameState.equipment.ring2);
                } else {
                    const equippedItem = gameState.equipment[item.type];
                    elements.tooltipEl.innerHTML = createItemComparisonTooltipHTML(item, equippedItem);
                }
            }

            const rect = element.getBoundingClientRect();
            elements.tooltipEl.style.left = `${rect.right + 10}px`;
            elements.tooltipEl.style.top = `${rect.top}px`;
            elements.tooltipEl.classList.remove('hidden');
        };

        const onMouseOver = (event) => {
            if (!(event.target instanceof Element)) return;
            const wrapper = event.target.closest('.item-wrapper');
            if (!(wrapper instanceof HTMLElement)) return;
            const id = wrapper.dataset.id;
            if (!id) return;

            const item = [...gameState.inventory, ...Object.values(gameState.equipment)].find(i => i && String(i.id) === id);
            if(item) {
                showTooltip(item, wrapper);
            }
        };

        const onMouseOut = () => elements.tooltipEl.classList.add('hidden');

        elements.inventorySlotsEl.addEventListener('mouseover', onMouseOver);
        elements.inventorySlotsEl.addEventListener('mouseout', onMouseOut);
    
        const equipmentSlots = document.getElementById('equipment-paperdoll');
        equipmentSlots.addEventListener('mouseover', (event) => {
            if (!(event.target instanceof Element)) return;
            const slotEl = event.target.closest('.equipment-slot');
            if (!(slotEl instanceof HTMLElement)) return;
            const item = gameState.equipment[slotEl.id.replace('slot-','')];
            showTooltip(item, slotEl);
        });
        equipmentSlots.addEventListener('mouseout', onMouseOut);
        
        elements.forgeInventorySlotsEl.addEventListener('mouseover', onMouseOver);
        elements.forgeInventorySlotsEl.addEventListener('mouseout', onMouseOut);
        
        elements.prestigeInventorySlotsEl.addEventListener('mouseover', onMouseOver);
        elements.prestigeInventorySlotsEl.addEventListener('mouseout', onMouseOut);
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
                // Show base ranges on shift
                elements.tooltipEl.innerHTML = ui.createLootTableTooltipHTML(itemBase);
            } else {
                // Default to comparison
                if (itemBase.type === 'ring') {
                    elements.tooltipEl.innerHTML = ui.createLootComparisonTooltipHTML(itemBase, gameState.equipment.ring1, gameState.equipment.ring2);
                } else {
                    const equippedItem = gameState.equipment[itemBase.type];
                    elements.tooltipEl.innerHTML = ui.createLootComparisonTooltipHTML(itemBase, equippedItem);
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

    function createRaidPanel() {
        if (!socket) return;
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
        if (!socket || !raidBtn) {
            if(raidBtn) raidBtn.style.display = 'none';
            return;
        };

        raidBtn.addEventListener('click', () => {
            if (raidPanel) {
                destroyRaidPanel();
                socket.disconnect();
                socket.connect();
            } else {
                createRaidPanel();
            }
        });
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
            const maxSelections = 3 + playerStats.legacyKeeperBonus;
            elements.prestigeFullscreenPanel.querySelector('h2').textContent = `Choose Your Legacy (Select up to ${maxSelections} items)`;
            prestigeSelections = [];
            elements.prestigeFullscreenPanel.classList.remove('hidden');
            updateAll();
        });

        elements.prestigeBackButton.addEventListener('click', () => {
            prestigeSelections = [];
            elements.prestigeFullscreenPanel.classList.add('hidden');
        });

        elements.prestigeInventorySlotsEl.addEventListener('click', (event) => {
            if (!(event.target instanceof Element)) return;
            const wrapper = event.target.closest('.item-wrapper');
            if (!(wrapper instanceof HTMLElement)) return;
            const id = wrapper.dataset.id;
            if (!id) return;
            const item = [...Object.values(gameState.equipment), ...gameState.inventory].find(i => i && String(i.id) === id);
            if (!item) return;

            const selectionIndex = prestigeSelections.indexOf(item.id);
            const maxSelections = 3 + playerStats.legacyKeeperBonus;

            if (selectionIndex > -1) {
                prestigeSelections.splice(selectionIndex, 1);
            } else if (prestigeSelections.length < maxSelections) {
                prestigeSelections.push(item.id);
            }
            updateAll();
        });

        elements.confirmPrestigeButton.addEventListener('click', () => {
            const maxSelections = 3 + playerStats.legacyKeeperBonus;
            if (prestigeSelections.length > maxSelections) {
                alert(`You can only select up to ${maxSelections} items!`);
                return;
            }
            
            const allCurrentItems = [...Object.values(gameState.equipment).filter(i => i), ...gameState.inventory];
            const itemsToAbsorb = allCurrentItems.filter(item => prestigeSelections.includes(item.id));
            const newAbsorbedStats = {};
            const newAbsorbedSynergies = [];
            const newAbsorbedUniqueEffects = {};

            for (const item of itemsToAbsorb) {
                const combinedStats = getCombinedItemStats(item);
                for (const statKey in combinedStats) {
                    newAbsorbedStats[statKey] = (newAbsorbedStats[statKey] || 0) + combinedStats[statKey];
                }
                if (item.sockets) {
                    for (const gem of item.sockets) {
                        if (gem && gem.synergy) {
                            newAbsorbedSynergies.push(gem.synergy);
                        }
                    }
                }
                const itemBase = ITEMS[item.baseId];
                if (itemBase && itemBase.uniqueEffect) {
                    newAbsorbedUniqueEffects[itemBase.uniqueEffect] = (newAbsorbedUniqueEffects[itemBase.uniqueEffect] || 0) + 1;
                }
            }

            if (itemsToAbsorb.length > 0) {
                logMessage(elements.gameLogEl, `Absorbed stats from ${itemsToAbsorb.length} selected items!`, 'epic');
            } else {
                 logMessage(elements.gameLogEl, `No items were selected to absorb.`, 'uncommon');
            }

            const heroToPrestige = gameState.hero;
            const oldAbsorbedStats = gameState.absorbedStats || {};
            const finalAbsorbedStats = { ...oldAbsorbedStats };
            for(const statKey in newAbsorbedStats) {
                finalAbsorbedStats[statKey] = (finalAbsorbedStats[statKey] || 0) + newAbsorbedStats[statKey];
            }
            
            const oldAbsorbedSynergies = gameState.absorbedSynergies || [];
            const finalAbsorbedSynergies = [...oldAbsorbedSynergies];
            for (const newSynergy of newAbsorbedSynergies) {
                const existingSynergy = finalAbsorbedSynergies.find(s => s.source === newSynergy.source && s.target === newSynergy.target);
                if (existingSynergy) {
                    existingSynergy.value += newSynergy.value;
                } else {
                    finalAbsorbedSynergies.push({ ...newSynergy });
                }
            }

            const oldAbsorbedUniqueEffects = gameState.absorbedUniqueEffects || {};
            const finalAbsorbedUniqueEffects = { ...oldAbsorbedUniqueEffects };
             for (const [effectKey, count] of Object.entries(newAbsorbedUniqueEffects)) {
                finalAbsorbedUniqueEffects[effectKey] = (finalAbsorbedUniqueEffects[effectKey] || 0) + count;
            }
            
            const spentPoints = heroToPrestige.attributes.strength + heroToPrestige.attributes.agility + heroToPrestige.attributes.luck;
            const newTotalAttributePoints = heroToPrestige.attributePoints + spentPoints;

            const prestgedHeroState = {
                ...heroToPrestige, // Keep level and XP
                attributePoints: newTotalAttributePoints, // Refund all points
                attributes: { strength: 0, agility: 0, luck: 0 } // Reset attributes
            };

            const oldPrestigeCount = gameState.prestigeCount || 0;
            const currentPrestigeLevel = gameState.nextPrestigeLevel || 100;
            const baseState = getDefaultGameState();

            gameState = {
                ...baseState,
                permanentUpgrades: gameState.permanentUpgrades, // Keep permanent upgrades
                absorbedStats: finalAbsorbedStats,
                absorbedSynergies: finalAbsorbedSynergies,
                absorbedUniqueEffects: finalAbsorbedUniqueEffects,
                prestigeCount: oldPrestigeCount + 1,
                completedLevels: gameState.completedLevels,
                maxLevel: 1, 
                nextPrestigeLevel: currentPrestigeLevel + 100,
                hero: prestgedHeroState, // Use the new, reset hero state
                currentFightingLevel: 1,
                currentRunCompletedLevels: [], 
            };

            logMessage(elements.gameLogEl, `PRESTIGE! You are reborn with greater power. Your next goal is Level ${gameState.nextPrestigeLevel}.`, 'legendary');
            elements.prestigeFullscreenPanel.classList.add('hidden');
            prestigeSelections = [];
            recalculateStats();
            startNewMonster();
            updateAll();
            autoSave();
        });
    }
    
    function migrateInventoryToGrid(oldInventory) {
        console.log("Old save detected. Migrating inventory to grid format...");
        const newGridInventory = [];
        
        for (const item of oldInventory) {
            if (typeof item.x === 'number' && item.x >= 0) {
                newGridInventory.push(item);
                continue;
            }

            let baseItem = ITEMS[item.baseId];
            if (!baseItem) {
                 const baseName = item.name.split(' ').slice(1).join(' ');
                 const foundKey = Object.keys(ITEMS).find(key => ITEMS[key].name === baseName);
                 if (foundKey) {
                    baseItem = ITEMS[foundKey];
                    item.baseId = foundKey;
                 }
            }

            if(baseItem) {
                item.width = baseItem.width;
                item.height = baseItem.height;
            } else {
                console.warn("Could not find base item for", item, "during migration. Defaulting to 1x1.");
                item.width = 1;
                item.height = 1;
            }

            const spot = findEmptySpot(item.width, item.height, newGridInventory);
            if (spot) {
                item.x = spot.x;
                item.y = spot.y;
                newGridInventory.push(item);
            } else {
                console.error("Could not find a spot for item during migration:", item);
            }
        }
        
        return newGridInventory;
    }

    function main() {
        elements = ui.initDOMElements();
        
        const savedData = localStorage.getItem('idleRPGSaveData');
        if (savedData) {
            const loadedState = JSON.parse(savedData);
            const baseState = getDefaultGameState();
            
            // Convert old array-based unique effects to new object-based one for old saves
            let uniqueEffects = loadedState.absorbedUniqueEffects || {};
            if (Array.isArray(uniqueEffects)) {
                const newEffectsObject = {};
                for (const effectKey of uniqueEffects) {
                    newEffectsObject[effectKey] = (newEffectsObject[effectKey] || 0) + 1;
                }
                uniqueEffects = newEffectsObject;
            }
            
            gameState = { 
                ...baseState, 
                ...loadedState,
                gems: loadedState.gems || [],
                hero: { ...baseState.hero, ...(loadedState.hero || {}), attributes: { ...baseState.hero.attributes, ...(loadedState.hero?.attributes || {}) } }, 
                upgrades: { ...baseState.upgrades, ...(loadedState.upgrades || {}) }, 
                equipment: { ...baseState.equipment, ...(loadedState.equipment || {}) }, 
                absorbedStats: { ...(loadedState.absorbedStats || {}) }, 
                absorbedSynergies: loadedState.absorbedSynergies || [],
                absorbedUniqueEffects: uniqueEffects,
                monster: { ...baseState.monster, ...(loadedState.monster || {}) }, 
                presets: loadedState.presets || baseState.presets, 
                isAutoProgressing: loadedState.isAutoProgressing !== undefined ? loadedState.isAutoProgressing : true, 
                currentRealmIndex: loadedState.currentRealmIndex || 0,
                currentRunCompletedLevels: loadedState.currentRunCompletedLevels || [], 
                legacyItems: [],
                inventoryGridInitialized: loadedState.inventoryGridInitialized || false,
                permanentUpgrades: { ...baseState.permanentUpgrades, ...(loadedState.permanentUpgrades || {}) },
                specialEncounter: loadedState.specialEncounter || null,
            };
            
            if (!gameState.inventoryGridInitialized) {
                gameState.inventory = migrateInventoryToGrid(gameState.inventory);
                gameState.inventoryGridInitialized = true;
                logMessage(elements.gameLogEl, "Your inventory has been updated to the new grid system!", "uncommon");
                autoSave();
            }

            if (gameState.nextPrestigeLevel === undefined) {
                gameState.nextPrestigeLevel = 100;
            }

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