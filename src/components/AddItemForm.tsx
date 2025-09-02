import React from 'react';

interface NewItem {
    name: string;
    price: string;
}

interface AddItemFormProps {
    newItem: NewItem;
    setNewItem: React.Dispatch<React.SetStateAction<{ name: string; price: string }>>;
    handleAddItem: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ newItem, setNewItem, handleAddItem }) => {
    return (
        <div className="mt-6 flex flex-col sm:flex-row gap-2 w-full max-w-md">
            <input
                className="flex-grow border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="text"
                value={newItem.name}
                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="New Item Name"
            />
            <input
                className="w-24 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="text"
                value={newItem.price}
                onChange={e => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                        setNewItem({ ...newItem, price: value });
                    }
                }}
                placeholder="Price"
            />
            <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                onClick={handleAddItem}
            >
                Add
            </button>
        </div>
    );
};

export default AddItemForm;
