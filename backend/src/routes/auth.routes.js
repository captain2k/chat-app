import express from 'express'

const router = express.Router()

router.get("/login", (req, res) => {
    res.send("Router login is working")
})

router.get("/logout", (req, res) => {
    res.send("Router logout is working")
})

router.get("/signup", (req, res) => {
    res.send("Router signup is working")
})

export default router