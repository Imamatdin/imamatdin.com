import type { Behavior } from '../types';
import { greeting } from './greeting';
import { idleFacts } from './idleFacts';
import { sleep } from './sleep';
import { clickReactions } from './clickReactions';

/**
 * The registry. Adding an ability means writing a behavior module and adding
 * one line here — Robot.tsx and useRobotBrain.ts should not need to change.
 * See ../README.md for the contract and a worked example.
 */
export const BEHAVIORS: Behavior[] = [greeting, idleFacts, sleep, clickReactions];
