import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShoppingList from '../components/ShoppingList';

beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('isLoggedIn', 'true');
});

test('renders shopping list', () => {
    render(<ShoppingList />);
    expect(screen.getByText(/shopping list/i)).toBeInTheDocument();
});

test('adds a new item', () => {
    render(<ShoppingList onLogout={jest.fn()} />);

    const nameInput = screen.getByPlaceholderText('New Item Name');
    const priceInput = screen.getByPlaceholderText('Price');
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(nameInput, { target: { value: 'Apples' } });
    fireEvent.change(priceInput, { target: { value: '2' } });
    fireEvent.click(addButton);

    expect(screen.getByText(/apples - £2.00/i)).toBeInTheDocument();
});

test('deletes an item', () => {
    render(<ShoppingList />);

    fireEvent.change(screen.getByPlaceholderText('New Item Name'), { target: { value: 'Milk' } });
    fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(screen.queryByText(/milk - £1.00/i)).not.toBeInTheDocument();
});

test('toggles bought state', () => {
    render(<ShoppingList />);

    fireEvent.change(screen.getByPlaceholderText('New Item Name'), { target: { value: 'Bread' } });
    fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
});

test('shows warning when limit exceeded', () => {
    render(<ShoppingList />);

    const limitInput = screen.getByPlaceholderText(/Enter limit/i);
    fireEvent.change(limitInput, { target: { value: '5' } });

    fireEvent.change(screen.getByPlaceholderText('New Item Name'), { target: { value: 'Cheese' } });
    fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '6' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getByText(/total exceeds your budget/i)).toBeInTheDocument();
});
