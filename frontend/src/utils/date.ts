export const handleDate = (date: string) => {
  const [datePart, timePart] = date.split("T");
  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  const dateFormatted = `${day}/${month}/${year} ${hour}:${minute}`;

  return dateFormatted;
}