import React, { useState } from 'react';
import { Package, Truck, Box, ArrowRight, RotateCcw } from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function Dashboard({ state }) {
    const [pkgId, setPkgId] = useState('');
    const [pkgSize, setPkgSize] = useState('');
    const [pkgDest, setPkgDest] = useState('');

    const addPackage = async (e) => {
        e.preventDefault();
        if (!pkgId || !pkgSize) return;
        await fetch(`${API_URL}/packages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tracking_id: pkgId, size: parseInt(pkgSize), destination: pkgDest || 'Unknown' })
        });
        setPkgId(''); setPkgSize(''); setPkgDest('');
    };

    const processPackage = async () => {
        await fetch(`${API_URL}/process`, { method: 'POST' });
    };

    const loadTruck = async (pkg) => {
        await fetch(`${API_URL}/load-truck`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pkg)
        });
    };

    const rollback = async () => {
        await fetch(`${API_URL}/rollback`, { method: 'POST' });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conveyor Panel */}
            <div className="bg-secondary p-6 rounded-xl shadow-lg border border-slate-700">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-accent">
                    <Package className="w-6 h-6" /> Conveyor Belt
                </h2>

                <form onSubmit={addPackage} className="mb-6 space-y-3">
                    <input
                        type="text" placeholder="Tracking ID"
                        value={pkgId} onChange={e => setPkgId(e.target.value)}
                        className="w-full bg-slate-800 p-2 rounded border border-slate-600 focus:border-accent outline-none"
                    />
                    <div className="flex gap-2">
                        <input
                            type="number" placeholder="Size"
                            value={pkgSize} onChange={e => setPkgSize(e.target.value)}
                            className="w-1/2 bg-slate-800 p-2 rounded border border-slate-600 focus:border-accent outline-none"
                        />
                        <input
                            type="text" placeholder="Dest"
                            value={pkgDest} onChange={e => setPkgDest(e.target.value)}
                            className="w-1/2 bg-slate-800 p-2 rounded border border-slate-600 focus:border-accent outline-none"
                        />
                    </div>
                    <button type="submit" className="w-full bg-accent hover:bg-blue-600 text-white p-2 rounded font-medium transition-colors">
                        Add Package
                    </button>
                </form>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {state.conveyor.length === 0 ? (
                        <p className="text-slate-500 text-center py-4">Conveyor Empty</p>
                    ) : (
                        state.conveyor.map((p, i) => (
                            <div key={i} className="bg-slate-800 p-3 rounded flex justify-between items-center border-l-4 border-yellow-500">
                                <div>
                                    <div className="font-bold">{p.tracking_id}</div>
                                    <div className="text-xs text-slate-400">Size: {p.size} | {p.destination}</div>
                                </div>
                                {i === 0 && (
                                    <button onClick={processPackage} className="bg-success hover:bg-green-600 p-1 rounded text-white" title="Store in Bin">
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Bins Panel */}
            <div className="bg-secondary p-6 rounded-xl shadow-lg border border-slate-700">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-success">
                    <Box className="w-6 h-6" /> Storage Bins
                </h2>
                <div className="grid grid-cols-2 gap-3">
                    {state.bins.map(bin => {
                        const percent = Math.min(100, (bin.occupied / bin.capacity) * 100);
                        const isFull = percent >= 100;
                        return (
                            <div key={bin.bin_id} className={`p-3 rounded border ${isFull ? 'border-red-500 bg-red-900/20' : 'border-slate-600 bg-slate-800'}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-sm">{bin.location_code}</span>
                                    <span className="text-xs text-slate-400">ID: {bin.bin_id}</span>
                                </div>
                                <div className="text-2xl font-bold mb-1">{bin.occupied} <span className="text-sm text-slate-500">/ {bin.capacity}</span></div>
                                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${isFull ? 'bg-red-500' : 'bg-success'}`}
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Truck Loading Panel */}
            <div className="bg-secondary p-6 rounded-xl shadow-lg border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-warning">
                        <Truck className="w-6 h-6" /> Loading Dock
                    </h2>
                    <button onClick={rollback} className="bg-danger hover:bg-red-600 text-white p-2 rounded flex items-center gap-1 text-sm">
                        <RotateCcw className="w-4 h-4" /> Rollback
                    </button>
                </div>

                <div className="flex flex-col-reverse gap-2 min-h-[300px] bg-slate-800/50 p-4 rounded border border-slate-700 border-dashed">
                    {state.dock.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-slate-500">Truck Empty</div>
                    ) : (
                        state.dock.map((p, i) => (
                            <div key={i} className="bg-slate-700 p-3 rounded shadow-md border border-slate-600 flex justify-between items-center">
                                <span className="font-mono font-bold text-warning">{p.tracking_id}</span>
                                <span className="text-xs bg-slate-900 px-2 py-1 rounded">Size: {p.size}</span>
                            </div>
                        ))
                    )}
                </div>

                {/* Helper to load from conveyor directly for demo if needed, but per requirements flow is Conveyor -> Bin -> Truck? 
            Actually requirements say "Truck loading behaves like a LIFO Stack". 
            Usually items come from storage to truck. 
            For this demo, let's assume we can pick items from "Storage" to load.
            But the UI spec says "Truck Loading Panel". 
            Let's add a simple "Load Test Package" button for demo if the stack is empty, 
            or rely on the Planner to define what to load.
        */}
            </div>
        </div>
    );
}
