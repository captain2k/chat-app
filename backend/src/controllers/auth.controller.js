import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import cloudinary from '../lib/cloudinary.js'

export const signUp = async (req, res) => {
  try {
    const {fullName, email, password} = req.body

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields is required' })
    }

    if(password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    const user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    })

    if(newUser) {
      await newUser.save()
      generateToken(newUser._id, res)
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePicture: newUser.profilePicture
      })
    } else {
      res.status(400).json({ message: 'Failed to create user' })
    }

  } catch (error) {
    console.log('Error in signUp: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const logIn = async (req, res) => {
  const { email, password } = req.body

  if(!email || !password) return res.status(400).json({ message: 'All fields are required' })

  try {
    const user = await User.findOne({ email })
    
    if(!user || user.email !== email) return res.status(400).json({ message: 'Invalid email or password' })

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' })

    generateToken(user._id, res)
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture
    })

  } catch (error) {
      console.log('Error in logIn: ', error)
      res.status(500).json({ message: 'Internal server error' })
  }
}

export const logOut = async (_, res) => {
  res.cookie('jwt', '', {maxAge: 0})
  res.status(200).json({ message: 'Logged out successfully' })
}

export const updateProfile = async (req, res) => {
  const { profilePicture } = req.body

  if(!profilePicture) return res.status(400).json({ message: 'Profile picture is required' })

  try {
    const pictureUrl = await cloudinary.uploader.upload(profilePicture)
    const userId = req.user._id
    const user = await User.findByIdAndUpdate(userId, {profilePicture: pictureUrl.secure_url}, {new: true})

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture
    })
  } catch (error) {
    console.log('Error in updateProfile: ', error)
    res.status(500).json({ message: 'Failed to upload profile picture' })
  }
}