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
};

let isMuted = false;
let isInitialized = false;

/**
 * Initializes the sound manager. Loads mute preference and sets volumes.
 * Should be called once when the game starts.
 */
export function initSounds() {
    if (isInitialized) return;

    // Load mute preference from localStorage
    const savedMuteState = localStorage.getItem('idleRPG_isMuted');
    isMuted = savedMuteState === 'true';

    // Set volumes for better balancing
    sounds.monster_hit.volume = 0.4;
    sounds.crit_hit.volume = 0.6;
    sounds.monster_defeat.volume = 0.7;
    sounds.unique_drop.volume = 1.0;
    sounds.hunt_reward.volume = 1.0;
    sounds.gem_success.volume = 0.8;
    sounds.gem_fail.volume = 0.8;
    sounds.salvage.volume = 0.6;

    isInitialized = true;
    console.log("Sound manager initialized. Muted:", isMuted);
}

/**
 * Plays a sound effect by its key name.
 * Handles the global mute state and allows for rapid re-playing of sounds.
 * @param {string} name The key of the sound to play (e.g., 'monster_hit').
 */
export function playSound(name) {
    if (isMuted || !isInitialized) {
        return;
    }

    const sound = sounds[name];
    if (sound) {
        // By setting currentTime to 0, we can play the sound again even if it's already playing.
        // This is crucial for rapid-fire sounds like monster hits.
        sound.currentTime = 0;
        sound.play().catch(error => {
            // The play() request was interrupted or failed. This is common if the user
            // clicks very fast. We can safely ignore this specific error.
            if (error.name !== 'AbortError') {
                console.error(`Error playing sound "${name}":`, error);
            }
        });
    } else {
        console.warn(`Sound not found: ${name}`);
    }
}

/**
 * Toggles the global mute state for all sound effects and saves the preference.
 * @returns {boolean} The new mute state (true if muted, false otherwise).
 */
export function toggleMute() {
    if (!isInitialized) return;
    isMuted = !isMuted;
    localStorage.setItem('idleRPG_isMuted', isMuted);
    console.log("Sound muted:", isMuted);
    return isMuted;
}

/**
 * Gets the current mute state.
 * @returns {boolean} True if muted, false otherwise.
 */
export function getMuteState() {
    return isMuted;
}