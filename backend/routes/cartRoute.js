import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { getCart, addToCart, updateQuantity, removeFromCart } from '../controllers/cartController.js'

const router = express.Router()

router.get('/',  isAuthenticated, getCart)
router.post('/add', isAuthenticated, addToCart)
router.post('/update', isAuthenticated,updateQuantity)
router.delete('/remove', isAuthenticated, removeFromCart)


export default router