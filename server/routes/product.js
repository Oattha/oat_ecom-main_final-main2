const express = require('express')
const router = express.Router()
// Controllers
const { create,
    list,
    read,
    update,
    remove,
    listby,
    searchFilters,
    createImages,
    removeImage,
    getProductById
} = require('../controllers/product')
const { authCheck, adminCheck } = require('../middlewares/authCheck')
// @ENDPOINT http://localhost:5001/api/product
router.post('/product', create)
router.get('/products/:count', list)
router.get('/product/:id', read)
router.put('/product/:id', update)
router.delete('/product/:id', remove)
router.post('/productby', listby)
router.post('/search/filters', searchFilters)

router.post('/images', authCheck, adminCheck, createImages)
router.post('/removeimages', authCheck, adminCheck, removeImage)


router.get('/product/:id', getProductById); // เพิ่มเส้นทางดึงข้อมูลสินค้ารายตัว

module.exports = router