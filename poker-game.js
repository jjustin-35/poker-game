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
    let card = addBlock('div.card');
    card.info = element;
    let cardBack = addBlock('div.cardBack');
    let cardFront = addBlock('div.cardFront');
    let img = addBlock('img');
    img.src = element.img;
    cardFront.appendChild(img);

    let cover = addBlock('div.cover');

    card.appendChild(cardBack);
    card.appendChild(cardFront);
    card.appendChild(cover);
    board.appendChild(card);
})
// score
let scoreHTML = document.querySelector('#score');
let amountHTML = document.querySelector('#amount');
let score = 0;
let amount = 0;
function changeScore() {
    scoreHTML.innerHTML = `得分：${score}`;
    amountHTML.innerHTML = `嘗試次數：${amount}`;
};

// DOM
let pokers = board.querySelectorAll('div.card');
let showOut = [];
pokers.forEach((elem) => {
    elem.addEventListener('click', () => {
        elem.style.transform = 'rotateY(180deg)';
        showOut.push(elem);

        if (showOut.length == 2) {
            amount++;
            changeScore();
            if (showOut[0].info.name != showOut[1].info.name) {
                showOut.forEach((elem) => {
                    setTimeout(() => {
                        elem.style.transform = '';
                    }, 1000);
                })
            } else if(showOut[0].info.name == showOut[1].info.name && showOut[0] !== showOut[1]){
                showOut.forEach((elem) => {
                    let cover = elem.children[2];
                    setTimeout(()=>{cover.style.display = 'block'}, 300);
                })
                score += 100;
                changeScore();
            } else {
                // 避免同張牌按兩次
                showOut.pop();
            }
            showOut = [];
        }
    })
})

function addBlock(e) {
    if (/\./.test(e)) {
        let words = e.split('.');
        let element = words[0];
        let addClass = words[1];
        if (/\s/.test(addClass)) {
            addClass = addClass.split(/\s/);
        } else {
            addClass = [addClass];
        }
        let block = document.createElement(element);
        addClass.forEach((c) => {
            block.classList.add(c);
        })
        return block;
    } else {
        return document.createElement(e);
    }
}