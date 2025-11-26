import React, { useState } from 'react';
import { Calculator, Check } from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function Planner() {
    const [capacity, setCapacity] = useState(30);
    const [packages, setPackages] = useState([
        { tracking_id: 'PKG_A', size: 15, destination: 'NY' },
        { tracking_id: 'PKG_B', size: 10, destination: 'LA' },
        { tracking_id: 'PKG_C', size: 20, destination: 'TX' },
        { tracking_id: 'PKG_D', size: 5, destination: 'FL' },
    ]);
    const [result, setResult] = useState(null);

    const runBacktracking = async () => {
        const res = await fetch(`${API_URL}/backtracking`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ capacity: parseInt(capacity), packages })
        });
        const data = await res.json();
        setResult(data);
    };

    const loadToTruck = async (pkg) => {
        await fetch(`${API_URL}/load-truck`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pkg)
        });
    };

    return (
        <div className="bg-secondary p-6 rounded-xl shadow-lg border border-slate-700 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-purple-400">
                <Calculator className="w-8 h-8" /> Shipment Planner (Backtracking)
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm text-slate-400 mb-2">Truck Capacity</label>
                    <input
                        type="number"
                        value={capacity} onChange={e => setCapacity(e.target.value)}
                        className="w-full bg-slate-800 p-3 rounded border border-slate-600 mb-6 focus:border-purple-500 outline-none"
                    />

                    <h3 className="font-bold mb-3">Available Packages</h3>
                    <div className="space-y-2 mb-6">
                        {packages.map((p, i) => (
                            <div key={i} className="bg-slate-800 p-3 rounded flex justify-between border border-slate-700">
                                <span>{p.tracking_id}</span>
                                <span className="text-slate-400">Size: {p.size}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={runBacktracking}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded font-bold transition-colors"
                    >
                        Find Optimal Load
                    </button>
                </div>

                <div className="bg-slate-800/50 p-6 rounded border border-slate-700">
                    <h3 className="font-bold mb-4 text-lg">Optimization Result</h3>
                    {!result ? (
                        <p className="text-slate-500 italic">Run the planner to see results.</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-slate-400">Total Size:</span>
                                <span className="text-3xl font-bold text-green-400">{result.reduce((sum, p) => sum + p.size, 0)} <span className="text-sm text-slate-500">/ {capacity}</span></span>
                            </div>

                            <div className="space-y-2">
                                {result.map((p, i) => (
                                    <div key={i} className="bg-slate-700 p-3 rounded flex justify-between items-center border-l-4 border-green-500">
                                        <div>
                                            <div className="font-bold">{p.tracking_id}</div>
                                            <div className="text-xs text-slate-400">Size: {p.size}</div>
                                        </div>
                                        <button
                                            onClick={() => loadToTruck(p)}
                                            className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white text-xs flex items-center gap-1"
                                        >
                                            Load <Check className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
