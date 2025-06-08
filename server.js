// --- Server Setup ---
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// This tells our server to serve all the files from our main project folder
app.use(express.static(__dirname));

// --- Raid Game State ---
const raidState = {
    boss: {
        name: "World-Eater Ogre",
        maxHp: 50000,
        currentHp: 50000,
    },
    players: {},
    isActive: false,
};

// --- Real-time Raid Logic ---
io.on('connection', (socket) => {
    console.log('A user connected with ID:', socket.id);

    socket.on('joinRaid', (playerData) => {
        console.log(`${playerData.id} is joining the raid with ${playerData.dps} DPS.`);
        raidState.players[socket.id] = {
            id: playerData.id,
            dps: playerData.dps
        };
        socket.join('raid_room');
        socket.emit('raidUpdate', raidState);
    });

    socket.on('attackRaidBoss', (attackData) => {
        if (raidState.currentHp > 0 && raidState.players[socket.id]) {
            raidState.currentHp -= attackData.damage;
            if (raidState.currentHp <= 0) {
                raidState.currentHp = 0;
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete raidState.players[socket.id];
    });
});

// --- Server-side Game Loop for the Raid ---
setInterval(() => {
    if (Object.keys(raidState.players).length > 0) {
        raidState.isActive = true;
        let totalDps = 0;
        for (const playerId in raidState.players) {
            totalDps += raidState.players[playerId].dps;
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

    } else {
        raidState.isActive = false;
    }
}, 1000);

function resetRaidBoss() {
    console.log("Resetting raid boss...");
    raidState.boss.currentHp = raidState.boss.maxHp;
}

// --- Start the Server ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});