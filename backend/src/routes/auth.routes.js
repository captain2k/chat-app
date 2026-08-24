import express from 'express'
import { signUp } from '../controllers/auth.controller.js'

const router = express.Router()

router.post("/signup", signUp)

router.get("/logout", (req, res) => {
    res.send("Router logout is working")
})

router.get("/signup", (req, res) => {
    res.send("Router signup is working")
})

export default router