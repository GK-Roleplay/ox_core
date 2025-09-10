// server/hud.ts
import { OxPlayer } from 'player/class';
import { OnPlayerLoaded } from 'player/events';
import { SelectAccount } from 'accounts/db';

type Balances = { cash: number; bank: number };

async function getBankForChar(charId: number): Promise<number> {
  // Use the server export you already provide to third parties:
  //   exports.ox_core.GetCharacterAccount(charId) -> OxAccount
  // And the account#get('balance') helper from lib/server/account.ts
  const account: any = await exports.ox_core.GetCharacterAccount(charId);
  if (!account) return 0;
  try {
    const bal = await account.get('balance');
    return Number(bal || 0);
  } catch {
    return 0;
  }
}

function getCashForPlayer(playerId: number): number {
  try {
    const amt = (exports.ox_inventory?.GetItemCount?.(playerId, 'money')) || 0;
    return Number(amt);
  } catch {
    return 0;
  }
}

async function computeBalances(playerId: number): Promise<Balances | null> {
  const p = OxPlayer.get(playerId);
  if (!p?.charId) return null;
  const [cash, bank] = [getCashForPlayer(playerId), await getBankForChar(p.charId)];
  return { cash, bank };
}

async function pushBalances(playerId: number) {
  const balances = await computeBalances(playerId);
  if (!balances) return;

  // 1) Replicate to the player's state bag (auto-sync to client)
  const state = Player(playerId).state;
  state.set('gkrpBalances', balances, true);

  // 2) Also push via a direct event (handy for immediate UI updates)
  emitNet('gkrp:updateBalances', playerId, balances);
}

// Start: after character is actually loaded (post-auth)
OnPlayerLoaded('ox_core', (player) => {
  pushBalances(player.source);
});

// Allow the client to request a refresh at any time
onNet('gkrp:reqBalances', () => {
  pushBalances(Number(source));
});

// --- Keep bank HUD live using your existing account events ---

// Cash <-> Bank movements
on('ox:depositedMoney', async ({ playerId }: { playerId: number }) => {
  pushBalances(playerId);
});

on('ox:withdrewMoney', async ({ playerId }: { playerId: number }) => {
  pushBalances(playerId);
});

// Any balance change on any account: if it's the player's personal account, refresh them
on('ox:updatedBalance', async ({ accountId }: { accountId: number }) => {
  const account = await SelectAccount(accountId); // includes owner
  const ownerCharId = account?.owner;
  if (!ownerCharId) return;

  const player = OxPlayer.getFromCharId(ownerCharId);
  if (player) pushBalances(player.source);
});
