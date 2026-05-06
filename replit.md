# Overview

This project is a modern full-stack web application for TechARA Academy's Web3 and blockchain conference. It serves as a marketing and registration platform, providing event details, speaker information, attendee demographics, and promotional content with dynamic visual effects. The application aims to offer a seamless user experience, high performance, and robust security for conference attendees and organizers.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Technology Stack**: React 18 with TypeScript, Vite for tooling, Wouter for routing, TanStack Query for state management.
- **Styling**: Tailwind CSS with a custom design system, shadcn/ui for consistent components, Radix UI primitives for accessibility.
- **Animations**: Framer Motion for advanced animations, including a Canvas-based bubble effect.
- **Performance**: Code splitting with React.lazy() and Suspense, optimized fonts (single Poppins family), WebP image optimization, and responsive image loading.
- **PWA Support**: Progressive Web App features including `manifest.json` and Service Worker for offline capabilities and caching.

## Backend Architecture
- **Technology Stack**: Express.js server with TypeScript.
- **Database**: PostgreSQL via Drizzle ORM, integrated with Neon Database for serverless persistence.
- **API**: Modular route registration, middleware for logging and error handling, Zod validation for API inputs.
- **Deployment**: Configured for development/production environment separation, compression middleware (gzip/brotli), and smart caching headers.

## UI/UX Design System
- **Branding**: TechARA Academy's Web3/crypto theme with a dark mode optimized design.
- **Visuals**: Custom color scheme (purple primary, orange accent), crypto-glow effects, and dynamic Canvas-based bubble animations.
- **Responsiveness**: Mobile-first approach with responsive design for all components.
- **Navigation**: Sticky navigation and bottom banner elements.

## Performance Optimizations
- **Core Web Vitals Focus**: Targeting high Lighthouse scores (90+ mobile, 95+ desktop).
- **Canvas Bubbles**: 60fps animation (max 10 bubbles) starts after Largest Contentful Paint (LCP) and is disabled on mobile.
- **Image Optimization**: All critical images converted to WebP with responsive `srcset` and `sizes`, `loading="eager"` and `fetchpriority="high"` for LCP images.
- **Build Process**: Aggressive code splitting, Terser minification, tree-shaking, and manual chunking.
- **Server-side**: Gzip/Brotli compression, 1-year immutable cache for assets, `no-cache` for HTML.
- **Accessibility**: Viewport scaling enabled, dynamic `aria-label` for menus, correct heading hierarchy.
- **Security**: Comprehensive Content Security Policy (CSP), HSTS, COOP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy.

# External Dependencies

## Database Services
- **PostgreSQL**: Primary database for persistence.
- **Drizzle ORM**: Type-safe ORM for database interactions.
- **Neon Database**: Serverless PostgreSQL integration for Replit.

## UI Framework & Libraries
- **Radix UI**: Accessible component primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **shadcn/ui**: Curated UI component library.
- **Lucide React**: Icon library.
- **Framer Motion**: Animation library.

## Development Platform
- **Replit**: Cloud development environment.
- **Vite**: Build tool and development server.

## Form Handling & Validation
- **React Hook Form**: Form state management.
- **Zod**: Schema validation library.
- **@hookform/resolvers**: Integration between React Hook Form and Zod.

## Session Management
- **Express Session**: Server-side session handling.
- **connect-pg-simple**: PostgreSQL session store.
- **Passport.js**: Authentication middleware (configured).

## Utilities
- **date-fns**: Date manipulation.
- **clsx** and **class-variance-authority**: Conditional CSS class utilities.
- **nanoid**: Unique ID generation.
- **undici**: HTTP client.