import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protectRoute = async (req, res, next) => {
    const token = req.cookies.jwt
    if(!token) return res.status(401).json({message: 'Unauthorized - No token provided'})    

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET)
      if(!decode) return res.status(401).json({message: 'Unauthorized - Invalid token'})

      const user = await User.findById(decode.userId).select('-password')
      if(!user) return res.status(401).json({message: 'User not found'})

      req.user = user
      next()

    } catch (error) {
      console.log('Error in protectRoute: ', error)
      res.status(500).json({ message: 'Internal server error' })
    }
}