// CLIENT
type SpawnData = { x:number;y:number;z:number; heading:number; model:number|string; health?:number; armour?:number; };

const wait = (ms:number)=>new Promise(res=>setTimeout(res,ms));
const tick = ()=>wait(0);

function clearAllScreenFX() {
  try {
    AnimpostfxStopAll();
    ClearTimecycleModifier();
    SetTimecycleModifierStrength(0.0);
    ShakeGameplayCam('NONE', 0.0);
    DestroyAllCams(true);
    RenderScriptCams(false, false, 0, true, true);
    ShutdownLoadingScreen();
    ShutdownLoadingScreenNui();
  } catch {}
}

async function loadModel(model:number|string, timeout=10000) {
  const hash = typeof model === 'number' ? model : GetHashKey(model);
  if (!IsModelInCdimage(hash) || !IsModelValid(hash)) throw new Error(`Invalid model ${model}`);
  RequestModel(hash);
  const start = GetGameTimer();
  while (!HasModelLoaded(hash)) {
    await tick();
    if (GetGameTimer() - start > timeout) throw new Error('Model load timeout');
  }
  return hash;
}

async function preloadSceneAt(x:number,y:number,z:number, timeout=6000) {
  NewLoadSceneStart(x, y, z, x, y, z, 50.0, 0);
  const t0 = GetGameTimer();
  while (IsNewLoadSceneActive()) {
    await tick();
    if (GetGameTimer() - t0 > timeout) break;
  }
  RequestCollisionAtCoord(x, y, z);
}

async function waitCollisionAround(ped:number, timeout=8000) {
  const t0 = GetGameTimer();
  while (!HasCollisionLoadedAroundEntity(ped)) {
    RequestCollisionAtCoord(...GetEntityCoords(ped) as [number, number, number]);
    await tick();
    if (GetGameTimer() - t0 > timeout) break;
  }
}

async function applyFreemodeDefaultsIfNeeded(ped:number) {
  const m = GetEntityModel(ped);
  if (m === GetHashKey('mp_m_freemode_01') || m === GetHashKey('mp_f_freemode_01')) {
    SetPedDefaultComponentVariation(ped);
    await tick();
  }
}

function fullyRevealPed(ped:number) {
  ResetEntityAlpha(ped);
  SetEntityAlpha(ped, 255, false);
  SetEntityVisible(ped, true, false);
  SetEntityCollision(ped, true, true);
  SetPedCanRagdoll(ped, true);
  FreezeEntityPosition(ped, false);
  NetworkSetEntityInvisibleToNetwork(ped, false);
  SetPlayerControl(PlayerId(), true, 0);
  DisplayRadar(true);
}

async function spawnLocal(spawn: SpawnData) {
  // always override with airport coords
  const airportX = -1037.0;
  const airportY = -2737.0;
  const airportZ = 13.8;
  const airportHeading = 90.0;

  DoScreenFadeOut(400);
  while (!IsScreenFadedOut()) await tick();

  clearAllScreenFX();
  try { leavePreviewRoom?.(); resetToSkyHold?.(); } catch {}

  let ped = PlayerPedId();
  SetPlayerControl(PlayerId(), false, 0);
  FreezeEntityPosition(ped, true);
  SetEntityVisible(ped, false, false);
  SetEntityCollision(ped, false, false);

  await preloadSceneAt(airportX, airportY, airportZ);

  let hash:number;
  try {
    hash = await loadModel(spawn.model);
  } catch (e) {
    console.warn('[spawn] model failed, fallback to mp_m_freemode_01', e);
    hash = await loadModel('mp_m_freemode_01');
  }

  SetPlayerModel(PlayerId(), hash);
  SetModelAsNoLongerNeeded(hash);
  ped = PlayerPedId();

  SetEntityCoordsNoOffset(ped, airportX, airportY, airportZ, false, false, false);
  SetEntityHeading(ped, airportHeading);

  await waitCollisionAround(ped);

  SetEntityHealth(ped, Math.max(100, Number(spawn.health ?? 200)));
  SetPedArmour(ped, Math.max(0, Number(spawn.armour ?? 0)));

  await applyFreemodeDefaultsIfNeeded(ped);
  fullyRevealPed(ped);

  DoScreenFadeIn(400);
  console.log('[spawn] finished at LSIA', { airportX, airportY, airportZ });
  SendNuiMessage(JSON.stringify({ action: 'close' }));
  SetNuiFocus(false, false);
}

// listen from server
onNet('gkrp:spawnWithModel', async (spawn: SpawnData) => {
  try {
    await spawnLocal(spawn);
  } catch (e) {
    console.error('[spawn] failed', e);
    await spawnLocal({ x:-1037.0, y:-2737.0, z:13.8, heading:90.0, model:'mp_m_freemode_01', health:200, armour:0 });
  }
});

onNet('gkrp:spawnError', (msg:string)=> {
  console.warn('[spawn] server error:', msg);
});
