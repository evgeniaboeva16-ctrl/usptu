const isSpecialist = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Пользователь не авторизован' });
    }
    
    if (req.user.email !== 'elisonkein@yahoo.com') {
      return res.status(403).json({ error: 'Доступ разрешен только для специалистов' });
    }
    
    next();
  } catch (error) {
    console.error('Ошибка проверки специалиста:', error);
    res.status(500).json({ error: 'Ошибка проверки прав доступа' });
  }
};

module.exports = isSpecialist;