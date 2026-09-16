import express from 'express'
import { getAllContacts, getMessagesById, getConversations, sendMessage } from '../controllers/message.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()
router.use(protectRoute)

router.get('/all-contacts', getAllContacts)
router.get('/conversations', getConversations)
router.get('/:id', getMessagesById)
router.post('/send/:id', sendMessage)

export default router