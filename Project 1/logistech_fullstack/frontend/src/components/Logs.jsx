import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function Logs() {
    const [logs, setLogs] = useState([]);

    const fetchLogs = async () => {
        const res = await fetch(`${API_URL}/logs`);
        const data = await res.json();
        setLogs(data);
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 2000); // Poll every 2s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-secondary p-6 rounded-xl shadow-lg border border-slate-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-300">
                <FileText className="w-6 h-6" /> Audit Logs
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-slate-400 border-b border-slate-700">
                            <th className="p-3">Time</th>
                            <th className="p-3">Tracking ID</th>
                            <th className="p-3">Action</th>
                            <th className="p-3">Bin ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                <td className="p-3 text-sm text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                <td className="p-3 font-mono text-accent">{log.tracking_id}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold 
                    ${log.status === 'STORED' ? 'bg-green-900 text-green-300' :
                                            log.status === 'FAILED_NO_BIN' ? 'bg-red-900 text-red-300' :
                                                'bg-blue-900 text-blue-300'}`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="p-3 text-slate-400">{log.bin_id || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
