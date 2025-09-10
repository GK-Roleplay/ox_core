// client/preview.ts — v3.2
// Spacious room + protected ped (cannot fall/die), with robust model proof loader.

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- State ---
let inRoom = false;
  ;(globalThis as any).__gk_preview_active = false;
let previewPed = 0 as number;
let scriptCam = 0 as number;
let currentModelHash = 0;
let loadedModels = new Set<number>();

let savedPos: [number, number, number] | null = null;
let savedHeading = 0.0;

// --- Preview room ---
// Large interior coords: Modern Apartment shell
const room = { x: -786.8663, y: 315.7642, z: 217.6385 };
const pedPivot = { x: room.x, y: room.y + 2.0, z: room.z };
let camRadius = 2.2; // start a bit further out
let camYawDeg = 180.0;
const camPitchDeg = -5.0;

// --- Helpers ---
function setRadarHud(show: boolean) {
  try {
    DisplayRadar(show);
    DisplayHud(show);
  } catch {}
}

function protectPed(ped: number) {
  SetEntityInvincible(ped, true);
  SetEntityProofs(ped, true, true, true, true, true, true, true, true);
  FreezeEntityPosition(ped, true);
  SetBlockingOfNonTemporaryEvents(ped, true);
  SetPedCanRagdoll(ped, false);
}

// Compute orbit camera position
function getOrbitCameraPos() {
  const yaw = (camYawDeg * Math.PI) / 180.0;
  const pitch = (camPitchDeg * Math.PI) / 180.0;
  const x = pedPivot.x + camRadius * Math.cos(pitch) * Math.cos(yaw);
  const y = pedPivot.y + camRadius * Math.cos(pitch) * Math.sin(yaw);
  const z = pedPivot.z + camRadius * Math.sin(pitch) + 0.8;
  return [x, y, z] as [number, number, number];
}

function refreshCamera() {
  if (scriptCam && DoesCamExist(scriptCam)) {
    DestroyCam(scriptCam, false);
    RenderScriptCams(false, false, 0, true, true);
  }
  const [cx, cy, cz] = getOrbitCameraPos();
  scriptCam = CreateCamWithParams('DEFAULT_SCRIPTED_CAMERA', cx, cy, cz, 0.0, 0.0, 0.0, 50.0, false, 2);
  PointCamAtCoord(scriptCam, pedPivot.x, pedPivot.y, pedPivot.z + 0.8);
  SetCamActive(scriptCam, true);
  RenderScriptCams(true, false, 0, true, true);
}

// --- Model proof loader ---
async function tryLoadModel(hash: number, label: string, timeoutMs = 5000) {
  const start = GetGameTimer();
  RequestModel(hash);
  let ok = HasModelLoaded(hash);
  while (!ok && GetGameTimer() - start < timeoutMs) {
    await wait(10);
    RequestModel(hash);
    ok = HasModelLoaded(hash);
  }
  const took = GetGameTimer() - start;
  if (ok) {
    console.log(`[preview] Model '${label}' (${hash}) loaded in ${took}ms`);
    return true;
  } else {
    console.warn(`[preview] Model '${label}' (${hash}) failed to load after ${took}ms`);
    return false;
  }
}

async function resolveAndLoadModel(modelName: string): Promise<number> {
  const clean = (modelName || '').trim();
  const candidates: Array<{ label: string; hash: number }> = [];

  candidates.push({ label: clean || '(empty)', hash: GetHashKey(clean) });

  const fallbackNames = [
    'mp_m_freemode_01',
    'mp_f_freemode_01',
    'a_m_m_skater_01',
    'a_f_y_hipster_02'
  ];
  for (const n of fallbackNames) {
    candidates.push({ label: `[fallback] ${n}`, hash: GetHashKey(n) });
  }

  for (const { label, hash } of candidates) {
    const valid = IsModelInCdimage(hash) && IsModelValid(hash);
    console.log(`[preview] Probe '${label}' (${hash}) valid=${valid}`);
    if (!valid) continue;
    const loaded = await tryLoadModel(hash, label);
    if (loaded) return hash;
  }
  throw new Error('No valid ped models could be loaded.');
}

// --- Room lifecycle ---
async function enterPreviewRoom() {
  (globalThis as any).__gk_preview_active = true;
  if (inRoom) return;

  const ped = PlayerPedId();

  savedHeading = GetEntityHeading(ped);
  const [x,y,z] = GetEntityCoords(ped, true);
  savedPos = [x,y,z];

  RequestCollisionAtCoord(room.x, room.y, room.z);
  SetEntityCoords(ped, room.x, room.y, room.z, false, false, false, false);
  SetEntityHeading(ped, 180.0);
  FreezeEntityPosition(ped, true);
  SetEntityCollision(ped, false, false);
  setRadarHud(false);

  refreshCamera();
  inRoom = true;
}

function freeLoadedModels(except?: number) {
  for (const h of Array.from(loadedModels)) {
    if (!except || h !== except) {
      SetModelAsNoLongerNeeded(h);
      loadedModels.delete(h);
    }
  }
}

function leavePreviewRoom() {
  if (previewPed && DoesEntityExist(previewPed)) {
    DeleteEntity(previewPed);
  }
  previewPed = 0;
  currentModelHash = 0;

  if (scriptCam && DoesCamExist(scriptCam)) {
    DestroyCam(scriptCam, false);
    RenderScriptCams(false, false, 0, true, true);
    scriptCam = 0;
  }
  freeLoadedModels();

  const ped = PlayerPedId();
  if (savedPos) {
    SetEntityCoords(ped, savedPos[0], savedPos[1], savedPos[2], false, false, false, false);
    SetEntityHeading(ped, savedHeading);
  }
  FreezeEntityPosition(ped, false);
  SetEntityCollision(ped, true, true);
  setRadarHud(true);

  inRoom = false;
  ;(globalThis as any).__gk_preview_active = false;
  savedPos = null;
}

// --- Ped spawn/update ---
async function createOrUpdatePreviewPed(modelName: string) {
  if (!inRoom) throw new Error('Not in preview room');

  const resolvedHash = await resolveAndLoadModel(modelName);
  if (currentModelHash === resolvedHash && previewPed && DoesEntityExist(previewPed)) {
    console.log('[preview] Same model already active; skipping re-create.');
    return;
  }
  loadedModels.add(resolvedHash);

  if (previewPed && DoesEntityExist(previewPed)) {
    DeleteEntity(previewPed);
  }

  previewPed = CreatePed(26, resolvedHash, pedPivot.x, pedPivot.y, pedPivot.z, 180.0, false, false);
  if (!previewPed || !DoesEntityExist(previewPed)) {
    throw new Error('CreatePed failed despite model being loaded.');
  }

  SetEntityHeading(previewPed, 180.0);
  protectPed(previewPed);
  TaskStandStill(previewPed, -1);
  SetPedDefaultComponentVariation(previewPed);

  currentModelHash = resolvedHash;
  refreshCamera();
}

// --- NUI API ---

onNet('ox:auth:registered', (payload?: { userId: number; charId: number }) => {
  try {
    console.log('[REGISTERED] received', payload);

    // clean up preview state
    leavePreviewRoom();
    resetToSkyHold();

    // safety: if no payload, ask server to resolve latest char for me
    if (!payload || !payload.charId) {
      return emitNet('ox:auth:spawn'); // server will pick latest char for this user
    }

    // normal path: spawn this specific character
  } catch (e) {
    console.warn('[preview] registered handler failed', e);
  }
});



/** Put player high in the sky briefly to hand control back to spawn pipeline. */
function resetToSkyHold() {
  try {
    const ped = PlayerPedId();
    // Move to safe sky coords (above map), freeze & invincible until spawn takes over.
    SetEntityCoords(ped, 0.0, 0.0, 2000.0, false, false, false, false);
    FreezeEntityPosition(ped, true);
    SetEntityInvincible(ped, true);
    // Small delay to ensure collision streaming doesn't yank us back.
    setTimeout(() => {
      FreezeEntityPosition(ped, false);
      SetEntityInvincible(ped, false);
    }, 1500);
  } catch (e) {
    console.warn('[preview] resetToSkyHold failed', e);
  }
}


RegisterNuiCallbackType('startPreview');
on('__cfx_nui:startPreview', async (data: any, cb: Function) => {
  try {
    await enterPreviewRoom();
    const modelName = (data?.model || 'mp_m_freemode_01').trim();
    await createOrUpdatePreviewPed(modelName);
    cb({ ok: true });
  } catch (e: any) {
    console.error('[preview] startPreview failed', e);
    cb({ ok: false, error: e?.message || 'exception' });
    leavePreviewRoom();
  }
});

RegisterNuiCallbackType('updatePreviewPed');

RegisterNuiCallbackType('savePreview');

RegisterNuiCallbackType('finishPreview');
on('__cfx_nui:finishPreview', async (_data: any, cb: Function) => {
  try {
    leavePreviewRoom();
    resetToSkyHold();
    cb({ ok: true });
  } catch (e) {
    console.error('[preview] finishPreview failed', e);
    cb({ ok: false, error: e?.message || 'exception' });
  }
});


on('__cfx_nui:savePreview', async (data: any, cb: Function) => {
  try {
    const modelHash = currentModelHash || 0;
    emitNet('ox:auth:savePreviewPed', { model: modelHash });
    cb({ ok: true });
  } catch (e) {
    console.error('[preview] savePreview failed', e);
    cb({ ok: false, error: e?.message || 'exception' });
  }
});


on('__cfx_nui:updatePreviewPed', async (data: any, cb: Function) => {
  try {
    const modelName = (data?.model || 'mp_f_freemode_01').trim();
    await createOrUpdatePreviewPed(modelName);
    cb({ ok: true });
  } catch (e: any) {
    console.error('[preview] updatePreviewPed failed', e);
    cb({ ok: false, error: e?.message || 'exception' });
  }
});

RegisterNuiCallbackType('rotatePreview');
on('__cfx_nui:rotatePreview', (data: any, cb: Function) => {
  if (!inRoom || !previewPed || !DoesEntityExist(previewPed)) return cb?.({ ok: false });
  const delta = Number(data?.delta ?? 15);
  try {
    const currentHeading = GetEntityHeading(previewPed);
    SetEntityHeading(previewPed, (currentHeading + delta + 360.0) % 360.0);
    cb?.({ ok: true });
  } catch {
    cb?.({ ok: false });
  }
});

RegisterNuiCallbackType('zoomPreview');
on('__cfx_nui:zoomPreview', (data: any, cb: Function) => {
  if (!inRoom) return cb?.({ ok: false });
  const value = Number(data?.value ?? 50);
  try {
    const minZoom = 1.2;
    const maxZoom = 4.0;
    camRadius = minZoom + (Math.max(0, Math.min(100, value)) / 100) * (maxZoom - minZoom);
    refreshCamera();
    cb?.({ ok: true });
  } catch {
    cb?.({ ok: false });
  }
});

RegisterNuiCallbackType('endPreview');
on('__cfx_nui:endPreview', (_d: any, cb: Function) => {
  leavePreviewRoom();
  cb?.({ ok: true });
});

onNet('onClientResourceStop', (resourceName: string) => {
  if (GetCurrentResourceName() === resourceName) {
    leavePreviewRoom();
  }
});
