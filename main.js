(() => {

    const random = (min, max) => Math.floor((Math.random() * (max - min + 1)) + min);

    const contains = (src, ...checks) => {
        for(let check of checks){
            if (src == check) return true;
        }
        return false;
    }

    const getElementText = (id, txt) => document.getElementById(id).innerHTML;
    const setElementText = (id, txt) => document.getElementById(id).innerHTML = txt;
    const appendElementText = (id, txt) => setElementText(id, getElementText(id) + txt);
    const appendChildByQuery = (tag, child) => document.querySelector(tag).appendChild(child);
    const appendChildById = (id, child) => document.getElementById(id).appendChild(child);
    const createElement = (tag, options) => Object.assign(document.createElement(tag),options);
    const createButton = (value, callback, style) => createElement("button", {innerHTML: value, onclick: callback, style});

    const objToStyle = (obj) => {
        let cssResult = "";
        for (let i in obj){
            let key = i,
                pair = obj[i];
            cssResult += `${key}: ${pair};`
        }
        return cssResult;
    }

    class Deck {
        constructor(howManyDecks = 1) {
            this.deckAmt = howManyDecks;
            this.cards = [];
            this.suits = ["H", "S", "D", "C"];
            this.values = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
            this.identities = ["🂱", "🂾", "🂽", "🂻", "🂺", "🂹", "🂸", "🂷", "🂶", "🂵", "🂴", "🂳", "🂲", "🂡", "🂮", "🂭", "🂫", "🂪", "🂩", "🂨", "🂧", "🂦", "🂥", "🂤", "🂣", "🂢", "🃁", "🃎", "🃍", "🃋", "🃊", "🃉", "🃈", "🃇", "🃆", "🃅", "🃄", "🃃", "🃂", "🃑", "🃞", "🃝", "🃛", "🃚", "🃙", "🃘", "🃗", "🃖", "🃕", "🃔", "🃓", "🃒"];
            this.cardsLeft = 52;
            this.hiddenCard = "🂠";
            this.reset();
        }

        getCardImage(suit, card) {
            return `<img src="img/cards/${card}${suit}.svg" width="107" height="150">`;
        }

        getBackOfCard() {
            return `<img src="img/cards/card_back.svg" width="107" height="150">`;
        }

        reset() {
            this.cards = [];

            let identity = 0;

            for (let i = 0; i < this.deckAmt; i++){
                for (let suit of this.suits){
                    for(let value of this.values){
                        this.cards.push(`${suit}_${value}_${this.identities[identity++]}`);
                    }
                }
                this.identity = 0;
            }

            this.cardsLeft = 52;
        }

        getValue(card) {
            return card == "A" ? 11 : contains(card, "K", "Q", "J") ? 10 : +card;
        }

        getCard(show=true) {
            if (this.cardsLeft == 0) this.reset();

            const randomCard = this.cards.splice(random(0, this.cards.length-1), 1)[0];
            const [suit, faceValue, identifier] = randomCard.split(/_/);
            const value = this.getValue(faceValue);

            this.cardsLeft--;

            return {suit, faceValue, value, identifier, show};
        }
    }

    class BlackJackEngine {
        constructor() {
            this.deck = new Deck();
        }

        newPlayer() {
            return {
                cards: [],
                value: 0,
                content: ""
            }
        }

        drawCard(target, id, show = true) {
            let card = this.deck.getCard(show);
            target.cards.push(card);
            target.value += card.value;
            this.content(target, card, id);
            return card.value
        }

        getResults(dealerHand, opponentHand) {
            if (opponentHand > 21) return 1;
            if (dealerHand > 21) return 0;
            if (opponentHand == dealerHand) return 2;
            if (opponentHand < dealerHand) return 1;
            if (opponentHand > dealerHand) return 0;
        }

        handValue(target) {
            let value, numberOfAces, aceStr
            for(let card of target.cards) {
                if (card.show){
                    value += card.value;
                    if (card.faceValue == "A") numberOfAces++;
                }
            }

            while(numberOfAces > 0){
                if (value > 21) {
                    value -= 10;
                    numberOfAces--;
                }else {
                    aceStr = `${value-10}/${value}`;
                    break;
                }
            }

            let result;
            if(value == 21 && target.cards.length == 2) result = { value, blackjack: true };
            else if(value <= 21) result = { value };
            else result = { bust: true, value };
            return result;
        }
        
        content(target, card, id) {
            if (card.show) {
                target.content = createElement("li", {
                    innerHTML: this.deck.getCardImage(card.suit, card.faceValue),
                    className: "card"
                });
            }else {
                target.content = createElement("li", {
                    innerHTML: this.deck.getBackOfCard(),
                    className: "card"
                });
            }
            appendChildById(id, target.content);
        }
    }

    let engine = new BlackJackEngine();
    let Player = engine.newPlayer();
    let Dealer = engine.newPlayer();

    const Settings = {
        turn: "player",
        gameOver: false
    };

    engine.drawCard(Player, "player-cards");
    engine.drawCard(Dealer, "dealer-cards");
    engine.drawCard(Player, "player-cards");
    engine.drawCard(Dealer, "dealer-cards", false);

    let myHitButtonStyle = objToStyle({
        border: "none",
        "background-color": "#09ff21",
        width: "3vw",
        height: "3vw",
        color: "black"
    });

    let hitButton = createButton("Hit", () => {
        engine.drawCard(Player, "player-cards");

        if (Player.value == 21) {
            Dealer.cards[1].show = true;
            Settings.turn = "dealer";
        }

    }, myHitButtonStyle)
    appendChildByQuery(".main", hitButton)

    let t = 0;
    setInterval(() => {
        if (!Settings.gameOver) {
            if (Settings.turn == "dealer") {
                t += 0.25;
                if (t >= 1) {
                    
                    if(Dealer.value >= 17){


                        let result = engine.getResults(Dealer.value, Player.value);

                        switch(result) {
                            case 0:
                                //Player wins
                                break;
                            case 1:
                                //Dealer wins
                                break;
                            case 2:
                                //Push
                                break;
                        };
                        Settings.gameOver = true;
                    }else {
                        engine.drawCard(Dealer, "dealer-cards");
                    }
                    t = 0;
                }
            }
        }



    }, 250);


})();