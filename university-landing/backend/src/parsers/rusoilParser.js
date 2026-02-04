const axios = require('axios');
const cheerio = require('cheerio');

class RusoilParser {
  constructor() {
    this.baseUrl = 'https://rusoil.net';
    this.newsUrl = `${this.baseUrl}/ru/news`;
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  }

  async parseNews(limit = 6) {
    try {
      console.log(`Парсим новости с: ${this.newsUrl}`);
      
      const { data } = await axios.get(this.newsUrl, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        },
        timeout: 15000
      });

      const $ = cheerio.load(data);
      const newsItems = [];

      console.log('Поиск новостей на сайте...');

      // Метод 1: Ищем все article элементы с data-history-node-id
      $('article[data-history-node-id]').each((index, element) => {
        if (index >= limit) return false;

        const $element = $(element);
        
        // Извлекаем данные
        const title = $element.find('.news-card__title').text().trim() || 
                     $element.find('h2, h3').first().text().trim();
        const date = $element.find('.news-card__date').text().trim() || 
                    $element.find('.date').first().text().trim();
        const categoryElement = $element.find('.news-card__tag span');
        const category = categoryElement.length ? categoryElement.text().trim() : 
                       $element.find('.category, .tag').first().text().trim();
        
        const link = $element.find('a.news-card').attr('href') || 
                    $element.find('a').first().attr('href') || '';
        
        const image = $element.find('img').attr('src') || '';
        
        if (title && link) {
          const formattedDate = this.formatDate(date);
          
          newsItems.push({
            id: index + 1,
            title: title,
            excerpt: this.generateExcerptFromTitle(title),
            url: this.normalizeUrl(link),
            date: formattedDate,
            category: category || 'Новости',
            image: image ? this.normalizeUrl(image) : ''
          });
          
          console.log(`📰 Найдена новость: ${title.substring(0, 50)}...`);
        }
      });

      // Метод 2: Если первый метод не нашел новости, ищем в .news-page__grid
      if (newsItems.length === 0) {
        console.log('🔄 Используем альтернативный метод поиска...');
        
        $('.news-page__grid article, .view-content article').each((index, element) => {
          if (index >= limit) return false;

          const $element = $(element);
          
          // Используем разные возможные селекторы
          const title = $element.find('.news-card__title, .title, h3').text().trim();
          const date = $element.find('.news-card__date, .date, time').text().trim();
          const link = $element.find('a').attr('href') || '';
          
          if (title && link) {
            newsItems.push({
              id: index + 1,
              title: title,
              excerpt: this.generateExcerptFromTitle(title),
              url: this.normalizeUrl(link),
              date: this.formatDate(date),
              category: 'Новости',
              image: ''
            });
          }
        });
      }

      console.log(`✅ Найдено новостей: ${newsItems.length}`);

      // Метод 3: Прямой поиск по структуре кода
      if (newsItems.length === 0) {
        console.log('🔄 Используем прямой парсинг структуры HTML...');
        return await this.directHTMLParse($, limit);
      }

      return newsItems.slice(0, limit);

    } catch (error) {
      console.error('❌ Ошибка парсинга:', error.message);
      console.error('Stack:', error.stack);
      return this.getFallbackNews();
    }
  }

  // Прямой парсинг HTML структуры
  async directHTMLParse($, limit) {
    const newsItems = [];
    let count = 0;
    
    // Ищем все article элементы в документе
    $('article').each((index, element) => {
      if (count >= limit) return false;
      
      const $element = $(element);
      const html = $element.html();
      
      // Извлекаем заголовок
      let title = '';
      const titleMatch = html.match(/class="[^"]*news-card__title[^"]*"[^>]*>([^<]+)</) ||
                       html.match(/<h[23][^>]*>([^<]+)</);
      if (titleMatch) title = titleMatch[1].trim();
      
      // Извлекаем дату
      let date = '';
      const dateMatch = html.match(/class="[^"]*news-card__date[^"]*"[^>]*>([^<]+)</) ||
                      html.match(/<time[^>]*>([^<]+)</);
      if (dateMatch) date = dateMatch[1].trim();
      
      // Извлекаем ссылку
      let link = '';
      const linkMatch = html.match(/href="([^"]+news[^"]+)"/);
      if (linkMatch) link = linkMatch[1];
      
      // Извлекаем категорию
      let category = '';
      const categoryMatch = html.match(/class="[^"]*news-card__tag[^"]*"[^>]*>\s*<span[^>]*>([^<]+)</);
      if (categoryMatch) category = categoryMatch[1].trim();
      
      // Извлекаем изображение
      let image = '';
      const imageMatch = html.match(/src="([^"]+\.(?:jpg|jpeg|png|gif)[^"]*)"/i);
      if (imageMatch) image = imageMatch[1];
      
      if (title && link) {
        newsItems.push({
          id: ++count,
          title: title,
          excerpt: this.generateExcerptFromTitle(title),
          url: this.normalizeUrl(link),
          date: this.formatDate(date),
          category: category || 'Новости',
          image: image ? this.normalizeUrl(image) : ''
        });
        
        console.log(`📰 Найдена новость (прямой парсинг): ${title.substring(0, 50)}...`);
      }
    });
    
    return newsItems;
  }

  formatDate(dateString) {
    if (!dateString) return new Date().toISOString().split('T')[0];
    
    // Удаляем лишние пробелы и символы
    dateString = dateString.replace(/\s+/g, ' ').trim();
    
    // Паттерны для распознавания даты
    const patterns = [
      /(\d{1,2})\.(\d{1,2})\.(\d{4})/,           // 26.12.2025
      /(\d{4})-(\d{1,2})-(\d{1,2})/,             // 2025-12-26
      /(\d{1,2})\s+([а-я]+)\s+(\d{4})/i,         // 26 декабря 2025
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,           // 26/12/2025
    ];

    for (const pattern of patterns) {
      const match = dateString.match(pattern);
      if (match) {
        try {
          let day, month, year;
          
          if (pattern === patterns[0] || pattern === patterns[3]) {
            // DD.MM.YYYY или DD/MM/YYYY
            day = match[1].padStart(2, '0');
            month = match[2].padStart(2, '0');
            year = match[3];
            return `${year}-${month}-${day}`;
          } else if (pattern === patterns[1]) {
            // YYYY-MM-DD
            return dateString;
          } else if (pattern === patterns[2]) {
            // DD Month YYYY
            day = match[1].padStart(2, '0');
            const months = {
              'января': '01', 'февраля': '02', 'марта': '03', 'апреля': '04',
              'мая': '05', 'июня': '06', 'июля': '07', 'августа': '08',
              'сентября': '09', 'октября': '10', 'ноября': '11', 'декабря': '12',
              'янв': '01', 'фев': '02', 'мар': '03', 'апр': '04',
              'май': '05', 'июн': '06', 'июл': '07', 'авг': '08',
              'сен': '09', 'окт': '10', 'ноя': '11', 'дек': '12'
            };
            const monthName = match[2].toLowerCase();
            month = months[monthName] || '01';
            year = match[3];
            return `${year}-${month}-${day}`;
          }
        } catch (e) {
          console.log('Ошибка форматирования даты:', e);
        }
      }
    }
    
    // Если не распознали, возвращаем сегодняшнюю дату
    return new Date().toISOString().split('T')[0];
  }

  generateExcerptFromTitle(title) {
    if (!title) return '';
    if (title.length <= 120) return title;
    return title.substring(0, 117) + '...';
  }

  normalizeUrl(url) {
    if (!url) return this.newsUrl;
    if (url.startsWith('http')) return url;
    if (url.startsWith('//')) return `https:${url}`;
    if (url.startsWith('/')) return `${this.baseUrl}${url}`;
    return `${this.baseUrl}/${url}`;
  }

  async debugPageStructure() {
    try {
      const { data } = await axios.get(this.newsUrl, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 10000
      });

      const $ = cheerio.load(data);
      
      console.log('=== ДЕБАГ СТРУКТУРЫ СТРАНИЦЫ ===');
      
      // 1. Ищем все article элементы
      const articles = $('article');
      console.log(`Найдено элементов article: ${articles.length}`);
      
      if (articles.length > 0) {
        console.log('\nСодержимое первых 3 статей:');
        articles.slice(0, 3).each((i, el) => {
          const $el = $(el);
          console.log(`\n--- Статья ${i+1} ---`);
          console.log('Классы:', $el.attr('class'));
          console.log('data-history-node-id:', $el.attr('data-history-node-id'));
          console.log('Заголовок:', $el.find('.news-card__title').text().trim());
          console.log('Дата:', $el.find('.news-card__date').text().trim());
          console.log('Ссылка:', $el.find('a').attr('href'));
        });
      }
      
      // 2. Ищем контейнеры новостей
      console.log('\n=== Контейнеры новостей ===');
      const containers = ['.news-page__grid', '.view-content', '.news-page__grid-wrapper'];
      containers.forEach(selector => {
        const elements = $(selector);
        console.log(`${selector}: ${elements.length} элементов`);
      });
      
      // 3. Проверяем наличие JavaScript-рендеринга
      const scriptTags = $('script');
      console.log(`\nНайдено script тегов: ${scriptTags.length}`);
      
      // 4. Ищем данные в атрибутах data-
      console.log('\n=== data-атрибуты ===');
      $('[data-history-node-id]').slice(0, 3).each((i, el) => {
        const $el = $(el);
        console.log(`Элемент ${i+1}:`, {
          id: $el.attr('data-history-node-id'),
          classes: $el.attr('class'),
          title: $el.find('.news-card__title').text().trim().substring(0, 50)
        });
      });

    } catch (error) {
      console.error('Ошибка отладки:', error.message);
    }
  }

  getFallbackNews() {
    console.log('⚠️ Возвращаем запасные новости');
    
    return [
      {
        id: 1,
        title: "Итоги 2025 года подвёл ректор УГНТУ Олег Баулин",
        excerpt: "Ректор Уфимского государственного нефтяного технического университета подвел итоги года.",
        url: "https://rusoil.net/ru/news/itogi-2025-goda-podvyol-rektor-ugntu-oleg-baulin",
        date: "2025-12-26",
        category: "Главное",
        image: ""
      },
      {
        id: 2,
        title: "Библиотека материалов для будущих дизайнеров открылась в УГНТУ",
        excerpt: "В университете открылась специализированная библиотека материалов для дизайнеров.",
        url: "https://rusoil.net/ru/news/biblioteka-materialov-dlya-buduschikh-dizaynerov-otkrylas-v-ugntu",
        date: "2025-12-26",
        category: "Образование",
        image: ""
      },
      {
        id: 3,
        title: "ООО «Газпром межрегионгаз» расширяет сотрудничество с УГНТУ",
        excerpt: "Компания «Газпром межрегионгаз» и УГНТУ подписали соглашение о расширении сотрудничества.",
        url: "https://rusoil.net/ru/news/ooo-gazprom-mezhregiongaz-rasshiryaet-sotrudnichestvo-s-ugntu",
        date: "2025-12-25",
        category: "Партнерство",
        image: ""
      },
      {
        id: 4,
        title: "Студентов-архитекторов УГНТУ наградили за проект благоустройства сквера в Уфе",
        excerpt: "Студенты-архитекторы получили награду за проект благоустройства городского сквера.",
        url: "https://rusoil.net/ru/news/studentov-arkhitektorov-ugntu-nagradili-za-proekt-blagoustroystva-skvera-v-ufe",
        date: "2025-12-25",
        category: "Кампус",
        image: ""
      }
    ];
  }
}

module.exports = RusoilParser;