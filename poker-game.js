// 創造poker object
class Pokers {
    constructor(name, suit, img) {
        this.name = name;
        this.suit = suit;
        this.img = img;
    }
}

// 放入list
let deck = [];
let suits = ['spade', 'heart', 'diamond', 'club'];
let nameList = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King'];

for (let i = 0; i < 4; i++){
    for (let y = 0; y < 13; y++){
        deck.push(new Pokers(nameList[y], suits[i], `./pukeImage/${suits[i]}_${y + 1}.jpg`));
    }
}

// 隨機排序
deck.sort(() => 0.5 - Math.random());
console.log(deck[0])

// 放入html
let board = document.querySelector('main.poker');

deck.forEach((element) => {
    let back = document.createElement('div');
    back.classList.add('black');
    let img = document.createElement('img');
    img.src = element.img;
    img.classList.add('hide')
    img.info = element;
    back.appendChild(img); 
    board.appendChild(back);
})
// score
let scoreHTML = document.querySelector('#score');
let amountHTML = document.querySelector('#amount');
let score = 0;
let amount = 0;
let changeScore = function () {
    scoreHTML.innerHTML = `得分：${score}`;
    amountHTML.innerHTML = `嘗試次數：${amount}`;
};

// DOM
let pokers = board.querySelectorAll('div');
let showOut = [];
pokers.forEach((elem) => {
    elem.addEventListener('click', () => {
        elem.classList.remove('black');
        let card = elem.children[0];
        card.classList.remove('hide');
        showOut.push(card);

        if (showOut.length == 2) {
            amount++;
            changeScore();
            if (showOut[0].info.name != showOut[1].info.name) {
                showOut.forEach((elem) => {
                    setTimeout(() => {
                        elem.classList.add('hide');
                        let div = elem.parentElement;
                        div.classList.add('black');
                    }, 1000);
                })
            } else {
                score += 100;
                changeScore();
            }
            showOut = [];
        }
    })
})
