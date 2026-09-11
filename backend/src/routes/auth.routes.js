import express from 'express'
import { signUp, logIn, logOut, updateProfile } from '../controllers/auth.controller.js'
import { protectRoute }  from '../middleware/auth.middleware.js'


const router = express.Router()

router.get('/test', (req, res) => {
    res.status(200).json({message: 'Test'})  
})

router.post("/signup", signUp)
router.post("/login", logIn)
router.post("/logout", logOut)

router.put("/update-profile", protectRoute, updateProfile)
router.get("/me", protectRoute, (req, res) => res.status(200).json(req.user))

export default router