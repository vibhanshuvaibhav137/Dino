export const checkCollision = (ball, obstacle) => {
  return (
    ball.x < obstacle.x + obstacle.width &&
    ball.x + ball.size > obstacle.x &&
    ball.y < obstacle.y + obstacle.height &&
    ball.y + ball.size > obstacle.y
  );
};

export const checkGroundCollision = (ball, groundHeight) => {
  return ball.y + ball.size >= groundHeight;
};

export const checkBounds = (ball, canvasWidth, canvasHeight) => {
  return {
    left: ball.x < 0,
    right: ball.x + ball.size > canvasWidth,
    top: ball.y < 0,
    bottom: ball.y + ball.size > canvasHeight,
  };
};

export const getCollisionPoint = (ball, obstacle) => {
  const ballCenterX = ball.x + ball.size / 2;
  const ballCenterY = ball.y + ball.size / 2;
  const obstacleCenterX = obstacle.x + obstacle.width / 2;
  const obstacleCenterY = obstacle.y + obstacle.height / 2;
  
  return {
    x: ballCenterX - obstacleCenterX,
    y: ballCenterY - obstacleCenterY,
  };
};