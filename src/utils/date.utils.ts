export const checkIfDateIsToday = (date: Date) => {
  const currentDate = new Date();
  return (
    date.getDate() === currentDate.getDate() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  );
};

export const today = () => {
  const date = new Date();

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};
