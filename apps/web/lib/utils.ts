import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isExpired(token: string): boolean {
  const expirationDate: any = token && jwtDecode(token).exp;
  const currentDate = new Date().getTime() / 1000;
  return currentDate >= expirationDate;
}
