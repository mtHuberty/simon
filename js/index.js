'use strict'

$(document).ready(function(){
   let game = {
     clickCount: 0,
     cpuSequence: [],
     playerSequence: [],
     score: 0,
     reset: function(){
       document.getElementById("endLineOne").innerHTML = '<span class="endEmph">Aww jeez</span>';
       document.getElementById("endLineTwo").innerHTML = "Play again?";
       this.clickCount = 0;
       document.getElementById("score").innerHTML = 0;
       this.cpuSequence = [];
       this.playerSequence = [];
       this.score = 0;
     },
     strictMode: false,
     sounds: {
       green: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
       red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
       yellow: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
       blue: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
       error: new Audio("http://morewhitespace.ca/piano_middle_C.mp3")
     },
     
     
     
     nextColor: function(){
       const colors = ["green", "red", "yellow", "blue"];
       let colorIndex = Math.floor(Math.random()*4);
       game.cpuSequence.push(colors[colorIndex]);
       console.log("cpuSequence is now " + game.cpuSequence);
       return colors[colorIndex];
     },
     
     
     
     playSequence: function(){
       (function seqLoop(i){
         setTimeout(function(){
           let itColor = game.cpuSequence[i];
           console.log("Running seqLoop() with " + itColor);
           console.log("cpuseq length is " + game.cpuSequence.length);
           $('#' + itColor).addClass("mash");
           game.sounds[itColor].currentTime=0;
           game.sounds[itColor].play();
           setTimeout(function(){
             $('#' + itColor).removeClass("mash");
           }, 200)
           if(i<game.cpuSequence.length-1){
             seqLoop(++i);
           } else if( i === game.cpuSequence.length-1 ){
              setTimeout(function(){
                $(".button").on("click", game.onPlayerClick);
              }, 400)
           }
         }, 500);
       })(0);
     },
     
     
     
     cpuTurn: function(playerTurnResult){
       game.playerSequence = [];
       this.clickCount = 0;
       if (playerTurnResult==="allmatch"){
         if(this.cpuSequence.length !== 0){
           this.score++;
           document.getElementById("score").innerHTML = this.score;
           if(this.score === 2){
             document.getElementById("endLineOne").innerHTML = '<span class="endEmph">AMAZING!</span>';
             document.getElementById("endLineTwo").innerHTML = "Play again?";
             document.getElementById("endModalBG").style.display = "block";
             document.getElementById("endModalContent").style.opacity = "1";
             return null;
           }
         }
         this.nextColor()
       }
       console.log("strictMode is currently " + this.strictMode)
       if (this.strictMode === true && playerTurnResult === false){
         document.getElementById("endModalBG").style.display = "block";
         document.getElementById("endModalContent").style.opacity = "1";
         return null;
       }
       console.log("PLAYING SEQUENCE!!");
       this.playSequence();
     },
     
     
     
     //Called when game needs to check if player sequence is correct (after each player click)
     //Returns "allmatch" if all match, true if curr matches curr, and false for any errant click
     checkSequence: function(){
       if (this.cpuSequence.length === this.playerSequence.length && 
          this.cpuSequence[this.clickCount-1] === this.playerSequence[this.clickCount-1]){
         return "allmatch";
       } else if (this.cpuSequence[this.clickCount-1] === 
                  this.playerSequence[this.clickCount-1]){
         return true;
       } else {
         return false;
       }
     },
     
     
     
     onPlayerClick: function(){
         game.clickCount++;
         let thisButton = $(this);
         thisButton.addClass("mash");
         game.sounds[this.id].currentTime=0;
         game.sounds[this.id].play();
         game.playerSequence.push(this.id);
         console.log(game.playerSequence);
         let success = game.checkSequence();
         console.log(game.checkSequence());
         setTimeout(function(){ 
           thisButton.removeClass("mash");
           }, 200);
         switch(success){
           case "allmatch":
             $(".button").off("click", game.onPlayerClick);
             setTimeout(function(){game.cpuTurn(success)}, 1000);
             break;
           case false:
             game.sounds.error.currentTime = 0;
             setTimeout(function(){
               game.sounds.error.play();
             }, 500);
             $(".button").off("click", game.onPlayerClick);
             setTimeout(function(){game.cpuTurn(success)}, 1000);
             break;
           case true:
             break;
         }
     },
     
     
     activateButtons: function() {
       $(".button").on("click", game.onPlayerClick);
       //ADD HOVER EVENT LISTENER
     },
     
     
     deactivateButtons: function() {
       $(".button").off("click")
       //REMOVE HOVER EVENT LISTENER
     },
     
     
     
     restart: function() {
       document.getElementById("endModalBG").style.display = "none";
       document.getElementById("endModalContent").style.opacity = "0";
       game.reset();
       this.cpuTurn("allmatch");
     },
     
     
     
     onInit: function() {
       //Start new game when user clicks start
       $("#start").on("click", function(){
         game.reset();
         game.cpuTurn("allmatch");
       });
       
       $("#strict").on("click", function(){
         game.strictMode = !game.strictMode;
         $("#strict").toggleClass("btn-warning btn-primary");
       });
       
       $("#restart").on("click", function(){
         game.restart();
       });
       
       //fixme
       game.sounds.green.volume = 0.6;
       game.sounds.red.volume = 0.6;
       game.sounds.yellow.volume = 0.6;
       game.sounds.blue.volume = 0.6;
     },
   }
   
   game.onInit();
   
});
//end