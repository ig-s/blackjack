//Example usage
let Player, Dealer, Settings

const playerName = "player";
const dealerName = "dealer";

/*
    Player attributes:
    balance [number]
    bet [number]
    cards [array]
    stand [boolean]
    totalValue [number]
*/

function reset() {
    Deck.reset();
    //Create the Player
    Player = BlackjackEngine.newPlayer();
    //Create the Dealer
    Dealer = BlackjackEngine.newPlayer();
    
    //Deal a card for the player
    BlackjackEngine.drawCard(Player)
    //Deal a card for the Dealer
    BlackjackEngine.drawCard(Dealer)
    //Deal a card for the player
    BlackjackEngine.drawCard(Player)
    //Deal a card for the Dealer that is hidden
    BlackjackEngine.drawCard(Dealer, false)

    Settings = {
        gameOver: false,
        turn: "player"
    }

    document.getElementById("reset-button").style.display = "none";
    document.getElementById("result").innerHTML = "";
    updateContent();
}

reset();


function setTurn(turn){
    Settings.turn = turn;
    if (turn == dealerName) {
        Dealer.cards[1].show = true
    }
}

function hit(){
    if (Settings.turn == playerName) {
        BlackjackEngine.drawCard(Player)
        let value = BlackjackEngine.calculateHandValue(Player).value;

        if (value == 21){
            setTurn(dealerName);
        }
        updateContent();
    }
}

function stand(){
    if (Settings.turn == playerName){
        Player.stand = true;
        setTurn(dealerName);
        updateContent();
    }
}

function gameOver() {
    Settings.gameOver = true;
    document.getElementById("reset-button").style.display = "inline-block";
    Dealer.cards[1].show = true;
    result();
}

function result(){
    let result = BlackjackEngine.getResults(Dealer.totalValue, Player.totalValue)[0];
    if(result == 0) {
        document.getElementById("result").innerHTML = "Results: Player Wins!";
    }else if(result == 1) {
        document.getElementById("result").innerHTML = "Results: Dealer Wins!";
    }else if(result == 2) {
        document.getElementById("result").innerHTML = "Results: Push!";
    }
}

function getScoreFor(target, element_id) {
    const elem = document.getElementById(element_id);
    const hand = BlackjackEngine.calculateHandValue(target);
    
    if (hand.blackjack){
        elem.innerHTML = "(Blackjack!)";
        gameOver();
        setTurn(dealerName);
    }else if(hand.bust) {
        elem.innerHTML = "(Bust!)"
        gameOver();
    }else if(hand.ace && !target.stand){
        elem.innerHTML = `(${hand.ace})`;
    }else{
        elem.innerHTML = `(${hand.value})`;
    }
}

function updateContent() {
    document.getElementById("dealer-cards").innerHTML = BlackjackEngine.content(Dealer);
    document.getElementById("player-cards").innerHTML = BlackjackEngine.content(Player);
    getScoreFor(Player, "player-score");
    getScoreFor(Dealer, "dealer-score");
}


//Loop for the dealer
let t = 0;
setInterval(() => {
    if (Settings.turn == dealerName && !Settings.gameOver) {
        t += 0.25
        if (t >= 0.75) {
            if (Dealer.totalValue >= 17) {
                gameOver();
                let result = BlackjackEngine.getResults(Dealer.totalValue, Player.totalValue)[0];
                if(result == 0) {
                    document.getElementById("result").innerHTML = "Results: Player Wins!";
                    //Player wins
                }else if(result == 1) {
                    document.getElementById("result").innerHTML = "Results: Dealer Wins!";
                    //Dealer wins
                }else if(result == 2) {
                    document.getElementById("result").innerHTML = "Results: Push!";
                    // It's a push!
                }
                Dealer.stand = true;
            }else {
                BlackjackEngine.drawCard(Dealer);
            }
            updateContent();
            t = 0;
        }
    }
}, 250);