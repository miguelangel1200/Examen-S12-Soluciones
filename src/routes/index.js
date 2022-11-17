const { Router } = require('express');
const router = Router();

const Product = require('../models/Product');
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const fs = require('fs-extra');

router.get('/', async (req, res) => {
    const photos = await Product.find();
    //console.log(photos);
    res.render('images', {photos});
});

router.get('/images/add', async (req, res) => {
    const photos = await Product.find();
    res.render('image_form', {photos});
});

router.post('/images/add', async (req, res) => {
    // console.log(req.body);
    const { name, description, proveedor, sku, price } = req.body;
    // console.log(req.file);
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    // console.log(result);
    
    const newProduct = new Product({
        name: name,
        description: description,
        proveedor: proveedor,
        sku: sku,
        price: Number(price),
        imageURL: result.url,
        public_id: result.public_id
    });

    await newProduct.save();
    await fs.unlink(req.file.path);
    res.redirect('/');
});

router.get('/images/delete/:photo_id', async (req, res) => {
    const { photo_id }= req.params;
    const photo = await Product.findByIdAndDelete(photo_id);
    const result = await cloudinary.v2.uploader.destroy(photo.public_id);
    res.redirect('/images/add')
});

//Redireccionando a la página de actualizar
router.get('/images/update/:photo_id', async (req, res) => {
    const product = await Product.findById(req.params.photo_id)

    res.render('image_update', {product})
})

router.post('/images/update/:photo_id', async (req, res) => {
    const { photo_id }= req.params;
    // Parametros para actualizar
    const { name, description, proveedor, sku, price } = req.body;
    //Eliminar imagen
    const photo_up = await Product.findById(photo_id);
    const result = await cloudinary.v2.uploader.destroy(photo_up.public_id);
    
    //Subir nueva imagen
    const resultup = await cloudinary.v2.uploader.upload(req.file.path);
    //Buscar 
    const photo = await Product.findByIdAndUpdate(photo_id, {
        name: name,
        description: description,
        proveedor: proveedor,
        sku: sku,
        price: Number(price),
        imageURL: resultup.url,
        public_id: resultup.public_id
    }, {
        new: true
    });
    
    res.redirect('/images/add')
});

module.exports = router;