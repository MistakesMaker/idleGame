// --- Server Setup ---
import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';

const app = express();

app.use(cors({
    origin: "https://idlegame-oqyq.onrender.com"
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://idlegame-oqyq.onrender.com",
    methods: ["GET", "POST"]
  }
});

// --- Serve Static Files ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
        console.log(`${playerData.id} joining with ${playerData.dps.toFixed(1)} DPS.`);
        raidState.players[socket.id] = { id: playerData.id, dps: playerData.dps };
        socket.join('raid_room');
        socket.emit('raidUpdate', raidState);
    });

    socket.on('updatePlayerStats', (playerData) => {
        if (raidState.players[socket.id]) {
            raidState.players[socket.id].dps = playerData.dps;
        }
    });

    socket.on('attackRaidBoss', (attackData) => {
        if (raidState.boss.currentHp > 0 && raidState.players[socket.id] && attackData && typeof attackData.damage === 'number') {
            raidState.boss.currentHp -= attackData.damage;
            if (raidState.boss.currentHp < 0) { raidState.boss.currentHp = 0; }
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
        for (const playerId in raidState.players) {
            totalDps += raidState.players[playerId].dps || 0;
        }

        if (raidState.boss.currentHp > 0) {
            raidState.boss.currentHp -= totalDps;
            if (raidState.boss.currentHp <= 0) {
                raidState.boss.currentHp = 0;
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