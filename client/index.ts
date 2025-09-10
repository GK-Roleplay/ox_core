export * from '../common';
import { PLATE_PATTERN } from 'config';
import 'player';
import 'spawn';
import 'death';
import 'vehicle';
import './gkrp_hud';
import './nui_bridge';
import './nui_login';
import './preview'; // v3
for (let i = 0; i < GetNumberOfVehicleNumberPlates(); i++) {
  SetDefaultVehicleNumberPlateTextPattern(i, PLATE_PATTERN);
}
