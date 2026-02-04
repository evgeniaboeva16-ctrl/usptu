<!-- AnalyticsDashboard.vue -->
<template>
  <div class="analytics-section">
    <div class="section-header">
      <h1>Аналитика</h1>
      <p class="section-subtitle">Обзор деятельности</p>
      
      <!-- Выпадающий список с годами -->
      <div class="year-selector">
        <div class="selector-label">Год:</div>
        <select v-model="selectedYear" class="year-dropdown">
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025" selected>2025</option>
        </select>
      </div>
    </div>

    <!-- Первый блок: Статистика мероприятий -->
    <div class="metrics-section">
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Прошедшие мероприятия</div>
          <div class="metric-value">1517</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-label">Активные мероприятия</div>
          <div class="metric-value">34</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-label">Будущие мероприятия</div>
          <div class="metric-value">108</div>
        </div>
      </div>
    </div>

    <!-- Второй блок: Две таблицы на одном уровне -->
    <div class="tables-grid">
      <!-- Таблица "Популярность мероприятий" -->
      <div class="table-section popularity-section">
        <h2 class="section-title">Популярность мероприятий</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Вид мероприятия</th>
                <th>Кол-во зарегистрировавшихся</th>
                <th>Кол-во посетивших</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Научно-практическая конференция</td>
                <td>210</td>
                <td>181</td>
              </tr>
              <tr>
                <td>Профориентационный проект "УГНТУ и точка"</td>
                <td>180</td>
                <td>163</td>
              </tr>
              <tr>
                <td>Профориентационный проект "Выбирай УГНТУ"</td>
                <td>146</td>
                <td>120</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Таблица "Топ локаций" -->
      <div class="table-section locations-section">
        <h2 class="section-title">Топ локаций</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Локация</th>
                <th>Кол-во абитуриентов</th>
                <th>Кол-во студентов</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Республика Башкортостан</td>
                <td>1000</td>
                <td>800</td>
              </tr>
              <tr>
                <td>Челябинская область</td>
                <td>850</td>
                <td>720</td>
              </tr>
              <tr>
                <td>Республика Татарстан</td>
                <td>750</td>
                <td>650</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Выбранный год (по умолчанию 2025)
const selectedYear = ref('2025')
</script>

<style scoped>
.analytics-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px;
  min-height: 100vh;
  background: #f8f9fa;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 10px;
}

.section-header h1 {
  margin: 0 0 5px 0;
  font-size: 32px;
  color: #333;
  background: linear-gradient(90deg, #622A97, #CB79DA);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 18px;
  font-weight: 500;
}

.year-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.selector-label {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.year-dropdown {
  padding: 8px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #622A97;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;
}

.year-dropdown:focus {
  outline: none;
  border-color: #CB79DA;
  box-shadow: 0 0 0 3px rgba(203, 121, 218, 0.1);
}

.year-dropdown:hover {
  border-color: #CB79DA;
}

.metrics-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.metric-card {
  background: linear-gradient(135deg, #f9f7ff, #f0ebff);
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e8e2ff;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(98, 42, 151, 0.15);
}

.metric-label {
  font-size: 16px;
  color: #666;
  margin-bottom: 15px;
  font-weight: 500;
}

.metric-value {
  font-size: 42px;
  font-weight: 700;
  color: #622A97;
  margin-bottom: 8px;
  line-height: 1;
}


.tables-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.table-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.table-container {
  overflow-x: auto;
  margin-top: 10px;
  flex-grow: 1;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-height: 200px;
}

thead {
  background: linear-gradient(90deg, #622A97, #CB79DA);
}

thead th {
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  font-size: 16px;
}

tbody tr {
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s;
}

tbody tr:hover {
  background-color: #f9f7ff;
}

tbody td {
  padding: 15px;
  color: #555;
  font-size: 15px;
}

tbody td:first-child {
  font-weight: 500;
  color: #333;
}

tbody tr:nth-child(even) {
  background-color: #fafafa;
}

tbody tr:nth-child(even):hover {
  background-color: #f9f7ff;
}

/* Стилизация для номеров в таблицах */
tbody td:not(:first-child) {
  text-align: center;
  font-weight: 600;
  color: #622A97;
}

@media (max-width: 1024px) {
  .tables-grid {
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .analytics-section {
    padding: 15px;
    gap: 20px;
  }
  
  .section-header h1 {
    font-size: 28px;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .metric-card {
    padding: 25px 15px;
  }
  
  .metric-value {
    font-size: 36px;
  }
  
  .tables-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .table-section {
    padding: 20px;
  }
  
  thead th,
  tbody td {
    padding: 12px 10px;
    font-size: 14px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .year-selector {
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
  
  .year-dropdown {
    width: 100%;
    max-width: 200px;
  }
}
</style>