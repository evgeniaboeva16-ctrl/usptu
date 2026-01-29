const express = require('express');
const RusoilParser = require('../parsers/rusoilParser');
const router = express.Router();

const parser = new RusoilParser();

let cache = {
  data: null,
  timestamp: null,
  ttl: 15 * 60 * 1000
};

router.get('/rusoil', async (req, res) => {
  try {
    console.log('📡 Запрос на новости RUSOIL');
    const { limit = 4 } = req.query;
    console.log(`📊 Лимит: ${limit}`);

    if (cache.data && cache.timestamp && 
        (Date.now() - cache.timestamp) < cache.ttl) {
      console.log('💾 Возвращаем данные из кэша');
      return res.json({
        success: true,
        cached: true,
        timestamp: new Date(cache.timestamp).toISOString(),
        news: cache.data.slice(0, limit)
      });
    }

    console.log('🔄 Парсим свежие данные с сайта RUSOIL...');
    const news = await parser.parseNews(Number(limit));

    cache.data = news;
    cache.timestamp = Date.now();

    console.log(`✅ Успешно получено ${news.length} новостей`);
    
    res.json({
      success: true,
      cached: false,
      timestamp: new Date().toISOString(),
      news: news.slice(0, limit)
    });

  } catch (error) {
    console.error('❌ API Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      news: getFallbackNews() 
    });
  }
});

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API новостей работает!',
    endpoints: {
      '/rusoil': 'Получить новости с сайта RUSOIL',
      '/rusoil?limit=6': 'Получить указанное количество новостей',
      '/test': 'Тестовый эндпоинт'
    },
    cacheInfo: {
      hasCache: !!cache.data,
      cacheAge: cache.timestamp ? Math.floor((Date.now() - cache.timestamp) / 1000) + ' секунд назад' : 'Нет кэша',
      cacheTTL: Math.floor(cache.ttl / 60000) + ' минут'
    }
  });
});

// Запасные статические данные
function getFallbackNews() {
  console.log('⚠️ Используем запасные данные');
  
  return [
    {
      id: 1,
      title: "День открытых дверей в УГНТУ",
      excerpt: "Приглашаем всех абитуриентов и их родителей на традиционный день открытых дверей, который состоится 25 января.",
      url: "https://rusoil.net/ru/news",
      date: new Date().toISOString().split('T')[0],
      category: "Событие"
    },
    {
      id: 2,
      title: "Запуск новой лаборатории нефтегазового оборудования",
      excerpt: "В рамках программы модернизации материально-технической базы университета открылась современная лаборатория.",
      url: "https://rusoil.net/ru/news",
      date: "2024-12-10",
      category: "Развитие"
    },
    {
      id: 3,
      title: "Студенты УГНТУ победили на всероссийском хакатоне",
      excerpt: "Команда факультета информационных технологий заняла первое место в конкурсе по разработке цифровых решений для ТЭК.",
      url: "https://rusoil.net/ru/news",
      date: "2024-12-05",
      category: "Достижения"
    },
    {
      id: 4,
      title: "Заключено новое соглашение о партнерстве",
      excerpt: "Университет подписал соглашение с ведущей нефтегазовой компанией о сотрудничестве в области подготовки кадров.",
      url: "https://rusoil.net/ru/news",
      date: "2024-12-01",
      category: "Сотрудничество"
    },
    {
      id: 5,
      title: "Научная конференция по нефтегазовым технологиям",
      excerpt: "В УГНТУ прошла ежегодная научно-практическая конференция с участием ведущих специалистов отрасли.",
      url: "https://rusoil.net/ru/news",
      date: "2024-11-28",
      category: "Наука"
    },
    {
      id: 6,
      title: "Открытие нового спортивного комплекса",
      excerpt: "В университетском городке открылся современный спортивный комплекс с бассейном и тренажерными залами.",
      url: "https://rusoil.net/ru/news",
      date: "2024-11-25",
      category: "Спорт"
    }
  ];
}

module.exports = router;