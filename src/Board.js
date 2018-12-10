import React from 'react';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
    {props.value}
    </button>
  );
}

function calculateWinner(squares, winLength) {
  let winner = null
  let winningLines = []
  const size = squares.length
  for(let x = 0; x < size; x++) {
    for(let y=0; y < size; y++) {
      if(y+winLength <= size) {
        let row = [[x,y]]
        for(let i=1; i < winLength; i++) {
          row.push([x, y+i])
        }
        winningLines.push(row)
      }

      if(x+winLength <= size) {
        let col = [[x,y]]
        for(let i=1; i < winLength; i++) {
          col.push([x+i, y])
        }
        winningLines.push(col)
      }

      if(y+winLength <= size && x+winLength <= size) {
        let diag = [[x,y]]
        for(let i=1; i < winLength; i++) {
          diag.push([x+i, y+i])
        }
        winningLines.push(diag)
      }

      if(y+winLength <= size && x+winLength <= size) {
        let diag = [[x,y]]
        for(let i=1; i < winLength; i++) {
          diag.push([x+i, y+i])
        }
        winningLines.push(diag)
      }

      if(x-(winLength - 1) >=0 && y+winLength <= size){
        let diagInv = [[x,y]]
        for(let i=1; i < winLength; i++) {
          diagInv.push([x-i, y+i])
        }
        winningLines.push(diagInv)
      }

    }
  }

  console.log(winningLines)

  for (let i = 0; i < winningLines.length; i++) {
    let isWinningRow = true
    let rowWinner = squares[winningLines[i][0][0]][winningLines[i][0][1]] === 'X' ? '1' : '2'
    for (let j = 0; j < winLength - 1; j++) {
      if (squares[winningLines[i][j][0]][winningLines[i][j][1]] !== null && squares[winningLines[i][j][0]][winningLines[i][j][1]] !== squares[winningLines[i][j+1][0]][winningLines[i][j+1][1]]) {
        isWinningRow = false
        rowWinner = null
      } else if (squares[winningLines[i][j][0]][winningLines[i][j][1]] === null) {
        isWinningRow = false
        rowWinner = null
      }
    }

    if(isWinningRow) {
      winner = rowWinner
    }
  }
  if(!winner){
    winner = "Game is Over"
    for(let x = 0; x < size; x++) {
      for(let y=0; y < size; y++) {
        if(squares[x][y] === null ) {
          winner = null
        }
      }
    }
  }
  return winner
}

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      size: 3,
      winLength: 3,
      squares: Array(0).fill(null).map(x => Array(0).fill(null)),
      history: Array(0).fill(null).map(x => Array(0).fill(null)),
      winner: null,
      isFirstPlayerTurn : true,
      currentMove : 0
    }
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
      const winner = calculateWinner(squares, this.state.winLength)
      const history = this.state.history
      history.splice(this.state.currentMove, this.state.history.length - this.state.currentMove, squares)
      this.setState({squares: squares.slice(), winner, history, currentMove: this.state.currentMove + 1})
    }
  }

  handleChangeSize = (event) => {
    let currentWinCond = this.state.winLength
    const selectedValue = parseInt(event.target.value, 10)
    if(currentWinCond > selectedValue)
      currentWinCond = selectedValue
    this.setState({size: selectedValue, winLength: currentWinCond})
  }

  handleChangeWinCond = (event) => {
    let selectedValue = parseInt(event.target.value, 10)
    if (selectedValue > this.state.size) {
      alert("La condition de victoire est supérieure à la taille !")
      selectedValue = this.state.size
    }
    this.setState({winLength: selectedValue});
  }

  initBoard = () => {
    this.setState({
      squares: Array(this.state.size).fill(null).map(x => Array(this.state.size).fill(null)),
      history: Array(0).fill(null).map(x => Array(0).fill(null)),
      winner: null,
      isFirstPlayerTurn: true,
      currentMove: 0
    })
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
    if(historyLength >= this.state.currentMove && this.state.currentMove >= 2 && !this.state.winner) {
      this.setState({squares: this.state.history[this.state.currentMove - 2], currentMove: this.state.currentMove - 1, isFirstPlayerTurn: !this.state.isFirstPlayerTurn})
    }
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
      if(this.state.winner === "Game is Over") {
        status = this.state.winner
        console.log(status)
      } else {
        status = 'Player ' + this.state.winner + ' won the game.'
      }
    } else {
      status = 'Waiting for player ' + (this.state.isFirstPlayerTurn ? '1' : '2') + ' to play.'
    }



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

    <button className="button" onClick={this.initBoard}> New Game</button>
    <button className="button" onClick={this.undoMove}> Undo Move</button>
    <button className="button" onClick={this.revertMove}> Revert Move</button>
    <br/>
    <p>Size :
    <select onChange={this.handleChangeSize} value={this.state.size}>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
    <option value="6">6</option>
    <option value="7">7</option>
    <option value="8">8</option>
    <option value="9">9</option>
    <option value="10">10</option>
    </select>
    </p>
    <p value="Win Condition : ">
    <select onChange={this.handleChangeWinCond} value={this.state.winLength}>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
    </select>
    </p>
    </div>
  );
}

}

export {Board}
