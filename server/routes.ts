import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";

interface SocketMessage {
  type: string;
  data?: any;
}

interface ConnectedClient {
  ws: WebSocket;
  id: string;
  type: 'host' | 'remote';
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time communication
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Map<string, ConnectedClient>();
  let currentSession: any = null;
  let timerState = {
    timeLeft: 300, // 5 minutes
    isRunning: false,
    startTime: null as number | null,
  };
  let reactionCounts = {
    fire: 0,
    mind: 0,
    laugh: 0,
    idea: 0,
  };

  function broadcast(message: SocketMessage, excludeId?: string) {
    const messageStr = JSON.stringify(message);
    clients.forEach((client, clientId) => {
      if (clientId !== excludeId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr);
      }
    });
  }

  function broadcastToHosts(message: SocketMessage) {
    const messageStr = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.type === 'host' && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr);
      }
    });
  }

  function generateClientId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Timer management
  let timerInterval: NodeJS.Timeout | null = null;

  function startTimer() {
    if (timerState.isRunning) {
      console.log('[Timer] Timer already running, ignoring start request');
      return;
    }
    
    console.log('[Timer] Starting timer...');
    timerState.isRunning = true;
    timerState.startTime = Date.now();
    
    timerInterval = setInterval(() => {
      if (timerState.timeLeft > 0) {
        timerState.timeLeft--;
        broadcast({
          type: 'timer_update',
          data: timerState,
        });
      } else {
        stopTimer();
        broadcast({
          type: 'timer_complete',
          data: {},
        });
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    timerState.isRunning = false;
  }

  function resetTimer() {
    stopTimer();
    timerState.timeLeft = 300;
    timerState.startTime = null;
    broadcast({
      type: 'timer_update',
      data: timerState,
    });
  }

  wss.on('connection', (ws, req) => {
    const clientId = generateClientId();
    console.log(`[WebSocket] New connection: ${clientId}`);
    
    ws.on('message', (data) => {
      try {
        const message: SocketMessage = JSON.parse(data.toString());
        console.log(`[WebSocket] Received message:`, message);
        
        switch (message.type) {
          case 'register':
            clients.set(clientId, {
              ws,
              id: clientId,
              type: message.data.type || 'remote',
            });
            
            // Send current state to new client
            ws.send(JSON.stringify({
              type: 'init',
              data: {
                clientId,
                timerState,
                reactionCounts,
                connectedUsers: clients.size,
              },
            }));
            
            // Notify all clients of updated connection count
            broadcast({
              type: 'connection_update',
              data: { connectedUsers: clients.size },
            });
            break;

          case 'start_timer':
            console.log(`[Timer] Starting timer requested by ${clientId}`);
            startTimer();
            break;

          case 'reset_timer':
            resetTimer();
            break;

          case 'send_reaction':
            const reactionType = message.data.reaction as string;
            if (reactionType && reactionType in reactionCounts) {
              (reactionCounts as any)[reactionType]++;
              
              // Broadcast reaction to hosts for animation
              broadcastToHosts({
                type: 'new_reaction',
                data: {
                  reaction: reactionType,
                  timestamp: Date.now(),
                  x: Math.random() * 100, // Random position percentage
                  y: Math.random() * 100,
                },
              });
              
              // Update reaction counts
              broadcast({
                type: 'reaction_counts_update',
                data: reactionCounts,
              });
            }
            break;

          case 'confetti_cheat':
            broadcastToHosts({
              type: 'trigger_confetti',
              data: { source: 'cheat' },
            });
            break;

          case 'poll_vote':
            // Handle poll voting (basic implementation)
            broadcast({
              type: 'poll_vote_update',
              data: message.data,
            });
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(clientId);
      broadcast({
        type: 'connection_update',
        data: { connectedUsers: clients.size },
      });
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(clientId);
    });
  });

  // REST API endpoints
  app.get('/api/qr-data', (req, res) => {
    const baseUrl = process.env.REPLIT_DOMAINS 
      ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
      : `${req.protocol}://${req.get('host')}`;
    
    res.json({
      url: `${baseUrl}/remote`,
      text: 'VibeStage Remote Controller',
    });
  });

  app.get('/api/session/current', (req, res) => {
    res.json({
      session: currentSession,
      timerState,
      reactionCounts,
      connectedUsers: clients.size,
    });
  });

  app.post('/api/session/create', (req, res) => {
    currentSession = {
      id: Date.now().toString(),
      name: req.body.name || 'VibeStage Session',
      createdAt: new Date(),
    };
    
    // Reset timer and reactions for new session
    resetTimer();
    reactionCounts = { fire: 0, mind: 0, laugh: 0, idea: 0 };
    
    res.json(currentSession);
  });

  return httpServer;
}
