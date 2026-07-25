import type { Behavior } from '../types';
import { greeting } from './greeting';
import { idleFacts } from './idleFacts';
import { routeComments } from './routeComments';
import { linkHover } from './linkHover';
import { scrollDepth } from './scrollDepth';
import { sleep } from './sleep';
import { tapTray } from './tapTray';
import { trayActions } from './trayActions';
import { tickle } from './tickle';
import { konamiDj } from './konamiDj';

/**
 * The registry. Adding an ability means writing a behavior module and adding
 * one line here — Robot.tsx and useRobotBrain.ts should not need to change.
 * See ../README.md for the contract and a worked example.
 */
export const BEHAVIORS: Behavior[] = [
  greeting,
  idleFacts,
  routeComments,
  linkHover,
  scrollDepth,
  sleep,
  tapTray,
  trayActions,
  tickle,
  konamiDj,
];
