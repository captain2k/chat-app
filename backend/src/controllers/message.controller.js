import Message from "../models/Message.js"
import User from "../models/User.js"

export const getAllContacts = async (req, res) => {
  try {
    const currentUserId = req.user._id
    
    const allUsers = await User.find({ _id: { $ne: currentUserId } }).select("-password")
    
    return res.status(200).json(allUsers)
  } catch (error) {
    console.log('Error in getAllContacts: ', error.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getMessagesById = async (req, res) => {
  try {
    const currentUserId = req.user._id
    const receiverId = req.params.id

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: receiverId },
        { senderId: receiverId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 })

    if (!messages) {
      return res.status(200).json([])
    }

    return res.status(200).json(messages)
  } catch (error) {
    console.log('Error in getMessagesById: ', error.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id

    const messagesByCurrentUser = await Message.find({
      $or: [
        { senderId: currentUserId },
        { receiverId: currentUserId },
      ],
    })

    const contactIdMessageWithCurrentID = messagesByCurrentUser.map(mes => {
      return mes.senderId.toString() === currentUserId.toString() ? 
                mes.receiverId.toString() : 
                mes.senderId.toString() 
    })

    const uniqueContactId = await User.find({
      _id: { $in: contactIdMessageWithCurrentID }
    }).select("-password")

    res.status(200).json(uniqueContactId)

  } catch (error) {
    console.log('Error in getConversations: ', error.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const {  message, image } = req.body
    const receiverId = req.params.id
    const senderId = req.user._id

    if (!message) {
      return res.status(400).json({ message: 'Message is required' })
    }

    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required' })
    }

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: 'Cannot send message to yourself' })
    }

    let imageUrl;

    if(image) {
      imageUrl = await cloudinary.uploader.upload(image)
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      image: imageUrl?.secure_url || ""
    })

    await newMessage.save()

    return res.status(201).json(newMessage)
  } catch (error) {
    console.log('Error in sendMessage: ', error.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
}