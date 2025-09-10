"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("../player/events");
SetConvarReplicated('inventory:framework', 'ox');
SetConvarReplicated('inventory:trimplate ', 'false');
(0, events_1.OnPlayerLoaded)('ox_inventory', function (player) {
    exports.ox_inventory.setPlayerInventory({
        source: player.source,
        identifier: player.charId,
        name: "".concat(player.get('firstName'), " ").concat(player.get('lastName')),
        sex: player.get('gender'),
        dateofbirth: player.get('dateOfBirth'),
        groups: {},
    });
});
