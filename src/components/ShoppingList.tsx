import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Item {
    id: number;
    name: string;
    price: number;
    isBought: boolean;
}

const ShoppingList = () => {
    const [items, setItems] = useState<Item[]>(() => {
        const saved = localStorage.getItem('itemData');
        return saved ? JSON.parse(saved) : [];
    });
    const [newItem, setNewItem] = useState({ name: '', price: '' });
        const [spendLimit, setSpendLimit] = useState<number>(() => {
        const saved = localStorage.getItem('spendLimit');
        return saved ? JSON.parse(saved) : 0;
    });
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'demo' && password === 'demo123') {
            setIsLoggedIn(true);
            localStorage.setItem('isLoggedIn', 'true');
            setUsername('');
            setPassword('');
        } else {
            alert('Invalid credentials (hint: demo / demo123)');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
    };

    useEffect(() => {
        localStorage.setItem('itemData', JSON.stringify(items));
    }, [items]);

    const toggleBoughtItem = (id: number) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, isBought: !item.isBought } : item
        ));
    };

    const handleAddItem = () => {
        if (!newItem.name.trim() || !newItem.price.trim()) return;
        if (items.find(item => item.name.toLowerCase() === newItem.name.toLowerCase())) {
            alert('Item already exists');
            return;
        }
        setItems([
            ...items,
            { id: Date.now(), name: newItem.name, price: parseFloat(newItem.price), isBought: false }
        ]);
        setNewItem({ name: '', price: '' });
    };

    const handleDeleteItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const reorderedItems = Array.from(items);
        const [removed] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, removed);
        setItems(reorderedItems);
    };

    const total = items.reduce((acc, item) => acc + item.price, 0);

    useEffect(() => {
        localStorage.setItem('spendLimit', JSON.stringify(spendLimit));
    }, [spendLimit]);
    

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-300">
                <div className="bg-white shadow-md rounded-lg p-8 w-80">
                    <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                    <form onSubmit={handleLogin} className="flex flex-col gap-3">
                        <input
                            className="border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <input
                            className="border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button
                            className="bg-blue-700 text-white py-2 rounded hover:bg-blue-600 transition"
                            type="submit"
                        >
                            Login
                        </button>
                    </form>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        Use <b>demo / demo123</b> to log in.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">Shopping List</h2>

            <button
                onClick={handleLogout}
                className="self-end mb-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition absolute top-10"
            >
                Logout
            </button>

            <div className="mb-4 flex items-center gap-2">
                <label className="font-semibold">Budget:
                    <input
                        className="border border-gray-300 rounded ml-2 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="text"
                        value={spendLimit}
                        onChange={e => {
                            const value = e.target.value;
                            if (/^\d*\.?\d*$/.test(value)) {
                                setSpendLimit(Number(value));
                            }
                        }}
                        placeholder="Enter limit"
                    />
                </label>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                    {provided => (
                        <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="w-full max-w-md"
                        >
                            {items.map((item, index) => (
                                <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                                    {provided => (
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
                                            <span
                                                {...provided.dragHandleProps}
                                                className="cursor-grab text-gray-500"
                                            >
                                                ⠿
                                            </span>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>

            <p className="mt-4 text-lg font-semibold">Total: £{total.toFixed(2)}</p>
            {spendLimit > 0 && total > spendLimit && (
                <p className="text-red-600 font-bold">Total exceeds your budget</p>
            )}

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
        </div>
    );
};

export default ShoppingList;
