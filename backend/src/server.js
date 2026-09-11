import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.route.js'
import path from 'path'
import { connectDB } from './lib/db.js'
import limiter from './lib/rateLimit.js'

const app = express()
dotenv.config()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use(limiter)

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    
    app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "..", "frontend", "dist", "index.html"));
    })
}


app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT );
    connectDB();
})
    