import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { ServiceTicket, TicketStatus } from '../../types';

const TechnicianPayments: React.FC = () => {
    const { tickets, payTechnician } = useContext(AppContext);

    const { pending, paid } = useMemo(() => {
        const completedJobs = tickets.filter(t => t.status === TicketStatus.COMPLETED);
        return {
            pending: completedJobs.filter(t => t.paymentStatus === 'Pending'),
            paid: completedJobs.filter(t => t.paymentStatus === 'Paid'),
        };
    }, [tickets]);

    const handlePay = (ticketId: string) => {
        payTechnician(ticketId);
        alert(`Payment for ticket ${ticketId} has been processed.`);
    };
    
    const renderTable = (jobList: ServiceTicket[], isPending: boolean) => (
         <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-100">
                        <th className="p-3 text-sm font-semibold text-slate-600">Completion Date</th>
                        <th className="p-3 text-sm font-semibold text-slate-600">Technician</th>
                        <th className="p-3 text-sm font-semibold text-slate-600">Job</th>
                        <th className="p-3 text-sm font-semibold text-slate-600">Earning</th>
                        <th className="p-3 text-sm font-semibold text-slate-600">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {jobList.length > 0 ? jobList.map(ticket => (
                        <tr key={ticket.id} className="border-b border-slate-200 hover:bg-slate-50">
                            <td className="p-3 text-sm">{ticket.completedAt?.toLocaleDateString()}</td>
                            <td className="p-3">{ticket.technicianName}</td>
                            <td className="p-3 text-sm">{ticket.serviceType}</td>
                            <td className="p-3 font-semibold">₹{ticket.technicianEarning?.toFixed(2)}</td>
                            <td className="p-3">
                                {isPending ? (
                                    <button onClick={() => handlePay(ticket.id)} className="bg-green-500 text-white px-3 py-1 text-sm rounded-md hover:bg-green-600">
                                        Pay Now
                                    </button>
                                ) : (
                                    <span className="text-green-600 font-semibold text-sm">Paid</span>
                                )}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="p-4 text-center text-slate-500">
                                {isPending ? 'No pending payments.' : 'No payments made yet.'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Technician Payments</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold text-slate-700 mb-4">Pending Payments</h2>
                {renderTable(pending, true)}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-slate-700 mb-4">Completed Payments</h2>
                {renderTable(paid, false)}
            </div>
        </div>
    );
};

export default TechnicianPayments;
