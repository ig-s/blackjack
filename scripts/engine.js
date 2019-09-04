//Deck Logic
let Deck = {}
Deck.suits = ["heart", "club", "spade", "diamond"];
Deck.values = ["ace", "2", "3", "4", "5", "6", "7", "9", "10", "jack", "queen", "king"];
Deck.usedCards = {};


// --Clubs
// 🃑, 🃞, 🃝, 🃛, 🃚, 🃙, 🃘, 🃗, 🃖, 🃕, 🃔, 🃓, 🃒




Deck.identifier = {
    spade: {ace: "🂡", king: "🂮", queen: "🂭", jack: "🂫🂭", 10: "🂪", 9: "🂩", 8: "🂨", 7: "🂧", 6: "🂦", 5: "🂥", 4: "🂤", 3: "🂣", 2: "🂢"},
    heart: {ace: "🂱", king: "🂾", queen: "🂽", jack: "🂻", 10: "🂺", 9: "🂹", 8: "🂸", 7: "🂷", 6: "🂶", 5: "🂵", 4: "🂴", 3: "🂳", 2: "🂲"},
    diamond: {ace: "🃁", king: "🃎", queen: "🃍", jack: "🃋", 10: "🃊", 9: "🃉", 8: "🃈", 7: "🃇", 6: "🃆", 5: "🃅", 4: "🃄", 3: "🃃", 2: "🃂"},
    club: {ace: "🃑", king: "🃞", queen: "🃝", jack: "🃛", 10: "🃚", 9: "🃙", 8: "🃘", 7: "🃗", 6: "🃖", 5: "🃕", 4: "🃔", 3: "🃓", 2: "🃒"}

}

const random = (min, max) => Math.floor((Math.random() * max) + min);

Deck.reset = () => { Deck.usedCards = {}; };

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

    if (Deck.usedCards.length == 52){ 
        Deck.reset(); 
        console.log("No more cards to deal, reseting!");
    }
    
    let cardIdentifier, suit, value

    do {
        suit = Deck.suits[random(0,Deck.suits.length-1)];
        value = Deck.values[random(0,Deck.values.length-1)];
        cardIdentifier = suit + "_" + value;

    }while(Deck.usedCards[cardIdentifier] == undefined)

    Deck.usedCards[cardIdentifier] = {
        suit: suit,
        value: Deck.getCardValue(value),
        faceValue: value,
    }

};


//Blackjack Logic

let BlackjackEngine = {}

BlackjackEngine.