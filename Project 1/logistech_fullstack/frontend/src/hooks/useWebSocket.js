import { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = 'ws://localhost:8000/ws';

export function useWebSocket() {
    const [state, setState] = useState({
        conveyor: [],
        dock: [],
        bins: []
    });
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(WS_URL);

        ws.current.onopen = () => {
            console.log('WS Connected');
            setIsConnected(true);
        };

        ws.current.onclose = () => {
            console.log('WS Disconnected');
            setIsConnected(false);
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'STATE_UPDATE') {
                setState({
                    conveyor: data.conveyor,
                    dock: data.dock,
                    bins: data.bins
                });
            }
        };

        return () => {
            ws.current.close();
        };
    }, []);

    const sendMessage = useCallback((msg) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(msg));
        }
    }, []);

    return { state, isConnected, sendMessage };
}
