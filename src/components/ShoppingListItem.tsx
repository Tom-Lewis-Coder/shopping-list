import React from 'react';
import { DraggableProvided } from '@hello-pangea/dnd';

interface Item {
    id: number;
    name: string;
    price: number;
    isBought: boolean;
}

interface ShoppingListItemProps {
    item: Item
    provided: DraggableProvided;
    toggleBoughtItem: (id: number) => void;
    handleDeleteItem: (id: number) => void;
}

const ShoppingListItem: React.FC<ShoppingListItemProps> = ({
    item,
    provided,
    toggleBoughtItem,
    handleDeleteItem
}) => {
    return (
        <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="flex justify-between items-center bg-white p-3 mb-2 rounded shadow hover:shadow-md transition"
        >
            <input
                type="checkbox"
                checked={item.isBought}
                onChange={() => toggleBoughtItem(item.id)}
                className="mr-2"
            />
            <span
                className={`flex-grow ${item.isBought ? 'line-through text-gray-400' : ''}`}
            >
                {item.name} - £{item.price.toFixed(2)}
            </span>
            <button
                onClick={() => handleDeleteItem(item.id)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition mr-2"
            >
                Delete
            </button>
            <span {...provided.dragHandleProps} className="cursor-grab text-gray-500">
                ⠿
            </span>
        </li>
    );
};

export default ShoppingListItem;
