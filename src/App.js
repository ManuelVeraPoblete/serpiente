import React, { useState, useEffect } from 'react';
import Snake from './components/Snake';
import Food from './components/Food';
import './App.css';

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max-min+1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max-min+1) + min) / 2) * 2;
  return [x, y];
}

const App = () => {
  const [snakeDots, setSnakeDots] = useState([[0, 0], [2, 0]]);
  const [food, setFood] = useState(getRandomCoordinates());
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(200);

  useEffect(() => {
    const onKeyDown = (e) => {
      e = e || window.event;
      switch (e.keyCode) {
        case 38:
          setDirection('UP');
          break;
        case 40:
          setDirection('DOWN');
          break;
        case 37:
          setDirection('LEFT');
          break;
        case 39:
          setDirection('RIGHT');
          break;
        default:
          break;
      }
    }
    document.onkeydown = onKeyDown;
    return () => {
      document.onkeydown = null;
    }
  }, []);

  useEffect(() => {
    const moveSnake = () => {
      let dots = [...snakeDots];
      let head = dots[dots.length - 1];
      switch (direction) {
        case 'RIGHT':
          head = [head[0] + 2, head[1]];
          break;
        case 'LEFT':
          head = [head[0] - 2, head[1]];
          break;
        case 'DOWN':
          head = [head[0], head[1] + 2];
          break;
        case 'UP':
          head = [head[0], head[1] - 2];
          break;
        default:
          break;
      }
      dots.push(head);
      dots.shift();
      setSnakeDots(dots);
    }

    const checkIfOutOfBorders = () => {
      let head = snakeDots[snakeDots.length - 1];
      if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
        onGameOver();
      }
    }

    const checkIfCollapsed = () => {
      let snake = [...snakeDots];
      let head = snake[snake.length - 1];
      snake.pop();
      snake.forEach(dot => {
        if (head[0] === dot[0] && head[1] === dot[1]) {
          onGameOver();
        }
      });
    }

    const checkIfEat = () => {
      let head = snakeDots[snakeDots.length - 1];
      let foodPosition = food;
      if (head[0] === foodPosition[0] && head[1] === foodPosition[1]) {
        setFood(getRandomCoordinates());
        enlargeSnake();
        increaseSpeed();
      }
    }

    const enlargeSnake = () => {
      let newSnake = [...snakeDots];
      newSnake.unshift([]);
      setSnakeDots(newSnake);
    }

    const increaseSpeed = () => {
      if (speed > 10) {
        setSpeed(speed - 10);
      }
    }

    const onGameOver = () => {
      alert(`Game Over. Snake length is ${snakeDots.length}`);
      setSnakeDots([[0, 0], [2, 0]]);
      setFood(getRandomCoordinates());
      setDirection('RIGHT');
      setSpeed(200);
    }

    const interval = setInterval(() => {
      moveSnake();
      checkIfOutOfBorders();
      checkIfCollapsed();
      checkIfEat();
    }, speed);

    return () => clearInterval(interval);
  }, [snakeDots, direction, food, speed]);

  return (
    <div className='background'>
      <div className="game-area">
        <Snake snakeDots={snakeDots} />
        <Food dot={food} />
      </div>
    </div>
  );
};

export default App;
