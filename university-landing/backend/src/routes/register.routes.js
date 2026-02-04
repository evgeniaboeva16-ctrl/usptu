const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, AbiturientProfile, School, Region } = require('../database/models');

function generateTempPassword() {
  const length = 8;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

router.post('/register', async (req, res) => {
  try {
    const { 
      email, 
      lastName, 
      firstName, 
      middleName, 
      phone, 
      school, 
      grade, 
      region, 
      consent 
    } = req.body;

    console.log('Регистрация нового пользователя:', { email, firstName, lastName });

    if (!email || !lastName || !firstName || !school || !grade || !consent) {
      return res.status(400).json({
        success: false,
        error: 'Заполните все обязательные поля'
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Пользователь с таким email уже существует'
      });
    }

    const fullName = `${lastName} ${firstName} ${middleName || ''}`.trim();

    const tempPassword = generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const newUser = await User.create({
      email,
      password_hash: passwordHash,
      role: 'abiturient',
      full_name: fullName,
      phone: phone || null,
      created_at: new Date(),
      is_active: true
    });

    console.log('Пользователь создан:', newUser.id);

    let schoolRecord = await School.findOne({ where: { name: school } });
    if (!schoolRecord) {
      schoolRecord = await School.create({
        name: school,
        city: region || '',
        is_active: true
      });
      console.log('Создана новая школа:', schoolRecord.id);
    }

    let regionRecord = null;
    if (region) {
      regionRecord = await Region.findOne({ where: { name: region } });
      if (!regionRecord) {
        regionRecord = await Region.create({ name: region });
        console.log('Создан новый регион:', regionRecord.id);
      }
    }

    const profileData = {
      user_id: newUser.id,
      school_id: schoolRecord.id,
      grade: parseInt(grade),
      region_id: regionRecord ? regionRecord.id : null,
      consent_signed: consent,
      consent_date: consent ? new Date() : null
    };


  } catch (error) {
    console.error('❌ Ошибка при регистрации:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при регистрации пользователя',
      message: error.message
    });
  }
});

router.get('/register/stats', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalAbiturients = await AbiturientProfile.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRegistrations = await User.count({
      where: {
        created_at: {
          [Op.gte]: today
        }
      }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalAbiturients,
        todayRegistrations,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
});

module.exports = router;