export const formatDateWithoutYear = (inputDate) => {
  const dateObject = new Date(inputDate);

  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");

  const formattedDate = `${day}.${month}`;

  return formattedDate;
};

export const formatDateWithMonthName = (inputDate) => {
  const dateObject = new Date(inputDate);

  const day = dateObject.getDate();

  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const monthName = months[dateObject.getMonth()];

  const formattedDate = `${day} ${monthName}`;

  return formattedDate;
};
