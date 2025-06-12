document.addEventListener('DOMContentLoaded', () => {

    // --- GAME STATE AND CONFIGURATION ---
    let gameState = {};
    const itemTypes = ['sword', 'shield', 'helmet', 'necklace', 'platebody', 'platelegs', 'ring', 'belt'];
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const statPools = { sword: [{key: 'clickDamage', name: 'Click Dmg'}, {key: 'dps', name: 'DPS'}], shield: [{key: 'dps', name: 'DPS'}], helmet: [{key: 'goldGain', name: '% Gold Gain'}], necklace: [{key: 'goldGain', name: '% Gold Gain'}], platebody: [{key: 'dps', name: 'DPS'}], platelegs: [{key: 'dps', name: 'DPS'}], ring: [{key: 'clickDamage', name: 'Click Dmg'}, {key: 'goldGain', name: '% Gold Gain'}], belt: [{key: 'dps', name: 'DPS'}], };
    const monsterData = {
        "Slime":    { levels: [1,100], image: 'images/slime.png', dropTypes: ['ring', 'belt'], dropChance: 1.0 },
        "Goblin":   { levels: [1, 20], image: 'images/slime.png', dropTypes: ['sword', 'belt'], dropChance: 1.0 },
        "Bat":      { levels: [1, 20], image: 'images/slime.png', dropTypes: ['ring', 'necklace'], dropChance: 1.0 },
        "Skeleton": { levels: [21, 40], image: 'images/slime.png', dropTypes: ['shield', 'helmet'], dropChance: 1.5 },
        "Zombie":   { levels: [21, 40], image: 'images/slime.png', dropTypes: ['sword', 'platelegs'], dropChance: 1.5 },
        "Orc":      { levels: [41, 100],image: 'images/slime.png', dropTypes: ['sword', 'platebody'], dropChance: 2.0 },
        "Dungeon Guardian": { 
            levels: [10, 20, 30, 40, 50, 60, 70, 80, 90], image: 'images/boss.png',
            dropTypes: ['sword', 'shield', 'helmet', 'platebody', 'platelegs'], dropChance: 100 
        },
        "Archdemon Overlord": { 
            levels: [100], image: 'images/bigboss.png',
            dropTypes: ['sword', 'shield', 'helmet', 'platebody', 'platelegs', 'ring', 'necklace', 'belt'], dropChance: 100
        }
    };
    let currentMonster = { name: "Slime", data: monsterData["Slime"]};
    let playerStats = { baseClickDamage: 1, baseDps: 0, totalClickDamage: 1, totalDps: 0 };
    let salvageMode = { active: false, selections: [] };
    let prestigeSelections = [];
    let saveTimeout;
    
    // --- DOM ELEMENT REFERENCES ---
    let saveIndicatorEl, goldStatEl, scrapStatEl, upgradeClickCostEl, upgradeDpsCostEl, upgradeClickLevelEl, 
        upgradeDpsLevelEl, monsterNameEl, currentLevelEl, monsterHealthBarEl, monsterHealthTextEl, 
        inventorySlotsEl, gameLogEl, prestigeButton, prestigeSelectionEl, prestigeInventorySlotsEl, 
        monsterImageEl, popupContainerEl, levelLockCheckbox, levelSelectInput, tooltipEl, heroLevelEl, 
        heroXpBarEl, heroXpTextEl, attributePointsEl, attrStrengthEl, attrAgilityEl, attrLuckEl, 
        addStrengthBtn, addAgilityBtn, addLuckBtn, clickDamageStatEl, dpsStatEl, bonusGoldStatEl, 
        magicFindStatEl, lootMonsterNameEl, lootDropChanceEl, lootTableDisplayEl;

    // --- START OF RAID SECTION ---
    const socket = io('https://idlegame-oqyq.onrender.com'); // IMPORTANT: Use your server URL
    let raidPanel = null;
    let raidPlayerId = `Player_${Math.random().toString(36).substr(2, 5)}`;
    // --- END OF RAID SECTION ---
    // testiin
    // --- HELPER & UTILITY FUNCTIONS ---
    function logMessage(message, className = '') { 
        const p = document.createElement('p'); 
        p.innerHTML = message; 
        if (className) p.classList.add(className);
        gameLogEl.prepend(p); 
        if (gameLogEl.children.length > 20) { 
            gameLogEl.removeChild(gameLogEl.lastChild); 
        } 
    }
    function isBossLevel(level) { return level % 10 === 0; }
    function isBigBossLevel(level) { return level % 100 === 0; }
    
    // --- CORE GAME LOGIC ---
    function getDefaultGameState() {
        return {
            gold: 0, scrap: 0, upgrades: { clickDamage: 0, dps: 0 }, maxLevel: 1, currentFightingLevel: 1,
            isLevelLocked: false, monster: { hp: 10, maxHp: 10 },
            equipment: { sword: null, shield: null, helmet: null, necklace: null, platebody: null, platelegs: null, ring1: null, ring2: null, belt: null, },
            inventory: [], legacyItems: [],
            hero: {
                level: 1, xp: 0, attributePoints: 0,
                attributes: { strength: 0, agility: 0, luck: 0 }
            }
        };
    }
    
    function clickMonster() { if (gameState.monster.hp <= 0) return; gameState.monster.hp -= playerStats.totalClickDamage; monsterImageEl.classList.add('monster-hit'); setTimeout(() => monsterImageEl.classList.remove('monster-hit'), 200); showDamagePopup(playerStats.totalClickDamage); if (gameState.monster.hp <= 0) { monsterDefeated(); } updateUI(); }
    function gameLoop() { if (playerStats.totalDps > 0 && gameState.monster.hp > 0) { gameState.monster.hp -= playerStats.totalDps; if (gameState.monster.hp <= 0) { monsterDefeated(); } updateUI(); } }
    
    function monsterDefeated() { 
        let goldGained = Math.ceil(Math.pow(1.22, gameState.currentFightingLevel) * (1 + (playerStats.bonusGold / 100)));
        gameState.gold += goldGained;
        
        let xpGained = gameState.currentFightingLevel * 5;
        if (isBossLevel(gameState.currentFightingLevel)) { xpGained *= 5; }
        gainXP(xpGained);

        logMessage(`You defeated the monster and gained ${Math.floor(goldGained)} gold and ${xpGained} XP.`);
        showGoldPopup(goldGained); 
        
        const dropRoll = Math.random() * 100;
        if (dropRoll < currentMonster.data.dropChance) {
            dropLoot();
        }
        
        if (!gameState.isLevelLocked) { gameState.currentFightingLevel++; if (gameState.currentFightingLevel > gameState.maxLevel) { gameState.maxLevel = gameState.currentFightingLevel; } } 
        setTimeout(() => { generateMonster(); updateUI(); }, 300); 
    }
    
    function generateMonster() {
        const level = gameState.currentFightingLevel;
        let monsterName = "Slime";
        let monsterDef = monsterData.Slime;

        if (isBigBossLevel(level)) {
            monsterName = "Archdemon Overlord";
            monsterDef = monsterData[monsterName];
        } else if (isBossLevel(level)) {
            monsterName = "Dungeon Guardian";
            monsterDef = monsterData[monsterName];
        } else {
            const possibleMonsters = Object.keys(monsterData).filter(key => {
                const md = monsterData[key];
                return level >= md.levels[0] && level <= md.levels[1] && md.dropChance < 100;
            });
            if (possibleMonsters.length > 0) {
                monsterName = possibleMonsters[Math.floor(Math.random() * possibleMonsters.length)];
                monsterDef = monsterData[monsterName];
            }
        }
        currentMonster = { name: monsterName, data: monsterDef };

        let monsterHealth = Math.ceil(10 * Math.pow(1.32, level));
        if (isBigBossLevel(level)) { monsterHealth *= 10; } 
        else if (isBossLevel(level)) { monsterHealth *= 3; }

        monsterImageEl.src = currentMonster.data.image;
        gameState.monster.maxHp = monsterHealth;
        gameState.monster.hp = monsterHealth;
        monsterNameEl.textContent = monsterName;
    }
    
    function recalculateStats() {
        const hero = gameState.hero;
        playerStats.baseClickDamage = 1; 
        playerStats.baseDps = 0;
        
        const allItems = [...gameState.legacyItems, ...Object.values(gameState.equipment)]; 
        for(const item of allItems) { if(item) addStatsFromItem(item); }
        
        const clickUpgradeBonus = gameState.upgrades.clickDamage * 0.5;
        const dpsUpgradeBonus = gameState.upgrades.dps * 1;
        
        const strengthBonusClick = hero.attributes.strength * 0.5;
        const strengthBonusDpsPercent = hero.attributes.strength * 0.2;
        const agilityBonusDpsPercent = hero.attributes.agility * 0.3;
        playerStats.bonusGold = hero.attributes.luck * 0.5;
        playerStats.magicFind = hero.attributes.luck * 0.2;
        
        playerStats.totalClickDamage = playerStats.baseClickDamage + clickUpgradeBonus + strengthBonusClick;
        let finalDps = playerStats.baseDps + dpsUpgradeBonus;
        finalDps *= (1 + (strengthBonusDpsPercent + agilityBonusDpsPercent) / 100);
        playerStats.totalDps = finalDps;

        // --- RAID: Update server with new stats ---
        if (socket.connected) {
            socket.emit('updatePlayerStats', { dps: playerStats.totalDps });
        }
    }
    function addStatsFromItem(item) { for (const stat in item.stats) { const value = item.stats[stat]; if (stat === 'clickDamage') playerStats.baseClickDamage += value; if (stat === 'dps') playerStats.baseDps += value; } }
    
    function getXpForNextLevel(level) { return Math.floor(100 * Math.pow(level, 1.5)); }
    function gainXP(amount) {
        gameState.hero.xp += amount;
        let xpToNextLevel = getXpForNextLevel(gameState.hero.level);
        while (gameState.hero.xp >= xpToNextLevel) {
            gameState.hero.xp -= xpToNextLevel;
            gameState.hero.level++;
            gameState.hero.attributePoints += 5;
            logMessage(`Congratulations! You reached Level ${gameState.hero.level}!`, 'legendary');
            xpToNextLevel = getXpForNextLevel(gameState.hero.level);
        }
    }
    function spendAttributePoint(attribute) { if (gameState.hero.attributePoints > 0) { gameState.hero.attributePoints--; gameState.hero.attributes[attribute]++; recalculateStats(); updateUI(); } }

    function generateItem(rarity, itemLevel, forcedType) {
        const type = forcedType || itemTypes[Math.floor(Math.random() * itemTypes.length)];
        const rarityIndex = rarities.indexOf(rarity); const item = { id: Date.now() + Math.random(), name: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} ${type.charAt(0).toUpperCase() + type.slice(1)}`, type: type, rarity: rarity, stats: {}, locked: false }; const levelModifier = 1 + (itemLevel / 15); let statValue = (Math.random() * 2.5 + 1) * (rarityIndex + 1) * levelModifier; const possibleStats = statPools[type]; const statToAssign = possibleStats[Math.floor(Math.random() * possibleStats.length)]; if (statToAssign.key === 'dps' || statToAssign.key === 'clickDamage') { statValue *= 2; } item.stats[statToAssign.key] = parseFloat(statValue.toFixed(2)); item.name = `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} ${type.charAt(0).toUpperCase() + type.slice(1)} of ${statToAssign.name.replace('% ', '')}`; return item;
    }
    function dropLoot() {
        const dropTypes = currentMonster.data.dropTypes;
        const itemTypeToDrop = dropTypes[Math.floor(Math.random() * dropTypes.length)];
        
        let roll = Math.random() * 100; roll -= playerStats.magicFind;
        let rarity;
        if (isBigBossLevel(gameState.currentFightingLevel) && roll < 1) rarity = 'legendary'; else if (roll < 5) rarity = 'legendary'; else if (roll < 20) rarity = 'epic'; else if (roll < 50) rarity = 'rare'; else if (roll < 85) rarity = 'uncommon'; else rarity = 'common';
        
        const item = generateItem(rarity, gameState.currentFightingLevel, itemTypeToDrop);
        gameState.inventory.push(item);
        logMessage(`The boss dropped an item! <span class="${item.rarity}" style="font-weight:bold;">${item.name}</span>`);
    }
    
    function equipItem(inventoryIndex) { const item = gameState.inventory[inventoryIndex]; if (!item) return; let targetSlot = item.type; if (item.type === 'ring') { if (!gameState.equipment.ring1) targetSlot = 'ring1'; else if (!gameState.equipment.ring2) targetSlot = 'ring2'; else targetSlot = 'ring1'; } const currentEquipped = gameState.equipment[targetSlot]; if (currentEquipped) { gameState.inventory.push(currentEquipped); } gameState.equipment[targetSlot] = item; gameState.inventory.splice(inventoryIndex, 1); recalculateStats(); updateUI(); }
    function unequipItem(slotName) { const item = gameState.equipment[slotName]; if (!item) return; gameState.inventory.push(item); gameState.equipment[slotName] = null; recalculateStats(); updateUI(); }
    
    function getUpgradeCost(upgradeType) { const level = gameState.upgrades[upgradeType]; if (upgradeType === 'clickDamage') { return Math.floor(10 * Math.pow(1.15, level)); } if (upgradeType === 'dps') { return Math.floor(25 * Math.pow(1.18, level)); } }
    function buyUpgrade(upgradeType) { const cost = getUpgradeCost(upgradeType); if (gameState.gold >= cost) { gameState.gold -= cost; gameState.upgrades[upgradeType]++; recalculateStats(); updateUI(); logMessage(`Upgraded ${upgradeType} to level ${gameState.upgrades[upgradeType]}!`); } else { logMessage("Not enough gold!"); } }
    function buyLootCrate() { const cost = 50; if (gameState.scrap >= cost) { gameState.scrap -= cost; logMessage(`Bought a loot crate for ${cost} Scrap!`); const rarityRoll = Math.random() * (rarities.length - 1) + 1; const rarity = rarities[Math.floor(rarityRoll)]; const item = generateItem(rarity, gameState.currentFightingLevel); gameState.inventory.push(item); logMessage(`The crate contained: <span class="${item.rarity}" style="font-weight:bold;">${item.name}</span>`); updateUI(); } else { logMessage("Not enough Scrap!"); } }
    function toggleSalvageMode() { salvageMode.active = !salvageMode.active; const salvageBtn = document.getElementById('salvage-mode-btn'); const confirmBtn = document.getElementById('confirm-salvage-btn'); const selectAllBtn = document.getElementById('select-all-salvage-btn'); if (salvageMode.active) { salvageBtn.textContent = 'Cancel Salvage'; salvageBtn.classList.add('active'); confirmBtn.classList.remove('hidden'); selectAllBtn.classList.remove('hidden'); } else { salvageBtn.textContent = 'Select to Salvage'; salvageBtn.classList.remove('active'); confirmBtn.classList.add('hidden'); selectAllBtn.classList.add('hidden'); salvageMode.selections = []; } document.body.classList.toggle('salvage-mode-active', salvageMode.active); document.getElementById('salvage-count').textContent = '0'; updateUI(); }
    function selectItemForSalvage(item, index) { if (item.locked) { logMessage("This item is locked and cannot be salvaged.", 'rare'); return; } const selectionIndex = salvageMode.selections.indexOf(index); if (selectionIndex > -1) { salvageMode.selections.splice(selectionIndex, 1); } else { salvageMode.selections.push(index); } document.getElementById('salvage-count').textContent = salvageMode.selections.length; updateUI(); }
    function selectAllForSalvage() { salvageMode.selections = []; gameState.inventory.forEach((item, index) => { if (!item.locked) { salvageMode.selections.push(index); } }); document.getElementById('salvage-count').textContent = salvageMode.selections.length; updateUI(); }
    function handleInventoryClick(item, index) { if (salvageMode.active) { selectItemForSalvage(item, index); } else { equipItem(index); } }
    function salvageSelectedItems() { if (salvageMode.selections.length === 0) { logMessage("No items selected for salvage."); return; } let totalScrapGained = 0; const selectedCount = salvageMode.selections.length; salvageMode.selections.sort((a, b) => b - a); salvageMode.selections.forEach(index => { const item = gameState.inventory[index]; if (item) { const rarityIndex = rarities.indexOf(item.rarity); const scrapGained = Math.ceil(Math.pow(4, rarityIndex)); totalScrapGained += scrapGained; gameState.inventory.splice(index, 1); } }); gameState.scrap += totalScrapGained; logMessage(`Salvaged ${selectedCount} items for a total of ${totalScrapGained} Scrap.`, 'uncommon'); toggleSalvageMode(); }
    function toggleItemLock(inventoryIndex) { const item = gameState.inventory[inventoryIndex]; if (item) { item.locked = !item.locked; logMessage(`Item ${item.name} ${item.locked ? 'locked' : 'unlocked'}.`); } updateUI(); }
    
    function updateUI() {
        goldStatEl.textContent = Math.floor(gameState.gold);
        scrapStatEl.textContent = gameState.scrap;
        const xpToNextLevel = getXpForNextLevel(gameState.hero.level);
        heroLevelEl.textContent = gameState.hero.level;
        heroXpTextEl.textContent = `${Math.floor(gameState.hero.xp)} / ${xpToNextLevel}`;
        heroXpBarEl.style.width = `${(gameState.hero.xp / xpToNextLevel) * 100}%`;
        attributePointsEl.textContent = gameState.hero.attributePoints;
        attrStrengthEl.textContent = gameState.hero.attributes.strength;
        attrAgilityEl.textContent = gameState.hero.attributes.agility;
        attrLuckEl.textContent = gameState.hero.attributes.luck;
        const havePoints = gameState.hero.attributePoints > 0;
        addStrengthBtn.disabled = !havePoints; addAgilityBtn.disabled = !havePoints; addLuckBtn.disabled = !havePoints;
        clickDamageStatEl.textContent = playerStats.totalClickDamage.toFixed(1);
        dpsStatEl.textContent = playerStats.totalDps.toFixed(1);
        bonusGoldStatEl.textContent = playerStats.bonusGold.toFixed(1);
        magicFindStatEl.textContent = playerStats.magicFind.toFixed(1);
        currentLevelEl.textContent = gameState.currentFightingLevel; levelLockCheckbox.checked = gameState.isLevelLocked; levelSelectInput.max = gameState.maxLevel;
        monsterHealthTextEl.textContent = `${Math.ceil(Math.max(0, gameState.monster.hp))} / ${gameState.monster.maxHp}`;
        const healthPercent = (gameState.monster.hp / gameState.monster.maxHp) * 100; monsterHealthBarEl.style.width = `${healthPercent}%`;
        if (healthPercent < 30) monsterHealthBarEl.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)'; else if (healthPercent < 60) monsterHealthBarEl.style.background = 'linear-gradient(to right, #f39c12, #e67e22)'; else monsterHealthBarEl.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';
        const clickCost = getUpgradeCost('clickDamage'); const dpsCost = getUpgradeCost('dps');
        upgradeClickCostEl.textContent = clickCost; upgradeDpsCostEl.textContent = dpsCost;
        upgradeClickLevelEl.textContent = `Lvl ${gameState.upgrades.clickDamage}`; upgradeDpsLevelEl.textContent = `Lvl ${gameState.upgrades.dps}`;
        document.getElementById('upgrade-click-damage').classList.toggle('disabled', gameState.gold < clickCost);
        document.getElementById('upgrade-dps').classList.toggle('disabled', gameState.gold < dpsCost);
        document.getElementById('buy-loot-crate-btn').disabled = gameState.scrap < 50;
        inventorySlotsEl.innerHTML = '';
        if (gameState.inventory.length > 0) {
            gameState.inventory.forEach((item, index) => {
                const itemWrapper = document.createElement('div');
                itemWrapper.className = 'item-wrapper';
                itemWrapper.dataset.index = index;
                itemWrapper.innerHTML = createItemHTML(item, false);

                if (salvageMode.active && salvageMode.selections.includes(index)) {
                    const itemDiv = itemWrapper.querySelector('.item');
                    if (itemDiv) {
                        itemDiv.classList.add('selected-for-salvage');
                    }
                }

                inventorySlotsEl.appendChild(itemWrapper);
            });
        } else {
            inventorySlotsEl.innerHTML = `<p style="text-align:center; width:100%;">No items.</p>`;
        }
        for (const slotName in gameState.equipment) {
            const slotEl = document.getElementById(`slot-${slotName}`); const item = gameState.equipment[slotName]; slotEl.innerHTML = '';
            if (item) {
                const itemDiv = document.createElement('div'); itemDiv.innerHTML = createItemHTML(item, true); itemDiv.onclick = (e) => { e.stopPropagation(); unequipItem(slotName); }; slotEl.appendChild(itemDiv);
            } else {
                const placeholder = document.createElement('img'); placeholder.src = getItemIcon(slotName.replace(/\d/g, '')); placeholder.className = 'placeholder-icon'; slotEl.appendChild(placeholder);
            }
        }
        prestigeButton.disabled = gameState.maxLevel < 100;
        lootMonsterNameEl.textContent = currentMonster.name;
        lootDropChanceEl.textContent = `${currentMonster.data.dropChance}% ${currentMonster.data.dropChance === 100 ? '(Boss)' : ''}`;
        lootTableDisplayEl.innerHTML = '';
        currentMonster.data.dropTypes.forEach(type => {
            const icon = document.createElement('img');
            icon.src = getItemIcon(type);
            icon.title = type.charAt(0).toUpperCase() + type.slice(1);
            icon.className = 'loot-item-icon';
            lootTableDisplayEl.appendChild(icon);
        });
    }
    
    // --- THIS IS THE FIX ---
    function createItemHTML(item, isEquipped) {
        if (isEquipped) {
            // Removed the 'title' attribute to prevent ugly browser tooltips on the equipment screen.
            return `<img src="${getItemIcon(item.type)}" class="item-icon">`;
        }

        const lockHTML = `<i class="fas ${item.locked ? 'fa-lock' : 'fa-lock-open'} lock-icon"></i>`;
        
        let statsHTML = '<ul>';
        for (const stat in item.stats) {
            const statInfo = statPools[item.type].find(s => s.key === stat);
            const statName = statInfo ? statInfo.name : stat;
            statsHTML += `<li>+${item.stats[stat].toFixed(2)} ${statName}</li>`;
        }
        statsHTML += '</ul>';

        const lockedClass = item.locked ? 'locked-item' : '';

        return `<div class="item ${item.rarity} ${lockedClass}">
                    ${lockHTML}
                    <div class="item-header">
                        <span>${item.name}</span>
                    </div>
                    ${statsHTML}
                    <img src="${getItemIcon(item.type)}" class="item-bg-icon" alt="">
                </div>`;
    }
    // --- END OF FIX ---


    function getItemIcon(type) { const iconMap = { sword: 'images/icons/sword.png', shield: 'images/icons/shield.png', helmet: 'images/icons/helmet.png', necklace: 'images/icons/necklace.png', platebody: 'images/icons/platebody.png', platelegs: 'images/icons/platelegs.png', ring: 'images/icons/ring.png', belt: 'images/icons/belt.png' }; return iconMap[type] || 'images/icons/sword.png'; }
    function showDamagePopup(damage) { const popup = document.createElement('div'); popup.textContent = `-${Math.floor(damage)}`; popup.className = 'damage-popup'; popup.style.left = `${40 + Math.random() * 20}%`; popup.style.top = `${40 + Math.random() * 20}%`; popupContainerEl.appendChild(popup); setTimeout(() => popup.remove(), 1000); }
    function showGoldPopup(gold) { const popup = document.createElement('div'); popup.innerHTML = `+${Math.floor(gold)} <i class="fas fa-coins"></i>`; popup.className = 'gold-popup'; popup.style.left = `${40 + Math.random() * 20}%`; popup.style.top = `${50}%`; popupContainerEl.appendChild(popup); setTimeout(() => popup.remove(), 1500); }

    function toggleLevelLock() { gameState.isLevelLocked = levelLockCheckbox.checked; logMessage(`Level lock ${gameState.isLevelLocked ? 'enabled' : 'disabled'}.`); }
    function goToLevel() { const desiredLevel = parseInt(levelSelectInput.value, 10); if (isNaN(desiredLevel) || desiredLevel <= 0) { alert("Please enter a valid level > 0."); return; } if (desiredLevel > gameState.maxLevel) { alert(`Your max level is ${gameState.maxLevel}.`); levelSelectInput.value = gameState.maxLevel; return; } gameState.currentFightingLevel = desiredLevel; logMessage(`Traveling to level ${desiredLevel}...`); generateMonster(); updateUI(); }
    
    function setupTooltipListeners() {
        inventorySlotsEl.addEventListener('mouseover', (event) => {
            const itemWrapper = event.target.closest('.item-wrapper');
            if (!itemWrapper || !tooltipEl) return;
            const index = parseInt(itemWrapper.dataset.index, 10);
            const inventoryItem = gameState.inventory[index];
            if (!inventoryItem) return;
            let slotToCompare = inventoryItem.type;
            if (slotToCompare === 'ring') {
                if (gameState.equipment.ring1) { slotToCompare = 'ring1'; } else { slotToCompare = 'ring2'; }
            }
            const equippedItem = gameState.equipment[slotToCompare];
            const rect = itemWrapper.getBoundingClientRect();
            tooltipEl.style.left = `${rect.right + 10}px`;
            tooltipEl.style.top = `${rect.top}px`;
            tooltipEl.innerHTML = createTooltipHTML(inventoryItem, equippedItem);
            tooltipEl.classList.remove('hidden');
        });
        inventorySlotsEl.addEventListener('mouseout', (event) => { if (!inventorySlotsEl.contains(event.relatedTarget)) { if (tooltipEl) tooltipEl.classList.add('hidden'); } });
    }
    
    function createTooltipHTML(hoveredItem, equippedItem) {
        if (!equippedItem) {
            let statsHTML = '<ul>';
            for (const statKey in hoveredItem.stats) {
                const statInfo = statPools[hoveredItem.type]?.find(s => s.key === statKey);
                const statName = statInfo ? statInfo.name : statKey;
                statsHTML += `<li>+${hoveredItem.stats[statKey].toFixed(2)} ${statName}</li>`;
            }
            statsHTML += '</ul>';
            return `<div class="item-header"><span>${hoveredItem.name}</span></div>${statsHTML}`;
        }
        const allStatKeys = new Set([...Object.keys(hoveredItem.stats), ...Object.keys(equippedItem.stats)]);
        let statsHTML = '<ul>';
        allStatKeys.forEach(statKey => {
            const hoveredValue = hoveredItem.stats[statKey] || 0;
            const equippedValue = equippedItem.stats[statKey] || 0;
            const difference = hoveredValue - equippedValue;
            const statInfo = statPools[hoveredItem.type]?.find(s => s.key === statKey) || statPools[equippedItem.type]?.find(s => s.key === statKey);
            const statName = statInfo ? statInfo.name : statKey;
            let diffSpan = '';
            if (Math.abs(difference) > 0.001) { const diffClass = difference > 0 ? 'stat-better' : 'stat-worse'; const sign = difference > 0 ? '+' : ''; diffSpan = ` <span class="${diffClass}">(${sign}${difference.toFixed(2)})</span>`; }
            statsHTML += `<li>${statName}: ${hoveredValue.toFixed(2)}${diffSpan}</li>`;
        });
        statsHTML += '</ul>';
        return `<div class="item-header"><span>${hoveredItem.name}</span></div>${statsHTML}`;
    }

    function autoSave() { saveIndicatorEl.classList.add('visible'); if (saveTimeout) clearTimeout(saveTimeout); saveTimeout = setTimeout(() => { saveIndicatorEl.classList.remove('visible'); }, 2000); localStorage.setItem('idleRPGSaveData', JSON.stringify(gameState)); }
    function resetGame() { if (confirm("Are you sure? This will delete your save permanently.")) { localStorage.removeItem('idleRPGSaveData'); window.location.reload(); } }
    
    function initiatePrestige() { prestigeSelections = []; prestigeSelectionEl.classList.remove('hidden'); prestigeButton.classList.add('hidden'); const allItems = [...Object.values(gameState.equipment).filter(i => i), ...gameState.inventory]; prestigeInventorySlotsEl.innerHTML = ''; allItems.forEach(item => { const itemEl = document.createElement('div'); itemEl.innerHTML = createItemHTML(item, false); itemEl.onclick = () => { const itemCard = itemEl.querySelector('.item'); if (prestigeSelections.includes(item.id)) { prestigeSelections = prestigeSelections.filter(id => id !== item.id); itemCard.classList.remove('selected-for-prestige'); } else if (prestigeSelections.length < 3) { prestigeSelections.push(item.id); itemCard.classList.add('selected-for-prestige'); } }; prestigeInventorySlotsEl.appendChild(itemEl); }); }
    function confirmPrestige() {
        if (prestigeSelections.length > 3) { alert("You can only select up to 3 items!"); return; }
        const allItems = [...Object.values(gameState.equipment).filter(i => i), ...gameState.inventory];
        const itemsToKeep = allItems.filter(item => prestigeSelections.includes(item.id));
        const scrapToKeep = gameState.scrap;
        const oldLevel = gameState.maxLevel;
        const heroStatsToKeep = gameState.hero; 
        
        gameState = getDefaultGameState();
        gameState.legacyItems = itemsToKeep;
        gameState.scrap = scrapToKeep;
        gameState.hero = heroStatsToKeep;
        
        logMessage(`PRESTIGE! Restarted from Lvl ${oldLevel}, keeping hero stats, ${itemsToKeep.length} items and ${scrapToKeep} Scrap.`);
        prestigeSelectionEl.classList.add('hidden');
        prestigeButton.classList.remove('hidden');
        recalculateStats();
        updateUI();
        autoSave();
    }
    
    // --- START OF RAID FUNCTIONS ---
    function createRaidPanel() {
        if (document.getElementById('raid-panel')) return; // Panel already exists

        const raidContainer = document.getElementById('raid-container');
        raidContainer.innerHTML = `
            <div id="raid-panel">
                <div id="raid-boss-info">
                    <h2 id="raid-boss-name">Loading...</h2>
                    <div id="raid-boss-health-bar-container">
                        <div id="raid-boss-health-bar"></div>
                    </div>
                    <p id="raid-boss-health-text">0 / 0</p>
                </div>
                <div id="raid-main-content">
                    <div id="raid-attack-area">
                        <button id="raid-attack-button">ATTACK!</button>
                    </div>
                    <div id="raid-player-list">
                        <h3>Participants</h3>
                        <ul></ul>
                    </div>
                </div>
            </div>`;

        raidPanel = document.getElementById('raid-panel');
        document.getElementById('raid-attack-button').addEventListener('click', () => {
            socket.emit('attackRaidBoss', { damage: playerStats.totalClickDamage });
        });

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
        document.getElementById('raid-boss-name').textContent = boss.name;
        document.getElementById('raid-boss-health-text').textContent = `${Math.ceil(boss.currentHp)} / ${boss.maxHp}`;
        
        const healthPercent = (boss.currentHp / boss.maxHp) * 100;
        document.getElementById('raid-boss-health-bar').style.width = `${healthPercent}%`;

        const playerListEl = raidPanel.querySelector('#raid-player-list ul');
        playerListEl.innerHTML = '';
        Object.values(raidState.players).forEach(player => {
            const li = document.createElement('li');
            li.textContent = `${player.id} - ${player.dps.toFixed(1)} DPS`;
            playerListEl.appendChild(li);
        });
    }

    function setupRaidListeners() {
        socket.on('connect', () => {
            logMessage('Connected to Raid Server!', 'uncommon');
        });

        socket.on('disconnect', () => {
            logMessage('Disconnected from Raid Server.', 'rare');
            destroyRaidPanel();
        });

        socket.on('raidUpdate', (raidState) => {
            updateRaidUI(raidState);
        });

        socket.on('raidOver', (data) => {
            logMessage(`RAID OVER: ${data.message}`, 'legendary');
            // Give a reward
            const scrapReward = 500;
            gameState.scrap += scrapReward;
            logMessage(`You received ${scrapReward} Scrap for participating!`, 'epic');
            updateUI();
            destroyRaidPanel();
        });
    }
    // --- END OF RAID FUNCTIONS ---
    
    function setupEventListeners() {
        document.getElementById('go-to-level-btn').addEventListener('click', goToLevel);
        levelLockCheckbox.addEventListener('change', toggleLevelLock);
        monsterImageEl.addEventListener('click', clickMonster);
        document.getElementById('buy-loot-crate-btn').addEventListener('click', buyLootCrate);
        document.getElementById('salvage-mode-btn').addEventListener('click', toggleSalvageMode);
        document.getElementById('select-all-salvage-btn').addEventListener('click', selectAllForSalvage);
        document.getElementById('confirm-salvage-btn').addEventListener('click', salvageSelectedItems);
        document.getElementById('reset-game-btn').addEventListener('click', resetGame);
        
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
        
        addStrengthBtn.addEventListener('click', () => spendAttributePoint('strength'));
        addAgilityBtn.addEventListener('click', () => spendAttributePoint('agility'));
        addLuckBtn.addEventListener('click', () => spendAttributePoint('luck'));

        document.getElementById('upgrade-click-damage').addEventListener('click', () => buyUpgrade('clickDamage'));
        document.getElementById('upgrade-dps').addEventListener('click', () => buyUpgrade('dps'));
        prestigeButton.addEventListener('click', initiatePrestige);
        document.getElementById('confirm-prestige-btn').addEventListener('click', confirmPrestige);
        
        document.querySelectorAll('.tabs').forEach(tabContainer => {
            const tabs = tabContainer.querySelectorAll('.tab-button');
            const parentPanel = tabContainer.parentElement;
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    parentPanel.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
                    const viewId = `${tab.textContent.toLowerCase()}-view`;
                    if (document.getElementById(viewId)) {
                        document.getElementById(viewId).classList.add('active');
                    }
                });
            });
        });
        
        inventorySlotsEl.addEventListener('click', (event) => {
            const wrapper = event.target.closest('.item-wrapper');
            if (!wrapper) return;
            const index = parseInt(wrapper.dataset.index, 10);
            const item = gameState.inventory[index];
            if (event.target.classList.contains('lock-icon')) {
                toggleItemLock(index);
            } else {
                handleInventoryClick(item, index);
            }
        });
        
        setupTooltipListeners();
    }
    
    // --- MAIN INITIALIZATION FUNCTION ---
    function main() {
        // --- Assign DOM elements to variables ---
        saveIndicatorEl = document.getElementById('save-indicator');
        goldStatEl = document.getElementById('gold-stat');
        scrapStatEl = document.getElementById('scrap-stat');
        upgradeClickCostEl = document.getElementById('upgrade-click-cost');
        upgradeDpsCostEl = document.getElementById('upgrade-dps-cost');
        upgradeClickLevelEl = document.getElementById('upgrade-click-level');
        upgradeDpsLevelEl = document.getElementById('upgrade-dps-level');
        monsterNameEl = document.getElementById('monster-name');
        currentLevelEl = document.getElementById('current-level');
        monsterHealthBarEl = document.getElementById('monster-health-bar');
        monsterHealthTextEl = document.getElementById('monster-health-text');
        inventorySlotsEl = document.getElementById('inventory-slots');
        gameLogEl = document.getElementById('game-log');
        prestigeButton = document.getElementById('prestige-button');
        prestigeSelectionEl = document.getElementById('prestige-selection');
        prestigeInventorySlotsEl = document.getElementById('prestige-inventory-slots');
        monsterImageEl = document.getElementById('monster-image');
        popupContainerEl = document.getElementById('popup-container');
        levelLockCheckbox = document.getElementById('level-lock-checkbox');
        levelSelectInput = document.getElementById('level-select-input');
        tooltipEl = document.getElementById('item-tooltip');
        heroLevelEl = document.getElementById('hero-level');
        heroXpBarEl = document.getElementById('hero-xp-bar');
        heroXpTextEl = document.getElementById('hero-xp-text');
        attributePointsEl = document.getElementById('attribute-points');
        attrStrengthEl = document.getElementById('attr-strength');
        attrAgilityEl = document.getElementById('attr-agility');
        attrLuckEl = document.getElementById('attr-luck');
        addStrengthBtn = document.getElementById('add-strength-btn');
        addAgilityBtn = document.getElementById('add-agility-btn');
        addLuckBtn = document.getElementById('add-luck-btn');
        clickDamageStatEl = document.getElementById('click-damage-stat');
        dpsStatEl = document.getElementById('dps-stat');
        bonusGoldStatEl = document.getElementById('bonus-gold-stat');
        magicFindStatEl = document.getElementById('magic-find-stat');
        lootMonsterNameEl = document.getElementById('loot-monster-name');
        lootDropChanceEl = document.getElementById('loot-drop-chance');
        lootTableDisplayEl = document.getElementById('loot-table-display');

        // Load game state from localStorage
        const savedData = localStorage.getItem('idleRPGSaveData');
        if (savedData) {
            const loadedState = JSON.parse(savedData);
            let baseState = getDefaultGameState();
            gameState = {...baseState, ...loadedState};
            gameState.hero = { ...baseState.hero, ...(loadedState.hero || {}) };
            gameState.hero.attributes = { ...baseState.hero.attributes, ...(loadedState.hero?.attributes || {}) };
            gameState.upgrades = {...baseState.upgrades, ...loadedState.upgrades};
            gameState.equipment = {...baseState.equipment, ...loadedState.equipment};
            if (gameState.level) { gameState.maxLevel = gameState.level; gameState.currentFightingLevel = gameState.level; delete gameState.level; }
        } else {
            gameState = getDefaultGameState();
        }
        
        // Now that elements are referenced and state is loaded, run setup.
        setupEventListeners();
        recalculateStats();
        generateMonster();
        
        // Log messages and render the UI for the first time.
        if (!savedData) {
             logMessage("Welcome! Your progress will be saved automatically.");
        } else {
            logMessage("Saved game loaded!");
        }
        updateUI();

        // --- RAID: Initialize raid listeners ---
        setupRaidListeners();
        
        // Start the game loops
        setInterval(autoSave, 30000);
        setInterval(gameLoop, 1000);
    }
    
    // --- START THE GAME ---
    main();
});
//moromoroo