import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.route.js'

const app = express()
dotenv.config()

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT );
})
    