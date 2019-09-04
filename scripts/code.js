//Example usage

//Create the Player
let Player = BlackjackEngine.newPlayer();
//Create the Dealer
let Dealer = BlackjackEngine.newPlayer();

//Deal a card for the player
BlackjackEngine.drawCard(Player)
//Deal a card for the Dealer
BlackjackEngine.drawCard(Dealer)
//Deal a card for the player
BlackjackEngine.drawCard(Player)
//Deal a card for the Dealer that is hidden
BlackjackEngine.drawCard(Dealer, false)

const playerName = "player";
const dealerName = "dealer";

const Settings = {
    gameOver: false,
    turn: "player"
}

function setTurn(turn){
    Settings.turn = turn;
    if (turn == dealerName) {
        Dealer.cards[1].show = true
    }
}

function hit(){
    if (Settings.turn == playerName) {
        BlackjackEngine.drawCard(Player)
        let _, value = BlackjackEngine.calculateHandValue(Player);

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
        elem.innerHTML = "(Blackjack!)"
        result();
        gameOver = true;
    }else if(hand.bust) {
        elem.innerHTML = "(Bust!)"
        setTurn(dealerName);
        Settings.gameOver = true;
        result();
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

updateContent();

let t = 0;
setInterval(() => {
    if (Settings.turn == dealerName && !Settings.gameOver) {
        t += 0.25
        if (t >= 0.75) {
            console.log(Dealer.totalValue)
            if (Dealer.totalValue >= 17) {
                Settings.gameOver = true;
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
            }else {
                BlackjackEngine.drawCard(Dealer);
            }
            updateContent();
            t = 0;
        }
    }
}, 250);