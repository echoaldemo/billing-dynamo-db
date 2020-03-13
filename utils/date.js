const today = new Date();
const appendLeadingZeroes = n => {
  if (n <= 9) {
    return "0" + n;
  }
  return n;
};

module.exports = {
  getDate: () => {
    return (
      today.getFullYear() +
      "-" +
      appendLeadingZeroes(today.getMonth() + 1) +
      "-" +
      appendLeadingZeroes(today.getDate())
    );
  },
  getTime: () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
};
