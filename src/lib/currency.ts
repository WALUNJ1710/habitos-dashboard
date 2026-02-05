 // Currency configuration - will be fetched from user preferences/location later
 export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";
 
 export interface CurrencyConfig {
   code: CurrencyCode;
   symbol: string;
   name: string;
   locale: string;
 }
 
 export const currencies: Record<CurrencyCode, CurrencyConfig> = {
   INR: { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
   USD: { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US" },
   EUR: { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
   GBP: { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB" },
 };
 
 // Default currency - can be changed based on user location/preference
 export const defaultCurrency: CurrencyCode = "INR";
 
export const formatCurrency = (
  amount: number,
  currencyCode: CurrencyCode | string = defaultCurrency
): string => {
  const code = (currencyCode in currencies ? currencyCode : defaultCurrency) as CurrencyCode;
  const config = currencies[code];
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
 
export const getCurrencySymbol = (currencyCode: CurrencyCode | string = defaultCurrency): string => {
  const code = (currencyCode in currencies ? currencyCode : defaultCurrency) as CurrencyCode;
  return currencies[code].symbol;
};