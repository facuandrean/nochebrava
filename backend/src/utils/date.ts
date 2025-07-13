/**
 * Gets the current date in ISO format with time zone adjustment
 * @returns string - date in ISO format
 */
export const getCurrentDate = (): string => {
  const dateUnformatted = new Date().toISOString();
  const dateFormatted = new Date(dateUnformatted);
  dateFormatted.setHours(dateFormatted.getHours() - 3);
  return dateFormatted.toISOString();
}

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};
