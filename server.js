// --- Server Setup ---
const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const cors = require('cors'); // Import the cors package

const app = express();

// Use the cors middleware for all incoming Express requests.
app.use(cors({
    origin: "https://idlegame-oqyq.onrender.com" // Your static site's URL
}));

const server = http.createServer(app);

// Configure Socket.IO with the same CORS options.
const io = socketIo(server, {
  cors: {
    origin: "https://idlegame-oqyq.onrender.com", // Your static site's URL
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

    socket.on('joinRaid', (playerData) => {
        console.log(`${playerData.id} is joining raid with ${playerData.dps.toFixed(1)} DPS.`);
        raidState.players[socket.id] = { id: playerData.id, dps: playerData.dps };
        socket.join('raid_room');
        socket.emit('raidUpdate', raidState);
    });

    socket.on('updatePlayerStats', (playerData) => {
        if (raidState.players[socket.id]) {
            raidState.players[socket.id].dps = playerData.dps;
        }
    });

    // THIS IS THE LISTENER WE ARE DEBUGGING
    socket.on('attackRaidBoss', (attackData) => {
        // Confirm that the server received the message
        console.log(`SERVER: Received 'attackRaidBoss' from ${socket.id} with data:`, attackData);

        if (raidState.currentHp > 0 && raidState.players[socket.id]) {
            raidState.currentHp -= attackData.damage;
            if (raidState.currentHp <= 0) { raidState.currentHp = 0; }
            
            // Confirm that the health was reduced
            console.log(`SERVER: Boss HP is now ${raidState.currentHp}`);
        } else {
            // Log if the attack was ignored for some reason
            console.log(`SERVER: Attack from ${socket.id} was ignored (boss already defeated or player not in raid).`);
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
        for (const playerId in raidState.players) { totalDps += raidState.players[playerId].dps; }
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