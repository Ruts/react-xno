import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className = 'square' onClick = {props.onClick}>
        {props.value}
      </button>
    );
}

function findGrid(i) {
  let x = 0;
  let y = 0;

  const j = i;

  if (j === 0 || j === 1 || j === 2) {
    y = 1;
  } else if (j === 3 || j === 4 || j === 5) {
    y = 2;
  } else {
    y = 3;
  }

  if (i === 0 || i === 3 || i === 6) {
    x = 1;
  } else if (i === 1 || i === 4 || i === 7) {
    x = 2;
  } else {
    x = 3;
  }

  return y + " by " + x;
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value = {this.props.squares[i]}
        onClick = {() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let row = [];
    let col = [];
    let squareNumber = 0;

    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        col.push(this.renderSquare(squareNumber));
        squareNumber++;

      }
      row.push(<div className = "board-row">{col}</div>);
      col= [];

    }

    return (
      <div>
        {row}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if(calculateWinner(squares) || squares[i]) {
      return;
    }

    let gridCrd = findGrid(i);

    squares[i] = this.state.xIsNext ? 'X': 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      squareNumb: i,
      gridCord: gridCrd,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step, i) {
    this.setState({
      stepNumber: step,
      squareNumb: i,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const gridCord = this.state.gridCord;

    const moves = history.map((step, move) => {
      let grid = findGrid(this.state.squareNumb);

      const desc = move ?
        'Go to move ' + grid + " move " + move + " gridCord " + gridCord:
        'Go to game start';
        return (
          <li key = {move}>
            <button onClick = {() => this.jumpTo(move, this.state.squareNumb)} > {desc} </button>
          </li>
        );
    });

    let status;
    if (winner) {
      status = 'Winner is Player ' + winner;
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className = "header">
        <h1>XnO Game by {fullName(name)}</h1>
        <h2>It is {tick()}.</h2>
        <div className = "game">
          <div className = "game-info">
            <div>{status}</div>
            <ol>{}</ol>
          </div>
          <div className = "game-board">
            <Board
              squares = {current.squares}
              onClick = {(i) => this.handleClick(i)}
            />
          </div>
          <ol> {moves} </ol>
        </div>
      </div>
    );

    done();
  }
}

function tick(){
  return new Date().toLocaleTimeString();
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];

  for(let i = 0; i < lines.length; i++){
    const [a,b,c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }

  return null;
}

function fullName(names){
  if (names) {
    return names.firstName + " " + names.middleName.charAt(0) + " " + names.surName;
  }
  return "Stranger";
}


// const title = response.potentiallyMaliciousInput;

const name = {
  firstName: "Martin",
  middleName: "Kiprotich",
  surName: "Ruto"
}

function done(){
    ReactDOM.render (
    <Game />,
    document.getElementById('root')
  );
}
setInterval(done, 1000);
