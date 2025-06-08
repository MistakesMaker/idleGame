// A single object to hold the entire state of our game
let gameState = {};
function getDefaultGameState() { return { gold: 0, scrap: 0, upgrades: { clickDamage: 0, dps: 0 }, maxLevel: 1, currentFightingLevel: 1, isLevelLocked: false, monster: { hp: 10, maxHp: 10 }, equipment: { sword: null, shield: null, helmet: null, necklace: null, platebody: null, platelegs: null, ring1: null, ring2: null, belt: null, }, inventory: [], legacyItems: [], }; }

// --- GLOBAL GAME STATE & FLAGS ---
let playerStats = { baseClickDamage: 1, baseDps: 0, totalClickDamage: 1, totalDps: 0 };
let isSalvageModeActive = false;
let socket;
let isRaidPanelVisible = false;

// --- DOM ELEMENT REFERENCES ---
const saveIndicatorEl = document.getElementById('save-indicator');
const goldStatEl = document.getElementById('gold-stat');
const clickDamageStatEl = document.getElementById('click-damage-stat');
const dpsStatEl = document.getElementById('dps-stat');
const scrapStatEl = document.getElementById('scrap-stat');
const upgradeClickCostEl = document.getElementById('upgrade-click-cost');
const upgradeDpsCostEl = document.getElementById('upgrade-dps-cost');
const upgradeClickLevelEl = document.getElementById('upgrade-click-level');
const upgradeDpsLevelEl = document.getElementById('upgrade-dps-level');
const monsterNameEl = document.getElementById('monster-name');
const currentLevelEl = document.getElementById('current-level');
const monsterHealthBarEl = document.getElementById('monster-health-bar');
const monsterHealthTextEl = document.getElementById('monster-health-text');
const inventorySlotsEl = document.getElementById('inventory-slots');
const gameLogEl = document.getElementById('game-log');
const prestigeButton = document.getElementById('prestige-button');
const prestigeSelectionEl = document.getElementById('prestige-selection');
const prestigeInventorySlotsEl = document.getElementById('prestige-inventory-slots');
const monsterImageEl = document.getElementById('monster-image');
const popupContainerEl = document.getElementById('popup-container');
const levelLockCheckbox = document.getElementById('level-lock-checkbox');
const levelSelectInput = document.getElementById('level-select-input');

// --- ITEM DEFINITIONS ---
const itemTypes = ['sword', 'shield', 'helmet', 'necklace', 'platebody', 'platelegs', 'ring', 'belt'];
const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const statPools = {
    sword: [{key: 'clickDamage', name: 'Click Dmg'}, {key: 'dps', name: 'DPS'}], shield: [{key: 'dps', name: 'DPS'}],
    helmet: [{key: 'goldGain', name: '% Gold Gain'}], necklace: [{key: 'goldGain', name: '% Gold Gain'}],
    platebody: [{key: 'dps', name: 'DPS'}], platelegs: [{key: 'dps', name: 'DPS'}],
    ring: [{key: 'clickDamage', name: 'Click Dmg'}, {key: 'goldGain', name: '% Gold Gain'}], belt: [{key: 'dps', name: 'DPS'}],
};

// --- CORE GAME & UI LOGIC ---
function clickMonster() { if (gameState.monster.hp <= 0) return; gameState.monster.hp -= playerStats.totalClickDamage; monsterImageEl.classList.add('monster-hit'); setTimeout(() => monsterImageEl.classList.remove('monster-hit'), 200); showDamagePopup(playerStats.totalClickDamage); if (gameState.monster.hp <= 0) { monsterDefeated(); } updateUI(); }
function gameLoop() { if (playerStats.totalDps > 0 && gameState.monster.hp > 0) { gameState.monster.hp -= playerStats.totalDps; if (gameState.monster.hp <= 0) { monsterDefeated(); } updateUI(); } }
function recalculateStats() {
    playerStats.baseClickDamage = 1; playerStats.baseDps = 0;
    const allItems = [...gameState.legacyItems, ...Object.values(gameState.equipment)];
    for(const item of allItems) { if(item) addStatsFromItem(item); }
    const clickUpgradeBonus = gameState.upgrades.clickDamage * 0.5;
    const dpsUpgradeBonus = gameState.upgrades.dps * 1;
    playerStats.totalClickDamage = playerStats.baseClickDamage + clickUpgradeBonus;
    playerStats.totalDps = playerStats.baseDps + dpsUpgradeBonus;
    if (socket && socket.connected) { socket.emit('updatePlayerStats', { dps: playerStats.totalDps }); }
}
function addStatsFromItem(item) { for (const stat in item.stats) { const value = item.stats[stat]; if (stat === 'clickDamage') playerStats.baseClickDamage += value; if (stat === 'dps') playerStats.baseDps += value; } }

// --- UPGRADE & SALVAGE LOGIC ---
function getUpgradeCost(upgradeType) { const level = gameState.upgrades[upgradeType]; if (upgradeType === 'clickDamage') { return Math.floor(10 * Math.pow(1.15, level)); } if (upgradeType === 'dps') { return Math.floor(25 * Math.pow(1.18, level)); } }
function buyUpgrade(upgradeType) { const cost = getUpgradeCost(upgradeType); if (gameState.gold >= cost) { gameState.gold -= cost; gameState.upgrades[upgradeType]++; recalculateStats(); updateUI(); logMessage(`Upgraded ${upgradeType} to level ${gameState.upgrades[upgradeType]}!`); } else { logMessage("Not enough gold!"); } }
function toggleSalvageMode() { isSalvageModeActive = !isSalvageModeActive; document.body.classList.toggle('salvage-mode-active', isSalvageModeActive); const btn = document.getElementById('salvage-mode-btn'); btn.classList.toggle('active', isSalvageModeActive); btn.textContent = isSalvageModeActive ? "Salvage Mode ON (Click Item)" : "Enter Salvage Mode"; }
function handleInventoryClick(item, index) { if (isSalvageModeActive) { salvageItem(index); } else { equipItem(index); } }
function salvageItem(inventoryIndex) { const item = gameState.inventory[inventoryIndex]; if (!item) return; const rarityIndex = rarities.indexOf(item.rarity); const scrapGained = Math.ceil(Math.pow(4, rarityIndex)); gameState.scrap += scrapGained; logMessage(`Salvaged ${item.name} for ${scrapGained} Scrap.`, item.rarity); gameState.inventory.splice(inventoryIndex, 1); toggleSalvageMode(); updateUI(); }
function buyLootCrate() { const cost = 50; if (gameState.scrap >= cost) { gameState.scrap -= cost; logMessage(`Bought a loot crate for ${cost} Scrap!`); const rarityRoll = Math.random() * (rarities.length - 1) + 1; const rarity = rarities[Math.floor(rarityRoll)]; const item = generateItem(rarity); gameState.inventory.push(item); logMessage(`The crate contained: <span class="${item.rarity}" style="font-weight:bold;">${item.name}</span>`); updateUI(); } else { logMessage("Not enough Scrap!"); } }

// --- UI UPDATING ---
function updateUI() {
    goldStatEl.textContent = Math.floor(gameState.gold); scrapStatEl.textContent = gameState.scrap; clickDamageStatEl.textContent = playerStats.totalClickDamage.toFixed(1); dpsStatEl.textContent = playerStats.totalDps.toFixed(1);
    const clickCost = getUpgradeCost('clickDamage'); const dpsCost = getUpgradeCost('dps');
    upgradeClickCostEl.textContent = clickCost; upgradeDpsCostEl.textContent = dpsCost;
    upgradeClickLevelEl.textContent = `Lvl ${gameState.upgrades.clickDamage}`; upgradeDpsLevelEl.textContent = `Lvl ${gameState.upgrades.dps}`;
    document.getElementById('upgrade-click-damage').classList.toggle('disabled', gameState.gold < clickCost); document.getElementById('upgrade-dps').classList.toggle('disabled', gameState.gold < dpsCost); document.getElementById('buy-loot-crate-btn').disabled = gameState.scrap < 50;
    inventorySlotsEl.innerHTML = ''; if (gameState.inventory.length === 0) { inventorySlotsEl.innerHTML = `<p style="text-align:center; width:100%;">No items.</p>`; } else { gameState.inventory.forEach((item, index) => { const itemEl = document.createElement('div'); itemEl.innerHTML = createItemHTML(item, false); itemEl.onclick = () => handleInventoryClick(item, index); inventorySlotsEl.appendChild(itemEl); }); }
    currentLevelEl.textContent = gameState.currentFightingLevel; levelLockCheckbox.checked = gameState.isLevelLocked; levelSelectInput.max = gameState.maxLevel;
    monsterHealthTextEl.textContent = `${Math.ceil(Math.max(0, gameState.monster.hp))} / ${gameState.monster.maxHp}`;
    const healthPercent = (gameState.monster.hp / gameState.monster.maxHp) * 100; monsterHealthBarEl.style.width = `${healthPercent}%`;
    if (healthPercent < 30) monsterHealthBarEl.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)'; else if (healthPercent < 60) monsterHealthBarEl.style.background = 'linear-gradient(to right, #f39c12, #e67e22)'; else monsterHealthBarEl.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';
    for (const slotName in gameState.equipment) {
        const slotEl = document.getElementById(`slot-${slotName}`); const item = gameState.equipment[slotName]; slotEl.innerHTML = '';
        if (item) { const itemDiv = document.createElement('div'); itemDiv.innerHTML = createItemHTML(item, true); itemDiv.onclick = (e) => { e.stopPropagation(); unequipItem(slotName); }; slotEl.appendChild(itemDiv); } else { const placeholder = document.createElement('img'); placeholder.src = getItemIcon(slotName.replace(/\d/g, '')); placeholder.className = 'placeholder-icon'; slotEl.appendChild(placeholder); }
    }
    prestigeButton.disabled = gameState.maxLevel < 100;
}

// --- AUTOSAVE SYSTEM ---
let saveTimeout;
function autoSave() { localStorage.setItem('idleRPGSaveData', JSON.stringify(gameState)); saveIndicatorEl.classList.add('visible'); if (saveTimeout) clearTimeout(saveTimeout); saveTimeout = setTimeout(() => { saveIndicatorEl.classList.remove('visible'); }, 2000); }

// --- PRESTIGE AND RESET ---
function confirmPrestige() { if (prestigeSelections.length > 3) { alert("You can only select up to 3 items!"); return; } const allItems = [...Object.values(gameState.equipment).filter(i => i), ...gameState.inventory]; const itemsToKeep = allItems.filter(item => prestigeSelections.includes(item.id)); const scrapToKeep = gameState.scrap; const oldLevel = gameState.maxLevel; gameState = getDefaultGameState(); gameState.legacyItems = itemsToKeep; gameState.scrap = scrapToKeep; logMessage(`PRESTIGE! Restarted from Lvl ${oldLevel}, keeping ${itemsToKeep.length} items and ${scrapToKeep} Scrap.`); prestigeSelectionEl.classList.add('hidden'); prestigeButton.classList.remove('hidden'); recalculateStats(); updateUI(); autoSave(); }
function resetGame() { if (confirm("Are you sure? This will delete your save permanently.")) { localStorage.removeItem('idleRPGSaveData'); if (socket && socket.connected) { socket.disconnect(); } window.location.reload(); } }

// --- INITIALIZATION ---
function initializeGame() {
    const savedData = localStorage.getItem('idleRPGSaveData');
    if (savedData) {
        const loadedState = JSON.parse(savedData);
        let baseState = getDefaultGameState();
        gameState = {...baseState, ...loadedState};
        gameState.upgrades = {...baseState.upgrades, ...loadedState.upgrades};
        gameState.equipment = {...baseState.equipment, ...loadedState.equipment};
        if (gameState.level) { gameState.maxLevel = gameState.level; gameState.currentFightingLevel = gameState.level; delete gameState.level; }
        logMessage("Saved game loaded!");
    } else {
        gameState = getDefaultGameState();
        logMessage("Welcome! Your progress will be saved automatically.");
    }
    setupTabs(); generateMonster(); recalculateStats(); updateUI();
    monsterImageEl.onclick = clickMonster;
    setInterval(autoSave, 30000);
    window.addEventListener('beforeunload', autoSave);
}

// --- RAID FEATURE LOGIC ---
function toggleRaidPanel() {
    const raidContainer = document.getElementById('raid-container');
    if (isRaidPanelVisible) {
        raidContainer.innerHTML = '';
        if (socket) socket.disconnect();
    } else {
        raidContainer.innerHTML = `<div id="raid-panel"><div id="raid-boss-info"><h2 id="raid-boss-name">Loading...</h2><div id="raid-boss-health-bar-container"><div id="raid-boss-health-bar" style="width: 100%;"></div></div><p id="raid-boss-health-text">? / ?</p></div><div id="raid-main-content"><div id="raid-attack-area"><button id="raid-attack-button" onclick="attackRaidBoss()">ATTACK</button></div><div id="raid-player-list"><h3>Participants</h3><ul id="raid-players-ul"></ul></div></div></div>`;
        setupRaidSocket();
    }
    isRaidPanelVisible = !isRaidPanelVisible;
}
function setupRaidSocket() {
    socket = io("https://idlegame-oqyq-server.onrender.com"); // <-- IMPORTANT: USE YOUR SERVER URL
    socket.on('connect', () => { console.log('Connected to raid server!', socket.id); socket.emit('joinRaid', { id: `Player_${Math.floor(Math.random() * 1000)}`, dps: playerStats.totalDps }); });
    socket.on('raidUpdate', (raidState) => { updateRaidUI(raidState); });
    socket.on('raidOver', (data) => { alert(data.message); const attackBtn = document.getElementById('raid-attack-button'); if(attackBtn) attackBtn.disabled = true; });
    socket.on('connect_error', () => { setTimeout(() => { if(!socket.connected) { logMessage("Raid server offline."); const raidPanel = document.getElementById('raid-panel'); if(raidPanel) raidPanel.innerHTML = "<h2>Raid Server Offline</h2>"; } }, 2000); });
}
function updateRaidUI(raidState) {
    const nameEl = document.getElementById('raid-boss-name'); const healthTextEl = document.getElementById('raid-boss-health-text'); const healthBarEl = document.getElementById('raid-boss-health-bar'); const playersUl = document.getElementById('raid-players-ul');
    if (nameEl) nameEl.textContent = raidState.boss.name; if (healthTextEl) healthTextEl.textContent = `${Math.ceil(raidState.boss.currentHp)} / ${raidState.boss.maxHp}`;
    if (healthBarEl) { const percent = (raidState.boss.currentHp / raidState.boss.maxHp) * 100; healthBarEl.style.width = `${percent}%`; }
    if (playersUl) { playersUl.innerHTML = ''; for (const playerId in raidState.players) { const player = raidState.players[playerId]; const li = document.createElement('li'); li.textContent = `${player.id} (DPS: ${player.dps.toFixed(1)})`; playersUl.appendChild(li); } }
}

// THIS IS THE FUNCTION WE ARE DEBUGGING
function attackRaidBoss() {
    if (socket) {
        // Confirm that the click is registered by the client
        console.log(`CLIENT: Attempting to attack with ${playerStats.totalClickDamage} damage.`);
        socket.emit('attackRaidBoss', { damage: playerStats.totalClickDamage });
    }
}

// --- ALL OTHER UNCHANGED FUNCTIONS ---
function setupTabs() { const tabs = document.querySelectorAll('.tab-button'); const views = document.querySelectorAll('.view'); tabs.forEach(tab => { tab.addEventListener('click', () => { tabs.forEach(t => t.classList.remove('active')); views.forEach(v => v.classList.remove('active')); tab.classList.add('active'); if (tab.textContent === 'Equipment') { document.getElementById('equipment-view').classList.add('active'); } else { document.getElementById('inventory-view').classList.add('active'); } }); }); }
function monsterDefeated() { let goldGained = Math.ceil(Math.pow(1.2, gameState.currentFightingLevel)); gameState.gold += goldGained; logMessage(`You defeated the monster and gained ${goldGained} gold.`); showGoldPopup(goldGained); if (isBossLevel(gameState.currentFightingLevel)) { dropLoot(); } if (!gameState.isLevelLocked) { gameState.currentFightingLevel++; if (gameState.currentFightingLevel > gameState.maxLevel) { gameState.maxLevel = gameState.currentFightingLevel; } } setTimeout(() => { generateMonster(); updateUI(); }, 300); }
function generateMonster() { const level = gameState.currentFightingLevel; const isBoss = isBossLevel(level); const isBigBoss = isBigBossLevel(level); let monsterHealth = Math.ceil(10 * Math.pow(1.45, level)); let monsterName = "Slime"; let monsterImage = "images/slime.png"; if (isBigBoss) { monsterHealth *= 10; monsterName = "Archdemon Overlord"; monsterImage = "images/bigboss.png"; } else if (isBoss) { monsterHealth *= 3; monsterName = "Dungeon Guardian"; monsterImage = "images/boss.png"; } else { const names = ["Goblin", "Bat", "Skeleton", "Zombie", "Orc"]; monsterName = names[Math.floor(Math.random() * names.length)]; } monsterImageEl.src = monsterImage; gameState.monster.maxHp = monsterHealth; gameState.monster.hp = monsterHealth; monsterNameEl.textContent = monsterName; }
function toggleLevelLock() { gameState.isLevelLocked = levelLockCheckbox.checked; logMessage(`Level lock ${gameState.isLevelLocked ? 'enabled' : 'disabled'}.`); }
function goToLevel() { const desiredLevel = parseInt(levelSelectInput.value, 10); if (isNaN(desiredLevel) || desiredLevel <= 0) { alert("Please enter a valid level > 0."); return; } if (desiredLevel > gameState.maxLevel) { alert(`Your max level is ${gameState.maxLevel}.`); levelSelectInput.value = gameState.maxLevel; return; } gameState.currentFightingLevel = desiredLevel; logMessage(`Traveling to level ${desiredLevel}...`); generateMonster(); updateUI(); }
function dropLoot() { const isBigBoss = isBigBossLevel(gameState.currentFightingLevel); let roll = Math.random(); let rarity; if (isBigBoss && roll < 0.1) rarity = 'legendary'; else if (roll < 0.05) rarity = 'legendary'; else if (roll < 0.20) rarity = 'epic'; else if (roll < 0.50) rarity = 'rare'; else if (roll < 0.85) rarity = 'uncommon'; else rarity = 'common'; const item = generateItem(rarity); gameState.inventory.push(item); logMessage(`The boss dropped an item! <span class="${item.rarity}" style="font-weight:bold;">${item.name}</span>`); updateUI(); }
function generateItem(rarity) { const type = itemTypes[Math.floor(Math.random() * itemTypes.length)]; const rarityIndex = rarities.indexOf(rarity); const item = { id: Date.now() + Math.random(), name: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} ${type.charAt(0).toUpperCase() + type.slice(1)}`, type: type, rarity: rarity, stats: {} }; const possibleStats = statPools[type]; const statToAssign = possibleStats[Math.floor(Math.random() * possibleStats.length)]; let statValue = (Math.random() * 5 + 1) * (rarityIndex + 1); if (statToAssign.key === 'dps' || statToAssign.key === 'clickDamage') { statValue *= 2; } item.stats[statToAssign.key] = parseFloat(statValue.toFixed(2)); item.name = `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} ${type.charAt(0).toUpperCase() + type.slice(1)} of ${statToAssign.name.replace('% ', '')}`; return item; }
function logMessage(message) { const p = document.createElement('p'); p.innerHTML = message; gameLogEl.prepend(p); if (gameLogEl.children.length > 20) { gameLogEl.removeChild(gameLogEl.lastChild); } }
function showDamagePopup(damage) { const popup = document.createElement('div'); popup.textContent = `-${Math.floor(damage)}`; popup.className = 'damage-popup'; popup.style.left = `${40 + Math.random() * 20}%`; popup.style.top = `${40 + Math.random() * 20}%`; popupContainerEl.appendChild(popup); setTimeout(() => popup.remove(), 1000); }
function showGoldPopup(gold) { const popup = document.createElement('div'); popup.innerHTML = `+${gold} <i class="fas fa-coins"></i>`; popup.className = 'gold-popup'; popup.style.left = `${40 + Math.random() * 20}%`; popup.style.top = `${50}%`; popupContainerEl.appendChild(popup); setTimeout(() => popup.remove(), 1500); }
function equipItem(inventoryIndex) { const item = gameState.inventory[inventoryIndex]; if (!item) return; let targetSlot = item.type; if (item.type === 'ring') { if (!gameState.equipment.ring1) targetSlot = 'ring1'; else if (!gameState.equipment.ring2) targetSlot = 'ring2'; else targetSlot = 'ring1'; } const currentEquipped = gameState.equipment[targetSlot]; if (currentEquipped) { gameState.inventory.push(currentEquipped); } gameState.equipment[targetSlot] = item; gameState.inventory.splice(inventoryIndex, 1); recalculateStats(); updateUI(); }
function unequipItem(slotName) { const item = gameState.equipment[slotName]; if (!item) return; gameState.inventory.push(item); gameState.equipment[slotName] = null; recalculateStats(); updateUI(); }
function createItemHTML(item, isEquipped) { if (isEquipped) { return `<img src="${getItemIcon(item.type)}" class="item-icon" title="${item.name} - Click to Unequip">`; } let statsHTML = '<ul>'; for (const stat in item.stats) { const statInfo = statPools[item.type].find(s => s.key === stat); const statName = statInfo ? statInfo.name : stat; statsHTML += `<li>+${item.stats[stat]} ${statName}</li>`; } statsHTML += '</ul>'; return `<div class="item ${item.rarity}"><div class="item-header"><span>${item.name}</span><img src="${getItemIcon(item.type)}" alt="${item.type}"></div>${statsHTML}</div>`; }
function getItemIcon(type) { const iconMap = { sword: 'images/icons/sword.png', shield: 'images/icons/shield.png', helmet: 'images/icons/helmet.png', necklace: 'images/icons/necklace.png', platebody: 'images/icons/platebody.png', platelegs: 'images/icons/platelegs.png', ring: 'images/icons/ring.png', belt: 'images/icons/belt.png' }; return iconMap[type] || 'images/icons/sword.png'; }
let prestigeSelections = []; function initiatePrestige() { prestigeSelections = []; prestigeSelectionEl.classList.remove('hidden'); prestigeButton.classList.add('hidden'); const allItems = [...Object.values(gameState.equipment).filter(i => i), ...gameState.inventory]; prestigeInventorySlotsEl.innerHTML = ''; allItems.forEach(item => { const itemEl = document.createElement('div'); itemEl.innerHTML = createItemHTML(item, false); itemEl.onclick = () => { const itemCard = itemEl.querySelector('.item'); if (prestigeSelections.includes(item.id)) { prestigeSelections = prestigeSelections.filter(id => id !== item.id); itemCard.classList.remove('selected-for-prestige'); } else if (prestigeSelections.length < 3) { prestigeSelections.push(item.id); itemCard.classList.add('selected-for-prestige'); } }; prestigeInventorySlotsEl.appendChild(itemEl); }); }
function isBossLevel(level) { return level % 10 === 0; }
function isBigBossLevel(level) { return level % 100 === 0; }

// Fire up the game!
initializeGame();
setInterval(gameLoop, 1000);