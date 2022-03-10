"use strict";
// HTML elements 
const btnStart = document.getElementById("btn-start");
const gameContainer = document.getElementById("game-container");
const gridContainerBottom = document.getElementById("grid-containerBottom");
const textContainer = document.getElementById("text-container");
const win = document.getElementById("win");
const gameLost = document.getElementById("gameOver");
const arr = [1, 2, 3, 3, 2, 3, 3, 3, 2, 1];
let isclicked = false;
// Timers
const timeout = 2000;
const chestOpenTimeout = 1000;
const resetTimer = 8000;
const musicTimer = 1400;
//listens for click on start button
btnStart.addEventListener('click', StartGame);
// hides start button and reveals gameContainer and listens for click on gamecontainerbutton which will look for click on chest imgs
function StartGame() {
    hide(btnStart);
    reveal(gameContainer, "grid-containerInfo");
    gridContainerBottom.addEventListener('click', function (event) { openChest(event); });
}
// picks random element from array and returns if target has identical id
function pickRandom(target) {
    const r = arr[Math.floor(Math.random() * arr.length)];
    if (r == +target.id) {
        return true;
    }
    return false;
}
// adds img to target element 
function getReward(target) {
    console.log(target.id);
    if (target.id == '1')
        addImg(target, "item_mushroom.png");
    else if (target.id == '2')
        addImg(target, "item_star.png");
    else
        addImg(target, "item_green_leaf.png");
}
// creates a html image element and inserts it in target html element
function addImg(target, imgName) {
    let img = document.createElement('img');
    img.src = "../img/" + imgName;
    img.className = "rewardImg";
    target.before(img);
}
// runs every time buttomContainer gets a mouse click, it checks if mouse curser is at chestImg and there is no click prior
function openChest(event) {
    const target = event.target;
    if (target.className == "chestImg" && !isclicked) {
        setTimeout(() => changeImg(target), chestOpenTimeout);
        target.className = "pickedChestImg";
        hideImgs();
        fadeOutEffect(textContainer, 20);
        fadeOutEffect(event.target, timeout);
        isclicked = true;
        if (pickRandom(target)) {
            gameOver(false);
            spawnReward(target);
        }
        else
            gameOver(true);
        resetAll();
    }
}
// fades out element gradually by how many mseconds inserted.
function fadeOutEffect(target, ms) {
    var fadeEffect = setInterval(function () {
        if (!target.style.opacity) {
            target.style.opacity = '1';
        }
        if (target.style.opacity > '0') {
            let x = +textContainer.style.opacity - 0.1;
            target.style.opacity = x + '';
        }
        else {
            clearInterval(fadeEffect);
        }
    }, ms);
}
// checks wether you won or lost and plays audio and reveals text
function gameOver(arg0) {
    if (arg0) {
        const audio = new Audio("../sound/GameOver - other 01.mp3");
        setTimeout(() => audio.play(), musicTimer + 400);
        setTimeout(() => { reveal(gameLost); }, timeout);
    }
    else {
        const audio = new Audio("../sound/Magic Spell_Coins_2.mp3");
        setTimeout(() => audio.play(), musicTimer);
        setTimeout(() => { reveal(win); }, timeout);
    }
}
// 
function spawnReward(target) {
    setTimeout(() => {
        getReward(target);
        hide(target, "grid-pic");
    }, timeout);
}
// reset everything back to originally when game started.
function resetAll() {
    console.log("im resetting");
    setTimeout(() => {
        // 
        isclicked = false;
        hide(gameContainer, "grid-containerInfo");
        reveal(btnStart);
        // setting textContainer to visable 
        textContainer.style.opacity = "1";
        resetpictures();
        hide(gameLost);
        hide(win);
    }, resetTimer);
}
// adds htmlelement to the class hide and removes from old class if wanted.
function hide(target, oldclass) {
    if (oldclass)
        target.classList.remove(oldclass);
    target.classList.add("hide");
}
// removes html element from the hide class and adds it to new class if wanted
function reveal(target, newclass) {
    if (target.classList.contains("hide"))
        target.classList.remove("hide");
    if (newclass)
        target.classList.add(newclass);
}
// resets all chestimg pictures and rewardpictures
function resetpictures() {
    const child = document.querySelector(".rewardImg");
    const element = document.querySelector(".pickedChestImg");
    for (let i = 1; i < 4; i++) {
        const element = document.getElementById(`${i}`);
        element.style.opacity = "1";
    }
    document.querySelectorAll(".img-div").forEach(e => {
        reveal(e, "grid-pic");
    });
    if (child)
        child.remove();
    element.classList.remove("pickedChestImg");
    reveal(element, "chestImg");
    changeImg(element);
}
//changes chestimg to closed or open img.
function changeImg(target) {
    if (isclicked)
        target.src = "../img/chest_open.png";
    else
        target.src = "../img/chest_closed.png";
}
// hides the img in the class chestImg.
function hideImgs() {
    document.querySelectorAll(".chestImg").forEach(e => {
        fadeOutEffect(e, 20);
        const removeChests = setTimeout(() => {
            e.parentElement.classList.remove("grid-pic");
            e.parentElement.classList.add("hide");
        }, 1000);
    });
}
