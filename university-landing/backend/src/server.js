require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(60));
  console.log('Сервер UniVerse успешно запущен!');
  console.log(`Локальный адрес: http://localhost:${PORT}`);
  console.log('\nОсновные эндпоинты:');
  console.log(`   • http://localhost:${PORT}/`);
  console.log(`   • http://localhost:${PORT}/health`);
  console.log(`   • http://localhost:${PORT}/api/register`);
  console.log(`   • http://localhost:${PORT}/api/news/rusoil`);
  console.log(`   http://localhost:${PORT}/health`);
});