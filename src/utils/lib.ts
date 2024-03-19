export const lessUsername = (username: string) => {
    if ((username && username.length < 10) || !username) {
      return username;
    } else return `${username.slice(0, 5)}...${username.slice(-3)}`;
  };