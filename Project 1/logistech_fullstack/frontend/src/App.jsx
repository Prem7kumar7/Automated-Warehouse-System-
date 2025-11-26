import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calculator, FileText, Wifi } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Planner from './components/Planner';
import Logs from './components/Logs';
import { useWebSocket } from './hooks/useWebSocket';

function NavLink({ to, icon: Icon, label }) {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link
            to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${isActive ? 'bg-accent text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
            <Icon className="w-5 h-5" /> {label}
        </Link>
    );
}

export default function App() {
    const { state, isConnected } = useWebSocket();

    return (
        <Router>
            <div className="min-h-screen bg-primary text-slate-100 font-sans">
                {/* Header */}
                <header className="bg-secondary border-b border-slate-700 p-4 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center font-bold text-xl">L</div>
                            <h1 className="text-xl font-bold tracking-tight">LogisTech <span className="text-slate-500 font-normal">Control Tower</span></h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-2 text-sm ${isConnected ? 'text-success' : 'text-danger'}`}>
                                <Wifi className="w-4 h-4" /> {isConnected ? 'Live' : 'Disconnected'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Navigation */}
                <div className="bg-secondary/50 border-b border-slate-700">
                    <div className="max-w-7xl mx-auto px-4 py-2 flex gap-2">
                        <NavLink to="/" icon={LayoutDashboard} label="Dashboard" />
                        <NavLink to="/planner" icon={Calculator} label="Planner" />
                        <NavLink to="/logs" icon={FileText} label="Audit Logs" />
                    </div>
                </div>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto p-6">
                    <Routes>
                        <Route path="/" element={<Dashboard state={state} />} />
                        <Route path="/planner" element={<Planner />} />
                        <Route path="/logs" element={<Logs />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
