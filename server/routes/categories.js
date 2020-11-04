const express = require('express');
const { update } = require('../models/Category');
const Category = require('../models/Category');
const Post = require('../models/Category');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({
      length: categories.length,
      categories
    });
  } catch (err) {
    res.json({
      message: err
    })
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const categories = await Category.findById(id);
    res.json(categories);
  } catch (err) {
    res.status(404).json({
      message: 'Category not found!'
    })
  }
});

router.post('/', async (req, res) => {
  const { name, recurrent } = req.body;


  // check if unique

  const isUnique = await Category.findOne({ name: name.toLowerCase() });

  if (!!isUnique) {
    res.status(400).json({
      message: 'Category already exists!'
    });
  } else {
    const category = new Category({
      name,
      recurrent: recurrent || false,
    });

    category.save()
      .then(data => {
        res.json(data);
      })
  }
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const updateOps = {};

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Category.updateOne({ _id: id }, { $set: updateOps })
    .then(() => {
      res.status(200).json({
        message: `Updated caterogy with id: ${id}`
      });
    })
    .catch(err => {
      console.error(err);
      res.status(400).json({
        error: err
      })
    })
})

module.exports = router;
