
import express from 'express'
import { isAdmin, isAuthenticated } from '../middleware/isAuthenticated.js'
import { addProduct, getAllProduct, deleteProduct, updateProduct } from '../controllers/productController.js'
import { multipleUpload } from '../middleware/multer.js'

const router = express.Router()

router.post('/add', multipleUpload, isAuthenticated, isAdmin, addProduct)
router.get('/getallproducts', getAllProduct)
router.delete('/delete/:productId', isAuthenticated, isAdmin, deleteProduct)
router.put('/update/:productId', multipleUpload, isAuthenticated, isAdmin, updateProduct)


export default router
