// localStorage.clear();

// 難度選擇
let difficutyBlk = document.querySelector('article.difficulty');
let difficultyBtn = difficutyBlk.querySelectorAll('button');
let filter = document.querySelector('.filter');

// 創造poker object
class Pokers {
    constructor(name, suit, img) {
        this.name = name;
        this.suit = suit;
        this.img = img;
    }
}

difficultyBtn.forEach((e, i) => {
    e.addEventListener('click', () => {
        difficutyBlk.classList.toggle('hideBlock');
        filter.classList.toggle('hideBlock');
        // easy = 2, normal = 3, hard = 4 suits
        let difficulty = i + 2;

        // 放入list
        let deck = [];
        let suits = ['spade', 'heart', 'diamond', 'club'];
        let nameList = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King'];

        for (let i = 0; i < difficulty; i++){
            for (let y = 0; y < 2; y++){
                deck.push(new Pokers(nameList[y], suits[i], `./pukeImage/${suits[i]}_${y + 1}.jpg`));
            }
        }

        // 隨機排序
        deck.sort(() => 0.5 - Math.random());

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
        let counter = 0;

        // 遊戲資料取出
        let gameData = localStorage.getItem('gameData');
        class GameData {
            constructor() {
                this.bestScore = 0;
                this.bestAmount = Infinity;
                this.bestTimer = {
                    second: Infinity,
                    minute: Infinity,
                    Hour: Infinity
                };
            }
        };
        if (!gameData) {
            gameData = {
                easy: new GameData(),
                normal: new GameData(),
                hard: new GameData(),
            }
        } else {
            gameData = JSON.parse(gameData);
        }

        let lastData;
        if (difficulty == 2) {
            lastData = gameData.easy;
        } else if (difficulty == 3) {
            lastData = gameData.normal;
        } else {
            lastData = gameData.hard;
        }

        pokers.forEach((elem) => {
            elem.addEventListener('click', () => {
                elem.style.transform = 'rotateY(180deg)';
                showOut.push(elem);

                // main
                if (showOut.length == 2) {
                    amount++;
                    if (showOut[0].info.name != showOut[1].info.name) {
                        showOut.forEach((elem) => {
                            setTimeout(() => {
                                elem.style.transform = '';
                            }, 1000);
                        })
                        showOut = [];
                    } else if(showOut[0].info.name == showOut[1].info.name && showOut[0] !== showOut[1]){
                        showOut.forEach((elem) => {
                            let cover = elem.children[2];
                            setTimeout(()=>{cover.style.display = 'block'}, 300);
                        })
                        score += 100;
                        counter += 2;
                        changeScore();
                        showOut = [];
                    } else {
                        // 避免同張牌按兩次
                        showOut.pop();
                        amount--;
                    }
                    changeScore();
                }
                // 停止
                if (counter == deck.length) {
                    // 停止計時器(click後才會觸發，順序在setInterval之後)
                    clearInterval(intervalID);
                    // 儲存最佳資料
                    if (lastData.bestScore < score) {
                        lastData.bestScore = score;
                    }
                    if (lastData.bestAmount > amount) {
                        lastData.bestAmount = amount;
                    }
                    if (lastData.bestTimer.hour > timeObject.hour) {
                        lastData.bestTimer = timeObject;
                    } else if (lastData.bestTimer.minute > timeObject.minute) {
                        lastData.bestTimer = timeObject;
                    } else if (lastData.bestTimer.second > timeObject.second) {
                        lastData.bestTimer = timeObject;
                    }

                    if (difficulty == 2) {
                        gameData.easy = lastData ;
                    } else if (difficulty == 3) {
                        gameData.normal = lastData;
                    } else {
                        gameData.hard = lastData;
                    }
                    
                    // 讓Infinity可以是Infinity，不會在JSON中變成null
                    localStorage.setItem('gameData', JSON.stringify(gameData, function (k,v) { return v === Infinity ? "Infinity" : v; }));
                }
            })
        })

        // 顯示最佳成績
        let bestbtn = document.querySelector('button#best');
        let bestBlock = document.querySelector('.bestBlock');

        let blockContent = bestBlock.querySelectorAll('span');

        if (lastData.bestScore==0 && lastData.bestAmount == Infinity) {
            blockContent[0].innerHTML = '-';
            blockContent[1].innerHTML = '-';
            blockContent[2].innerHTML = '--:--:--';
        } else {
            blockContent[0].innerHTML = lastData.bestScore;
            blockContent[1].innerHTML = lastData.bestAmount;
            blockContent[2].innerHTML = getTimeString(lastData.bestTimer);
        }

        bestbtn.addEventListener('click', () => {
            bestBlock.classList.toggle('hideBlock');
            bestBlock.classList.toggle('showBlock');
            filter.classList.toggle('hideBlock');
            filter.classList.toggle('showBlock');

            filter.addEventListener('click', () => {
                bestBlock.classList.add('hideBlock');
                bestBlock.classList.remove('showBlock');
                filter.classList.add('hideBlock');
                filter.classList.remove('showBlock');
            })
        })

        // 計時器
        let timer = document.querySelector('span#timer');

        let min = 0;
        let hr = 0;
        let sec = 0;
        let timeObject;

        let intervalID = setInterval(() => {
            sec++;
            if (sec == 60) {
                sec = 0;
                min++;
            }
            if (min == 60) {
                min = 0;
                hr++;
            }
            timeObject = {
                second: sec,
                minute: min,
                hour: hr,
            }
            timer.innerHTML = getTimeString(timeObject);
        }, 1000);
    })
})

// function
function getTimeString(obj) {
    function addZero(time) {
        if (time < 10) {
            time = '0' + time;
        }
    
        return time;
    }
    return `${addZero(obj.hour)}:${addZero(obj.minute)}:${addZero(obj.second)}`;
}

function addBlock(html) {
    if (/\./.test(html)) {
        let words = html.split('.');
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
        return document.createElement(html);
    }
}