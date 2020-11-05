const express = require('express');
const Joi = require('joi');
const Category = require('../models/Category');

const schemaCategory = Joi.object({
  name: Joi.string().trim().required(),
  recurrent: Joi.boolean,
});

const router = express.Router();


// GET ALL CATEGORIES

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

// GET BY ID

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

// POST

router.post('/', async (req, res, next) => {
  try {
    const { name, recurrent } = req.body;
    const isValid = await schemaCategory.validateAsync(req.body);

    const category = await Category.findOne({ name: name.toLowerCase() });

    if (!!category) {
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
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  const updateOps = {};

  for (const ops of req.body) {

    updateOps[ops.propName] = ops.value;
  }

  await Category.updateOne({ _id: id }, { $set: updateOps });

  try {
    const patched = await Category.findById({ _id: id });
    res.status(200).json({
      message: 'Updated caterogy!',
      update: patched
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  Category.deleteOne({ _id: id })
    .then(() => {
      res.status(200).json({
        message: `Deleted category with id: ${id}`
      })
    })
    .catch(err => {
      next(err);
    })
})

module.exports = router;
