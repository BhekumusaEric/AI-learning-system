import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

// Helper to initialize or read DB
function readDb() {
  if (!fs.existsSync(dbPath)) {
    // Make sure 'data' directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const initialData = { users: {} };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
  
  const content = fs.readFileSync(dbPath, 'utf-8');
  try {
    return JSON.parse(content);
  } catch (e) {
    return { users: {} };
  }
}

// Helper to write DB
function writeDb(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET: Fetch user progress
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  
  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const db = readDb();
  const user = db.users[username];
  
  if (!user) {
    // If user doesn't exist, we can create their stub immediately
    db.users[username] = {
      completedPages: {},
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    writeDb(db);
    return NextResponse.json(db.users[username]);
  }
  
  // Update last active on fetch
  user.lastActive = new Date().toISOString();
  writeDb(db);

  return NextResponse.json(user);
}

// POST: Update or Create user progress
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, completedPages } = body;
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const db = readDb();
    
    if (!db.users[username]) {
      db.users[username] = {
        completedPages: completedPages || {},
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
    } else if (completedPages) {
      db.users[username].completedPages = {
        ...db.users[username].completedPages,
        ...completedPages
      };
      db.users[username].lastActive = new Date().toISOString();
    }
    
    writeDb(db);
    
    return NextResponse.json({ success: true, user: db.users[username] });
  } catch (error) {
    console.error("Failed to update progress:", error);
    return NextResponse.json({ error: 'Failed to parse request' }, { status: 500 });
  }
}

// DELETE: Remove user from DB
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username || username === 'guest') {
      return NextResponse.json({ error: 'Valid username is required' }, { status: 400 });
    }

    const db = readDb();
    
    if (db.users[username]) {
      delete db.users[username];
      writeDb(db);
      return NextResponse.json({ success: true, message: `User ${username} deleted.` });
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
