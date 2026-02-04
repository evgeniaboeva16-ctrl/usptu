const express = require('express');
const router = express.Router();
const { School } = require('../database/models');

router.get('/', async (req, res) => {
  try {
    const { search = '' } = req.query;
    
    const whereCondition = search ? {
      name: {
        [Op.iLike]: `%${search}%`
      }
    } : {};

    const schools = await School.findAll({
      where: whereCondition,
      limit: 10,
      order: [['name', 'ASC']]
    });

    res.json(schools);
  } catch (error) {
    console.error('Ошибка поиска школ:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;