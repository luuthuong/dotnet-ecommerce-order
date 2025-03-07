import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return "N/A"

  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function generateGUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const rand = (Math.random() * 16) | 0;
    const value = char === 'x' ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function generateRandomAddress() {
  const streets = ["Main St", "Highland Ave", "Broadway", "Maple St", "Oak St"];
  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Miami"];
  const states = ["NY", "CA", "IL", "TX", "FL"];
  const zipCodes = ["10001", "90001", "60601", "77001", "33101"];
  const countries = ["USA", "Canada", "UK", "Australia", "Germany"];

  return {
    street: `${Math.floor(Math.random() * 9999)} ${streets[Math.floor(Math.random() * streets.length)]}`,
    city: cities[Math.floor(Math.random() * cities.length)],
    state: states[Math.floor(Math.random() * states.length)],
    zipCode: zipCodes[Math.floor(Math.random() * zipCodes.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
  };
}