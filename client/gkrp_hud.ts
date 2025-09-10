// client/gkrp_hud.ts
// Minimal, fast native HUD for GK:RP brand + cash/bank + active players

let showHud = false;
let cash = 0;
let bank = 0;

// pick up server push
onNet('gkrp:updateBalances', (data: { cash: number; bank: number }) => {
  cash = Number(data?.cash || 0);
  bank = Number(data?.bank || 0);
});

// also observe state bag updates (replicated from server)
AddStateBagChangeHandler('gkrpBalances', null, (bagName: string, _key: string, value: any, _reserved: number, _replicated: boolean) => {
  // only apply if this bag belongs to the local player
  const player = GetPlayerFromStateBagName(bagName); // FiveM helper
  if (player === PlayerId() && value) {
    cash = Number(value.cash || 0);
    bank = Number(value.bank || 0);
  }
});

// Post-auth trigger
on('ox:playerLoaded', () => {
  showHud = true;
  // ask server for an immediate snapshot
  emitNet('gkrp:reqBalances');
});

// Utility: right-aligned text draw
function drawRightText(txt: string, x: number, y: number, scale: number = 0.35) {
  SetTextFont(4);
  SetTextProportional(true);
  SetTextScale(scale, scale);
  SetTextColour(255, 255, 255, 215);
  SetTextOutline();
  SetTextRightJustify(true);
  SetTextWrap(0.0, x);
  BeginTextCommandDisplayText('STRING');
  AddTextComponentSubstringPlayerName(txt);
  EndTextCommandDisplayText(x, y);
}

// Utility: left-aligned brand
function drawLeftText(txt: string, x: number, y: number, scale: number = 0.4) {
  SetTextFont(4);
  SetTextProportional(true);
  SetTextScale(scale, scale);
  SetTextColour(255, 255, 255, 230);
  SetTextOutline();
  SetTextCentre(false);
  BeginTextCommandDisplayText('STRING');
  AddTextComponentSubstringPlayerName(txt);
  EndTextCommandDisplayText(x, y);
}

setTick(() => {
  if (!showHud) return;

  // background strip (top bar) – subtle & cheap
  DrawRect(0.5, 0.045, 0.33, 0.07, 0, 0, 0, 90);

  // brand (top-left)
  drawLeftText('GK:RP', 0.02, 0.02, 0.5);

  // active players (top-right)
  const players = GetActivePlayers()?.length || 1;
  drawRightText(`Players: ~w~${players}`, 0.98, 0.018);

  // money lines (below players, right-aligned)
  drawRightText(`Cash: ~g~$${cash.toLocaleString()}`, 0.98, 0.045);
  drawRightText(`Bank: ~b~$${bank.toLocaleString()}`, 0.98, 0.070);
});
