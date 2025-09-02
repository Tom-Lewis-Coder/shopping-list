import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import ShoppingListItem from "./ShoppingListItem";
import AddItemForm from "./AddItemForm";

interface Item {
    id: number;
    name: string;
    price: number;
    isBought: boolean;
}

interface ShoppingListProps {
    onLogout?: () => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ onLogout }) => {
    const [items, setItems] = useState<Item[]>(() => {
        const saved = localStorage.getItem("itemData");
        return saved ? JSON.parse(saved) : [];
    });
    const [newItem, setNewItem] = useState({ name: "", price: "" });
    const [spendLimit, setSpendLimit] = useState<number>(() => {
        const saved = localStorage.getItem("spendLimit");
        return saved ? JSON.parse(saved) : 0;
    });

    useEffect(() => {
        localStorage.setItem("itemData", JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        localStorage.setItem("spendLimit", JSON.stringify(spendLimit));
    }, [spendLimit]);

    const toggleBoughtItem = useCallback((id: number) => {
        setItems(items => items.map(item =>
            item.id === id ? { ...item, isBought: !item.isBought } : item
        ));
    }, []);

    const handleAddItem = useCallback(() => {
        if (!newItem.name.trim() || !newItem.price.trim()) return;
        setItems(items => {
            if (items.find(item => item.name.toLowerCase() === newItem.name.toLowerCase())) {
                alert("Item already exists");
                return items;
            }
            return [
                ...items,
                { id: Date.now(), name: newItem.name, price: parseFloat(newItem.price), isBought: false }
            ];
        });
        setNewItem({ name: "", price: "" });
    }, [newItem]);

    const handleDeleteItem = useCallback((id: number) => {
        setItems(items => items.filter(item => item.id !== id));
    }, []);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const reorderedItems = Array.from(items);
        const [removed] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, removed);
        setItems(reorderedItems);
    };

    const handleSpendLimitChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setSpendLimit(Number(value));
        }
    }, []);

    const handleShare = useCallback(() => {
        const body = items
            .map(i => `${i.name} - £${i.price.toFixed(2)} ${i.isBought ? "(bought)" : ""}`)
            .join("\n");
        window.location.href = `mailto:?subject=My Shopping List&body=${encodeURIComponent(body)}`;
    }, [items]);

    const total = items.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-200">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">Shopping List</h2>

            <button
                onClick={onLogout}
                className="self-end mb-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition absolute top-10"
            >
                Logout
            </button>

            <div className="mb-4 flex items-center gap-2">
                <label className="font-semibold">
                    Budget:
                    <input
                        className="border border-gray-300 rounded ml-2 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="text"
                        value={spendLimit}
                        onChange={handleSpendLimitChange}
                        placeholder="Enter limit"
                    />
                </label>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                    {provided => (
                        <ul {...provided.droppableProps} ref={provided.innerRef} className="w-full max-w-md">
                            {items.map((item, index) => (
                                <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                                    {provided => (
                                        <ShoppingListItem
                                            item={item}
                                            provided={provided}
                                            toggleBoughtItem={toggleBoughtItem}
                                            handleDeleteItem={handleDeleteItem}
                                        />
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

            <AddItemForm
                newItem={newItem}
                setNewItem={setNewItem}
                handleAddItem={handleAddItem}
            />

            <button
                className="mt-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
                onClick={handleShare}
            >
                Share via Email
            </button>
        </div>
    );
};

export default ShoppingList;
