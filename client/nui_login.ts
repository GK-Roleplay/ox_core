// nui_login.ts - barebones, just login + apply model


// Apply chosen model to the player (when user confirms)
RegisterNuiCallbackType("applyPedModel");
on("__cfx_nui:applyPedModel", async (data: any, cb: Function) => {
  try {
    const modelName = (data?.model || "").trim();
    if (!modelName) return cb({ ok: false, error: "no-model" });

    const model = GetHashKey(modelName);
    if (!IsModelInCdimage(model) || !IsModelValid(model)) {
      return cb({ ok: false, error: "invalid-model" });
    }

    RequestModel(model);
    let i = 0;
    while (!HasModelLoaded(model) && i < 500) {
      await new Promise(res => setTimeout(res, 10));
      i++;
    }
    if (!HasModelLoaded(model)) return cb({ ok: false, error: "model-timeout" });

    SetPlayerModel(PlayerId(), model);
    SetPedDefaultComponentVariation(PlayerPedId());
    SetModelAsNoLongerNeeded(model);

    cb({ ok: true });
  } catch (err) {
    console.error("applyPedModel failed", err);
    cb({ ok: false, error: "exception" });
  }
});


// Handle login NUI → server
// NUI → client
RegisterNuiCallbackType('register');
on('__cfx_nui:register', (data: any, cb: Function) => {
  try {
    console.log('[NUI] register payload:', data);
    emitNet('ox:auth:register', data); // send to server
    cb({ ok: true });
  } catch (e) {
    console.error('register callback failed', e);
    cb({ ok: false, error: 'exception' });
  }
});

// (optional) keep your login callback similarly instrumented
RegisterNuiCallbackType('login');
on('__cfx_nui:login', (data: { username: string; password: string }, cb: Function) => {
  try {
    if (!data?.username || !data?.password) {
      return cb({ ok: false, error: 'missing-creds' });
    }

    console.log('[NUI] login payload:', data);
    // pass as single payload object
    emitNet('ox:auth:login', data);

    cb({ ok: true });
  } catch (e) {
    console.error('login callback failed', e);
    cb({ ok: false, error: 'exception' });
  }
});