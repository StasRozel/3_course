const axios = require('axios');
const WebSocket = require('ws');
const readline = require('readline');

const BASE_URL = 'http://localhost:3000';
const WS_URL = 'ws://localhost:3000';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

function setupWebSocket() {
  const ws = new WebSocket(WS_URL);

  ws.on('open', () => {
    console.log('WebSocket подключен');
  });

  ws.on('message', (data) => {
    console.log('Уведомление получено:', JSON.parse(data));
  });

  ws.on('close', () => {
    console.log('WebSocket отключен');
  });

  ws.on('error', (error) => {
    console.log('Ошибка WebSocket:', error.message);
  });

  return ws;
}

async function executeSingleRequest(option) {
  try {
    switch (option) {
      case '1':
        const allStudents = await axios.get(`${BASE_URL}/`);
        console.log('Список студентов:', allStudents.data);
        break;
      case '2':
        rl.question('Введите ID студента: ', (id) => {
          rl.question('Введите имя студента: ', (name) => {
            rl.question('Введите дату рождения студента (формат YYYY-MM-DD): ', async (bday) => {
              if (!isValidDate(bday)) {
                console.error('Неверный формат даты. Используйте формат YYYY-MM-DD');
                showMenu();
                return;
              }
              rl.question('Введите специальность студента: ', async (speciality) => {
                const newStudent = { id, name, bday, speciality };
                try {
                  const addedStudent = await axios.post(`${BASE_URL}/`, newStudent);
                  console.log('Добавленный студент:', addedStudent.data);
                } catch (error) {
                  console.error('Ошибка:', error.response?.data || error.message);
                }
                showMenu();
              });
            });
          });
        });
        return; 
      case '3':
        rl.question('Введите ID студента: ', async (id) => {
          try {
            const studentInfo = await axios.get(`${BASE_URL}/${id}`);
            console.log('Информация о студенте:', studentInfo.data);
          } catch (error) {
            console.error('Ошибка:', error.response?.data || error.message);
          }
          showMenu();
        });
        return;
      case '4':
        rl.question('Введите ID студента для обновления: ', (id) => {
          rl.question('Введите новое имя студента: ', (name) => {
            rl.question('Введите новую дату рождения студента (формат YYYY-MM-DD): ', async (bday) => {
              if (!isValidDate(bday)) {
                console.error('Неверный формат даты. Используйте формат YYYY-MM-DD');
                showMenu();
                return;
              }
              rl.question('Введите новую специальность студента: ', async (speciality) => {
                const updatedStudent = { id, name, bday, speciality };
                try {
                  const updatedResponse = await axios.put(`${BASE_URL}/`, updatedStudent);
                  console.log('Обновленный студент:', updatedResponse.data);
                } catch (error) {
                  console.error('Ошибка:', error.response?.data || error.message);
                }
                showMenu();
              });
            });
          });
        });
        return;
      case '5':
        rl.question('Введите ID студента для удаления: ', async (id) => {
          try {
            const deletedStudent = await axios.delete(`${BASE_URL}/${id}`);
            console.log('Удаленный студент:', deletedStudent.data);
          } catch (error) {
            console.error('Ошибка:', error.response?.data || error.message);
          }
          showMenu();
        });
        return;
      case '6':
        const backupResponse = await axios.post(`${BASE_URL}/backup`);
        console.log('Создана резервная копия:', backupResponse.data);
        break;
      case '7':
        const backupsList = await axios.get(`${BASE_URL}/backup`);
        console.log('Список резервных копий:', backupsList.data);
        break;
      case '8':
        rl.question('Введите дату для удаления резервных копий (формат yyyymmdd): ', async (date) => {
          try {
            const removedBackups = await axios.delete(`${BASE_URL}/backup/${date}`);
            console.log('Удаленные резервные копии:', removedBackups.data);
          } catch (error) {
            console.error('Ошибка:', error.response?.data || error.message);
          }
          showMenu();
        });
        return;
      default:
        console.log('Неверный выбор');
    }
  } catch (error) {
    console.error('Ошибка:', error.response?.data || error.message);
  }
  showMenu();
}

function showMenu() {
  console.log('\n=== Меню тестирования API ===');
  console.log('1. Получить список всех студентов');
  console.log('2. Добавить нового студента');
  console.log('3. Получить информацию о студенте');
  console.log('4. Обновить информацию о студенте');
  console.log('5. Удалить студента');
  console.log('6. Создать резервную копию');
  console.log('7. Получить список резервных копий');
  console.log('8. Удалить старые резервные копии');
  console.log('0. Выход');
  
  rl.question('\nВыберите опцию: ', async (option) => {
    if (option === '0') {
      console.log('Выход из программы...');
      rl.close();
      if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
        wsConnection.close();
      }
      return;
    } else {
      await executeSingleRequest(option);
    }
  });
}

async function main() {
  const wsConnection = setupWebSocket();
  
  showMenu();
}

let wsConnection;

main().catch(error => {
  console.error('Критическая ошибка:', error);
  if (rl) rl.close();
  if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
    wsConnection.close();
  }
  process.exit(1);
});