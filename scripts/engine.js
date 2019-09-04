//Deck Logic
let Deck = {}

//Suits & Values to pair each "heart, club, spade, diamond" to every single digit 
Deck.suits = ["heart", "club", "spade", "diamond"];
Deck.values = ["ace", 2, 3, 4, 5, 6, 7, 9, 10, "jack", "queen", "king"];

//If you draw a card, that card will get into the usedCards object and not be drawn again.
Deck.usedCards = {amt: 0};

//Used for unicode recognition
Deck.identifier = {
    spade: {ace: "🂡", king: "🂮", queen: "🂭", jack: "🂫", 10: "🂪", 9: "🂩", 8: "🂨", 7: "🂧", 6: "🂦", 5: "🂥", 4: "🂤", 3: "🂣", 2: "🂢"},
    heart: {ace: "🂱", king: "🂾", queen: "🂽", jack: "🂻", 10: "🂺", 9: "🂹", 8: "🂸", 7: "🂷", 6: "🂶", 5: "🂵", 4: "🂴", 3: "🂳", 2: "🂲"},
    diamond: {ace: "🃁", king: "🃎", queen: "🃍", jack: "🃋", 10: "🃊", 9: "🃉", 8: "🃈", 7: "🃇", 6: "🃆", 5: "🃅", 4: "🃄", 3: "🃃", 2: "🃂"},
    club: {ace: "🃑", king: "🃞", queen: "🃝", jack: "🃛", 10: "🃚", 9: "🃙", 8: "🃘", 7: "🃗", 6: "🃖", 5: "🃕", 4: "🃔", 3: "🃓", 2: "🃒"},
    backOfCard: "🂠"
}

//Random function to help with random ranges
const random = (min, max) => Math.floor((Math.random() * max) + min);

//Resets the deck so all the cards are usable again
Deck.reset = () => { Deck.usedCards = {amt: 0}; };

Deck.getIdentifier = (suit, value) => Deck.identifier[suit][value];

Deck.getHiddenCardImage = () => Deck.identifier.backOfCard;


//Get the card values for Ace, King, Queen and Jack
Deck.getCardValue = (card) => {
    if (card == "ace") {
        return 11;
    }
    if (card == "king" || card == "queen" || card == "jack") {
        return 10;
    }
    return card;
}


//Returns an object with card information
Deck.getCard = (show = true) => {
    if (Deck.usedCards.amt >= 52){ 
        Deck.reset(); 
        console.log("No more cards to deal, reseting!");
    }

    let usedDeckIdentifier, suit, value
    let stop = false

    //Loop until it finds a card that has not been used.
    do {
        suit = Deck.suits[random(0,Deck.suits.length-1)];
        value = Deck.values[random(0,Deck.values.length-1)];
        usedDeckIdentifier = suit + "_" + value;
        if (Deck.usedCards[usedDeckIdentifier] == undefined)
            stop = true
    }while(!stop)
    Deck.usedCards.amt++;

    Deck.usedCards[usedDeckIdentifier] = {
        suit: suit,
        value: Deck.getCardValue(value),
        faceValue: value,
        identifier: Deck.getIdentifier(suit, value),
        show: show
    };

    return Deck.usedCards[usedDeckIdentifier];
};


//Blackjack Logic

let BlackjackEngine = {}

BlackjackEngine.newPlayer = () => {
    return {
        totalValue: 0,
        cards: [],
        balance: 0,
        bet: 0,
        stand: false
    }
}

BlackjackEngine.drawCard = (target, show = true) => {
    let card = Deck.getCard(show)
    target.cards[target.cards.length] = card
    return card.value
}


//Return Results:
//0 - Player wins
//1 - Dealer wins
//2 - Push
BlackjackEngine.getWinners = (dealer, opponent) => {
    if (typeof opponent == "object") {
        if (opponent.length == 1){
            BlackjackEngine.getWinners(dealer, opponent[0]);
        }else{
            let results = [];
            for(let i = 0; i < opponent; i++){
                let score = opponent[i];
                if (score > 21) results.push(1);
                else if (dealer > 21)  results.push(0);
                else if (dealer == score)  results.push(2);
                else if (score > dealer)  results.push(0);
                else if (score < dealer)  results.push(1);
            }
            return results
        }
    }else{
        if (score > 21)  return [1];
        else if (dealer > 21) return [0];
        else if (dealer == score) return [2];
        else if (score > dealer) return [0];
        else if (score < dealer) return [1]
    }
}

BlackjackEngine.calculateHandValue = (target) => {
    let _value = 0;
    let _aces = 0;

    for (k of target.cards) {
        if (k.show) {
            _value += k.value
            if (k.value == "ace") _aces++
        }
    }

    let ace_str = ""

    while(_aces > 0){
        if (_value > 21) {
            _value -= 10;
            _aces--;
        }else{
            ace_str = `${_value-10}/${value}`;
            break;
        }
    }

    if (_value == 21 && target.cards.length == 2) return "BlackJack", _value
    if (_value <= 21) {
        return _value, _value, ace_str
    }
}


//Return Results:
//0 - Player wins
//1 - Dealer wins
//2 - Push
BlackjackEngine.getWinners = (dealer, opponent) => {
    if (typeof opponent == "object") {
        if (opponent.length == 1){
            BlackjackEngine.getWinners(dealer, opponent[0]);
        }else{
            let results = [];
            for(let i = 0; i < opponent; i++){
                let score = opponent[i];
                if (score > 21) results.push(1);
                else if (dealer > 21)  results.push(0);
                else if (dealer == score)  results.push(2);
                else if (score > dealer)  results.push(0);
                else if (score < dealer)  results.push(1);
            }
            return results
        }
    }else{
        if (score > 21)  return [1];
        else if (dealer > 21) return [0];
        else if (dealer == score) return [2];
        else if (score > dealer) return [0];
        else if (score < dealer) return [1]
    }
}

BlackjackEngine.calculateHandValue = (target) => {
    let _value = 0;
    let _aces = 0;

    for (k of target.cards) {
        if (k.show) {
            _value += k.value
            if (k.value == "ace") _aces++
        }
    }

    let ace_str = ""

    while(_aces > 0){
        if (_value > 21) {
            _value -= 10;
            _aces--;
        }else{
            ace_str = `${_value-10}/${value}`;
            break;
        }
    }

    let ret

    if (_value == 21 && target.cards.length == 2) {
        ret = {
            value: _value,
            blackjack: true
        }
    }
    else if (_value <= 21) { 
        ret = {
            value: _value,
            ace: ace_str
        }
    }
    else {
        ret = {
            value: _value,
            bust: true
        }
    }
    return ret
}

BlackjackEngine.content = (target) => {
    let stringBuilder = "";
    for (card of target.cards) {
        if (card.show) {
            stringBuilder += `<li class="card">${card.identifier}</li>`;
        }else{
            stringBuilder += `<li class="card">${Deck.getHiddenCardImage()}</li>`;
        }
    }
    return stringBuilder
}