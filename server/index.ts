export * from '../common/index';
import './bridge';
import 'player';
import 'utils';
import 'accounts';
import 'vehicle';
import './hud'; 
import './auth';
import './player/selection';  // <-- add this
import { versionCheck } from '@communityox/ox_lib/server';
import { DEBUG } from 'config';

if (!DEBUG) {
  versionCheck('communityox/ox_core');
}
