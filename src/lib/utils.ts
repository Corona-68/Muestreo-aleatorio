import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SamplingResult {
  id: string;
  order: string;
  a: number;
  b: number;
  longDist: number;
  transDist: number;
  chainage: string;
  axisDist: number;
  side: 'Izquierdo' | 'Derecho';
}

export interface SamplingParams {
  workName: string;
  startKm: number;
  startMetros: number;
  endKm: number;
  endMetros: number;
  numSamples: number;
  stripWidth: number;
}
