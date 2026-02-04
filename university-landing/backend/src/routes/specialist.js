const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const isSpecialist = require('../middleware/isSpecialist');

router.use(verifyToken);
router.use(isSpecialist);

router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = {
      totalEvents: 15,
      totalParticipants: 342,
      upcomingEvents: 3,
      avgRating: 4.7,
      completedEvents: 12,
      activeEvents: 2,
      cancelledEvents: 1,
      totalBudget: 150000,
      budgetUsed: 85000
    };
    
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/events', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const events = [
      {
        id: 1,
        title: 'День открытых дверей',
        short_description: 'Знакомство с университетом',
        start_datetime: new Date(Date.now() + 86400000).toISOString(),
        type: 'offline',
        current_participants: 45,
        max_participants: 100,
        status: 'registration_open',
        location_type: 'offline',
        address: 'ул. Первомайская, 14'
      },
      {
        id: 2,
        title: 'Вебинар по программированию',
        short_description: 'Основы Python для начинающих',
        start_datetime: new Date(Date.now() + 172800000).toISOString(),
        type: 'online',
        current_participants: 89,
        max_participants: 150,
        status: 'published',
        location_type: 'online',
        online_link: 'https://zoom.us/j/123456789'
      }
    ];
    
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/events/upcoming', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const events = [
      {
        id: 1,
        title: 'День открытых дверей',
        start_datetime: new Date(Date.now() + 86400000).toISOString(),
        type: 'offline',
        current_participants: 45,
        max_participants: 100,
        status: 'registration_open'
      },
      {
        id: 2,
        title: 'Вебинар по программированию',
        start_datetime: new Date(Date.now() + 172800000).toISOString(),
        type: 'online',
        current_participants: 89,
        max_participants: 150,
        status: 'published'
      }
    ];
    
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/events', async (req, res) => {
  try {
    const userId = req.user.id;
    const eventData = {
      ...req.body,
      created_by: userId,
      organizer_id: userId,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const event = { id: Date.now(), ...eventData };
    
    res.json({ success: true, event, message: 'Мероприятие создано успешно' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/events/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.user.id;
    
    res.json({ success: true, message: 'Мероприятие обновлено' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/events/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.user.id;

    
    res.json({ success: true, message: 'Мероприятие удалено' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/verify', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Доступ подтвержден', 
    user: req.user 
  });
});

module.exports = router;