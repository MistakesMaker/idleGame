// --- Server Setup ---
const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: "https://idlegame-oqyq.onrender.com"
}));

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "https://idlegame-oqyq.onrender.com",
    methods: ["GET", "POST"]
  }
});

// --- Serve Static Files ---
const publicPath = path.join(__dirname);
app.use(express.static(publicPath));
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// --- Raid Game State ---
const raidState = {
    boss: { name: "World-Eater Ogre", maxHp: 50000, currentHp: 50000 },
    players: {}, isActive: false,
};

// --- Real-time Raid Logic ---
io.on('connection', (socket) => {
    console.log('A user connected with ID:', socket.id);

    socket.onAny((eventName, ...args) => {
        console.log(`SERVER: CATCH-ALL: Received event '${eventName}' from ${socket.id} with data:`, args);
    });

    socket.on('joinRaid', (playerData) => {
        raidState.players[socket.id] = { id: playerData.id, dps: playerData.dps };
        socket.join('raid_room');
        socket.emit('raidUpdate', raidState);
    });

    socket.on('updatePlayerStats', (playerData) => {
        if (raidState.players[socket.id]) {
            raidState.players[socket.id].dps = playerData.dps;
        }
    });

    // --- NEW, MORE DETAILED ATTACK LISTENER ---
    socket.on('attackRaidBoss', (attackData) => {
        console.log(`SERVER: 'attackRaidBoss' listener was triggered for socket ${socket.id}.`);

        // Granular debugging checks
        const bossHasHp = raidState.currentHp > 0;
        const playerExists = raidState.players[socket.id] !== undefined;
        console.log(`SERVER: Checking conditions -> Boss HP > 0: ${bossHasHp}, Player Exists: ${playerExists}`);
        
        if (bossHasHp && playerExists) {
            // Check if the data is well-formed
            if (attackData && typeof attackData.damage === 'number') {
                raidState.currentHp -= attackData.damage;
                if (raidState.currentHp < 0) { raidState.currentHp = 0; }
                console.log(`SERVER: SUCCESS! Boss HP is now ${raidState.currentHp.toFixed(0)}`);
            } else {
                console.log(`SERVER: ERROR! Attack data is malformed. Data received:`, attackData);
            }
        } else {
            console.log(`SERVER: Attack ignored. One of the conditions failed.`);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete raidState.players[socket.id];
    });
});

// --- Server-side Game Loop ---
setInterval(() => {
    if (Object.keys(raidState.players).length > 0) {
        if (!raidState.isActive) { console.log("Raid is now active!"); raidState.isActive = true; }
        
        let totalDps = 0;
        // Small fix: ensure player and dps exist before adding
        for (const playerId in raidState.players) {
            if(raidState.players[playerId] && raidState.players[playerId].dps) {
                totalDps += raidState.players[playerId].dps;
            }
        }

        if (raidState.currentHp > 0) {
            raidState.currentHp -= totalDps;
            if (raidState.currentHp <= 0) {
                raidState.currentHp = 0;
                io.to('raid_room').emit('raidOver', { message: "The World-Eater Ogre has been defeated! Rewards are distributed!" });
                setTimeout(resetRaidBoss, 10000);
            }
        }
        io.to('raid_room').emit('raidUpdate', raidState);
    } else if (raidState.isActive) {
        console.log("All players left. Raid is now inactive.");
        raidState.isActive = false;
    }
}, 1000);

function resetRaidBoss() {
    console.log("Resetting raid boss...");
    raidState.boss.currentHp = raidState.boss.maxHp;
    io.to('raid_room').emit('raidUpdate', raidState);
}

// --- Start the Server ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});