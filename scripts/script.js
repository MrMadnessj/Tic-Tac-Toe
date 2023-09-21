const startButton = document.querySelector('.start');


//controls the result text
const displayController = (() => {
    const renderMessage = (message) => {
        document.querySelector('.result').innerHTML = message;
    };

    const renderTurn = (turn) => {
        document.querySelector('.turn').innerHTML = `<p class="turn">Turn: ${turn}</p>`;
    };

    return {renderMessage, renderTurn};
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

    let atleastOneGamePlayed = 0;
    const aiCheck = () => {
        if(document.getElementById('ai-check').checked == true)
            return true;
    }

    const checkName = () => {
        if(document.getElementById('p1name').value === "" || document.getElementById('p1name').value === undefined ||
            document.getElementById('p2name').value === "" || document.getElementById('p1name').value === undefined)
            {
                document.querySelector('.error').innerHTML = "Enter a name!";
                return 0;
            }
    }


    const start = () => {

        atleastOneGamePlayed = 1;
        if(checkName() == 0)return;
        document.querySelector('.error').innerHTML = "";
        players = [
            createPlayer(document.getElementById('p1name').value, "X"),
            createPlayer(document.getElementById('p2name').value, "O")
        ];

        console.log(players[0][1])
        currPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
        
    };


    const checking = () =>{
        if(checkForWin(Gameboard.getGameBoard(), players[currPlayerIndex].mark)) //curreplayer not required but it works as it is not used in the function itself
        {
            console.log(`${players[currPlayerIndex].name} Won!`);
            displayController.renderTurn('X/O');
            displayController.renderMessage(`${players[currPlayerIndex].name} Won!`);
            gameOver = true;
            return;
        }
        else if(checkForDraw(Gameboard.getGameBoard()))
        {
            displayController.renderTurn('X/O');
            console.log(`It's a tie`);
            displayController.renderMessage(`It's a Tie!`);
            
            gameOver = true;
            return;
        }
    }

    const ai = () => {
        let bestScore = Infinity;

        let bestmove;
        players[1] = createPlayer("AI", "O");
        console.log(players);
        const board = Gameboard.getGameBoard();
        for(let i=0; i<9; i++)
        {
            if(board[i] === ""){
                Gameboard.update(i, players[currPlayerIndex].mark);
                let score = minimax(Gameboard.getGameBoard());
                Gameboard.update(i, "");

                if(score < bestScore){
                    bestScore = score;
                    bestmove = i;
                }           
            }
        }
        Gameboard.update(bestmove, players[currPlayerIndex].mark);
        checking();
        currPlayerIndex = currPlayerIndex === 0 ? 1 : 0;
    }



    const clickHandler = (e) => {   
        if(gameOver)
            return;

        checking();

        const clickedSquareIndex = parseInt(e.target.id.split("-")[1]);
        console.log(clickedSquareIndex);
        if(Gameboard.getGameBoard()[clickedSquareIndex] != "")return;
        Gameboard.update(clickedSquareIndex, players[currPlayerIndex].mark);
      
        currPlayerIndex = currPlayerIndex === 0 ? 1 : 0;
        displayController.renderTurn(players[currPlayerIndex].name);

        if(aiCheck && currPlayerIndex == 1){
            ai();  
        }
    };


    const restart = () =>{
        if(atleastOneGamePlayed == 0)return;
        // Game.start();           //extra to prevent error if restart button clicked first
        for(let i=0; i<9; i++)
            Gameboard.update(i, "");
        gameOver = false;

        document.querySelector('.turn').innerHTML = `<p class="turn">Turn: X/O</p>`
        displayController.renderMessage(``);
        Gameboard.render();
    }

    function minimax(board)
    {
        return 1;
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
        if(board[a] && board[a] === board[b] && board[a] === board[c]){ //checks if char in those positions are the same
            console.log(`${board[a]} ${board[b]} ${board[c]}`);
            return true;
        }
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