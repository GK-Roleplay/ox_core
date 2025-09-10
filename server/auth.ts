// server/auth.ts (patched)
// UI open (join + restart), robust login, ped spawn from DB, proper charId hydration

import bcrypt from 'bcryptjs';
import { db } from './db';
import { loadPlayer } from './player/loading';
import { UpdateUserTokens, IsUserBanned, CreateCharacter, IsStateIdAvailable, GetUserAuthByUsername } from './player/db';
import { onUserAuthenticated, onCharacterLoaded } from './compat.inventory'; // the shim we made

// server/util.ts
export function getSrc(): number {
  const s = (global as any).source;
  const n = typeof s === 'string' ? parseInt(s, 10) : Number(s);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function safeEmitNet(event: string, src: number, ...args: any[]) {
  if (!Number.isFinite(src) || src <= 0) {
    console.warn(`[safeEmitNet] invalid src (${src}) for ${event}`);
    return;
  }
  emitNet(event, src, ...args);
}
// Track which charId we've already announced for each src

const loadedForChar = new Map<number, number>(); // src -> charId
function normalizeModel(model: any): number {
  let hash = 0;
  try {
    if (typeof model === 'string') hash = GetHashKey(model);
    else if (typeof model === 'number') hash = model|0;
  } catch {}
  if (!hash || !IsModelInCdimage(hash) || !IsModelValid(hash)) {
    hash = GetHashKey('mp_m_freemode_01');
  }
  return hash;
}

function setCharIdentity(src: number, charId: number) {
  // Update your ox_core registry object (from your compat shim)
  try {
    const p = (global as any).OxPlayer?.get?.(src);
    if (p) {
      p.charId = charId;
      if (typeof p.set === 'function') p.set('charId', charId);
    }
  } catch {}

  // Also mirror into the statebag for other resources
  try {
    const st = (global as any).Player?.(String(src))?.state;
    st?.set?.('charId', charId, true);
  } catch {}
}

function emitPlayerLoadedOnce(src: number, charId: number) {
  const prev = loadedForChar.get(src);
  if (prev === charId) return;           // already emitted for this char
  loadedForChar.set(src, charId);

  const p = (global as any).OxPlayer?.get?.(src);
  if (!p || !p.charId) return;           // guard against undefined
  try { emit('ox:playerLoaded', src); } catch (e) {
    console.warn('[spawn] ox:playerLoaded emit failed', e);
  }
}


// ---- UI open on join ----
on('playerJoining', () => {
  const src = getSrc();                  // ✅ capture once, right away
  if (!src) return console.log("= getSrc");
  // Instead of immediately loading a player, tell client to open NUI
  emitNet('ox:forceOpenLogin', src);
});
// ---- UI reopen for all players on resource restart ----
on('onResourceStart', (resName: string) => {
  if (resName !== GetCurrentResourceName()) return;

  setTimeout(() => {
    // getPlayers() is available in JS runtime on server; if not, fall back to probing IDs.
    let players: string[] = [];
    try {
      // @ts-ignore
      if (typeof getPlayers === 'function') players = (getPlayers() as string[]) || [];
    } catch {}
    if (!players || players.length === 0) {
      const max = 1024;
      for (let i = 1; i <= max; i++) {
        try {
          const id = String(i);
          const name = GetPlayerName(id);
          if (name && name.length) players.push(id);
        } catch {}
      }
    }
    for (const id of players) {
      const src = Number(id);
      postClient(src, 'open');
    }
  }, 800);
});

// ---- helpers ----
async function isUsernameTaken(username: string): Promise<boolean> {
  return !!(await db.exists('SELECT 1 FROM users WHERE username = ?', [username]));
}


function attachCharIdentity(src: number, charId: number) {
  // 1) registry OxPlayer
  let ox = undefined as any;
  try {
    ox = (OxPlayer as any)?.get?.(src) 
      ?? (global as any).exports?.ox_core?.getPlayer?.(src);
  } catch {}

  if (ox) {
    ox.charId = charId;                       // direct prop (covers listeners using .charId)
    if (typeof ox.set === 'function') {
      ox.set('charId', charId);               // internal map (covers listeners using get/set)
    }
  }

  // 2) Player statebag (replicated)
  try {
    const st = (global as any).Player?.(String(src))?.state;
    if (st?.set) st.set('charId', charId, true);
  } catch {}
}
// ---- manual UI open (for testing) ----
onNet('gkrp:reqOpenUi', () => {
  const src = getSrc();                  // ✅ capture once, right away
  if (!src) return console.log("= getSrc");
  if (src > 0) postClient(src, 'open');
});

// ---- LOGIN ----
// ---- LOGIN (defensive & helper
// Safe token collector; no external helpers needed
function collectPlayerTokens(src: number): string[] {
  const tokens: string[] = [];
  try {
    const count = (global as any).GetNumPlayerTokens ? GetNumPlayerTokens(String(src)) : 0;
    for (let i = 0; i < (count || 0); i++) {
      const t = GetPlayerToken(String(src), i);
      if (t) tokens.push(t);
    }
  } catch (e) {
    console.warn('[auth] token collection failed', e);
  }
  return tokens;
}

// tiny sugar
function postClient(src: number, action: 'open'|'close'|'alert', payload?: any) {
  if (!src || src <= 0) return;
  if (action === 'alert') emitNet('ox:nui:alert', src, payload?.type || 'error', payload?.message || '');
  else if (action === 'open') emitNet('ox:nui:open', src);
  else if (action === 'close') emitNet('ox:nui:close', src);
}

// helpers
function safeString(v: any, max = 128) {
  return (typeof v === 'string' ? v : String(v ?? '')).trim().slice(0, max);
}
function dobFromAge(age: number): string {
  // YYYY-MM-DD based on age, using Jan 1 as default
  const now = new Date();
  const y = now.getUTCFullYear() - (Number.isFinite(age) ? Math.round(age) : 18);
  return `${y}-01-01`;
}
function generateStateId(): string {
  return 'GK' + Math.floor(Math.random() * 900000 + 100000);
}
async function ensureGroupsState(src: number, charId: number) {
  // Build your groups map from DB if you have one; otherwise keep it empty
  let groups: Record<string, number> = {};
  try {
    // Example table: character_groups(name, grade, charId)
    const rows = await db.query<{ name: string; grade: number }[]>(
      'SELECT name, grade FROM character_groups WHERE charId = ?',
      [charId]
    );
    if (Array.isArray(rows)) {
      groups = rows.reduce((acc, r) => {
        acc[String(r.name)] = Number(r.grade) || 0;
        return acc;
      }, {} as Record<string, number>);
    }
  } catch (e) {
    console.warn('[groups] load failed, defaulting to empty {}', e);
  }

  // Mirror to the player's statebag so clients (and bridges) can read it
  try {
    (global as any).Player?.(String(src))?.state?.set?.('groups', groups, true);
  } catch (e) {
    console.warn('[groups] statebag set failed', e);
  }

  // Also push to client to hydrate any cached player object/export
  emitNet('ox_core:client:setGroups', src, groups);
}


RegisterNetEvent('ox:auth:register');
onNet('ox:auth:register', async (raw: any) => {
  const src = getSrc();                  // ✅ capture once, right away
  if (!src) return console.log("= getSrc");

  // per-src mutex
  (global as any).__gkActiveOps ||= new Map<number, string>();
  const ops: Map<number, string> = (global as any).__gkActiveOps;
  if (ops.has(src)) return;
  ops.set(src, 'register');

  try {
    // 1) normalize + validate
    const payload = raw ?? {};
    const username = safeString(payload.username);
    const password = safeString(payload.password, 256);
    const firstName = safeString(payload.first_name ?? payload.first);
    const lastName  = safeString(payload.last_name  ?? payload.last);
    const pedName   = safeString(payload.ped, 64);
    const description = safeString(payload.description, 400);
    const age = Number(payload.age);

    console.log('[REGISTER] payload (normalized)', { src, username, firstName, lastName, pedName, age });

    if (!username || !password || !firstName || !lastName || !pedName) {
      return postClient(src, 'alert', { type: 'error', message: 'Missing required fields.' });
    }

    const taken = await db.row<{ userId: number }>(
      'SELECT userId FROM users WHERE username = ? LIMIT 1', [username]
    );
    if (taken?.userId) {
      return postClient(src, 'alert', { type: 'error', message: 'Username already taken.' });
    }

    // 2) create user
    const password_hash = await bcrypt.hash(password, 10);
    const userId = await db.insert(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, password_hash]
    );
    if (!userId) {
      return postClient(src, 'alert', { type: 'error', message: 'Failed to create account.' });
    }

    // 3) create character
    const stateId = generateStateId();
    const dob = dobFromAge(age);
    const charId = await CreateCharacter(userId, stateId, firstName, lastName, 'other', dob);

    const modelHash = GetHashKey(pedName);
    await db.update(
      'UPDATE characters SET model = ?, bio = ? WHERE charId = ?',
      [modelHash, description || null, charId]
    );

    // ensure inventory row (ignore duplicates)
    try {
      await db.query(
        'INSERT IGNORE INTO character_inventory (charId, inventory) VALUES (?, ?)',
        [charId, '[]']
      );
    } catch (e) {
      console.warn('[REGISTER] inventory hydrate failed (non-fatal)', e);
    }

    // 4) ensure ox_core player exists and is registered
    const playerOrErr = await loadPlayer(src, userId);   // returns player or string
    if (typeof playerOrErr === 'string') {
      console.warn('[REGISTER] loadPlayer returned', playerOrErr);
      return postClient(src, 'alert', { type: 'error', message: playerOrErr });
    }
    const player = playerOrErr;

    if (typeof player.setAsJoined === 'function') {
      await player.setAsJoined(); // registers in ox_core’s internal registry
    }

    // 5) set active character (this sets player.charId internally)
    if (typeof player.setActiveCharacter === 'function') {
      await player.setActiveCharacter(charId);
    } else {
      try { player.charId = charId; if (typeof player.set === 'function') player.set('charId', charId); } catch {}
    }

    // 6) set statebags ONCE on server (client should NOT write to them)
    try {
      const state = (global as any).Player?.(String(src))?.state;
      state?.set?.('userId', userId, true);
      state?.set?.('charId', charId, true);
      // If you don’t have a groups system yet, {} is fine (prevents ox_inventory nil access)
      state?.set?.('groups', {}, true);
    } catch (e) {
      console.warn('[statebag] set failed', e);
    }

    // 7) notify other resources (ox_core expects ONLY src)
    emit('ox:playerLoaded', src);
    const charRow = await db.row<{
      x: number|null; y: number|null; z: number|null; heading: number|null;
      health: number|null; armour: number|null; model: number|null;
    }>('SELECT x,y,z,heading,health,armour,model FROM characters WHERE charId = ? LIMIT 1', [charId]);

    if (!charRow) return postClient(src, 'alert', { type: 'error', message: 'Character not found.' });

    const spawnData = {
      x: Number.isFinite(charRow.x as any) ? Number(charRow.x) : -1037.0,
      y: Number.isFinite(charRow.y as any) ? Number(charRow.y) : -2737.0,
      z: Number.isFinite(charRow.z as any) ? Number(charRow.z) : 13.8,
      heading: Number.isFinite(charRow.heading as any) ? Number(charRow.heading) : 90.0,
      health: Number.isFinite(charRow.health as any) ? Math.max(Number(charRow.health), 100) : 200,
      armour: Number.isFinite(charRow.armour as any) ? Number(charRow.armour) : 0,
      model: Number.isFinite(charRow.model as any) && Number(charRow.model)
        ? Number(charRow.model) : GetHashKey('mp_m_freemode_01'),
    };
    // 7) spawn + close UI
    emitNet('gkrp:spawnWithModel', src, normalizeModel(spawnData));

    // 8) spawn ONCE, then close UI
    postClient(src, 'close');
    postClient(src, 'alert', { type: 'success', message: 'Registration successful. Spawning…' });

    // optional: UI info hook (do NOT spawn again on this)
    emitNet('ox:auth:registered', src, { userId, charId });

    console.log('[REGISTER] success', { src, userId, charId });
  } catch (e) {
    console.error('[REGISTER] error', e);
    postClient(src, 'alert', { type: 'error', message: 'Registration failed. Try again.' });
  } finally {
    ops.delete(src);
  }
});

RegisterNetEvent('ox:auth:login');
onNet('ox:auth:login', async (raw: any) => {
  const src = getSrc();                  // ✅ capture once, right away
  if (!src) return console.log("= getSrc");

  // per-src mutex
  (global as any).__gkActiveOps ||= new Map<number, string>();
  const ops: Map<number, string> = (global as any).__gkActiveOps;
  if (ops.has(src)) return;
  ops.set(src, 'login');

  try {
    // 1) normalize + validate
    const payload = raw ?? {};
    const username = safeString(payload.username);
    const password = safeString(payload.password, 256);

    console.log('[LOGIN] payload (normalized)', { src, username });

    if (!username || !password) {
      return postClient(src, 'alert', { type: 'error', message: 'Missing username or password.' });
    }

    // 2) find user
    const user = await db.row<{
      userId: number;
      password_hash: string;
    }>(
      'SELECT userId, password_hash FROM users WHERE username = ? LIMIT 1',
      [username]
    );

    if (!user?.userId) {
      return postClient(src, 'alert', { type: 'error', message: 'Invalid username or password.' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return postClient(src, 'alert', { type: 'error', message: 'Invalid username or password.' });
    }

    const userId = user.userId;

    // 3) load last active character
    const char = await db.row<{ charId: number }>(
      'SELECT charId FROM characters WHERE userId = ? LIMIT 1',
      [userId]
    );

    if (!char?.charId) {
      return postClient(src, 'alert', {
        type: 'error',
        message: 'No characters found. Please register one.'
      });
    }

    const charId = char.charId;

    // 4) ensure ox_core player
    const playerOrErr = await loadPlayer(src, userId);
    if (typeof playerOrErr === 'string') {
      console.warn('[LOGIN] loadPlayer returned', playerOrErr);
      return postClient(src, 'alert', { type: 'error', message: playerOrErr });
    }
    const player = playerOrErr;

    if (typeof player.setAsJoined === 'function') {
      await player.setAsJoined();
    }

    if (typeof player.setActiveCharacter === 'function') {
      await player.setActiveCharacter(charId);
    } else {
      try { player.charId = charId; if (typeof player.set === 'function') player.set('charId', charId); } catch {}
    }

    // 5) set statebags (server authoritative)
    try {
      const state = (global as any).Player?.(String(src))?.state;
      state?.set?.('userId', userId, true);
      state?.set?.('charId', charId, true);
      state?.set?.('groups', {}, true);
    } catch (e) {
      console.warn('[statebag] set failed', e);
    }

    // 6) notify other resources
    emit('ox:playerLoaded', src);
    const charRow = await db.row<{
      x: number|null; y: number|null; z: number|null; heading: number|null;
      health: number|null; armour: number|null; model: number|null;
    }>('SELECT x,y,z,heading,health,armour,model FROM characters WHERE charId = ? LIMIT 1', [charId]);

    if (!charRow) return postClient(src, 'alert', { type: 'error', message: 'Character not found.' });

    const spawnData = {
      x: Number.isFinite(charRow.x as any) ? Number(charRow.x) : -1037.0,
      y: Number.isFinite(charRow.y as any) ? Number(charRow.y) : -2737.0,
      z: Number.isFinite(charRow.z as any) ? Number(charRow.z) : 13.8,
      heading: Number.isFinite(charRow.heading as any) ? Number(charRow.heading) : 90.0,
      health: Number.isFinite(charRow.health as any) ? Math.max(Number(charRow.health), 100) : 200,
      armour: Number.isFinite(charRow.armour as any) ? Number(charRow.armour) : 0,
      model: Number.isFinite(charRow.model as any) && Number(charRow.model)
        ? Number(charRow.model) : GetHashKey('mp_m_freemode_01'),
    };
    // 7) spawn + close UI
    emitNet('gkrp:spawnWithModel', src, normalizeModel(spawnData));
    console.log(`postClient(src, 'alert', { type: 'success', message: 'Login successful. Spawning…' });`)
    postClient(src, 'close');
    postClient(src, 'alert', { type: 'success', message: 'Login successful. Spawning…' });

    // optional info hook
    emitNet('ox:auth:loggedin', src, { userId, charId });

    console.log('[LOGIN] success', { src, userId, charId });
  } catch (e) {
    console.error('[LOGIN] error', e);
    postClient(src, 'alert', { type: 'error', message: 'Login failed. Try again.' });
  } finally {
    ops.delete(src);
  }
});

// ---- Character select passthrough (server -> client) ----
on('ox:startCharacterSelect', (userId: number, characters: any[]) => {
  const src = getSrc();                  // ✅ capture once, right away
  if (!src) return console.log("= getSrc");
  if (src > 0) emitNet('ox:openCharacterSelect', src, characters);
});


// Save preview ped model to the active character (if any)
onNet('ox:auth:savePreviewPed', async (data: { model?: number }) => {
  const src = getSrc();                  // ✅ capture once, right away
  if (!src) return console.log("= getSrc");
  try {
    const model = Number(data?.model || 0);
    // Grab OxPlayer and charId safely
    // @ts-ignore
    const OxPlayer = global.exports['ox_core']?.OxPlayer || (global as any).OxPlayer;
    const player = OxPlayer?.get?.(src);
    const charId = player?.charId || player?.charid || player?._data?.charId;
    if (!charId) return; // nothing to persist yet

    if (model && model > 0) {
      await db.update('UPDATE characters SET model = ? WHERE charId = ?', [model, charId]);
    }
  } catch (e) {
    console.error('[auth] savePreviewPed failed', e);
  }
});



RegisterNetEvent('ox:auth:spawn');
onNet('ox:auth:spawn', async (charId?: number) => {  const src = getSrc();                  // ✅ capture once, right away
  if (!src) return console.log(":spawn");
if (!src || src <= 0) {
  console.warn('[ox:auth:spawn] called without valid src', src);
  return;
}  try {
    // if client didn't pass a charId, resolve most recent for this user
    if (!charId) {
      const player = (global as any).exports?.ox_core?.OxPlayer?.get?.(src);
      const userId = player?.userId;
      if (!userId) return postClient(src, 'alert', { type: 'error', message: 'No user loaded.' });

      const row = await db.row<{ charId: number }>(
        'SELECT charId FROM characters WHERE userId = ? ORDER BY charId DESC LIMIT 1',
        [userId]
      );
      if (!row) return postClient(src, 'alert', { type: 'error', message: 'No character found.' });
      charId = row.charId;
    }

    const charRow = await db.row<{
      x: number|null; y: number|null; z: number|null; heading: number|null;
      health: number|null; armour: number|null; model: number|null;
    }>('SELECT x,y,z,heading,health,armour,model FROM characters WHERE charId = ? LIMIT 1', [charId]);

    if (!charRow) return postClient(src, 'alert', { type: 'error', message: 'Character not found.' });

    const spawnData = {
      x: Number.isFinite(charRow.x as any) ? Number(charRow.x) : -1037.0,
      y: Number.isFinite(charRow.y as any) ? Number(charRow.y) : -2737.0,
      z: Number.isFinite(charRow.z as any) ? Number(charRow.z) : 13.8,
      heading: Number.isFinite(charRow.heading as any) ? Number(charRow.heading) : 90.0,
      health: Number.isFinite(charRow.health as any) ? Math.max(Number(charRow.health), 100) : 200,
      armour: Number.isFinite(charRow.armour as any) ? Number(charRow.armour) : 0,
      model: Number.isFinite(charRow.model as any) && Number(charRow.model)
        ? Number(charRow.model) : GetHashKey('mp_m_freemode_01'),
    };

    emitNet('gkrp:spawnWithModel', src || (global as any).source || source, normalizeModel(spawnData));
    console.log('[SPAWN] success', { src, charId });
  } catch (e) {
    console.error('[SPAWN] failed', e);
    postClient(src, 'alert', { type: 'error', message: 'Spawn failed.' });
  }
});


// SERVER
// SERVER
RegisterNetEvent('gkrp:serverSpawn');
onNet('gkrp:serverSpawn', async (charId?: number) => {
  console.log(`RegisterNetEvent('gkrp:serverSpawn');`)
  const src = getSrc();                  // ✅ capture once, right away
  if (!src) return console.log("= getSrc");

  if (!src || src <= 0) {
    console.warn('[gkrp:serverSpawn] called without valid player src:', src);
    return;
  }

  try {
    // Always reset routing bucket for a clean world
    SetPlayerRoutingBucket(src, 0);

    // Resolve charId if not provided
    if (!charId) {
      const u = (global as any).exports?.ox_core?.OxPlayer?.get?.(src)?.userId;
      if (!u) {
        return emitNet('gkrp:spawnError', src, 'No userId found.');
      }

      const row = await db.row<{ charId: number }>(
        'SELECT charId FROM characters WHERE userId = ? ORDER BY charId DESC LIMIT 1',
        [u]
      );

      if (!row) {
        return emitNet('gkrp:spawnError', src, 'No character found.');
      }

      charId = row.charId;
      setCharIdentity(src, charId);
    }

    const row = await db.row<{
      x: number | null;
      y: number | null;
      z: number | null;
      heading: number | null;
      health: number | null;
      armour: number | null;
      model: number | null;
    }>(
      'SELECT x,y,z,heading,health,armour,model FROM characters WHERE charId = ? LIMIT 1',
      [charId]
    );

    if (!row) {
      return emitNet('gkrp:spawnError', src, 'Character not found.');
    }

    const spawnData = {
      x: Number.isFinite(row.x as any) ? Number(row.x) : -1037.0,
      y: Number.isFinite(row.y as any) ? Number(row.y) : -2737.0,
      z: Number.isFinite(row.z as any) ? Number(row.z) : 13.8,
      heading: Number.isFinite(row.heading as any) ? Number(row.heading) : 90.0,
      health: Math.max(100, Number(row.health ?? 200)),
      armour: Math.max(0, Number(row.armour ?? 0)),
      model: (Number.isFinite(row.model as any) && Number(row.model))
        ? Number(row.model)
        : GetHashKey('mp_m_freemode_01'),
    };

    emitPlayerLoadedOnce(src, charId);

    // ✅ src is guaranteed > 0 here
    emitNet('gkrp:spawnWithModel', src || (global as any).source || source, normalizeModel(spawnData));

  } catch (e) {
    console.error('[serverSpawn] error', e);
    if (src && src > 0) {
      emitNet('gkrp:spawnError', src, 'Spawn failed.');
    }
  }
});
