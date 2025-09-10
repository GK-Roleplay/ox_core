// server/player/selection.ts
import { db } from '../db';
import { OxPlayer } from './class';

// --- SERVER -> CLIENT: open character select UI
on('ox:startCharacterSelect', async (userId: number, characters: any[]) => {
  const src = (global as any).source;
  emitNet('ox:openCharacterSelect', src, characters);
});

// --- CLIENT -> SERVER: user chose a character in NUI
onNet('ox:selectCharacter', async (charId: number) => {
  const src = Number((global as any).source);
  const player = OxPlayer.get(src);
  if (!player) return;

  player.charId = Number(charId);

  // Ensure inventory row exists for this character (so saves won't hit 0 rows)
  await db.query(
    'INSERT IGNORE INTO character_inventory (charId, inventory) VALUES (?, ?)',
    [player.charId, '[]']
  );

  // Tell server listeners the character is fully loaded (server-only event)
  emit('ox:playerLoaded', src);

  // Optional: tell the client-side HUD/NUI that gameplay can start
  emitNet('gkrp:playerLoaded', src);


// Build a payload for the client: coords, health, armour, and model
const row = await db.row<{
  x: number|null; y: number|null; z: number|null;
  heading: number|null; health: number|null; armour: number|null;
  model: number|null;
}>(
  'SELECT x, y, z, heading, health, armour, model FROM characters WHERE userId = ? LIMIT 1',
  [player.userId!]   // since every user has exactly one character
);

if (!row) return; // sanity check

// Defaults
const x = row.x ?? 0.0;
const y = row.y ?? 0.0;
const z = row.z ?? 72.0;
const heading = row.heading ?? 0.0;
const health  = row.health ?? 200;
const armour  = row.armour ?? 0;

// Always trust DB model (already normalized to freemode at minimum)
const model = Number(row.model);
console.log(`[spawn] model from DB =`, row?.model, 'for charId', player.charId);

emitNet('gkrp:spawnWithModel', src, { x, y, z, heading, health, armour, model });


// Finally close the auth/selection UI
emitNet('ox:nui:close', src);
});

// --- /refreshchar command: save, clear, reopen selection
RegisterCommand('refreshchar', async (_src: string, _args: string[], _raw: string) => {
  const src = Number(_src);
  const player = OxPlayer.get(src);
  if (!player) return;

  // 1) save inventory immediately (don’t rely only on disconnect)
  try {
    (global as any).exports.ox_inventory?.SaveInventory?.(src);
  } catch (e) {
    console.warn('[ox_core] SaveInventory error on /refreshchar', e);
  }

  // 2) mark as not in a loaded character
  player.charId = undefined as any;

  // 3) prep the client for selection (hide HUD, freeze, etc.)
  emitNet('gkrp:prepareCharSelect', src);

  // 4) re-run the “joined” flow which emits ox:startCharacterSelect
  // setAsJoined() also (re-)adds to registry if needed and sends characters
  await player.setAsJoined();
}, false);
