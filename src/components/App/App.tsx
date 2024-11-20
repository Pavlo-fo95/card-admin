import React, { useState, useEffect } from 'react';
import LoginForm from '../Auth/LoginForm';
import AdminTable from '../AdminTable/AdminTable';
import CardEditor from '../CardEditor/CardEditor';
import './App.css';
import axios from 'axios';

export interface Card {
  id: number;
  name: string;
  category: string;
  description: string;
  photoUrl: string;
  dateAdded: string; // ISO-формат даты
  dateEdit: string | null;
  visible: boolean;
}

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных карточек
  const fetchCards = async () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    try { 
      setError(null); // Очистка ошибок перед новым запросом
      const response = await axios.get<Card[]>('http://localhost:5283/api/Admin/cards');
      console.log('Данные карточек:', response.data);
      setCards(response.data);
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
      setError('Ошибка при загрузке данных. Проверьте подключение к серверу.');
    }
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchCards();
  }, []);

  // Сохранение карточки (добавление/обновление)
  const handleSave = async (updatedCard: Card) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    try {
      setError(null); // Очистка ошибок перед началом операции
      if (updatedCard.id) {
        // Обновление карточки
        const response = await axios.put(
          `http://localhost:5283/api/Admin/cards/${updatedCard.id}`,
          updatedCard
        );
        console.log('Обновленная карточка:', response.data);
        setCards((prev) =>
          prev.map((card) => (card.id === updatedCard.id ? response.data : card))
        );
      } else {
        // Добавление новой карточки
        const response = await axios.post('http://localhost:5283/api/Admin/cards', updatedCard);
        console.log('Новая карточка:', response.data);
        setCards((prev) => [...prev, response.data]);
      }
      setSelectedCardId(null);
    } catch (err) {
      console.error('Ошибка при сохранении карточки:', err);
      setError('Ошибка при сохранении данных. Проверьте подключение к серверу.');
    }
  };

  // Удаление карточки
  const handleDelete = async (id: number) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    try {
      setError(null); // Очистка ошибок перед началом операции
      await axios.delete(`http://localhost:5283/api/Admin/cards/${id}`);
      console.log('Карточка удалена:', id);
      setCards((prev) => prev.filter((card) => card.id !== id));
      setSelectedCardId(null);
    } catch (err) {
      console.error('Ошибка при удалении карточки:', err);
      setError('Ошибка при удалении данных. Проверьте подключение к серверу.');
    }
  };

  // if (error) {
  //   return <div className="error-message">{error}</div>;
  // }

  return (
    <div className="container">
      <div className="admin-dashboard">
        <div className="top-bar">
          {!token ? (
            <LoginForm onLoginSuccess={setToken} />
          ) : (
            <div>
              <h2>Авторизация выполнена</h2>
              <button className="logout-button" onClick={() => setToken(null)}>
                Выйти
              </button>
            </div>
          )}
        </div>

        <div className="main-content">
          <div className="left-section">
            {selectedCardId && (
              <CardEditor
                card={cards.find((card) => card.id === selectedCardId) as Card}
                onSave={handleSave}
                onDelete={handleDelete}
                onCancel={() => setSelectedCardId(null)}
              />
            )}
          </div>
          <div className="right-section">
            <AdminTable cards={cards} onSelectCard={setSelectedCardId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
