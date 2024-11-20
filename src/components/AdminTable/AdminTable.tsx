// AdminTable.tsx
import React from 'react';
import './AdminTable.css';

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

interface AdminTableProps {
  cards: Card[];
  onSelectCard: (id: number) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({ cards, onSelectCard }) => {
  return (
    <div className="admin-table-container">
      <h2>Admin Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Date Added</th>
            <th>Date Edited</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card.id}>
              <td>{card.id}</td>
              <td>{card.name}</td>
              <td>{card.category}</td>
              <td>{new Date(card.dateAdded).toLocaleDateString()}</td>
              <td>{card.dateEdit ? new Date(card.dateEdit).toLocaleDateString() : "No edits"}</td>
              <td>
                <button onClick={() => onSelectCard(card.id)}>Выбрать</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
