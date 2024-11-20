import React, { useState } from 'react';
import { api } from '../../services/api';

interface AdminActionsProps {
  onRefresh: () => void;
}

const AdminActions: React.FC<AdminActionsProps> = ({ onRefresh }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleAddCard = async () => {
    try {
      await api.post('/admin/cards', {
        name,
        category,
        description,
        photoUrl,
        visible: true,
      });
      onRefresh();
      setName('');
      setCategory('');
      setDescription('');
      setPhotoUrl('');
    } catch (err) {
      console.error('Ошибка добавления карточки:', err);
    }
  };

  return (
    <div>
      <h3>Добавить карточку</h3>
      <input
        type="text"
        placeholder="Название"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Категория"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="URL фото"
        value={photoUrl}
        onChange={(e) => setPhotoUrl(e.target.value)}
      />
      <button onClick={handleAddCard}>Добавить</button>
    </div>
  );
};

export default AdminActions;