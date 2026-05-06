# 🚀 Deployment Guide - TechARA Academy

## Table of Contents
1. [Local Development](#local-development)
2. [cPanel Hosting](#cpanel-hosting)
3. [Production Deployment](#production-deployment)
4. [Troubleshooting](#troubleshooting)

---

## Local Development

### Setup
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Setup database (if needed)
npm run db:push
```

### Option 1: Single Port (Both client and server)
```bash
npm run dev
```
- Server runs on `http://localhost:5000`
- Client runs on `http://localhost:5000` (served by Express)
- Visit `http://localhost:5000`

### Option 2: Split Ports (Recommended for Development)
```bash
npm run dev:split
```
- Client (Vite) runs on `http://localhost:3000`
- Server (Express) runs on `http://localhost:8000`
- Visit `http://localhost:3000`

To use split ports, ensure your `.env` has:
```env
NODE_ENV=development
VITE_API_URL=http://localhost:8000
```

---

## cPanel Hosting

### Architecture

```
cPanel Account
├── Public HTML (Frontend - port 3000 or 5000)
│   ├── Built Vite app
│   └── dist/public/ files
│
└── Server (Backend - port 8000)
    ├── Node.js process
    ├── Express API
    └── Database connection
```

### Deployment Steps

#### Step 1: Prepare Your cPanel Account

```bash
# 1. SSH into your cPanel server
ssh username@yourdomain.com

# 2. Install Node.js (if not already installed)
# Contact cPanel support or use Node Version Manager (nvm)
curl -fsSL https://nvm.sh/install.sh | bash
source ~/.bashrc
nvm install 20

# 3. Verify Node.js
node --version  # Should be v20.x or higher
npm --version
```

#### Step 2: Upload Your Project

**Option A: Using Git (Recommended)**
```bash
cd ~/public_html
git clone https://github.com/yourusername/techara.git
cd techara
npm install
```

**Option B: Using File Manager**
- Upload all project files via cPanel File Manager
- Run `npm install` via SSH

#### Step 3: Configure Environment

```bash
# Create .env file in project root
nano .env
```

**For cPanel (same server setup):**
```env
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
VITE_API_URL=https://yourdomain.com
# or if using subdomain:
VITE_API_URL=https://api.yourdomain.com
```

**For separate domain/server:**
```env
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://user:password@api-server.com:5432/dbname
VITE_API_URL=https://api.yourdomain.com
```

#### Step 4: Build Frontend

```bash
npm run build
```

This creates:
- `dist/public/` - Frontend (static files)
- `dist/index.js` - Backend server

#### Step 5: Setup Backend Server

**Using PM2 (Recommended)**
```bash
# Install PM2 globally
npm install -g pm2

# Start server
pm2 start dist/index.js --name "techara-api"

# Make it auto-start
pm2 startup
pm2 save
```

**Using Screen (Alternative)**
```bash
# Start in detached session
screen -S techara
npm start
# Press Ctrl+A then D to detach
```

#### Step 6: Configure Frontend Hosting

**Option A: Serve from cPanel directly**
```bash
# Copy built files to public_html
cp -r dist/public/* ~/public_html/

# Ensure .htaccess exists for React Router
cat > ~/public_html/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
EOF
```

**Option B: Serve from Node.js backend**
- Backend already serves frontend from `dist/public/`
- No additional configuration needed
- Visit `https://yourdomain.com:8000`

#### Step 7: Setup SSL & Domain Pointing

1. **In cPanel:**
   - Go to **Addon Domains** or **Domains**
   - Point `yourdomain.com` to `public_html`
   
2. **SSL Certificate:**
   - Use AutoSSL in cPanel (automatic)
   - Or use Let's Encrypt (free)

3. **Configure API URL:**
   - Update `.env` with your domain:
   ```env
   VITE_API_URL=https://yourdomain.com:8000
   ```

#### Step 8: Verify Deployment

```bash
# Check if server is running
curl http://localhost:8000

# Check logs
pm2 logs techara-api

# or with screen
screen -r techara
```

### Network Topology Diagram

```
User Browser
    ↓
┌─────────────────────────────────┐
│   Your cPanel Server            │
├─────────────────────────────────┤
│ Port 443 (HTTPS)                │
│ └─→ public_html/                │
│     (React App - index.html)    │
│                                  │
│ Port 8000 (API)                 │
│ └─→ Node.js Server              │
│     ├─ /api/register            │
│     ├─ /api/attendees           │
│     └─ /api/...                 │
│                                  │
│ PostgreSQL (localhost)           │
│ └─→ Database                    │
└─────────────────────────────────┘
```

---

## Production Deployment

### For Heroku / Railway / Render

```bash
# Create production .env
VITE_API_URL=https://your-api.herokuapp.com
DATABASE_URL=postgresql://...
NODE_ENV=production
PORT=5000
```

```bash
# Deploy
git push heroku main
# or
npm run build && npm start
```

### For AWS / DigitalOcean / Linode

1. **Setup Ubuntu server with Node.js**
2. **Copy files to server**
3. **Configure .env** with your API URL
4. **Run:**
   ```bash
   npm install
   npm run build
   npm start
   ```
5. **Use PM2 or systemd** to manage process
6. **Setup Nginx** as reverse proxy
7. **Configure SSL** with Let's Encrypt

---

## Troubleshooting

### API Calls Failing

**Issue:** Frontend can't reach backend API

**Solutions:**
1. Check `VITE_API_URL` in `.env`
   ```bash
   echo $VITE_API_URL
   ```

2. Test API endpoint:
   ```bash
   curl https://yourdomain.com:8000/api
   ```

3. Check firewall/port access:
   ```bash
   netstat -tulpn | grep 8000
   ```

4. Check browser console for CORS errors:
   - Verify `allowedHosts` in vite config
   - Check security headers in server

### Build Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Check TypeScript
npm run check

# Try build again
npm run build
```

### Database Connection Issues

```bash
# Check environment variables
env | grep DATABASE

# Test connection
npm run db:push --dry-run

# Check credentials
nano .env
```

### PM2 Not Starting

```bash
# Check logs
pm2 logs

# Restart process
pm2 restart techara-api

# Check status
pm2 status
```

---

## Environment Variables Summary

| Variable | Local Dev | cPanel | Purpose |
|----------|-----------|--------|---------|
| `NODE_ENV` | `development` | `production` | Node.js mode |
| `PORT` | `8000` | `8000` | Server port |
| `VITE_API_URL` | `http://localhost:8000` | `https://yourdomain.com:8000` | Frontend API endpoint |
| `DATABASE_URL` | `postgresql://localhost/...` | `postgresql://user:pass@host/db` | Database connection |

---

## Quick Commands

```bash
# Local development
npm run dev:split          # Client on 3000, Server on 8000

# Production build
npm run build              # Build everything

# Start server
npm start                  # Run production server

# Database
npm run db:push           # Sync schema to DB

# Type checking
npm run check             # TypeScript validation
```

---

## Security Best Practices

1. **Never commit `.env` to git**
   - Use `.env.example` for reference
   - Add `.env` to `.gitignore`

2. **Use HTTPS** in production
   - cPanel AutoSSL is automatic
   - Update `VITE_API_URL` to use `https://`

3. **Database security**
   - Use strong passwords
   - Restrict database user permissions
   - Don't use default credentials

4. **API security**
   - Enable CORS properly
   - Validate all inputs
   - Use environment variables for secrets

---

## Support

For issues:
1. Check error logs: `pm2 logs`
2. Check database connection
3. Verify environment variables
4. Check firewall/ports
5. Review browser console for CORS errors

Good luck with your deployment! 🚀
