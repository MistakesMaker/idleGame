// --- START OF MODIFICATION: Categorize sounds ---
const sounds = {
    combat: {
        monster_hit: new Audio('sounds/monster_hit.wav'),
        crit_hit: new Audio('sounds/crit_hit.wav'),
        monster_defeat: new Audio('sounds/monster_defeat.wav'), // Moved here
    },
    ui: {
        equip_armor: new Audio('sounds/equip_armor.wav'),
        equip_weapon: new Audio('sounds/equip_weapon.wav'),
        equip_jewelry: new Audio('sounds/equip_jewelry.wav'),
        salvage: new Audio('sounds/salvage.wav'),
        socket_gem: new Audio('sounds/socket_gem.wav'),
        gem_success: new Audio('sounds/gem_success.wav'),
        gem_fail: new Audio('sounds/gem_fail.wav'),
        permanent_upgrade_buy: new Audio('sounds/cha_ching.wav'),
    },
    loot: {
        hunt_completed: new Audio('sounds/hunt_completed.wav'),
        hunt_reward: new Audio('sounds/hunt_reward.wav'),
        unique_drop: new Audio('sounds/unique_drop.wav'),
    }
};
// --- END OF MODIFICATION ---

const POOL_SIZE = 10; // Number of clones for high-frequency sounds
const soundPool = {
    monster_hit: [],
};
let poolIndexes = {
    monster_hit: 0,
};
const musicTracks = {
    'The Overworld': new Audio('sounds/music/overworld.mp3'),
    'The Underdark': new Audio('sounds/music/underdark.mp3'),
    'The Sunken World': new Audio('sounds/music/sunken_world.mp3'),
    'The Celestial Planes': new Audio('sounds/music/celestial_planes.mp3'),
    'The Aetherium Forge': new Audio('sounds/music/aetherium_forge.mp3'),
};

let currentMusicTrack = null;
let currentTrackName = null;
let isInitialized = false;

const GLOBAL_VOLUME_CEILING = 0.2;

let volumeSettings = {
    master: 0.5,
    music: 0.5,
    sfx: 0.15,
    sfx_combat: 1.0,
    sfx_ui: 0.8,
    sfx_loot: 1.0,
    _lastMaster: 0.5,
    _lastMusic: 0.5,
    _lastSfx: 0.15,
    _lastSfx_combat: 1.0,
    _lastSfx_ui: 0.8,
    _lastSfx_loot: 1.0,
};

/**
 * Saves the current volume settings to localStorage.
 */
function saveVolumeSettings() {
    localStorage.setItem('idleRPGVolumeSettings', JSON.stringify(volumeSettings));
}

/**
 * Loads volume settings from localStorage or uses defaults.
 */
function loadVolumeSettings() {
    const savedSettings = localStorage.getItem('idleRPGVolumeSettings');
    if (savedSettings) {
        try {
            const parsed = JSON.parse(savedSettings);
            const defaults = { ...volumeSettings }; 
            
            volumeSettings.master = typeof parsed.master === 'number' ? parsed.master : defaults.master;
            volumeSettings.music = typeof parsed.music === 'number' ? parsed.music : defaults.music;
            volumeSettings.sfx = typeof parsed.sfx === 'number' ? parsed.sfx : defaults.sfx;
            volumeSettings.sfx_combat = typeof parsed.sfx_combat === 'number' ? parsed.sfx_combat : defaults.sfx_combat;
            volumeSettings.sfx_ui = typeof parsed.sfx_ui === 'number' ? parsed.sfx_ui : defaults.sfx_ui;
            volumeSettings.sfx_loot = typeof parsed.sfx_loot === 'number' ? parsed.sfx_loot : defaults.sfx_loot;
            
            volumeSettings._lastMaster = typeof parsed._lastMaster === 'number' && parsed._lastMaster > 0 ? parsed._lastMaster : defaults._lastMaster;
            volumeSettings._lastMusic = typeof parsed._lastMusic === 'number' && parsed._lastMusic > 0 ? parsed._lastMusic : defaults._lastMusic;
            volumeSettings._lastSfx = typeof parsed._lastSfx === 'number' && parsed._lastSfx > 0 ? parsed._lastSfx : defaults._lastSfx;
            volumeSettings._lastSfx_combat = typeof parsed._lastSfx_combat === 'number' && parsed._lastSfx_combat > 0 ? parsed._lastSfx_combat : defaults._lastSfx_combat;
            volumeSettings._lastSfx_ui = typeof parsed._lastSfx_ui === 'number' && parsed._lastSfx_ui > 0 ? parsed._lastSfx_ui : defaults._lastSfx_ui;
            volumeSettings._lastSfx_loot = typeof parsed._lastSfx_loot === 'number' && parsed._lastSfx_loot > 0 ? parsed._lastSfx_loot : defaults._lastSfx_loot;

        } catch (e) {
            console.error("Failed to parse volume settings, using defaults.", e);
        }
    }
}


/**
 * Reloads volume settings from localStorage and applies them.
 * Useful after a full game state reset like Prestige.
 */
export function reloadVolumeSettings() {
    loadVolumeSettings();
    setRealmMusic(currentTrackName);
}

/**
 * Initializes the sound manager. Loads mute preference and sets volumes.
 * Should be called once when the game starts.
 */
export function initSounds() {
    if (isInitialized) return;

    loadVolumeSettings();

    for (const key in musicTracks) {
        musicTracks[key].loop = true;
    }
    
    for (const soundName in soundPool) {
        let masterSound = null;
        for (const category in sounds) {
            if (sounds[category][soundName]) {
                masterSound = sounds[category][soundName];
                break;
            }
        }
        if (masterSound) {
            for (let i = 0; i < POOL_SIZE; i++) {
                // --- FIX: Cast the cloned node to HTMLAudioElement ---
                const clone = /** @type {HTMLAudioElement} */ (masterSound.cloneNode());
                soundPool[soundName].push(clone);
            }
        } else {
            console.error(`Sound "${soundName}" for pooling not found in any category.`);
        }
    }

    isInitialized = true;
    console.log("Sound manager initialized. Volume settings:", volumeSettings);
}

/**
 * Finds a sound object and its category by name.
 * @param {string} name The key of the sound.
 * @returns {{sound: HTMLAudioElement, category: string}|null}
 */
function findSound(name) {
    for (const category in sounds) {
        if (sounds[category][name]) {
            return { sound: sounds[category][name], category };
        }
    }
    // --- Fallback check for monster_defeat which was missed in categorization ---
    if (name === 'monster_defeat') {
        const combatSound = sounds.combat[name];
        if (combatSound) return { sound: combatSound, category: 'combat' };
    }
    return null;
}


/**
 * Plays a sound effect by its key name.
 * Handles the global mute state and allows for rapid re-playing of sounds.
 * @param {string} name The key of the sound to play (e.g., 'monster_hit').
 */
export function playSound(name, volumeMultiplier = 1) { // <-- CHANGE THIS LINE
    if (!isInitialized) {
        return;
    }

    const soundData = findSound(name);
    if (!soundData) {
        console.warn(`Sound not found in any category: ${name}`);
        return;
    }

    const { sound: masterSound, category } = soundData;
    // --- START OF FIX ---
    // Use the nullish coalescing operator (??) to correctly handle 0 as a valid volume.
    const subCategoryVolume = volumeSettings[`sfx_${category}`] ?? 1.0;
    // --- END OF FIX ---

    const finalVolume = volumeSettings.master * volumeSettings.sfx * subCategoryVolume * volumeMultiplier * GLOBAL_VOLUME_CEILING;
    if (finalVolume <= 0) {
        return;
    }

    if (soundPool[name]) {
        const pool = soundPool[name];
        let index = poolIndexes[name];

        const soundToPlay = pool[index];
        soundToPlay.currentTime = 0;
        soundToPlay.volume = finalVolume;
        soundToPlay.playbackRate = 1 + (Math.random() - 0.5) * 0.3;
        soundToPlay.play().catch(e => { if (e.name !== 'AbortError') console.error(e); });

        poolIndexes[name] = (index + 1) % POOL_SIZE;
    } else {
        // --- FIX: Cast the cloned node to HTMLAudioElement ---
        const soundClone = /** @type {HTMLAudioElement} */ (masterSound.cloneNode());
        soundClone.volume = finalVolume;
        soundClone.play().catch(e => { if (e.name !== 'AbortError') console.error(e); });
    }
}


function stopMusic() {
    if (currentMusicTrack) {
        currentMusicTrack.pause();
        currentMusicTrack.currentTime = 0;
        currentMusicTrack = null;
    }
}


export function setRealmMusic(realmName) {
    if (!isInitialized) return;

    stopMusic();
    currentTrackName = realmName;

    const finalVolume = volumeSettings.master * volumeSettings.music * GLOBAL_VOLUME_CEILING;
    if (finalVolume <= 0 || !realmName) {
        return;
    }

    const newTrack = musicTracks[realmName];
    if (newTrack) {
        currentMusicTrack = newTrack;
        currentMusicTrack.volume = finalVolume;
        currentMusicTrack.play().catch(error => {
            if (error.name !== 'AbortError') {
                console.warn(`Could not play music for "${realmName}" yet. Waiting for user interaction.`);
            }
        });
    } else {
        console.warn(`No music track found for realm: ${realmName}`);
    }
}

/**
 * Updates a specific volume category, saves it, and applies the change.
 * @param {'master'|'music'|'sfx'|'sfx_combat'|'sfx_ui'|'sfx_loot'} category The category to update.
 * @param {number} value The new volume level (0.0 to 1.0).
 */
export function updateVolume(category, value) {
    if (volumeSettings.hasOwnProperty(category)) {
        volumeSettings[category] = value;
        if (value > 0) {
            if (category === 'master') volumeSettings._lastMaster = value;
            else if (category === 'music') volumeSettings._lastMusic = value;
            else if (category === 'sfx') volumeSettings._lastSfx = value;
            else if (category === 'sfx_combat') volumeSettings._lastSfx_combat = value;
            else if (category === 'sfx_ui') volumeSettings._lastSfx_ui = value;
            else if (category === 'sfx_loot') volumeSettings._lastSfx_loot = value;
        }
        
        saveVolumeSettings();
        
        if (category === 'master' || category === 'music') {
            if (currentMusicTrack) {
                const newMusicVolume = volumeSettings.master * volumeSettings.music * GLOBAL_VOLUME_CEILING;
                currentMusicTrack.volume = newMusicVolume;
                if (newMusicVolume > 0 && currentMusicTrack.paused) {
                    setRealmMusic(currentTrackName);
                } else if (newMusicVolume <= 0 && !currentMusicTrack.paused) {
                    stopMusic();
                }
            } else if (volumeSettings.master * volumeSettings.music > 0) {
                setRealmMusic(currentTrackName);
            }
        }
    }
}

/**
 * Toggles a category between 0 and its last known non-zero volume.
 * @param {'master'|'music'|'sfx'|'sfx_combat'|'sfx_ui'|'sfx_loot'} category The category to toggle.
 */
export function toggleCategoryMute(category) {
    if (category === 'master') {
        const newVolume = volumeSettings.master > 0 ? 0 : volumeSettings._lastMaster;
        updateVolume('master', newVolume);
    } else if (category === 'music') {
        const newVolume = volumeSettings.music > 0 ? 0 : volumeSettings._lastMusic;
        updateVolume('music', newVolume);
    } else if (category === 'sfx') {
        const newVolume = volumeSettings.sfx > 0 ? 0 : volumeSettings._lastSfx;
        updateVolume('sfx', newVolume);
    } else if (category === 'sfx_combat') {
        const newVolume = volumeSettings.sfx_combat > 0 ? 0 : volumeSettings._lastSfx_combat;
        updateVolume('sfx_combat', newVolume);
    } else if (category === 'sfx_ui') {
        const newVolume = volumeSettings.sfx_ui > 0 ? 0 : volumeSettings._lastSfx_ui;
        updateVolume('sfx_ui', newVolume);
    } else if (category === 'sfx_loot') {
        const newVolume = volumeSettings.sfx_loot > 0 ? 0 : volumeSettings._lastSfx_loot;
        updateVolume('sfx_loot', newVolume);
    }
}


/**
 * Gets the current volume settings for the UI.
 * @returns {object} The volumeSettings object.
 */
export function getVolumeSettings() {
    return { ...volumeSettings };
}