# VibeStage - Interactive Presentation Platform

## Overview

VibeStage is a real-time interactive presentation platform that transforms ordinary demo sessions into engaging, interactive shows. The system consists of a host display for projectors and a mobile remote controller for audience interaction, featuring live emoji reactions, countdown timers, polls, and special effects like confetti celebrations.

## System Architecture

The application follows a modern full-stack architecture with real-time capabilities:

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **Routing**: Wouter for lightweight client-side routing
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state, React hooks for local state
- **Real-time Communication**: WebSocket client with automatic reconnection

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Real-time**: WebSocket Server (ws library) for bidirectional communication
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: In-memory storage with planned database persistence

### Build System
- **Development**: Vite dev server with HMR
- **Production**: ESBuild for server bundling, Vite for client bundling
- **TypeScript**: Strict configuration with path mapping for clean imports

## Key Components

### Real-time Communication System
- WebSocket-based architecture with automatic client reconnection
- Client type registration (host vs remote) for targeted messaging
- Message broadcasting with selective delivery based on client type
- Connection state management and user counting

### Timer System
- 5-minute countdown timer with server-side state management
- Real-time synchronization across all connected clients
- Visual progress indicators and completion effects
- Confetti celebration system triggered on timer completion

### Reaction System
- Four emoji types: Fire 🔥, Mind Blown 🤯, Laugh 😂, Idea 💡
- Real-time reaction broadcasting with visual animations
- Reaction counting and statistics tracking
- Parallax animation effects for visual appeal

### UI Components
- Responsive design optimized for both desktop (host) and mobile (remote)
- Dark/light theme support with CSS custom properties
- Accessible components built on Radix UI primitives
- Mobile-first approach with touch-optimized interactions

## Data Flow

1. **Connection Flow**: Client connects via WebSocket → Registers as host/remote → Receives current state
2. **Timer Flow**: Host starts timer → Server broadcasts timer updates → All clients sync display
3. **Reaction Flow**: Remote sends reaction → Server increments counter → Broadcasts to all hosts with animation data
4. **Poll Flow**: Host creates poll → Server stores state → Remotes vote → Real-time results to hosts

## External Dependencies

### Core Libraries
- **Database**: `drizzle-orm`, `@neondatabase/serverless` for PostgreSQL operations
- **UI Framework**: Multiple `@radix-ui/*` packages for accessible components
- **Real-time**: `ws` for WebSocket server implementation
- **Validation**: `zod` with `drizzle-zod` for schema validation
- **Date Handling**: `date-fns` for time operations

### Development Tools
- **Build**: `vite`, `esbuild` for fast compilation
- **Types**: `tsx` for TypeScript execution
- **Canvas**: `canvas` for server-side graphics generation (future GIF trophy feature)

### Third-party Integrations
- **QR Code Generation**: Custom canvas-based implementation for mobile access
- **Giphy API**: Planned integration for trophy GIF generation
- **Confetti System**: Custom CSS/JavaScript animation system

## Deployment Strategy

### Development Environment
- Vite development server with hot module replacement
- Concurrent client and server development with shared TypeScript configuration
- WebSocket proxy through Vite for seamless development experience

### Production Build
- Client: Vite builds optimized React bundle to `dist/public`
- Server: ESBuild bundles Node.js application to `dist/index.js`
- Static file serving through Express for single-domain deployment

### Database Strategy
- Development: Uses DATABASE_URL environment variable
- Schema management through Drizzle migrations in `/migrations` directory
- Connection pooling via Neon's serverless driver for optimal performance

### Environment Configuration
- Environment variables for database connection and API keys
- Graceful fallbacks for missing configurations
- Development vs production feature flags

## Changelog

```
Changelog:
- July 04, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```