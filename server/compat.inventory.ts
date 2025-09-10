/* eslint-disable @typescript-eslint/no-explicit-any */
const registry = new Map<number, any>();
const emittedForChar = new Map<number, number>();

(global as any).OxPlayer = {
  get(src: number) { return registry.get(src); },
};

// export a classic getter many resources expect: exports.ox_core:get(playerId)
exports('get', (src: number) => {
  return registry.get(src); // return your player object (has .source/.userId/.charId/.get/.set)
});

// (keep any other exports you already have)
exports('GetPlayer', (src: number) => registry.get(src));
exports('GetPlayerByUserId', (userId: number) => {
  for (const p of registry.values()) if (p?.userId === userId) return p;
  return undefined;
});

function setStatebagCharId(src: number, charId: number) {
  try { (global as any).Player?.(String(src))?.state?.set?.('charId', charId, true); } catch {}
}

export function registerPlayerObject(src: number, userId: number, charId?: number) {
  const p =
    registry.get(src) ??
    {
      source: src,
      data: new Map<string, any>(),
      get(k: string) { return this.data.get(k); },
      set(k: string, v: any) { this.data.set(k, v); },
    };

  p.source = src;
  p.userId = userId;
  if (charId != null) {
    p.charId = charId;
    try { p.set('charId', charId); } catch {}
  }
  registry.set(src, p);
  return p;
}

export function onUserAuthenticated(src: number, userId: number) {
  registerPlayerObject(src, userId);
}

export function onCharacterLoaded(src: number, charId: number) {
  const userId = registry.get(src)?.userId ?? 0;
  const p = registerPlayerObject(src, userId, charId);
  setStatebagCharId(src, charId);

  // de-dupe per (src, charId)
  if (emittedForChar.get(src) === charId) return;
  emittedForChar.set(src, charId);

  try { emit('ox:playerLoaded', src); } catch (e) {
    console.warn('[compat.inventory] emit ox:playerLoaded failed', e);
  }
}

export function onPlayerLogout(src: number) {
  emittedForChar.delete(src);
  try { emit('ox:playerLogout', src); } catch {}
  registry.delete(src);
}

on('playerDropped', () => {
  const src = Number((global as any).source);
  if (src) onPlayerLogout(src);
});
