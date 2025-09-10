-- client/compat_ox.lua
-- Start BEFORE ox_inventory. Provides exports.ox_core:GetPlayer() with a non-nil .groups.
-- IMPORTANT: Do not write to the 'groups' statebag inside its change handler.

local cacheGroups = {}

local function safeTable(t)
    return type(t) == 'table' and t or {}
end

local function myBagName()
    return ('player:%s'):format(GetPlayerServerId(PlayerId()))
end

-- Export: always return a fresh snapshot; groups defaults to {} if not ready yet.
local function GetPlayer()
    local st = LocalPlayer and LocalPlayer.state or nil
    local groups = st and st.groups or cacheGroups
    groups = safeTable(groups)

    return {
        source = GetPlayerServerId(PlayerId()),
        userId = st and st.userId or nil,
        charId = st and st.charId or nil,
        groups = groups,
    }
end
exports('GetPlayer', GetPlayer)

-- One-way sync from statebag -> cache (NO writes back here!)
AddStateBagChangeHandler('groups', nil, function(bagName, _key, value, _reserved, _replicated)
    if bagName ~= myBagName() then return end
    cacheGroups = safeTable(value)
end)

-- Optional: server may push an event once; update cache only (no statebag writes)
RegisterNetEvent('ox_core:client:setGroups', function(groups)
    cacheGroups = safeTable(groups)
    -- DO NOT call LocalPlayer.state:set('groups', ...) here; server should replicate it.
end)

-- Safety net: on (re)start, ensure local defaults so bridges won't see nil
AddEventHandler('onClientResourceStart', function(res)
    if res ~= GetCurrentResourceName() then return end
    local st = LocalPlayer and LocalPlayer.state or nil
    if st and type(st.groups) ~= 'table' then
        -- Non-replicating default; prevents nil access before server sync arrives
        st.groups = {}
    end
    if type(cacheGroups) ~= 'table' then
        cacheGroups = {}
    end
end)
