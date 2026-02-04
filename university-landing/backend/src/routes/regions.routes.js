const express = require('express');
const router = express.Router();
const { Region } = require('../database/models');

router.get('/', async (req, res) => {
  try {
    const regions = await Region.findAll({
      order: [['name', 'ASC']]
    });

    res.json(regions);
  } catch (error) {
    console.error('Ошибка загрузки регионов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;