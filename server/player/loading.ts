import { OxPlayer } from 'player/class';
import { CreateUser, GetUserIdFromIdentifier, IsUserBanned, UpdateUserTokens, GetUserAuthByUsername, GetUsernameByUserId } from './db';
import { GetIdentifiers, GetPlayerLicense } from 'utils';
import { DEBUG, SV_LAN } from '../config';
import type { Dict } from 'types';
import locales from '../../common/locales';
import bcrypt from 'bcryptjs';
import { db } from '../db';
export async function SavePlayer(player: any) {
  try {
    if (!player || !player.charId) {
      console.warn('[SavePlayer] called without charId', {
        src: player?.source,
        userId: player?.userId,
      });
      return; // nothing to save yet
    }

    // safest way: pull inventory from ox_inventory
    const inv = global.exports.ox_inventory.GetInventory(player.source);
    if (!inv) return;

    await db.query(
      'UPDATE character_inventory SET inventory = ? WHERE charId = ?',
      [JSON.stringify(inv), player.charId]
    );
  } catch (err) {
    console.error(`[ox_core] Failed saving char ${player?.charId}`, err);
  }
}
const connectingPlayers: Dict<OxPlayer> = {};

export async function loadPlayer(playerId: number, forceUserId?: number) {
  let player: OxPlayer | undefined;

  try {
    if (serverLockdown) return serverLockdown;

    player = new OxPlayer(playerId);

    // Figure out the userId:
    let userId = 0;

    if (forceUserId && Number.isInteger(forceUserId) && forceUserId > 0) {
      // NUI-authenticated path
      userId = forceUserId;
    } else {
      // Identifier path (no auto-create if not found)
      const license = SV_LAN ? 'fayoum' : GetPlayerLicense(playerId);
      if (!license) return locales('no_license');

      const identifier = license.substring(license.indexOf(':') + 1);
      player.identifier = identifier;

      userId = (await GetUserIdFromIdentifier(identifier)) ?? 0;

      // If no account linked to this identifier, require manual login
      if (!userId) {
        return 'Please log in with your username and password.';
      }
    }

    // Prevent duplicate session for same user
    if (userId && OxPlayer.getFromUserId(userId)) {
      const kickReason = locales('userid_is_active', userId);

      if (!DEBUG) return kickReason;

      // In DEBUG we’ll allow checking the next match (rare edge case)
      const license = SV_LAN ? 'fayoum' : GetPlayerLicense(playerId);
      if (license) {
        const identifier = license.substring(license.indexOf(':') + 1);
        const altUserId = (await GetUserIdFromIdentifier(identifier, 1)) ?? 0;
        if (altUserId && OxPlayer.getFromUserId(altUserId)) return kickReason;
        if (altUserId) userId = altUserId;
      }
    }

    // Tokens + ban check only for valid user
    if (userId > 0) {
      const tokens = getPlayerTokens(playerId);
      await UpdateUserTokens(userId, tokens);

      const ban = await IsUserBanned(userId);
      if (ban) {
        return OxPlayer.formatBanReason(ban);
      }
    }

    // Set identity/display name
    player.userId = userId;
    const dbUsername = userId ? await GetUsernameByUserId(userId) : undefined;
    player.username = dbUsername ?? GetPlayerName(player.source as string);

    DEV: console.info(`Loaded player data for OxPlayer<${player.userId}>`);
    return player;
  } catch (err: any) {
    console.error('Error loading player:', err);

    if (player?.userId) {
      try {
        OxPlayer.remove(player.source);
      } catch (cleanupErr) {
        console.error('Error during cleanup:', cleanupErr);
      }
    }

    return err?.message || 'Failed to load player.';
  }
}

let serverLockdown: string;

setInterval(() => {
  for (const tempId in connectingPlayers) {
    if (!DoesPlayerExist(tempId)) delete connectingPlayers[tempId];
  }
}, 10000);

on('txAdmin:events:serverShuttingDown', () => {
  serverLockdown = locales('server_restarting');
  OxPlayer.saveAll(serverLockdown);
});

on('playerConnecting', (name: string, setKickReason: any, deferrals: any) => {
  const src = source as number;
  deferrals.defer();

  // Optional: you can set a "please wait" message here
  deferrals.update(`Welcome ${name}, opening login UI...`);

  // Open the NUI login screen on the client

  // Immediately finish deferral (player enters, but frozen in NUI focus)
  deferrals.done();
  emitNet('ox:nui:open', src);

});
on('playerJoining', async (tempId: string) => {
  if (serverLockdown) return DropPlayer(source.toString(), serverLockdown);

  const player = connectingPlayers[tempId];

  if (!player) return;

  delete connectingPlayers[tempId];
  connectingPlayers[source] = player;
  player.source = source;

  DEV: console.info(`Assigned id ${source} to OxPlayer<${player.userId}>`);
});

on('playerDropped', () => {
  const player = OxPlayer.get(source);
  SavePlayer(player);

  if (!player) return;

  player.logout(true, true);
  OxPlayer.remove(player.source);

  DEV: console.info(`Dropped OxPlayer<${player.userId}>`);
});

RegisterCommand(
  'saveplayers',
  () => {
    OxPlayer.saveAll();
  },
  true,
);

// --- Manual login state ---
const loginOverride: Record<number, number> = {};
const loginVerified = new Set<number>();
const joinedPending = new Set<number>();
function setLoginOverride(src: number, userId: number) { loginOverride[src] = userId; }

// --- Manual login: username/password ---
onNet('ox:submitLogin', async (username: string, password: string) => {
});
