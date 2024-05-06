import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import Chat from './models/Chat.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:5173' } });
const PORT = process.env.PORT || 8800;

import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js'

connectDB();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use('/api', authRoutes);
app.use('/api', listingRoutes);
app.use('/api', orderRoutes);
app.use('/api', userRoutes);

io.on('connection', (socket) => {
    console.log('A user connected!');

    socket.on('join_chat_room', (orderId) => {
        socket.join(orderId);
        console.log(`User ${socket.id} joined room for order ${orderId}`);
    });

    socket.on('send_chat_message', async ({ message, orderId, sender }) => {
        const newMessage = new Chat({
            message,
            sender,
            orderId,
        });

        try {
            await newMessage.save();
            console.log('Message saved successfully!');
            io.to(orderId).emit('receive_chat_message', {
                message,
                sender,
            });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected!');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on PORT => ${PORT}`);
});
