type SocketMessage = {
  type: string;
  data?: any;
};

type SocketCallback = (data: any) => void;

class SocketManager {
  private ws: WebSocket | null = null;
  private listeners = new Map<string, SocketCallback[]>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(clientType: 'host' | 'remote' = 'remote') {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    // Connect to WebSocket server
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    console.log('Attempting WebSocket connection to:', wsUrl);
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('✅ WebSocket connected successfully');
      this.reconnectAttempts = 0;
      
      // Register client type
      this.send('register', { type: clientType });
    };

    this.ws.onmessage = (event) => {
      try {
        const message: SocketMessage = JSON.parse(event.data);
        console.log('Received WebSocket message:', message);
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.attemptReconnect(clientType);
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      console.error('WebSocket readyState:', this.ws?.readyState);
    };
  }

  private attemptReconnect(clientType: 'host' | 'remote') {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting... attempt ${this.reconnectAttempts}`);
        this.connect(clientType);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  private handleMessage(message: SocketMessage) {
    const callbacks = this.listeners.get(message.type) || [];
    callbacks.forEach(callback => callback(message.data));
  }

  send(type: string, data?: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }

  on(messageType: string, callback: SocketCallback) {
    if (!this.listeners.has(messageType)) {
      this.listeners.set(messageType, []);
    }
    this.listeners.get(messageType)!.push(callback);
  }

  off(messageType: string, callback: SocketCallback) {
    const callbacks = this.listeners.get(messageType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const socketManager = new SocketManager();
