// CardEditor.tsx
import React, { useState } from "react";
import { Card } from "../App/App";
import "./CardEditor.css";
import axios from "axios";

interface CardEditorProps {
  card: Card;
  onSave: (updatedCard: Card) => void;
  onDelete: (id: number) => void;
  onCancel: () => void;
}

const CardEditor: React.FC<CardEditorProps> = ({
  card,
  onSave,
  onDelete,
  onCancel,
}) => {
  const [updatedCard, setUpdatedCard] = useState<Card>(card);
  const [loadingImage, setLoadingImage] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedCard((prevCard) => ({ ...prevCard, [name]: value }));
  };

  const handleGeneratePhoto = async () => {
    setLoadingImage(true);
    try {
      const response = await axios.post(
        "https://localhost:7103/api/Admin/generate-photo",
        {
          description: updatedCard.description,
        }
      );

      const imageUrl = response.data.photoUrl;
      setUpdatedCard((prevCard) => ({ ...prevCard, photoUrl: imageUrl }));
    } catch (error) {
      console.error("Ошибка при генерации изображения:", error);
    } finally {
      setLoadingImage(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://localhost:7103/api/Admin/cards/${updatedCard.id}`,
        updatedCard
      );
      onSave(response.data); // Передаём обновленную карточку вверх
    } catch (error) {
      console.error("Ошибка при сохранении карточки:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://localhost:7103/api/Admin/cards/${updatedCard.id}`
      );
      onDelete(updatedCard.id); // Удаляем карточку
    } catch (error) {
      console.error("Ошибка при удалении карточки:", error);
    }
  };

  return (
    <div className="card-editor">
      <h2>Редактор карточки</h2>
      <input
        type="text"
        name="name"
        value={updatedCard.name}
        onChange={handleChange}
        placeholder="Название"
      />
      <input
        type="text"
        name="category"
        value={updatedCard.category}
        onChange={handleChange}
        placeholder="Категория"
      />
      <textarea
        name="description"
        value={updatedCard.description}
        onChange={handleChange}
        placeholder="Описание"
      />
      <div className="image-preview">
        {updatedCard.photoUrl ? (
          <img src={updatedCard.photoUrl} alt="Превью изображения" />
        ) : (
          <p>Изображение не добавлено</p>
        )}
      </div>
      <button
        className="generate-button"
        onClick={handleGeneratePhoto}
        disabled={loadingImage}
      >
        {loadingImage ? "Генерация..." : "Генерировать изображение"}
      </button>
      <button className="save-button" onClick={handleSave}>
        Сохранить
      </button>
      <button className="delete-button" onClick={handleDelete}>
        Удалить
      </button>
      <button className="cancel-button" onClick={onCancel}>
        Отмена
      </button>
    </div>
  );
};

export default CardEditor;