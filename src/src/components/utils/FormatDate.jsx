export const formatDate = (inputDate) => {
  const dateObject = new Date(inputDate);

  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const year = dateObject.getFullYear();

  const formattedDate = `${day}.${month}.${year}`;

  return formattedDate;
};
