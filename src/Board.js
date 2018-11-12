import React from 'react';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
    {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  let winner
  const winningLines = [
    [[0,0],[0,1],[0,2]],
    [[1,0],[1,1],[1,2]],
    [[2,0],[2,1],[2,2]],
    [[0,0],[1,0],[2,0]],
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]],
    [[0,2],[1,1],[2,0]]
  ]
  for (let i = 0; i < winningLines.length; i++) {
    if(squares[winningLines[i][0][0]][winningLines[i][0][1]] != null && squares[winningLines[i][0][0]][winningLines[i][0][1]] === squares[winningLines[i][1][0]][winningLines[i][1][1]] && squares[winningLines[i][0][0]][winningLines[i][0][1]] === squares[winningLines[i][2][0]][winningLines[i][2][1]]) {
      winner = squares[winningLines[i][0][0]][winningLines[i][0][1]] === 'X' ? '1' : '2'
    }
  }
  return winner
}

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      size: 0,
      squares: Array(0).fill(null).map(x => Array(0).fill(null)),
      history: Array(0).fill(null).map(x => Array(0).fill(null)),
      winner: null,
      isFirstPlayerTurn : true,
      currentMove : 0
    }
  }

  initBoard = (size) => {
    const squares = Array(size).fill(null).map(x => Array(size).fill(null))
    this.setState({squares, size: size})
  }

  handleClick(x, y) {
    let squares = this.state.squares.map(function(arr) {
    return arr.slice();
    });
    if(squares[x][y] == null && this.state.winner == null) {
      if(this.state.isFirstPlayerTurn){
        squares[x][y] = 'X';
        this.setState({isFirstPlayerTurn: false})
      } else {
        squares[x][y] = 'O';
        this.setState({isFirstPlayerTurn: true})
      }
      const winner = calculateWinner(squares)
      const history = this.state.history
      console.log(this.state.history)
      //history.push(squares)
      history.splice(this.state.currentMove, this.state.history.length - this.state.currentMove, squares)
      console.log(history)
      this.setState({squares: squares.slice(), winner, history, currentMove: this.state.currentMove + 1});
    }
  }


  renderSquare(x, y) {
    return (
      <Square
      value={this.state.squares[x][y]}
      onClick={() => this.handleClick(x, y)}/>
    )
  }

  undoMove = () => {
    const historyLength = this.state.history.length
    console.log(this.state.currentMove)
    console.log(historyLength)
    if(historyLength >= this.state.currentMove && this.state.currentMove >= 2 && !this.state.winner) {
      console.log("test")
      this.setState({squares: this.state.history[this.state.currentMove - 2], currentMove: this.state.currentMove - 1, isFirstPlayerTurn: !this.state.isFirstPlayerTurn})
    }
    console.log(this.state.history)
    console.log(this.state.squares)
  }

  revertMove = () => {
    const historyLength = this.state.history.length
    if(historyLength > this.state.currentMove && !this.state.winner) {
      this.setState({squares: this.state.history[this.state.currentMove], currentMove: this.state.currentMove + 1, isFirstPlayerTurn: !this.state.isFirstPlayerTurn})
    }
  }

  resetBoard = () => {
    this.setState({
      squares: Array(this.state.size).fill(null).map(x => Array(this.state.size).fill(null)),
      history: Array(0).fill(null).map(x => Array(0).fill(null)),
      winner: null,
      isFirstPlayerTurn : true,
      currentMove : 0
    })
  }

  render(){

    let status
    if(this.state.winner != null) {
      status = 'Player ' + this.state.winner + ' won the game.'
    } else {
      status = 'Waiting for player ' + (this.state.isFirstPlayerTurn ? '1' : '2') + ' to play.'
    }




    //console.log("History Length : " + this.state.history.length)
    //console.log("Current Move : " + this.state.currentMove)
    return (
      <div>
      <div className="status">{status}</div>
      {this.state.squares.map((x, rowIndex) => {
        return (
          <div className="board-row">
            {x.map((y, colIndex) => this.renderSquare(rowIndex, colIndex))}
          </div>
        )
      })
      }
      <button className="button" onClick={() => this.initBoard(4)}> Start Game</button>
      <button className="button" onClick={this.resetBoard}> Reset Board</button>
      <button className="button" onClick={this.undoMove}> Undo Move</button>
      <button className="button" onClick={this.revertMove}> Revert Move</button>
      </div>
    );
  }

}

export {Board}
