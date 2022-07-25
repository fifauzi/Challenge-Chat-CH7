export const generateRoomId = (users, choosenUser) => {
  return (users + choosenUser).split('').sort().join('');
};
