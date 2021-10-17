const opponentWallsCountNumber = <HTMLElement>(
  document.querySelector('.opponent-walls-count-number')
);
const playerWallsCountNumber = <HTMLElement>(
  document.querySelector('.player-walls-count-number')
);

export const setWallsNumbers = ({
  playerWallsCount,
  opponentWallsCount,
}: {
  playerWallsCount: number;
  opponentWallsCount: number;
}) => {
  opponentWallsCountNumber.innerText = String(opponentWallsCount);
  playerWallsCountNumber.innerText = String(playerWallsCount);
};
