// --- START OF FILE sound_manager.js ---

const sounds = {
    monster_hit: new Audio('sounds/monster_hit.wav'),
    monster_defeat: new Audio('sounds/monster_defeat.wav'),
    crit_hit: new Audio('sounds/crit_hit.wav'),
    hunt_reward: new Audio('sounds/hunt_reward.wav'),
    unique_drop: new Audio('sounds/unique_drop.wav'),
    equip_armor: new Audio('sounds/equip_armor.wav'),
    equip_weapon: new Audio('sounds/equip_weapon.wav'),
    equip_jewelry: new Audio('sounds/equip_jewelry.wav'),
    salvage: new Audio('sounds/salvage.wav'),
    socket_gem: new Audio('sounds/socket_gem.wav'),
    gem_success: new Audio('sounds/gem_success.wav'),
    gem_fail: new Audio('sounds/gem_fail.wav'),
    permanent_upgrade_buy: new Audio('sounds/cha_ching.wav'),
    
};
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

// --- START MODIFICATION: Volume Settings Management ---
let volumeSettings = {
    master: 1.0,
    music: 0.3,
    sfx: 0.7,
    // Store previous non-zero volume for toggling mute
    _lastMaster: 1.0,
    _lastMusic: 0.3,
    _lastSfx: 0.7,
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
            // Ensure all keys are present and are numbers
            volumeSettings.master = typeof parsed.master === 'number' ? parsed.master : 1.0;
            volumeSettings.music = typeof parsed.music === 'number' ? parsed.music : 0.3;
            volumeSettings.sfx = typeof parsed.sfx === 'number' ? parsed.sfx : 0.7;
            volumeSettings._lastMaster = typeof parsed._lastMaster === 'number' && parsed._lastMaster > 0 ? parsed._lastMaster : 1.0;
            volumeSettings._lastMusic = typeof parsed._lastMusic === 'number' && parsed._lastMusic > 0 ? parsed._lastMusic : 0.3;
            volumeSettings._lastSfx = typeof parsed._lastSfx === 'number' && parsed._lastSfx > 0 ? parsed._lastSfx : 0.7;

        } catch (e) {
            console.error("Failed to parse volume settings, using defaults.", e);
        }
    }
}
// --- END MODIFICATION ---

/**
 * Initializes the sound manager. Loads mute preference and sets volumes.
 * Should be called once when the game starts.
 */
export function initSounds() {
    if (isInitialized) return;

    // Load volume settings from localStorage
    loadVolumeSettings();

    // Set all music tracks to loop
    for (const key in musicTracks) {
        musicTracks[key].loop = true;
    }
    
    // Create sound pools for high-frequency sounds
    for (const soundName in soundPool) {
        for (let i = 0; i < POOL_SIZE; i++) {
            const clone = sounds[soundName].cloneNode();
            soundPool[soundName].push(clone);
        }
    }

    isInitialized = true;
    console.log("Sound manager initialized. Volume settings:", volumeSettings);
}

/**
 * Plays a sound effect by its key name.
 * Handles the global mute state and allows for rapid re-playing of sounds.
 * @param {string} name The key of the sound to play (e.g., 'monster_hit').
 */
export function playSound(name) {
    if (!isInitialized) {
        return;
    }

    const masterSound = sounds[name];
    if (!masterSound) {
        console.warn(`Sound not found in 'sounds' object: ${name}`);
        return;
    }

    // --- START MODIFICATION: Calculate final volume ---
    const finalVolume = volumeSettings.master * volumeSettings.sfx;
    if (finalVolume <= 0) {
        return; // Don't play if volume is zero
    }
    // --- END MODIFICATION ---

    if (soundPool[name]) {
        const pool = soundPool[name];
        let index = poolIndexes[name];

        const soundToPlay = pool[index];
        soundToPlay.currentTime = 0;
        soundToPlay.volume = finalVolume; // Apply calculated volume
        soundToPlay.playbackRate = 1 + (Math.random() - 0.5) * 0.3;
        soundToPlay.play().catch(e => { if (e.name !== 'AbortError') console.error(e); });

        poolIndexes[name] = (index + 1) % POOL_SIZE;
    } else {
        const soundClone = masterSound.cloneNode();
        soundClone.volume = finalVolume; // Apply calculated volume
        soundClone.play().catch(e => { if (e.name !== 'AbortError') console.error(e); });
    }
}

/**
 * Stops any currently playing music track.
 */
function stopMusic() {
    if (currentMusicTrack) {
        currentMusicTrack.pause();
        currentMusicTrack.currentTime = 0;
        currentMusicTrack = null;
    }
}

/**
 * Sets the background music for a specific realm.
 * Handles stopping the old track and starting the new one.
 * @param {string | null} realmName The name of the realm, or null to stop music.
 */
export function setRealmMusic(realmName) {
    if (!isInitialized) return;

    stopMusic();
    currentTrackName = realmName;

    const finalVolume = volumeSettings.master * volumeSettings.music;
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

// --- START MODIFICATION: New Volume Control Functions ---

/**
 * Updates a specific volume category, saves it, and applies the change.
 * @param {'master'|'music'|'sfx'} category The category to update.
 * @param {number} value The new volume level (0.0 to 1.0).
 */
export function updateVolume(category, value) {
    if (volumeSettings.hasOwnProperty(category)) {
        volumeSettings[category] = value;
        // If we are adjusting a category, store this as the last non-zero volume for mute toggling
        if (value > 0) {
            if (category === 'master') volumeSettings._lastMaster = value;
            if (category === 'music') volumeSettings._lastMusic = value;
            if (category === 'sfx') volumeSettings._lastSfx = value;
        }
        
        saveVolumeSettings();
        
        // Apply the new volume to the currently playing music track
        if (category === 'master' || category === 'music') {
            if (currentMusicTrack) {
                const newMusicVolume = volumeSettings.master * volumeSettings.music;
                currentMusicTrack.volume = newMusicVolume;
                // If music was off and now it's on, try to play it
                if (newMusicVolume > 0 && currentMusicTrack.paused) {
                    setRealmMusic(currentTrackName);
                } else if (newMusicVolume <= 0 && !currentMusicTrack.paused) {
                    stopMusic();
                }
            } else if (volumeSettings.master * volumeSettings.music > 0) {
                // If music was off and we turn it up, start playing it
                setRealmMusic(currentTrackName);
            }
        }
    }
}

/**
 * Toggles a category between 0 and its last known non-zero volume.
 * @param {'master'|'music'|'sfx'} category The category to toggle.
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
    }
}

/**
 * Gets the current volume settings for the UI.
 * @returns {object} The volumeSettings object.
 */
export function getVolumeSettings() {
    return { ...volumeSettings };
}

// The old toggleMute and getMuteState are no longer needed and have been removed.
// --- END MODIFICATION ---