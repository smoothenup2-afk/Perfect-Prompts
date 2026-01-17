# Our Cricket - Cricket Statistics Tracking App

## Overview

"Our Cricket" is a cricket statistics tracking application for a group of 6 players (Himanshu, Kuldeep, Monti, Ronaldo, Jitu, Dilip). The app allows users to enter daily match data per player and automatically calculates professional cricket statistics including career-best records, batting averages, strike rates, and bowling figures.

The application follows a full-stack architecture with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming (cricket green theme)
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite

### Key Frontend Pages
- Dashboard (`/`) - Overview with player statistics table and quick stats
- Add Data (`/add`) - Form to enter daily match statistics
- History (`/history`) - View and manage past match entries
- Player Profile (`/player/:id`) - Detailed player statistics

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **API Design**: RESTful endpoints defined in `shared/routes.ts`
- **Validation**: Zod schemas for input validation

### Data Model
Two main tables:
1. **players** - Stores player info (id, name, role, imageUrl)
2. **match_stats** - Stores per-match statistics (runs, balls faced, fours, sixes, wickets, overs bowled, runs conceded, date)

### Calculated Statistics
Player stats are computed on-the-fly from match data:
- Total matches, runs, wickets
- Batting average, strike rate
- Fifties, hundreds
- Best batting score
- Best bowling figures (wickets/runs)
- Economy rate

### API Endpoints
- `GET /api/players` - List all players with calculated stats
- `GET /api/players/:id` - Get single player with stats
- `PATCH /api/players/:id` - Update player info
- `POST /api/stats` - Add new match statistics
- `GET /api/stats` - List all match statistics
- `PATCH /api/stats/:id` - Update match statistics
- `DELETE /api/stats/:id` - Delete match statistics

### Build System
- Development: Vite dev server with HMR
- Production: Vite builds frontend to `dist/public`, esbuild bundles server to `dist/index.cjs`
- Database migrations: Drizzle Kit with `db:push` command

## External Dependencies

### Database
- **PostgreSQL** - Primary data store (requires `DATABASE_URL` environment variable)
- **Drizzle ORM** - Database queries and schema management
- **connect-pg-simple** - PostgreSQL session store

### UI Libraries
- **Radix UI** - Accessible component primitives
- **Shadcn/ui** - Pre-built component library
- **Lucide React** - Icon library
- **Embla Carousel** - Carousel component

### Form & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **drizzle-zod** - Generate Zod schemas from Drizzle tables

### Date Handling
- **date-fns** - Date formatting and manipulation

### Build Tools
- **Vite** - Frontend build and dev server
- **esbuild** - Server bundling
- **TypeScript** - Type checking