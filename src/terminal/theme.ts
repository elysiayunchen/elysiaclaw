import chalk, { Chalk } from "chalk";
import { SAKURA_PALETTE } from "./palette.js";

const hasForceColor =
  typeof process.env.FORCE_COLOR === "string" &&
  process.env.FORCE_COLOR.trim().length > 0 &&
  process.env.FORCE_COLOR.trim() !== "0";

const baseChalk = process.env.NO_COLOR && !hasForceColor ? new Chalk({ level: 0 }) : chalk;

const hex = (value: string) => baseChalk.hex(value);

export const theme = {
  accent: hex(SAKURA_PALETTE.accent),
  accentBright: hex(SAKURA_PALETTE.accentBright),
  accentDim: hex(SAKURA_PALETTE.accentDim),
  info: hex(SAKURA_PALETTE.info),
  success: hex(SAKURA_PALETTE.success),
  warn: hex(SAKURA_PALETTE.warn),
  error: hex(SAKURA_PALETTE.error),
  muted: hex(SAKURA_PALETTE.muted),
  heading: baseChalk.bold.hex(SAKURA_PALETTE.accent),
  command: hex(SAKURA_PALETTE.accentBright),
  option: hex(SAKURA_PALETTE.warn),
} as const;

export const isRich = () => Boolean(baseChalk.level > 0);

export const colorize = (rich: boolean, color: (value: string) => string, value: string) =>
  rich ? color(value) : value;
