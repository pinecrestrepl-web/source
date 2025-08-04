
import React from 'react';
import { NavLink, To } from 'react-router-dom';

interface NavItem {
    to: To;
    label: string;
    icon: React.ReactNode;
}

interface DashboardLayoutProps {
    sidebarNavItems: NavItem[];
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ sidebarNavItems, children }) => {
    return (
        <div className="flex min-h-[calc(100vh-64px)]">
            <aside className="w-64 bg-surface-light text-white p-4 flex flex-col border-r border-slate-700">
                <nav className="flex flex-col space-y-2">
                    {sidebarNavItems.map(item => (
                        <NavLink
                            key={item.to.toString()}
                            to={item.to}
                            end={item.to === '' || item.to === '.'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-brand-primary text-slate-900'
                                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                                }`
                            }
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 p-6 sm:p-8 lg:p-10 bg-surface-dark overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;