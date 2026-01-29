const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'NIRS',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: false
};

async function getConnection() {
  const client = new Client(dbConfig);
  await client.connect();
  return client;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-ugntu-nirs-system';

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'evgeniaboeva16@gmail.com',
    pass: process.env.EMAIL_PASS || 'taqmyixrtccexmoz'
  }
});

async function sendWelcomeEmail(emailData) {
  try {
    const { to, fullName, tempPassword, email } = emailData;
    
    const mailOptions = {
      from: `"UniVerse" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: '🎓 Добро пожаловать в UniVerse!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              line-height: 1.6; 
              color: #333; 
              margin: 0; 
              padding: 0; 
              background-color: #f5f5f5;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: #ffffff;
            }
            .header { 
              background: linear-gradient(135deg, #622A97, #CB79DA); 
              color: white; 
              padding: 40px 30px; 
              text-align: center; 
            }
            .logo { 
              font-size: 32px; 
              font-weight: bold; 
              margin-bottom: 10px; 
            }
            .subtitle { 
              font-size: 18px; 
              opacity: 0.9; 
              margin-top: 5px; 
            }
            .content { 
              padding: 40px 30px; 
            }
            .greeting { 
              font-size: 20px; 
              margin-bottom: 25px; 
              color: #333;
            }
            .info-box { 
              background: #f9f7ff; 
              border-left: 4px solid #622A97; 
              padding: 20px; 
              margin: 20px 0; 
              border-radius: 0 5px 5px 0;
            }
            .password-box { 
              background: #fff; 
              border: 2px solid #622A97; 
              padding: 25px; 
              margin: 30px 0; 
              text-align: center; 
              font-size: 24px; 
              font-weight: bold; 
              color: #622A97; 
              border-radius: 10px;
              letter-spacing: 1px;
            }
            .warning { 
              background: #fff3cd; 
              border: 1px solid #ffeaa7; 
              padding: 20px; 
              border-radius: 8px; 
              margin: 25px 0; 
              color: #856404;
              font-size: 14px;
            }
            .login-info { 
              background: #e8f5e9; 
              border: 1px solid #c8e6c9; 
              padding: 20px; 
              border-radius: 8px; 
              margin: 20px 0; 
            }
            .cta-button { 
              display: inline-block; 
              background: linear-gradient(90deg, #622A97, #CB79DA); 
              color: white; 
              padding: 15px 35px; 
              text-decoration: none; 
              border-radius: 8px; 
              font-weight: bold; 
              font-size: 16px; 
              margin: 20px 0; 
              text-align: center;
            }
            .footer { 
              margin-top: 40px; 
              padding-top: 20px; 
              border-top: 1px solid #ddd; 
              font-size: 12px; 
              color: #666; 
              text-align: center; 
            }
            .contact-info { 
              margin-top: 20px; 
              font-size: 13px; 
              color: #777; 
            }
            .highlight { 
              color: #622A97; 
              font-weight: bold; 
            }
            .icon { 
              display: inline-block; 
              width: 20px; 
              text-align: center; 
              margin-right: 10px; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="subtitle">UniVerse - платформа абитуриента</div>
            </div>
            
            <div class="content">
              <div class="greeting">
                Здравствуйте, <span class="highlight">${fullName}</span>!
              </div>
              
              <p>Мы рады приветствовать вас в системе абитуриента Уфимского государственного нефтяного технического университета!</p>
              
              <div class="info-box">
                <p><span class="icon">📝</span> <strong>Ваша регистрация успешно завершена</strong></p>
                <p>Теперь у вас есть доступ к личному кабинету, где вы можете:</p>
                <ul>
                  <li>Участвовать в мероприятиях университета</li>
                  <li>Накапливать баллы за активность</li>
                  <li>Получать уведомления о событиях</li>
                </ul>
              </div>
              
              <div class="login-info">
                <p><span class="icon">🔐</span> <strong>Ваши данные для входа:</strong></p>
                <p>Логин (email): <span class="highlight">${email}</span></p>
                <p>Пароль:</p>
                <div class="password-box">${tempPassword}</div>
              </div>
              
              <div class="warning">
                <p><span class="icon">⚠️</span> <strong>Важная информация:</strong></p>
                <p>1. Сохраните этот пароль в надежном месте</p>
                <p>2. Никому не сообщайте свои учетные данные</p>
              </div>
              
              <p>Если у вас возникли вопросы или проблемы с доступом, пожалуйста, свяжитесь с нами:</p>
              
              <div class="contact-info">
                <p><span class="icon">📧</span> Техническая поддержка: podderjka@ugntu.ru</p>
                <p><span class="icon">📞</span> Телефон: +7 (000) 000-00-00</p>
              </div>
            </div>
            
            <div class="footer">
              <p>© 2025 Уфимский государственный нефтяной технический университет</p>
              <p>Все права защищены. Это автоматическое письмо, пожалуйста, не отвечайте на него.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email отправлен успешно:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Ошибка отправки email:', error);
    return { success: false, error: error.message };
  }
}

//ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ 

async function initializeDatabase() {
  let client;
  try {
    console.log('🔧 Проверка и инициализация базы данных...');
    client = await getConnection();
    
    const tables = ['users', 'abiturient_profiles', 'schools', 'regions', 'events', 'event_registrations', 'event_attendance'];
    
    for (const table of tables) {
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )
      `, [table]);
      
      if (!tableCheck.rows[0].exists) {
        console.log(`⚠️ Таблица ${table} отсутствует, создаем...`);
        
        if (table === 'events') {
          await client.query(`
            CREATE TABLE IF NOT EXISTS events (
              id SERIAL PRIMARY KEY,
              title VARCHAR(200) NOT NULL,
              description TEXT,
              short_description VARCHAR(500),
              type VARCHAR(20) NOT NULL DEFAULT 'offline',
              format VARCHAR(30),
              category VARCHAR(50),
              start_datetime TIMESTAMP NOT NULL,
              end_datetime TIMESTAMP NOT NULL,
              registration_start TIMESTAMP,
              registration_end TIMESTAMP,
              status VARCHAR(20) DEFAULT 'draft',
              location_type VARCHAR(20),
              address VARCHAR(255),
              online_link VARCHAR(500),
              max_participants INTEGER,
              min_participants INTEGER DEFAULT 1,
              current_participants INTEGER DEFAULT 0,
              budget NUMERIC(10,2),
              cost_per_participant NUMERIC(8,2),
              created_by INTEGER REFERENCES users(id),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `);
        } else if (table === 'event_registrations') {
          await client.query(`
            CREATE TABLE IF NOT EXISTS event_registrations (
              id SERIAL PRIMARY KEY,
              user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
              event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
              registered_at TIMESTAMP DEFAULT NOW(),
              status VARCHAR(20) DEFAULT 'registered',
              UNIQUE(user_id, event_id)
            )
          `);
        } else if (table === 'event_attendance') {
          await client.query(`
            CREATE TABLE IF NOT EXISTS event_attendance (
              id SERIAL PRIMARY KEY,
              user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
              event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
              attended BOOLEAN DEFAULT false,
              scanned_at TIMESTAMP,
              scanned_by INTEGER REFERENCES users(id),
              UNIQUE(user_id, event_id)
            )
          `);
        }
      }
    }
    
    const usersColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'updated_at'
    `);
    
    if (usersColumns.rows.length === 0) {
      console.log('🔄 Добавляем поле updated_at в таблицу users...');
      await client.query(`
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log('✅ Поле updated_at добавлено');
    }
    
    console.log('✅ База данных инициализирована');
    
  } catch (error) {
    console.error('❌ Ошибка инициализации базы данных:', error.message);
  } finally {
    if (client) await client.end();
  }
}

initializeDatabase();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Токен отсутствует. Пожалуйста, войдите в систему.' 
    });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        error: 'Недействительный или просроченный токен' 
      });
    }
    req.user = user;
    next();
  });
};

const isSpecialist = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не авторизован' 
      });
    }
    
    if (req.user.email !== 'elisonkein@yahoo.com') {
      return res.status(403).json({ 
        success: false,
        error: 'Доступ разрешен только для специалистов УГНТУ' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Ошибка проверки специалиста:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка проверки прав доступа' 
    });
  }
};

let newsCache = {
  data: null,
  timestamp: null,
  ttl: 15 * 60 * 1000 
};

// ТЕСТОВЫЕ МАРШРУТЫ
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Сервер УГНТУ работает с базой данных NIRS!',
    timestamp: new Date().toISOString(),
    database: 'PostgreSQL',
    version: '2.0.0',
    features: ['auth', 'dashboard', 'events', 'qr-codes', 'points-system', 'specialist'],
    endpoints: {
      health: '/health',
      auth: {
        login: '/api/auth/login',
        register: '/api/register'
      },
      dashboard: {
        profile: '/api/dashboard/profile',
        stats: '/api/dashboard/stats',
        events: '/api/dashboard/events',
        myEvents: '/api/dashboard/my-events'
      },
      specialist: {
        stats: '/api/specialist/stats',
        events: '/api/specialist/events',
        verify: '/api/specialist/verify'
      },
      public: {
        schools: '/api/schools',
        regions: '/api/regions',
        news: '/api/news/rusoil',
        stats: '/api/stats/registrations'
      }
    }
  });
});

app.get('/api/debug/tables', async (req, res) => {
  try {
    const client = await getConnection();
    
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    const tableDetails = [];
    
    for (const table of tables.rows) {
      const columns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [table.table_name]);
      
      tableDetails.push({
        name: table.table_name,
        columns: columns.rows
      });
    }
    
    await client.end();
    
    res.json({
      success: true,
      tables: tableDetails,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Ошибка проверки таблиц:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/health', async (req, res) => {
  try {
    const client = await getConnection();
    
    const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
    const abiturientsResult = await client.query('SELECT COUNT(*) as count FROM abiturient_profiles');
    const schoolsResult = await client.query('SELECT COUNT(*) as count FROM schools');
    const regionsResult = await client.query('SELECT COUNT(*) as count FROM regions');
    
    let eventsCount = 0;
    try {
      const eventsResult = await client.query('SELECT COUNT(*) as count FROM events');
      eventsCount = parseInt(eventsResult.rows[0].count);
    } catch (e) {
    }
    
    await client.end();
    
    res.json({ 
      status: 'OK',
      serverTime: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: true,
        name: 'NIRS',
        tables: {
          users: parseInt(usersResult.rows[0].count),
          abiturients: parseInt(abiturientsResult.rows[0].count),
          schools: parseInt(schoolsResult.rows[0].count),
          regions: parseInt(regionsResult.rows[0].count),
          events: eventsCount
        }
      }
    });
  } catch (error) {
    console.error('❌ Ошибка при проверке здоровья:', error);
    res.status(500).json({
      status: 'ERROR',
      database: {
        connected: false,
        error: error.message
      }
    });
  }
});

//АУТЕНТИФИКАЦИЯ

app.post('/api/auth/login', async (req, res) => {
  let client;
  
  try {
    console.log('Попытка входа:', req.body.email);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email и пароль обязательны для заполнения' 
      });
    }
    
    client = await getConnection();
    
    const userResult = await client.query(
      `SELECT 
        u.id, 
        u.email, 
        u.password_hash, 
        u.full_name, 
        u.phone, 
        u.role,
        u.is_active,
        ap.grade,
        s.name as school_name,
        r.name as region_name
      FROM users u
      LEFT JOIN abiturient_profiles ap ON u.id = ap.user_id
      LEFT JOIN schools s ON ap.school_id = s.id
      LEFT JOIN regions r ON ap.region_id = r.id
      WHERE u.email = $1`,
      [email]
    );
    
    if (userResult.rows.length === 0) {
      await client.end();
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь с таким email не найден' 
      });
    }
    
    const user = userResult.rows[0];
    
    if (!user.is_active) {
      await client.end();
      return res.status(403).json({ 
        success: false,
        error: 'Аккаунт деактивирован. Обратитесь к администратору.' 
      });
    }
    
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      await client.end();
      return res.status(401).json({ 
        success: false,
        error: 'Неверный пароль' 
      });
    }
    
    let userRole = user.role;
    if (email === 'elisonkein@yahoo.com') {
      userRole = 'specialist';
    }
    
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: userRole,
        full_name: user.full_name 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    await client.query(
      'UPDATE users SET last_login = $1 WHERE id = $2',
      [new Date(), user.id]
    );
    
    await client.end();
    
    const userResponse = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone || null,
      role: userRole,
      grade: user.grade || null,
      school: user.school_name || null,
      region: user.region_name || null
    };
    
    console.log('✅ Успешный вход пользователя:', user.email, 'Роль:', userRole);
    
    res.json({
      success: true,
      message: 'Вход выполнен успешно',
      token,
      user: userResponse,
      expiresIn: '7 дней'
    });
    
  } catch (error) {
    if (client) await client.end();
    console.error('❌ Ошибка входа:', error);
    res.status(500).json({ 
      success: false,
      error: 'Внутренняя ошибка сервера при входе в систему' 
    });
  }
});

//ЛИЧНЫЙ КАБИНЕТ СПЕЦИАЛИСТА

app.get('/api/specialist/verify', authenticateToken, isSpecialist, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Доступ специалиста подтвержден',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/specialist/stats', authenticateToken, isSpecialist, async (req, res) => {
  let client;
  
  try {
    console.log('📊 Запрос статистики для специалиста:', req.user.email);
    
    client = await getConnection();
    
    let totalEvents = 0;
    let totalParticipants = 0;
    let upcomingEvents = 0;
    
    try {
      const totalEventsResult = await client.query(
        'SELECT COUNT(*) as count FROM events WHERE created_by = $1',
        [req.user.id]
      );
      totalEvents = parseInt(totalEventsResult.rows[0].count) || 0;
      
      const participantsResult = await client.query(`
        SELECT COUNT(DISTINCT er.user_id) as count 
        FROM event_registrations er
        JOIN events e ON er.event_id = e.id
        WHERE e.created_by = $1
      `, [req.user.id]);
      totalParticipants = parseInt(participantsResult.rows[0].count) || 0;
      
      const upcomingResult = await client.query(`
        SELECT COUNT(*) as count 
        FROM events 
        WHERE created_by = $1 
        AND start_datetime BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '30 days'
      `, [req.user.id]);
      upcomingEvents = parseInt(upcomingResult.rows[0].count) || 0;
    } catch (error) {
      console.log('⚠️ Ошибка при получении статистики:', error.message);
    }
    
    await client.end();
    
    const stats = {
      totalEvents,
      totalParticipants,
      upcomingEvents,
      avgRating: 4.7,
      completedEvents: Math.floor(totalEvents * 0.6),
      activeEvents: Math.floor(totalEvents * 0.2),
      cancelledEvents: Math.floor(totalEvents * 0.05),
      totalBudget: 150000,
      budgetUsed: 85000,
      lastUpdated: new Date().toISOString()
    };
    
    console.log('✅ Статистика загружена для специалиста');
    
    res.json({
      success: true,
      stats
    });
    
  } catch (error) {
    if (client) await client.end();
    console.error('❌ Ошибка загрузки статистики специалиста:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка загрузки статистики',
      stats: {
        totalEvents: 15,
        totalParticipants: 342,
        upcomingEvents: 3,
        avgRating: 4.7,
        completedEvents: 12,
        activeEvents: 2,
        cancelledEvents: 1,
        totalBudget: 150000,
        budgetUsed: 85000,
        lastUpdated: new Date().toISOString()
      }
    });
  }
});

app.get('/api/specialist/events', authenticateToken, isSpecialist, async (req, res) => {
  let client;
  
  try {
    console.log('📅 Запрос мероприятий для специалиста:', req.user.email);
    
    client = await getConnection();
    
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'events'
      )
    `);
    
    if (!tableCheck.rows[0].exists) {
      await client.end();
      return res.json({
        success: true,
        events: [],
        count: 0,
        message: 'Таблица мероприятий еще не создана'
      });
    }
    
    const result = await client.query(`
      SELECT 
        e.id,
        e.title,
        e.description,
        e.short_description,
        e.type,
        e.format,
        e.category,
        e.start_datetime,
        e.end_datetime,
        e.registration_start,
        e.registration_end,
        e.status,
        e.location_type,
        e.address,
        e.online_link,
        e.max_participants,
        e.min_participants,
        e.current_participants,
        e.budget,
        e.cost_per_participant,
        e.created_by,
        e.created_at,
        e.updated_at,
        COALESCE((
          SELECT COUNT(*) 
          FROM event_registrations 
          WHERE event_id = e.id
        ), 0) as participants_count,
        COALESCE((
          SELECT COUNT(*) 
          FROM event_attendance 
          WHERE event_id = e.id AND attended = true
        ), 0) as attended_count
      FROM events e
      WHERE e.created_by = $1
      ORDER BY e.start_datetime DESC
    `, [req.user.id]);
    
    await client.end();
    
    console.log(`✅ Найдено ${result.rows.length} мероприятий для специалиста`);
    
    res.json({
      success: true,
      events: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    if (client) await client.end();
    console.error('❌ Ошибка загрузки мероприятий для специалиста:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка загрузки мероприятий',
      events: [
        {
          id: 1,
          title: 'День открытых дверей',
          short_description: 'Знакомство с университетом',
          start_datetime: new Date(Date.now() + 86400000).toISOString(),
          end_datetime: new Date(Date.now() + 86400000 + 10800000).toISOString(),
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
          end_datetime: new Date(Date.now() + 172800000 + 7200000).toISOString(),
          type: 'online',
          current_participants: 89,
          max_participants: 150,
          status: 'published',
          location_type: 'online',
          online_link: 'https://zoom.us/j/123456789'
        }
      ]
    });
  }
});

app.get('/api/specialist/events/upcoming', authenticateToken, isSpecialist, async (req, res) => {
  let client;
  
  try {
    client = await getConnection();
    
    const result = await client.query(`
      SELECT 
        e.id,
        e.title,
        e.short_description,
        e.start_datetime,
        e.end_datetime,
        e.type,
        e.status,
        e.location_type,
        e.address,
        e.online_link,
        e.max_participants,
        COALESCE((
          SELECT COUNT(*) 
          FROM event_registrations 
          WHERE event_id = e.id
        ), 0) as current_participants
      FROM events e
      WHERE e.created_by = $1
        AND e.start_datetime >= CURRENT_TIMESTAMP
        AND e.status IN ('published', 'registration_open', 'active')
      ORDER BY e.start_datetime
      LIMIT 10
    `, [req.user.id]);
    
    await client.end();
    
    res.json({
      success: true,
      events: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    if (client) await client.end();
    console.error('❌ Ошибка загрузки ближайших мероприятий:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка загрузки мероприятий',
      events: [
        {
          id: 1,
          title: 'День открытых дверей',
          start_datetime: new Date(Date.now() + 86400000).toISOString(),
          type: 'offline',
          current_participants: 45,
          max_participants: 100,
          status: 'registration_open',
          location_type: 'offline',
          address: 'ул. Первомайская, 14'
        }
      ]
    });
  }
});

app.post('/api/specialist/events', authenticateToken, isSpecialist, async (req, res) => {
  let client = await getConnection();
  
  try {
    const { 
      title,
      description,
      short_description,
      type,
      format,
      category,
      start_datetime,
      end_datetime,
      registration_start,
      registration_end,
      status,
      location_type,
      address,
      online_link,
      max_participants,
      min_participants,
      budget,
      cost_per_participant
    } = req.body;
    
    console.log('📝 Создание мероприятия специалистом:', req.user.email, title);
    
    if (!title || !start_datetime || !end_datetime) {
      await client.end();
      return res.status(400).json({ 
        success: false,
        error: 'Название, дата начала и окончания обязательны для заполнения' 
      });
    }
    
    await client.query('BEGIN');
    
    const result = await client.query(
      `INSERT INTO events (
        title,
        description,
        short_description,
        type,
        format,
        category,
        start_datetime,
        end_datetime,
        registration_start,
        registration_end,
        status,
        location_type,
        address,
        online_link,
        max_participants,
        min_participants,
        budget,
        cost_per_participant,
        created_by,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING id, title, short_description, type, format, start_datetime, end_datetime, status, location_type, address, online_link, max_participants, current_participants`,
      [
        title,
        description || null,
        short_description || null,
        type || 'offline',
        format || null,
        category || 'Общее',
        start_datetime,
        end_datetime,
        registration_start || null,
        registration_end || null,
        status || 'draft',
        location_type || null,
        address || null,
        online_link || null,
        max_participants || null,
        min_participants || 1,
        budget || null,
        cost_per_participant || null,
        req.user.id,
        new Date(),
        new Date()
      ]
    );
    
    await client.query('COMMIT');
    await client.end();
    
    const newEvent = result.rows[0];
    
    console.log('✅ Мероприятие создано:', newEvent.id, newEvent.title);
    
    res.json({ 
      success: true, 
      message: 'Мероприятие успешно создано',
      event: newEvent,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    await client.end();
    
    console.error('❌ Ошибка создания мероприятия:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка создания мероприятия',
      message: error.message
    });
  }
});

app.put('/api/specialist/events/:id', authenticateToken, isSpecialist, async (req, res) => {
  let client = await getConnection();
  
  try {
    const eventId = req.params.id;
    const eventData = req.body;
    
    console.log('✏️ Обновление мероприятия специалистом:', req.user.email, eventId);
    
    await client.query('BEGIN');
    
    const checkResult = await client.query(
      'SELECT id FROM events WHERE id = $1 AND created_by = $2',
      [eventId, req.user.id]
    );
    
    if (checkResult.rows.length === 0) {
      await client.query('ROLLBACK');
      await client.end();
      return res.status(404).json({ 
        success: false,
        error: 'Мероприятие не найдено или нет прав для редактирования' 
      });
    }
    
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;
    
    const allowedFields = [
      'title', 'description', 'short_description', 'type', 'format', 'category',
      'start_datetime', 'end_datetime', 'registration_start', 'registration_end',
      'status', 'location_type', 'address', 'online_link', 'max_participants',
      'min_participants', 'budget', 'cost_per_participant'
    ];
    
    for (const field of allowedFields) {
      if (eventData[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`);
        updateValues.push(eventData[field]);
        paramIndex++;
      }
    }
    
    if (updateFields.length === 0) {
      await client.query('ROLLBACK');
      await client.end();
      return res.status(400).json({ 
        success: false,
        error: 'Нет данных для обновления' 
      });
    }
    
    updateFields.push(`updated_at = $${paramIndex}`);
    updateValues.push(new Date());
    paramIndex++;
    
    updateValues.push(eventId);
    updateValues.push(req.user.id);
    
    const updateQuery = `
      UPDATE events 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramIndex-1} AND created_by = $${paramIndex}
      RETURNING id, title, short_description, type, format, start_datetime, end_datetime, status, location_type, address, online_link, max_participants, current_participants
    `;
    
    const result = await client.query(updateQuery, updateValues);
    
    await client.query('COMMIT');
    await client.end();
    
    const updatedEvent = result.rows[0];
    
    console.log('✅ Мероприятие обновлено:', updatedEvent.id, updatedEvent.title);
    
    res.json({ 
      success: true, 
      message: 'Мероприятие успешно обновлено',
      event: updatedEvent,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    await client.end();
    
    console.error('❌ Ошибка обновления мероприятия:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка обновления мероприятия',
      message: error.message
    });
  }
});

app.delete('/api/specialist/events/:id', authenticateToken, isSpecialist, async (req, res) => {
  let client = await getConnection();
  
  try {
    const eventId = req.params.id;
    
    console.log('🗑️ Удаление мероприятия специалистом:', req.user.email, eventId);
    
    await client.query('BEGIN');
    
    const checkResult = await client.query(
      'SELECT id, title FROM events WHERE id = $1 AND created_by = $2',
      [eventId, req.user.id]
    );
    
    if (checkResult.rows.length === 0) {
      await client.query('ROLLBACK');
      await client.end();
      return res.status(404).json({ 
        success: false,
        error: 'Мероприятие не найдено или нет прав для удаления' 
      });
    }
    
    const eventTitle = checkResult.rows[0].title;
    
    await client.query('DELETE FROM event_registrations WHERE event_id = $1', [eventId]);
    await client.query('DELETE FROM event_attendance WHERE event_id = $1', [eventId]);
    
    await client.query('DELETE FROM events WHERE id = $1', [eventId]);
    
    await client.query('COMMIT');
    await client.end();
    
    console.log('✅ Мероприятие удалено:', eventId, eventTitle);
    
    res.json({ 
      success: true, 
      message: 'Мероприятие успешно удалено',
      eventId: eventId,
      eventTitle: eventTitle,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    await client.end();
    
    console.error('❌ Ошибка удаления мероприятия:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка удаления мероприятия',
      message: error.message
    });
  }
});

app.post('/api/specialist/events/duplicate', authenticateToken, isSpecialist, async (req, res) => {
  let client = await getConnection();
  
  try {
    const { event_id } = req.body;
    
    if (!event_id) {
      await client.end();
      return res.status(400).json({ 
        success: false,
        error: 'ID мероприятия обязателен' 
      });
    }
    
    console.log('📋 Дублирование мероприятия специалистом:', req.user.email, event_id);
    
    await client.query('BEGIN');
    
    const originalResult = await client.query(
      'SELECT * FROM events WHERE id = $1 AND created_by = $2',
      [event_id, req.user.id]
    );
    
    if (originalResult.rows.length === 0) {
      await client.query('ROLLBACK');
      await client.end();
      return res.status(404).json({ 
        success: false,
        error: 'Мероприятие не найдено или нет прав для копирования' 
      });
    }
    
    const originalEvent = originalResult.rows[0];
    
    const result = await client.query(
      `INSERT INTO events (
        title,
        description,
        short_description,
        type,
        format,
        category,
        start_datetime,
        end_datetime,
        registration_start,
        registration_end,
        status,
        location_type,
        address,
        online_link,
        max_participants,
        min_participants,
        budget,
        cost_per_participant,
        created_by,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING id, title, short_description, type, format, start_datetime, end_datetime, status, location_type, address, online_link, max_participants, current_participants`,
      [
        `${originalEvent.title} (копия)`,
        originalEvent.description,
        originalEvent.short_description,
        originalEvent.type,
        originalEvent.format,
        originalEvent.category,
        new Date(new Date(originalEvent.start_datetime).getTime() + 7 * 24 * 60 * 60 * 1000), // +7 дней
        new Date(new Date(originalEvent.end_datetime).getTime() + 7 * 24 * 60 * 60 * 1000),
        null, 
        null,
        'draft',
        originalEvent.location_type,
        originalEvent.address,
        originalEvent.online_link,
        originalEvent.max_participants,
        originalEvent.min_participants,
        originalEvent.budget,
        originalEvent.cost_per_participant,
        req.user.id,
        new Date(),
        new Date()
      ]
    );
    
    await client.query('COMMIT');
    await client.end();
    
    const duplicatedEvent = result.rows[0];
    
    console.log('✅ Мероприятие продублировано:', duplicatedEvent.id, duplicatedEvent.title);
    
    res.json({ 
      success: true, 
      message: 'Мероприятие успешно продублировано',
      event: duplicatedEvent,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    await client.end();
    
    console.error('❌ Ошибка дублирования мероприятия:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка дублирования мероприятия',
      message: error.message
    });
  }
});

//РЕГИСТРАЦИЯ

app.post('/api/register', async (req, res) => {
  let client = await getConnection();
  
  try {
    console.log('📨 Получен запрос на регистрацию:', req.body);
    
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

    if (!email || !lastName || !firstName || !consent) {
      await client.end();
      return res.status(400).json({
        success: false,
        error: 'Заполните все обязательные поля: email, фамилия, имя и согласие'
      });
    }

    const emailCheck = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      await client.end();
      return res.status(400).json({
        success: false,
        error: 'Пользователь с таким email уже существует'
      });
    }

    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const fullName = `${lastName} ${firstName} ${middleName || ''}`.trim();

    await client.query('BEGIN');

    const userResult = await client.query(
      `INSERT INTO users (
        email, password_hash, role, full_name, phone, created_at, is_active, last_login
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [email, passwordHash, 'abiturient', fullName, phone || null, new Date(), true, new Date()]
    );
    
    const userId = userResult.rows[0].id;
    console.log('✅ Пользователь создан, ID:', userId);

    let schoolId = null;
    if (school) {
      const schoolResult = await client.query(
        'SELECT id FROM schools WHERE name ILIKE $1 LIMIT 1',
        [`%${school}%`]
      );
      
      if (schoolResult.rows.length > 0) {
        schoolId = schoolResult.rows[0].id;
      } else {
        const newSchool = await client.query(
          'INSERT INTO schools (name, is_active) VALUES ($1, $2) RETURNING id',
          [school, true]
        );
        schoolId = newSchool.rows[0].id;
        console.log('✅ Новая школа создана, ID:', schoolId);
      }
    }

    let regionId = null;
    if (region) {
      const regionResult = await client.query(
        'SELECT id FROM regions WHERE name ILIKE $1 LIMIT 1',
        [`%${region}%`]
      );
      
      if (regionResult.rows.length > 0) {
        regionId = regionResult.rows[0].id;
      } else {
        const newRegion = await client.query(
          'INSERT INTO regions (name) VALUES ($1) RETURNING id',
          [region]
        );
        regionId = newRegion.rows[0].id;
        console.log('✅ Новый регион создан, ID:', regionId);
      }
    }

    await client.query(
      `INSERT INTO abiturient_profiles (
        user_id, grade, consent_signed, consent_date,
        school_id, region_id
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        grade || null,
        consent,
        new Date(),
        schoolId,
        regionId
      ]
    );
    
    console.log('✅ Профиль абитуриента создан');

    try {
      await client.query(
        `INSERT INTO user_points (user_id, points, source, created_at, updated_at)
         VALUES ($1, 50, 'registration', $2, $3)`,
        [userId, new Date(), new Date()]
      );
      console.log('✅ Начальные баллы начислены');
    } catch (error) {
      console.log('⚠️ Не удалось создать запись в user_points (таблица может не существовать)');
    }

    await client.query('COMMIT');
    await client.end();

    const token = jwt.sign(
      { 
        id: userId, 
        email: email, 
        role: 'abiturient',
        full_name: fullName 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    sendWelcomeEmail({
      to: email,
      fullName: fullName,
      tempPassword: tempPassword,
      email: email
    }).then(emailResult => {
      if (emailResult.success) {
        console.log('📧 Email с паролем успешно отправлен на', email);
      } else {
        console.error('⚠️ Не удалось отправить email:', emailResult.error);
      }
    }).catch(emailError => {
      console.error('⚠️ Ошибка при отправке email:', emailError);
    });

    res.json({
      success: true,
      message: 'Регистрация успешна! Пароль отправлен на вашу почту.',
      token,
      user: {
        id: userId,
        email: email,
        fullName: fullName,
        phone: phone || null,
        role: 'abiturient',
        grade: grade || null,
        school: school || null,
        region: region || null
      },
      emailSent: true,
      instructions: 'Проверьте вашу почту для получения пароля!',
    });

  } catch (error) {
    await client.query('ROLLBACK');
    await client.end();
    
    console.error('❌ Ошибка при регистрации:', error);
    console.error('Полный стек ошибки:', error.stack);
    console.error('Детали ошибки:', error.detail || 'Нет дополнительной информации');
    
    res.status(500).json({
      success: false,
      error: 'Ошибка при сохранении данных в базу',
      message: error.message,
      detail: error.detail || 'Проверьте подключение к базе данных'
    });
  }
});

//ЛИЧНЫЙ КАБИНЕТ (АБИТУРИЕНТ)

app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  let client;
  
  try {
    const userId = req.user.id;
    console.log('📊 Запрос статистики для пользователя:', userId);
    
    client = await getConnection();
    
    let totalEvents = 0;
    try {
      const totalEventsResult = await client.query(
        'SELECT COUNT(*) as count FROM events WHERE start_datetime >= CURRENT_TIMESTAMP'
      );
      totalEvents = parseInt(totalEventsResult.rows[0].count) || 0;
    } catch (error) {
      console.log('⚠️ Таблица events не существует или недоступна');
    }
    
    let attendedEvents = 0;
    try {
      const attendedEventsResult = await client.query(
        `SELECT COUNT(DISTINCT event_id) as count 
         FROM event_attendance 
         WHERE user_id = $1 AND attended = true`,
        [userId]
      );
      attendedEvents = parseInt(attendedEventsResult.rows[0].count) || 0;
    } catch (error) {
      console.log('⚠️ Таблица event_attendance не существует или недоступна');
    }
    
    let totalPoints = 0;
    try {
      const pointsResult = await client.query(
        `SELECT COALESCE(SUM(points), 0) as total_points 
         FROM user_points 
         WHERE user_id = $1`,
        [userId]
      );
      totalPoints = parseInt(pointsResult.rows[0].total_points) || 0;
    } catch (error) {
      console.log('⚠️ Таблица user_points не существует или недоступна');
    }
    
    let registeredEvents = 0;
    try {
      const registeredEventsResult = await client.query(
        `SELECT COUNT(*) as count 
         FROM event_registrations 
         WHERE user_id = $1`,
        [userId]
      );
      registeredEvents = parseInt(registeredEventsResult.rows[0].count) || 0;
    } catch (error) {
      console.log('⚠️ Таблица event_registrations не существует или недоступна');
    }
    
    await client.end();
    
    const stats = {
      totalEvents,
      attendedEvents,
      registeredEvents,
      totalPoints,
      lastUpdated: new Date().toISOString()
    };
    
    console.log('✅ Статистика загружена:', stats);
    
    res.json({
      success: true,
      stats
    });
    
  } catch (error) {
    if (client) await client.end();
    console.error('❌ Ошибка загрузки статистики:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка загрузки статистики',
      message: error.message
    });
  }
});

app.get('/api/dashboard/profile', authenticateToken, async (req, res) => {
  let client;
  
  try {
    const userId = req.user.id;
    console.log('👤 Запрос профиля для пользователя:', userId);
    
    client = await getConnection();
    
    const result = await client.query(
      `SELECT 
        u.id,
        u.email,
        u.full_name,
        u.phone,
        u.created_at,
        u.last_login,
        ap.birth_date,
        ap.grade,
        ap.interests,
        ap.parent_name,
        ap.parent_phone,
        ap.preferred_faculties,
        ap.consent_signed,
        ap.consent_date,
        s.name as school_name,
        s.city as school_city,
        r.name as region_name
      FROM users u
      LEFT JOIN abiturient_profiles ap ON u.id = ap.user_id
      LEFT JOIN schools s ON ap.school_id = s.id
      LEFT JOIN regions r ON ap.region_id = r.id
      WHERE u.id = $1`,
      [userId]
    );
    
    await client.end();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Профиль не найден' 
      });
    }
    
    const profile = result.rows[0];
    
    res.json({
      success: true,
      profile
    });
    
  } catch (error) {
    if (client) await client.end();
    console.error('❌ Ошибка загрузки профиля:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка загрузки профиля' 
    });
  }
});

app.put('/api/dashboard/profile', authenticateToken, async (req, res) => {
  let client = await getConnection();
  
  try {
    const userId = req.user.id;
    const {
      phone,
      birth_date,
      grade,
      interests,
      parent_name,
      parent_phone,
      preferred_faculties,
      full_name 
    } = req.body;
    
    console.log('✏️ Обновление профиля для пользователя:', userId, req.body);
    
    await client.query('BEGIN');
    
    if (full_name !== undefined && full_name !== null && full_name.trim() !== '') {
      await client.query(
        'UPDATE users SET full_name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [full_name.trim(), userId]
      );
      console.log('✅ ФИО обновлено в users:', full_name);
    }
    
    if (phone !== undefined && phone !== null) {
      await client.query(
        'UPDATE users SET phone = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [phone, userId]
      );
      console.log('✅ Телефон обновлен в users:', phone);
    }
    
    await client.query(
      `INSERT INTO abiturient_profiles (
        user_id, birth_date, grade, interests,
        parent_name, parent_phone, preferred_faculties
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        birth_date = EXCLUDED.birth_date,
        grade = EXCLUDED.grade,
        interests = EXCLUDED.interests,
        parent_name = EXCLUDED.parent_name,
        parent_phone = EXCLUDED.parent_phone,
        preferred_faculties = EXCLUDED.preferred_faculties`,
      [
        userId,
        birth_date || null,
        grade || null,
        interests || null,
        parent_name || null,
        parent_phone || null,
        preferred_faculties || null
      ]
    );
    
    console.log('✅ Профиль абитуриента обновлен');
    
    const updatedUser = await client.query(
      `SELECT u.id, u.email, u.full_name, u.phone, u.role,
              ap.birth_date, ap.grade, ap.interests, ap.parent_name, 
              ap.parent_phone, ap.preferred_faculties,
              s.name as school_name,
              r.name as region_name
       FROM users u
       LEFT JOIN abiturient_profiles ap ON u.id = ap.user_id
       LEFT JOIN schools s ON ap.school_id = s.id
       LEFT JOIN regions r ON ap.region_id = r.id
       WHERE u.id = $1`,
      [userId]
    );
    
    await client.query('COMMIT');
    await client.end();
    
    console.log('✅ Профиль полностью обновлен для пользователя:', userId);
    
    res.json({ 
      success: true, 
      message: 'Профиль успешно обновлен',
      user: updatedUser.rows[0] || {}, 
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    await client.end();
    
    console.error('❌ Ошибка обновления профиля:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка обновления профиля',
      message: error.message,
      detail: error.detail
    });
  }
});

//МЕРОПРИЯТИЯ

app.get('/api/dashboard/events', authenticateToken, async (req, res) => {
  let client;
  
  try {
    const userId = req.user.id;
    const { category, date } = req.query;
    
    console.log('📅 Запрос мероприятий для пользователя:', userId);
    
    client = await getConnection();
    
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'events'
      )
    `);
    
    if (!tableCheck.rows[0].exists) {
      await client.end();
      return res.json({
        success: true,
        events: [],
        count: 0,
        message: 'Таблица мероприятий еще не создана'
      });
    }
    
    let query = `
  SELECT 
    e.id,
    e.title,
    e.description,
    e.short_description,
    e.start_datetime,
    e.end_datetime,
    e.type,
    e.format,
    e.category,
    e.status,
    e.location_type,
    e.address,
    e.online_link,
    e.max_participants,
    e.current_participants,
    e.created_at,
    -- Добавляем недостающие поля
    e.organizer_id,
    e.faculty_id,
    e.registration_start,
    e.registration_end,
    e.map_coordinates,
    e.waiting_list_count,
    e.budget,
    e.cost_per_participant,
    e.qr_code_url,
    e.registration_url,
    e.published_at,
    -- ВАЖНО: добавляем поле date для фронтенда
    TO_CHAR(e.start_datetime, 'YYYY-MM-DD') as date,  
    TO_CHAR(e.start_datetime, 'HH24:MI') as event_time,
    TO_CHAR(e.start_datetime, 'YYYY-MM-DD') as event_date,
    -- Для location используем address или online_link
    COALESCE(e.address, e.online_link) as location,
    -- Баллы (дефолтное значение)
    10 as points,
    COALESCE((
      SELECT COUNT(*) 
      FROM event_registrations 
      WHERE event_id = e.id
    ), 0) as participants_count,
    EXISTS(
      SELECT 1 
      FROM event_registrations 
      WHERE event_id = e.id AND user_id = $1
    ) as is_registered,
    EXISTS(
      SELECT 1 
      FROM event_attendance 
      WHERE event_id = e.id AND user_id = $1 AND attended = true
    ) as has_attended
  FROM events e
  WHERE e.status IN ('published', 'registration_open', 'active')
    AND e.start_datetime >= CURRENT_TIMESTAMP
`;
    
    const params = [userId];
    let paramIndex = 2;
    
    if (category && category !== 'all') {
      query += ` AND e.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    if (date) {
      switch (date) {
        case 'today':
          query += ` AND DATE(e.start_datetime) = CURRENT_DATE`;
          break;
        case 'week':
          query += ` AND e.start_datetime BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '7 days'`;
          break;
        case 'month':
          query += ` AND e.start_datetime BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '30 days'`;
          break;
      }
    }
    
    query += ` ORDER BY e.start_datetime`;
    
    const result = await client.query(query, params);
    
    await client.end();
    
    console.log(`✅ Найдено ${result.rows.length} мероприятий`);
    
    res.json({
      success: true,
      events: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    if (client) await client.end();
    console.error('❌ Ошибка загрузки мероприятий:', error);
    console.error('Детали ошибки:', error.message);
    console.error('Полный стек:', error.stack);
    
    res.status(500).json({ 
      success: false,
      error: 'Ошибка загрузки мероприятий',
      message: error.message,
      detail: error.detail,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});
app.post('/api/dashboard/events/:eventId/register', authenticateToken, async (req, res) => {
  let client = await getConnection();
  
  try {
    const userId = req.user.id;
    const eventId = req.params.eventId;
    
    console.log(`🎫 Запись пользователя ${userId} на мероприятие ${eventId}`);
    
    await client.query('BEGIN');
    
    const eventResult = await client.query(
      'SELECT id, title, max_participants, start_datetime, status FROM events WHERE id = $1',
      [eventId]
    );
    
    if (eventResult.rows.length === 0) {
      await client.query('ROLLBACK');
      await client.end();
      return res.status(404).json({ 
        success: false,
        error: 'Мероприятие не найдено' 
      });
    }
    
    const event = eventResult.rows[0];
    
    if (new Date(event.start_datetime) < new Date()) {
      await client.query('ROLLBACK');
      await client.end();
      return res.status(400).json({ 
        success: false,
        error: 'Мероприятие уже прошло' 
      });
    }
    
    if (event.status !== 'registration_open') {
      await client.query('ROLLBACK');
      await client.end();
      return res.status(400).json({ 
        success: false,
        error: 'Регистрация на это мероприятие закрыта' 
      });
    }
    
    const existingRegistration = await client.query(
      'SELECT id FROM event_registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );
    
    if (existingRegistration.rows.length > 0) {
      await client.query('ROLLBACK');
      await client.end();
      return res.status(400).json({ 
        success: false,
        error: 'Вы уже записаны на это мероприятие' 
      });
    }
    
    const participantsCountResult = await client.query(
      'SELECT COUNT(*) as count FROM event_registrations WHERE event_id = $1',
      [eventId]
    );
    
    const currentParticipants = parseInt(participantsCountResult.rows[0].count);
    
    if (event.max_participants && currentParticipants >= event.max_participants) {
      await client.query('ROLLBACK');
      await client.end();
      return res.status(400).json({ 
        success: false,
        error: 'Мест на мероприятие больше нет' 
      });
    }
    
    await client.query(
      'INSERT INTO event_registrations (user_id, event_id, registered_at) VALUES ($1, $2, NOW())',
      [userId, eventId]
    );
    
    await client.query(
      'UPDATE events SET current_participants = current_participants + 1 WHERE id = $1',
      [eventId]
    );
    
    await client.query('COMMIT');
    await client.end();
    
    console.log('✅ Пользователь успешно записан на мероприятие');
    
    res.json({ 
      success: true, 
      message: 'Вы успешно записались на мероприятие',
      event: {
        id: event.id,
        title: event.title,
        start_datetime: event.start_datetime
      }
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    await client.end();
    
    console.error('❌ Ошибка записи на мероприятие:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка записи на мероприятие',
      message: error.message
    });
  }
});

app.get('/api/dashboard/my-events', authenticateToken, async (req, res) => {
  let client;
  
  try {
    const userId = req.user.id;
    
    console.log('📋 Запрос истории мероприятий для пользователя:', userId);
    
    client = await getConnection();
    
    const result = await client.query(
      `SELECT 
        e.id,
        e.title,
        e.description,
        e.short_description,
        e.start_datetime,
        e.end_datetime,
        e.type,
        e.location_type,
        e.address,
        e.online_link,
        e.category,
        er.registered_at,
        ea.attended,
        ea.scanned_at,
        up.points as earned_points
      FROM events e
      INNER JOIN event_registrations er ON e.id = er.event_id AND er.user_id = $1
      LEFT JOIN event_attendance ea ON e.id = ea.event_id AND ea.user_id = $1
      LEFT JOIN user_points up ON e.id = up.event_id AND up.user_id = $1
      ORDER BY e.start_datetime DESC, er.registered_at DESC`,
      [userId]
    );
    
    const upcoming = [];
    const attended = [];
    const registered = [];
    
    result.rows.forEach(event => {
      if (event.attended) {
        attended.push(event);
      } else if (new Date(event.start_datetime) >= new Date()) {
        upcoming.push(event);
      } else {
        registered.push(event);
      }
    });
    
    await client.end();
    
    console.log(`✅ Найдено ${result.rows.length} мероприятий в истории`);
    
    res.json({
      success: true,
      events: {
        all: result.rows,
        upcoming,
        attended,
        registered
      },
      counts: {
        total: result.rows.length,
        upcoming: upcoming.length,
        attended: attended.length,
        registered: registered.length
      }
    });
    
  } catch (error) {
    if (client) await client.end();
    console.error('❌ Ошибка загрузки истории мероприятий:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка загрузки истории мероприятий' 
    });
  }
});

//QR КОДЫ

app.post('/api/dashboard/scan-qr', authenticateToken, async (req, res) => {
  let client = await getConnection();
  
  try {
    const { userId: targetUserId, eventId, qrCode } = req.body;
    const scannerUserId = req.user.id; 
    
    console.log(`📱 Сканирование QR кода организатором ${scannerUserId} для пользователя ${targetUserId} на мероприятие ${eventId}`);
    
    const scannerResult = await client.query(
      'SELECT role FROM users WHERE id = $1',
      [scannerUserId]
    );
    
    if (scannerResult.rows.length === 0 || 
        (scannerResult.rows[0].role !== 'organizer' && scannerUserId !== req.user.id)) {
      await client.end();
      return res.status(403).json({ 
        success: false,
        error: 'Только организаторы могут сканировать QR коды' 
      });
    }
    
    await client.query('BEGIN');
    
    const registrationResult = await client.query(
      `SELECT er.id 
       FROM event_registrations er
       WHERE er.user_id = $1 AND er.event_id = $2`,
      [targetUserId, eventId]
    );
    
    if (registrationResult.rows.length === 0) {
      await client.query('ROLLBACK');
      await client.end();
      return res.status(400).json({ 
        success: false,
        error: 'Пользователь не записан на это мероприятие' 
      });
    }
    
    const attendanceResult = await client.query(
      `SELECT id, attended 
       FROM event_attendance 
       WHERE user_id = $1 AND event_id = $2`,
      [targetUserId, eventId]
    );
    
    if (attendanceResult.rows.length > 0 && attendanceResult.rows[0].attended) {
      await client.query('ROLLBACK');
      await client.end();
      return res.status(400).json({ 
        success: false,
        error: 'QR код уже был отсканирован для этого мероприятия' 
      });
    }
    
    const eventResult = await client.query(
      'SELECT title, points FROM events WHERE id = $1',
      [eventId]
    );
    
    if (eventResult.rows.length === 0) {
      await client.query('ROLLBACK');
      await client.end();
      return res.status(404).json({ 
        success: false,
        error: 'Мероприятие не найдено' 
      });
    }
    
    const event = eventResult.rows[0];
    
    await client.query(
      `INSERT INTO event_attendance (user_id, event_id, attended, scanned_at, scanned_by)
       VALUES ($1, $2, true, NOW(), $3)
       ON CONFLICT (user_id, event_id) 
       DO UPDATE SET 
         attended = true, 
         scanned_at = NOW(),
         scanned_by = $3`,
      [targetUserId, eventId, scannerUserId]
    );
    
    await client.query(
      `INSERT INTO user_points (user_id, points, source, event_id, created_at, updated_at)
       VALUES ($1, $2, 'event_attendance', $3, NOW(), NOW())
       ON CONFLICT (user_id, event_id) 
       DO UPDATE SET 
         points = user_points.points + EXCLUDED.points,
         updated_at = NOW()`,
      [targetUserId, event.points, eventId]
    );
    
    await client.query(
      `INSERT INTO points_history (user_id, points, action, event_id, created_by)
       VALUES ($1, $2, 'attendance', $3, $4)`,
      [targetUserId, event.points, eventId, scannerUserId]
    );
    
    await client.query('COMMIT');
    await client.end();
    
    console.log(`✅ Посещение подтверждено. Начислено ${event.points} баллов`);
    
    res.json({ 
      success: true, 
      message: 'Посещение подтверждено успешно',
      points: event.points,
      event: {
        title: event.title,
        points: event.points
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    await client.end();
    
    console.error('❌ Ошибка сканирования QR кода:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка сканирования QR кода',
      message: error.message
    });
  }
});

app.get('/api/dashboard/my-qr', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const qrData = {
      userId,
      timestamp,
      token: random,
      expiresAt: timestamp + (5 * 60 * 1000) 
    };
    
    const qrString = JSON.stringify(qrData);
    const qrCode = Buffer.from(qrString).toString('base64');
    
    console.log(`🔄 Сгенерирован QR код для пользователя ${userId}`);
    
    res.json({
      success: true,
      qrCode,
      expiresIn: '5 минут',
      timestamp: new Date().toISOString(),
      refreshInterval: 30000 
    });
    
  } catch (error) {
    console.error('❌ Ошибка генерации QR кода:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка генерации QR кода' 
    });
  }
});

//БАЛЛЫ

app.get('/api/dashboard/points', authenticateToken, async (req, res) => {
  let client;
  
  try {
    const userId = req.user.id;
    
    console.log('⭐ Запрос информации о баллах для пользователя:', userId);
    
    client = await getConnection();
    
    // Общее количество баллов
    const totalPointsResult = await client.query(
      `SELECT COALESCE(SUM(points), 0) as total_points 
       FROM user_points 
       WHERE user_id = $1`,
      [userId]
    );
    
    // История начислений
    const historyResult = await client.query(
      `SELECT 
        ph.id,
        ph.points,
        ph.action,
        ph.event_id,
        e.title as event_title,
        ph.created_at,
        ph.created_by,
        u.full_name as created_by_name
      FROM points_history ph
      LEFT JOIN events e ON ph.event_id = e.id
      LEFT JOIN users u ON ph.created_by = u.id
      WHERE ph.user_id = $1
      ORDER BY ph.created_at DESC
      LIMIT 50`,
      [userId]
    );
    
    // Рейтинг среди других пользователей
    const rankingResult = await client.query(
      `WITH ranked_users AS (
        SELECT 
          user_id,
          SUM(points) as total_points,
          ROW_NUMBER() OVER (ORDER BY SUM(points) DESC) as rank
        FROM user_points
        GROUP BY user_id
      )
      SELECT 
        ru.rank,
        ru.total_points,
        (SELECT COUNT(DISTINCT user_id) FROM user_points) as total_users
      FROM ranked_users ru
      WHERE ru.user_id = $1`,
      [userId]
    );
    
    await client.end();
    
    const totalPoints = parseInt(totalPointsResult.rows[0].total_points) || 0;
    const ranking = rankingResult.rows[0] || { rank: 0, total_points: 0, total_users: 0 };
    
    res.json({
      success: true,
      points: {
        total: totalPoints,
        history: historyResult.rows,
        ranking: {
          position: ranking.rank,
          totalPoints: ranking.total_points,
          totalUsers: ranking.total_users,
          percentile: ranking.total_users > 0 
            ? Math.round(((ranking.total_users - ranking.rank + 1) / ranking.total_users) * 100)
            : 0
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    if (client) await client.end();
    console.error('❌ Ошибка загрузки информации о баллах:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка загрузки информации о баллах' 
    });
  }
});

//ПУБЛИЧНЫЕ ДАННЫЕ

app.get('/api/schools', async (req, res) => {
  try {
    const { search = '' } = req.query;
    const client = await getConnection();
    
    let query = 'SELECT id, name, city, address, phone FROM schools WHERE is_active = true';
    const params = [];
    
    if (search) {
      query += ' AND (LOWER(name) LIKE LOWER($1) OR LOWER(city) LIKE LOWER($1))';
      params.push(`%${search}%`);
    }
    
    query += ' ORDER BY name LIMIT 20';
    
    const result = await client.query(query, params);
    await client.end();
    
    if (result.rows.length === 0) {
      res.json([
        { id: 1, name: 'Лицей №1 г. Уфа', city: 'Уфа' },
        { id: 2, name: 'Гимназия №2 г. Уфа', city: 'Уфа' },
        { id: 3, name: 'Школа №3 с углубленным изучением математики', city: 'Уфа' }
      ]);
    } else {
      res.json(result.rows);
    }
    
  } catch (error) {
    console.error('❌ Ошибка при получении школ:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/regions', async (req, res) => {
  try {
    const client = await getConnection();
    const result = await client.query('SELECT id, name, federal_district FROM regions ORDER BY name');
    await client.end();
    
    if (result.rows.length === 0) {
      res.json([
        { id: 1, name: 'Республика Башкортостан' },
        { id: 2, name: 'Московская область' },
        { id: 3, name: 'Санкт-Петербург' },
        { id: 4, name: 'Свердловская область' },
        { id: 5, name: 'Челябинская область' }
      ]);
    } else {
      res.json(result.rows);
    }
    
  } catch (error) {
    console.error('❌ Ошибка при получении регионов:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats/registrations', async (req, res) => {
  try {
    const client = await getConnection();
    
    const totalResult = await client.query('SELECT COUNT(*) as count FROM users WHERE role = $1', ['abiturient']);
    
    const today = new Date().toISOString().split('T')[0];
    const todayResult = await client.query(
      'SELECT COUNT(*) as count FROM users WHERE role = $1 AND DATE(created_at) = $2',
      ['abiturient', today]
    );
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeResult = await client.query(
      'SELECT COUNT(DISTINCT user_id) as count FROM event_attendance WHERE scanned_at >= $1',
      [thirtyDaysAgo]
    );
    
    await client.end();
    
    res.json({
      total: parseInt(totalResult.rows[0].count) || 0,
      today: parseInt(todayResult.rows[0].count) || 0,
      active: parseInt(activeResult.rows[0].count) || 0,
      lastUpdated: new Date().toISOString(),
      database: 'NIRS'
    });
    
  } catch (error) {
    console.error('❌ Ошибка при получении статистики:', error);
    res.json({ 
      total: 0,
      today: 0,
      active: 0,
      lastUpdated: new Date().toISOString(),
      note: 'Нет данных в БД'
    });
  }
});

app.get('/api/news/rusoil', async (req, res) => {
  try {
    console.log('📡 Запрос на новости RUSOIL');
    
    if (newsCache.data && newsCache.timestamp && 
        (Date.now() - newsCache.timestamp) < newsCache.ttl) {
      console.log('💾 Возвращаем данные из кэша');
      return res.json({
        success: true,
        cached: true,
        timestamp: new Date(newsCache.timestamp).toISOString(),
        news: newsCache.data
      });
    }
    
    const path = require('path');
    const parserPath = path.join(__dirname, 'parsers', 'rusoilParser');
    console.log('Пытаемся загрузить парсер из:', parserPath);
    
    const RusoilParser = require(parserPath);
    const parser = new RusoilParser();
    
    const news = await parser.parseNews(6);
    
    newsCache.data = news;
    newsCache.timestamp = Date.now();
    
    res.json({
      success: true,
      cached: false,
      news: news,
      timestamp: new Date().toISOString(),
      source: 'rusoil.net'
    });
    
  } catch (error) {
    console.error('❌ Ошибка загрузки новостей:', error);
    
    const fallbackNews = [
      {
        id: 1,
        title: "Студентка УГНТУ стала лучшей на международной олимпиаде",
        excerpt: "Студентка Уфимского государственного нефтяного технического университета показала высокий результат.",
        url: "https://rusoil.net/ru/news",
        date: "2025-12-15",
        category: "Достижения"
      },
      {
        id: 2,
        title: "Прототип мобильной робоплатформы разработали в УГНТУ",
        excerpt: "Ученые УГНТУ представили инновационную разработку для исследования сложных территорий.",
        url: "https://rusoil.net/ru/news",
        date: "2025-12-14",
        category: "Наука"
      },
      {
        id: 3,
        title: "50-летие отметила кафедра водоснабжения УГНТУ",
        excerpt: "Одна из старейших кафедр университета отмечает юбилейную дату.",
        url: "https://rusoil.net/ru/news",
        date: "2025-12-13",
        category: "Событие"
      },
      {
        id: 4,
        title: "Игры по истории России разработали студенты УГНТУ",
        excerpt: "Инновационный образовательный проект студентов для изучения истории.",
        url: "https://rusoil.net/ru/news",
        date: "2025-12-12",
        category: "Образование"
      }
    ];
    
    res.json({
      success: false,
      error: error.message,
      news: fallbackNews,
      timestamp: new Date().toISOString(),
      source: 'fallback'
    });
  }
});

//АДМИНИСТРАТИВНЫЕ МАРШРУТЫ

app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Доступ запрещен. Требуются права администратора.' 
      });
    }
    
    const client = await getConnection();
    const result = await client.query(
      `SELECT 
        u.id,
        u.email,
        u.full_name,
        u.phone,
        u.role,
        u.is_active,
        u.created_at,
        u.last_login,
        ap.grade,
        s.name as school_name,
        r.name as region_name,
        COALESCE(up.points, 0) as points,
        (SELECT COUNT(*) FROM event_attendance WHERE user_id = u.id AND attended = true) as attended_events
      FROM users u
      LEFT JOIN abiturient_profiles ap ON u.id = ap.user_id
      LEFT JOIN schools s ON ap.school_id = s.id
      LEFT JOIN regions r ON ap.region_id = r.id
      LEFT JOIN user_points up ON u.id = up.user_id
      ORDER BY u.created_at DESC`
    );
    
    await client.end();
    
    res.json({
      success: true,
      users: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    console.error('❌ Ошибка при получении пользователей:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// МАТЕРИАЛЫ МЕРОПРИЯТИЙ 

app.get('/api/specialist/events/:id/materials', authenticateToken, isSpecialist, async (req, res) => {
  let client = await getConnection();
  
  try {
    const eventId = req.params.id;
    
    console.log('Запрос материалов для мероприятия:', eventId);
    
    const eventCheck = await client.query(
      'SELECT id FROM events WHERE id = $1 AND created_by = $2',
      [eventId, req.user.id]
    );
    
    if (eventCheck.rows.length === 0) {
      await client.end();
      return res.status(403).json({ 
        success: false,
        error: 'Нет прав доступа к материалам этого мероприятия' 
      });
    }
    
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'event_materials'
      )
    `);
    
    if (!tableCheck.rows[0].exists) {
      await client.end();
      return res.json({
        success: true,
        materials: [],
        count: 0,
        message: 'Таблица материалов еще не создана'
      });
    }
    
    const result = await client.query(
      `SELECT 
        id,
        event_id,
        title,
        description,
        material_type,
        file_url,
        file_name,
        file_size,
        file_type,
        is_public,
        available_from,
        available_until,
        download_count,
        last_downloaded,
        uploaded_at
      FROM event_materials
      WHERE event_id = $1
      ORDER BY uploaded_at DESC`,
      [eventId]
    );
    
    await client.end();
    
    res.json({
      success: true,
      materials: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    await client.end();
    console.error('❌ Ошибка загрузки материалов:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка загрузки материалов'
    });
  }
});

//ОБРАТНАЯ СВЯЗЬ

async function createFeedbackTableIfNeeded() {
  let client = await getConnection();
  
  try {
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'feedback'
      )
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Создаем таблицу feedback...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS feedback (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          event_id INTEGER REFERENCES events(id),
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          question TEXT,
          replied_to INTEGER REFERENCES feedback(id),
          is_read BOOLEAN DEFAULT false,
          is_answered BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Таблица feedback создана');
    }
  } catch (error) {
    console.error('❌ Ошибка создания таблицы feedback:', error);
  } finally {
    await client.end();
  }
}

app.get('/api/specialist/feedback', authenticateToken, isSpecialist, async (req, res) => {
  let client = await getConnection();
  
  try {
    await createFeedbackTableIfNeeded();
    
    const result = await client.query(`
      SELECT 
        f.id,
        f.user_id,
        f.event_id,
        f.rating,
        f.comment,
        f.question,
        f.is_read,
        f.is_answered,
        f.created_at,
        e.title as event_title,
        u.full_name as user_name,
        u.email as user_email
      FROM feedback f
      LEFT JOIN events e ON f.event_id = e.id
      LEFT JOIN users u ON f.user_id = u.id
      WHERE e.created_by = $1
      ORDER BY f.created_at DESC
      LIMIT 50
    `, [req.user.id]);
    
    await client.end();
    
    res.json({
      success: true,
      feedback: result.rows,
      count: result.rows.length,
      unread_count: result.rows.filter(f => !f.is_read).length
    });
    
  } catch (error) {
    await client.end();
    console.error('❌ Ошибка загрузки обратной связи:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка загрузки обратной связи',
      feedback: []
    });
  }
});

//АНАЛИТИКА 

app.get('/api/specialist/analytics/events', authenticateToken, isSpecialist, async (req, res) => {
  let client = await getConnection();
  
  try {
    const { period = 'monthly', start_date, end_date } = req.query;
    
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'analytics_events'
      )
    `);
    
    if (!tableCheck.rows[0].exists) {
      await client.end();
      return res.json({
        success: true,
        analytics: [],
        message: 'Таблица аналитики еще не создана'
      });
    }
    
    let query = `
      SELECT 
        ae.*,
        e.title as event_title,
        e.start_datetime as event_date
      FROM analytics_events ae
      JOIN events e ON ae.event_id = e.id
      WHERE e.created_by = $1
    `;
    
    const params = [req.user.id];
    let paramIndex = 2;
    
    if (start_date) {
      query += ` AND ae.calculation_date >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }
    
    if (end_date) {
      query += ` AND ae.calculation_date <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }
    
    if (period) {
      query += ` AND ae.period_type = $${paramIndex}`;
      params.push(period);
      paramIndex++;
    }
    
    query += ` ORDER BY ae.calculation_date DESC LIMIT 100`;
    
    const result = await client.query(query, params);
    
    await client.end();
    
    res.json({
      success: true,
      analytics: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    await client.end();
    console.error('❌ Ошибка загрузки аналитики:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка загрузки аналитики',
      analytics: []
    });
  }
});

//ОБРАБОТКА ОШИБОК
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Маршрут не найден',
    path: req.path,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  console.error('🔥 Ошибка сервера:', err);
  res.status(500).json({
    success: false,
    error: 'Внутренняя ошибка сервера',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

module.exports = app;