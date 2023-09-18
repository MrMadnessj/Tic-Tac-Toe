const startButton = document.querySelector('.start');


//controls the result text
const displayController = (() => {
    const renderMessage = (message) => {
        document.querySelector('.result').innerHTML = message;
    }

    return {renderMessage};
})();// need to put this for it to work 


//The board renders updates and shows board
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const render = () =>{
        let boardHTML = "";
        board.forEach((square, index) => {
            boardHTML += `<div class="square" id="sqaure-${index}" >${square}</div>`;

        })
        document.querySelector(".board").innerHTML = boardHTML;

        const sqaures = document.querySelectorAll('.square');
        sqaures.forEach((square) => {
            square.addEventListener('click', Game.clickHandler);
        })
    };

    const update = (index, mark) => {
        board[index] = mark;
        render();
    }

    const getGameBoard = () => board;

    return {render, update, getGameBoard};
})();


//creates player factory function
const createPlayer = (name, mark) =>{
    return{name, mark};
}

//game logic start, restart, winner, click handling
const Game = (() => {
    let players = [];
    let currPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            createPlayer('Player 1', "x"),
            createPlayer('Player 2', "o")
        ]

        currPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
        
    };


    const clickHandler = (e) => {   
        if(gameOver)
            return;

        const clickedSquareIndex = parseInt(e.target.id.split("-")[1]);
        console.log(clickedSquareIndex);
        if(Gameboard.getGameBoard()[clickedSquareIndex] != "")return;
        Gameboard.update(clickedSquareIndex, players[currPlayerIndex].mark);

        if(checkForWin(Gameboard.getGameBoard(), players[currPlayerIndex].mark)) //curreplayer not required but it works as it is not used in the function itself
        {
            gameOver = true;
            console.log(`${players[currPlayerIndex].mark} Won!`);
            displayController.renderMessage(`${players[currPlayerIndex].mark} Won!`);
        }
        else if(checkForDraw(Gameboard.getGameBoard()))
        {
            gameOver = true;
            console.log(`It's a tie`);
            displayController.renderMessage(`It's a Tie!`);
        }

        currPlayerIndex = currPlayerIndex === 0 ? 1 : 0;
        document.querySelector

    };

    const restart = () =>{
        Game.start();           //extra to prevent error if restart button clicked first
        for(let i=0; i<9; i++)
            Gameboard.update(i, "");
        gameOver = false;


        displayController.renderMessage(``);
        Gameboard.render();
    }


    return {start, clickHandler, restart};
})();


//checks for draw
function checkForDraw(board){
    return board.every(cell => cell !== "");
}

//checks for win
function checkForWin(board)
{
    const winningCombinations = [
        [0, 1, 2],
        [0, 4, 8],
        [0, 3, 6],
        [3, 4, 5],
        [6, 7, 8],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6]
    ];
    for(let i=0; i<winningCombinations.length; i++)
    {
        const [a, b, c] = winningCombinations[i];
        if(board[a] && board[a] === board[b] && board[a] === board[c])  //checks if char in those positions are the same
            return true;
    }
    return false;
}

//restart button 
const restartButton = document.querySelector('#restart');
restartButton.addEventListener('click', () => {
    Game.restart();
})

//start button
startButton.addEventListener('click', () => {
    Game.start();
});