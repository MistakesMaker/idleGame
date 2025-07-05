import { ITEMS } from './data/items.js';
import { MONSTERS } from './data/monsters.js';
import { REALMS } from './data/realms.js';
import { STATS } from './data/stat_pools.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- STEP 1: Find the minimum drop level for every item ---
    const itemDropLevels = new Map();

    for (const monsterKey in MONSTERS) {
        const monster = MONSTERS[monsterKey];
        if (!monster.lootTable) continue;

        // Find all sub-zones where this monster appears
        const monsterLocations = [];
        for (const realm of REALMS) {
            for (const zoneId in realm.zones) {
                const zone = realm.zones[zoneId];
                for (const subZoneId in zone.subZones) {
                    const subZone = zone.subZones[subZoneId];
                    if (subZone.monsterPool.includes(monster)) {
                        monsterLocations.push(subZone);
                    }
                }
            }
        }
        if (monsterLocations.length === 0) continue;

        // The first level a monster can appear at is the minimum of its sub-zone start levels
        const firstMonsterLevel = Math.min(...monsterLocations.map(sz => sz.levelRange[0]));

        // For each item in its loot table, update its minimum drop level
        for (const loot of monster.lootTable) {
            const itemId = loot.item.id;
            const currentMinLevel = itemDropLevels.get(itemId) || Infinity;
            if (firstMonsterLevel < currentMinLevel) {
                itemDropLevels.set(itemId, firstMonsterLevel);
            }
        }
    }

    // --- STEP 2: Group all item data by slot and then by stat ---
    const groupedData = {};

    for (const itemId in ITEMS) {
        const item = ITEMS[itemId];
        const dropLevel = itemDropLevels.get(item.id);

        // Skip items that don't have a drop source (can't be plotted on a level graph)
        if (dropLevel === undefined) {
            console.warn(`Orphaned item: ${item.name} (ID: ${item.id}) has no drop source and will be excluded from graphs.`);
            continue;
        }

        const slotType = item.type;
        if (!groupedData[slotType]) {
            groupedData[slotType] = {};
        }

        for (const stat of item.possibleStats) {
            const statKey = stat.key;
            if (!groupedData[slotType][statKey]) {
                groupedData[slotType][statKey] = [];
            }
            
            // For the Y-axis, we'll plot the average of the min/max possible stat value
            const averageStatValue = (stat.min + stat.max) / 2;

            groupedData[slotType][statKey].push({
                x: dropLevel,
                y: averageStatValue,
                label: item.name, // For tooltips
            });
        }
    }

    // --- STEP 3: Create a chart for each group ---
    const chartContainer = document.getElementById('chart-container');
    const chartColors = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#f1c40f', '#1abc9c', '#e67e22'];
    let colorIndex = 0;

    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    for (const slotType in groupedData) {
        for (const statKey in groupedData[slotType]) {
            const dataPoints = groupedData[slotType][statKey];
            if (dataPoints.length < 2) continue; // Need at least two points to draw a line

            // Sort data by level for a coherent line graph
            dataPoints.sort((a, b) => a.x - b.x);

            const statInfo = Object.values(STATS).find(s => s.key === statKey) || { name: 'Unknown Stat' };
            const chartTitle = `${capitalize(slotType)} - ${statInfo.name} Progression`;

            // Create canvas for the chart
            const wrapper = document.createElement('div');
            wrapper.className = 'chart-wrapper';
            const canvas = document.createElement('canvas');
            wrapper.appendChild(canvas);
            chartContainer.appendChild(wrapper);

            const color = chartColors[colorIndex % chartColors.length];
            colorIndex++;
            
            // --- START OF THE DEFINITIVE FIX ---
            // Use a JSDoc type cast to inform TypeScript about the Chart object
            new (/** @type {any} */ (window)).Chart(canvas, {
            // --- END OF THE DEFINITIVE FIX ---
                type: 'line',
                data: {
                    datasets: [{
                        label: `${capitalize(slotType)} - ${statInfo.name}`,
                        data: dataPoints,
                        borderColor: color,
                        backgroundColor: color + '33', // Add alpha for fill
                        tension: 0.1,
                        fill: true,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        x: {
                            type: 'linear',
                            title: {
                                display: true,
                                text: 'Item First Drop Level',
                                color: '#ecf0f1',
                                font: { size: 14 }
                            },
                            ticks: { color: '#bdc3c7' }
                        },
                        y: {
                            type: 'logarithmic', // Log scale is best for stats that grow exponentially
                            title: {
                                display: true,
                                text: `${statInfo.name} (Avg Value)`,
                                color: '#ecf0f1',
                                font: { size: 14 }
                            },
                            ticks: { 
                                color: '#bdc3c7',
                                // Optional: format ticks for better readability on log scale
                                callback: function(value, index, values) {
                                    if (value >= 1000000) return (value / 1000000) + 'M';
                                    if (value >= 1000) return (value / 1000) + 'K';
                                    return value;
                                }
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: chartTitle,
                            color: '#f1c40f',
                            font: { size: 18 }
                        },
                        tooltip: {
                            callbacks: {
                                // Show the item name in the tooltip
                                title: function(context) {
                                    return context[0].raw.label;
                                },
                                label: function(context) {
                                    return `${context.dataset.label}: ${context.formattedValue}`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }
});