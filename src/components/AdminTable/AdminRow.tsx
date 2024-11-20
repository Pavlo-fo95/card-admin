import React from 'react';
import { api } from '../../services/api';

interface Card {
  id: number;
  name: string;
  category: string;
  description: string;
  photoUrl: string;
  visible: boolean;
}

interface AdminRowProps {
  card: Card;
  onEdit: () => void; // Новый пропс для редактирования
}

const AdminRow: React.FC<AdminRowProps> = ({ card, onEdit }) => {
  const toggleVisibility = async () => {
    try {
      await api.put(`/admin/cards/${card.id}`, { ...card, visible: !card.visible });
    } catch (err) {
      console.error('Ошибка обновления:', err);
    }
  };

  return (
    <tr>
      <td>{card.name}</td>
      <td>{card.category}</td>
      <td>
        <button onClick={toggleVisibility}>
          {card.visible ? 'Скрыть' : 'Показать'}
        </button>
        <button onClick={onEdit}>Редактировать</button>
      </td>
    </tr>
  );
};

export default AdminRow;;