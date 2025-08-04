
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { User, Technician, Customer, UserRole } from '../../types';
import { generateTechnicianSummary } from '../../services/geminiService';
import { UserCheck, UserX, ShieldCheck, Mail, Phone, Briefcase, Home, CircleUser, Bell, X } from 'lucide-react';

const ManageUsers: React.FC = () => {
    const { users } = useContext(AppContext);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [summary, setSummary] = useState('');
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [showGroupNotificationModal, setShowGroupNotificationModal] = useState(false);
    const [groupNotificationRole, setGroupNotificationRole] = useState<UserRole | null>(null);
    const [groupNotificationMessage, setGroupNotificationMessage] = useState('');

    const technicians = useMemo(() => {
        return (users.filter(u => u.role === 'Technician') as Technician[]).sort((a, b) => a.name.localeCompare(b.name));
    }, [users]);

    const customers = useMemo(() => {
        return (users.filter(u => u.role === 'Customer') as Customer[]).sort((a, b) => a.name.localeCompare(b.name));
    }, [users]);
    
    useEffect(() => {
        if (selectedUser?.role === 'Technician') {
            const tech = selectedUser as Technician;
            setLoadingSummary(true);
            generateTechnicianSummary(tech.jobsCompleted, tech.rating, tech.specialty)
                .then(setSummary)
                .finally(() => setLoadingSummary(false));
        } else {
            setSummary('');
        }
    }, [selectedUser]);

    const handleSendNotification = () => {
        if (!notificationMessage || !selectedUser) return;
        alert(`Notification sent to ${selectedUser.name}:\n\n"${notificationMessage}"`);
        setNotificationMessage('');
        setShowNotificationModal(false);
    };
    
    const openGroupNotificationModal = (role: UserRole) => {
        setGroupNotificationRole(role);
        setShowGroupNotificationModal(true);
    };

    const handleSendGroupNotification = () => {
        if (!groupNotificationMessage || !groupNotificationRole) return;
        alert(`Notification sent to all ${groupNotificationRole}s:\n\n"${groupNotificationMessage}"`);
        setGroupNotificationMessage('');
        setShowGroupNotificationModal(false);
        setGroupNotificationRole(null);
    };
    
    const renderUserList = (userList: User[], title: string, role: UserRole) => (
        <div className="bg-surface-light p-4 rounded-xl shadow-lg border border-slate-700">
            <div className="flex justify-between items-center mb-3">
                 <h3 className="text-lg font-bold text-slate-200">{title}</h3>
                 <button onClick={() => openGroupNotificationModal(role)} className="text-xs flex items-center gap-1 bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-md hover:bg-brand-primary/20"><Bell size={14}/> Notify All</button>
            </div>
            <ul className="space-y-1 max-h-60 overflow-y-auto pr-1">
                {userList.map(u => (
                    <li key={u.id}>
                        <button onClick={() => { setSelectedUser(u); setShowNotificationModal(false); }} className={`w-full text-left p-2 rounded-md transition-colors text-sm ${selectedUser?.id === u.id ? 'bg-brand-primary/20 font-semibold text-slate-100' : 'hover:bg-slate-700/50 text-slate-300'}`}>
                           {u.name}
                           {u.role === 'Technician' && <span className="text-xs text-slate-500 block">{(u as Technician).specialty} - {(u as Technician).location}</span>}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-6">Manage Users</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 space-y-6">
                    {renderUserList(technicians, 'Technicians', UserRole.TECHNICIAN)}
                    {renderUserList(customers, 'Customers', UserRole.CUSTOMER)}
                </div>
                <div className="md:col-span-2">
                    <div className="bg-surface-light p-6 rounded-xl shadow-lg min-h-[400px] sticky top-24 border border-slate-700">
                        {selectedUser ? (
                            <div>
                                <h2 className="text-2xl font-bold text-slate-100">{selectedUser.name}</h2>
                                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mt-1 ${selectedUser.role === 'Technician' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>
                                    {selectedUser.role}
                                </span>

                                <div className="mt-4 border-t border-slate-700 pt-4 space-y-3 text-slate-400">
                                    <p className="flex items-center gap-3"><Mail size={16} /> {selectedUser.email}</p>
                                    <p className="flex items-center gap-3"><Phone size={16} /> {selectedUser.phone}</p>
                                    <p className="flex items-center gap-3"><CircleUser size={16} /> {selectedUser.upiId || 'N/A'}</p>
                                    
                                    {selectedUser.role === 'Customer' && <p className="flex items-center gap-3"><Home size={16} /> {(selectedUser as Customer).address}</p>}
                                    
                                    {selectedUser.role === 'Technician' && (
                                        <>
                                            <p className="flex items-center gap-3"><Briefcase size={16} /> {(selectedUser as Technician).specialty} in {(selectedUser as Technician).location}</p>
                                            <p className="flex items-center gap-3"><ShieldCheck size={16} className={(selectedUser as Technician).verified ? 'text-green-500' : 'text-red-500'} /> {(selectedUser as Technician).verified ? 'Verified' : 'Not Verified'}</p>
                                            
                                            <div className="mt-3 bg-surface-dark p-3 rounded-md">
                                                <h4 className="font-semibold text-slate-300 text-sm">AI Generated Summary</h4>
                                                {loadingSummary ? <div className="h-4 bg-slate-600 rounded animate-pulse mt-2"></div> : <p className="text-sm italic mt-1 text-slate-400">{summary}</p>}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="mt-6 flex gap-3 flex-wrap">
                                     <button className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-2 text-sm rounded-md hover:bg-green-500/20 transition-colors"><UserCheck size={16} /> Approve</button>
                                     <button className="flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-2 text-sm rounded-md hover:bg-red-500/20 transition-colors"><UserX size={16} /> Suspend</button>
                                     <button onClick={() => setShowNotificationModal(true)} className="flex items-center gap-2 bg-sky-500/10 text-sky-400 px-3 py-2 text-sm rounded-md hover:bg-sky-500/20 transition-colors"><Bell size={16} /> Send Notification</button>
                                </div>
                                {showNotificationModal && (
                                    <div className="mt-4 pt-4 border-t border-slate-700">
                                        <h4 className="font-semibold text-slate-300">Send notification to {selectedUser.name}</h4>
                                        <textarea value={notificationMessage} onChange={(e) => setNotificationMessage(e.target.value)} rows={3} className="input mt-2" placeholder="Your message..."/>
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={handleSendNotification} className="button-primary px-4 py-1">Send</button>
                                            <button onClick={() => setShowNotificationModal(false)} className="bg-slate-600 px-4 py-1 text-sm rounded-md hover:bg-slate-500">Cancel</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">
                                <p>Select a user to see details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Group Notification Modal */}
            {showGroupNotificationModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface-light rounded-lg shadow-xl p-6 w-full max-w-md relative border border-slate-700">
                        <button onClick={() => setShowGroupNotificationModal(false)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-200">
                            <X size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-brand-primary">Send Notification to All {groupNotificationRole}s</h2>
                        <textarea
                            value={groupNotificationMessage}
                            onChange={(e) => setGroupNotificationMessage(e.target.value)}
                            rows={4}
                            className="w-full mt-4 input"
                            placeholder={`Enter your message for all ${groupNotificationRole}s...`}
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setShowGroupNotificationModal(false)} className="bg-slate-600 px-4 py-2 text-sm rounded-md hover:bg-slate-500 text-slate-200">Cancel</button>
                            <button onClick={handleSendGroupNotification} className="button-primary px-4 py-2">Send Notification</button>
                        </div>
                    </div>
                </div>
            )}
             <style>{`.input { padding: 0.5rem 0.75rem; border: 1px solid #475569; border-radius: 0.375rem; width: 100%; background-color: #334155; color: #e2e8f0; } .button-primary { color: #111827; background-color: #22d3ee; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 600; }`}</style>
        </div>
    );
};

export default ManageUsers;