"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./loading");
require("./events");
require("./commands");
var class_1 = require("./class");
var db_1 = require("./db");
/**
 * Sets an interval to save every 10 minutes.
 * @todo Consider performance on servers with a high player-count.
 * Multiple staggered saves may improve load.
 */
setInterval(function () { return class_1.OxPlayer.saveAll(); }, 600000);
exports('GetCharIdFromStateId', db_1.GetCharIdFromStateId);
exports('BanUser', db_1.BanUser);
exports('UnbanUser', db_1.UnbanUser);
