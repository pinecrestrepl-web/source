
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const Inventory: React.FC = () => {
    const { inventory } = useContext(AppContext);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Inventory Management</h1>
                <button className="bg-brand-primary text-slate-900 font-semibold px-4 py-2 rounded-md hover:bg-brand-secondary">
                    Add New Item
                </button>
            </div>
            <div className="bg-surface-light p-6 rounded-xl shadow-lg border border-brand-border">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-brand-border">
                                <th className="p-3 text-sm font-semibold text-text-secondary">Item Name</th>
                                <th className="p-3 text-sm font-semibold text-text-secondary">Item ID</th>
                                <th className="p-3 text-sm font-semibold text-text-secondary">Quantity</th>
                                <th className="p-3 text-sm font-semibold text-text-secondary">Price per Unit</th>
                                <th className="p-3 text-sm font-semibold text-text-secondary">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map(item => (
                                <tr key={item.id} className="border-b border-brand-border last:border-b-0 hover:bg-surface-dark">
                                    <td className="p-3 text-text-primary font-medium">{item.name}</td>
                                    <td className="p-3 text-text-primary font-mono text-xs">{item.id}</td>
                                    <td className="p-3 text-text-primary">{item.quantity}</td>
                                    <td className="p-3 text-text-primary">₹{item.price.toFixed(2)}</td>
                                    <td className="p-3">
                                        <button className="text-brand-primary hover:underline text-sm font-semibold">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventory;