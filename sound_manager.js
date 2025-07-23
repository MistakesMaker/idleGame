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

const musicTracks = {
    'The Overworld': new Audio('sounds/music/overworld.mp3'),
    'The Underdark': new Audio('sounds/music/underdark.mp3'),
    'The Sunken World': new Audio('sounds/music/sunken_world.mp3'),
    'The Celestial Planes': new Audio('sounds/music/celestial_planes.mp3'),
    'The Aetherium Forge': new Audio('sounds/music/aetherium_forge.mp3'),
};

let currentMusicTrack = null;
let currentTrackName = null;
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

    // Set all music tracks to loop
    for (const key in musicTracks) {
        musicTracks[key].loop = true;
        musicTracks[key].volume = 0.3; // Set a default volume for music
    }

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
// AFTER
export function playSound(name) {
    if (isMuted || !isInitialized) {
        return;
    }

    const masterSound = sounds[name];
    if (masterSound) {
        // Create a clone of the audio element. This allows for overlapping sounds.
        const soundClone = masterSound.cloneNode();
        soundClone.volume = masterSound.volume; // Ensure the clone has the same volume
        
        soundClone.play().catch(error => {
            // The play() request was interrupted or failed.
            if (error.name !== 'AbortError') {
                console.error(`Error playing sound "${name}":`, error);
            }
        });
    } else {
        console.warn(`Sound not found: ${name}`);
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
    currentTrackName = realmName; // Always remember what should be playing

    if (isMuted || !realmName) {
        return; // Don't play if muted or if realm is null
    }

    const newTrack = musicTracks[realmName];
    if (newTrack) {
        currentMusicTrack = newTrack;
        // Play is asynchronous and might be interrupted by the browser
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
 * Toggles the global mute state for all sound effects and saves the preference.
 * @returns {boolean} The new mute state (true if muted, false otherwise).
 */
export function toggleMute() {
    if (!isInitialized) return;
    isMuted = !isMuted;
    localStorage.setItem('idleRPG_isMuted', String(isMuted));
    console.log("Sound muted:", isMuted);

    if (isMuted) {
        stopMusic();
    } else {
        // If we are unmuting, start playing the correct track for the current realm
        setRealmMusic(currentTrackName);
    }

    return isMuted;
}

/**
 * Gets the current mute state.
 * @returns {boolean} True if muted, false otherwise.
 */
export function getMuteState() {
    return isMuted;
}