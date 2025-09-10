// unchanged from v2, included for completeness
let nuiOpen = false;
function hidePlayerForUi(hide: boolean) {
  const ped = PlayerPedId();
  try { DisplayRadar(!hide); DisplayHud(!hide); } catch {}
  if (hide) {
    SetEntityVisible(ped, false, false);
    FreezeEntityPosition(ped, true);
    SetEntityCollision(ped, false, false);
  } else {
    FreezeEntityPosition(ped, false);
    SetEntityCollision(ped, true, true);
    SetEntityVisible(ped, true, false);
  }
}
onNet('ox:nui:open', () => {
  nuiOpen = true;
  try { SetNuiFocus(true, true); SendNUIMessage({ action: 'open' }); } catch {}
  hidePlayerForUi(true);
});
onNet('ox:nui:close', () => {
  nuiOpen = false;
  try { SendNUIMessage({ action: 'close' }); } catch {}
  SetNuiFocus(false, false);
  ShutdownLoadingScreenNui();
  hidePlayerForUi(false);
});
onNet('ox:forceOpenLogin', () => { emit('ox:nui:open'); });
RegisterNuiCallbackType("login");
on("__cfx_nui:login", (data: { username: string; password: string }, cb: Function) => {
  try {
    const { username, password } = data || {};
    if (!username || !password) {
      return cb({ ok: false, error: "missing-creds" });
    }
    emitNet("ox:auth:login", username, password);
    cb({ ok: true });
  } catch (e) {
    console.error("login callback failed", e);
    cb({ ok: false, error: "exception" });
  }
});

// Bridge NUI "register" → server event
RegisterNuiCallbackType("register");
on("__cfx_nui:register", (data: any, cb: Function) => {
  try {
    emitNet("ox:auth:register", data);
    cb({ ok: true });
  } catch (e) {
    console.error("register callback failed", e);
    cb({ ok: false, error: "exception" });
  }
});