let blackjackGame = {
    "you": {"scoreSpan":"#your-bj-result","div":"#your-box","score":0},
    "bot": {"scoreSpan":"#bot-bj-result","div":"#bot-box","score":0},
    "cards": ["2","3","4","5","6","7","8","9","10","K","J","Q","A"],
    "cardsValue": {"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,"K":10,"J":10,"Q":10,"A":[1,11]}, 
    "wins": 0,
    "losses": 0, 
    "draws": 0,
    "isStand":false,
    "turnsOver":false,
};

const YOU= blackjackGame["you"];
const BOT= blackjackGame["bot"];
const hitSound=new Audio("sounds/swish.m4a");
const winSound=new Audio("sounds/cash.mp3");
const lostSound=new Audio("sounds/aww.mp3");

document.querySelector("#bj-hit").addEventListener("click",blackjackHit);
document.querySelector("#bj-stand").addEventListener("click",botLogic);
document.querySelector("#bj-deal").addEventListener("click",bjDeal);

function blackjackHit(){
    if(blackjackGame["isStand"]===false){
    let card=randomCard();
    showCard(card,YOU);
    updateScore(card,YOU);
    showScore(YOU);  
} 
}

function showCard(card,activePlayer)
{
    if(activePlayer["score"]<=21){
    let cardIMG= document.createElement("img");
    cardIMG.src=`images/${card}.jpg`;
    document.querySelector(activePlayer["div"]).appendChild(cardIMG);
    hitSound.play(); 
}
}


function bjDeal(){
   
if(blackjackGame["turnsOver"]===true){

    blackjackGame["isStand"]=false;
 let yourImages=document.querySelector("#your-box").querySelectorAll("img");
 let botImages=document.querySelector("#bot-box").querySelectorAll("img");
 

for(let i=0;i<yourImages.length;i++){
    yourImages[i].remove();
}

for(let i=0;i<botImages.length;i++){
    botImages[i].remove();
}

YOU["score"]=0;
BOT["score"]=0;
document.querySelector(YOU["scoreSpan"]).textContent="0";
document.querySelector(YOU["scoreSpan"]).style.color="#fff";

document.querySelector(BOT["scoreSpan"]).textContent="0";
document.querySelector(BOT["scoreSpan"]).style.color="#fff";

document.querySelector("#blackjack-result").textContent="LET'S PLAY";
document.querySelector("#blackjack-result").style.color="#fff";

blackjackGame["turnsOver"]=true;
}

}

function randomCard()
{
    let randomIndex=Math.floor(Math.random()*13);
    return blackjackGame["cards"][randomIndex];
}


function updateScore(cards,activePlayer)
{
    if (cards==="A"){
    if (activePlayer["score"]+blackjackGame["cardsValue"][cards][1] <=21)
    {
        activePlayer["score"]+=blackjackGame["cardsValue"][cards][1];  
    }else
        activePlayer["score"]+=blackjackGame["cardsValue"][cards][0];
    }else{
    activePlayer["score"]+=blackjackGame["cardsValue"][cards];
    }
}

function showScore(activePlayer){
    if(activePlayer["score"] > 21 ){
        document.querySelector(activePlayer['scoreSpan']).textContent = "BUST!";
        document.querySelector(activePlayer['scoreSpan']).style.color="red";    

    }else{
   document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
}
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function botLogic()
{
    blackjackGame["isStand"]=true;
    while (BOT["score"]<16 && blackjackGame["isStand"]===true) {
        let card= randomCard();
        showCard(card,BOT);
        updateScore(card,BOT);
        showScore(BOT);
        await sleep(1000);
    }


        blackjackGame["turnsOver"]=true;
        showResult(computeWinner());
    

}

function computeWinner(){
    let winner;

    if(YOU["score"]<=21)
    {
        if(YOU["score"]>BOT["score"]||BOT["score"]>21){
            blackjackGame["wins"]++;
            winner=YOU;
        }else if(YOU["score"]<BOT["score"]){
            blackjackGame["losses"]++;
            winner=BOT;
        }else if (YOU["score"]===BOT["score"])
        {
            blackjackGame["draws"]++;
        }
    
    }else if (YOU["score"]>21 && BOT["score"]<=21)
    {
        blackjackGame["losses"]++;
        winner=BOT;
    }else if (YOU["score"]>21&& BOT["score"]>21)
    {
        blackjackGame["draws"]++;
    }
    return winner;
}

function showResult(winner)
{
    let message, messageColor;

    if(blackjackGame["turnsOver"]===true){
    if(winner===YOU)
    {
        document.querySelector("#wins").textContent=blackjackGame["wins"];
        winSound.play();
        message="You WIN!";
        messageColor="green";
    }else if(winner===BOT)
    {
        document.querySelector("#losses").textContent=blackjackGame["losses"];
        lostSound.play();
        message="You LOST!";
        messageColor="black";
    }else
    {
        document.querySelector("#draws").textContent=blackjackGame["draws"];
        message="Draw!"
        messageColor="yellow";
    }

    document.querySelector("#blackjack-result").textContent=message;
    document.querySelector("#blackjack-result").style.color=messageColor;
}
}