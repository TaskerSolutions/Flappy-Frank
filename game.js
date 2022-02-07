const RAD = Math.PI/180;
const scrn = document.getElementById('canvas');
let scoreCounter = 0;
scrn.height = 420;
const sctx = scrn.getContext("2d");
scrn.tabIndex = 1;

window.addEventListener("resize",()=>{
    resizeCanvas();
 })

 function resizeCanvas() {
    if (window.innerWidth > 850) {
        scrn.width = 800;
    } else {
        scrn.width = window.innerWidth - 50;
    }
    if (window.innerWidth > 600) {
        bird.x = 150;
    } else if (window.innerWidth <= 600 && window.innerWidth > 400) {
        bird.x = 100;
    } else if (window.innerWidth <= 400) {
        bird.x = 50;
    }
 }

scrn.addEventListener("click",()=>{
    switch (state.curr) {
        case state.getReady :
            state.curr = state.Play;
            SFX.start.play();
            resetGame(); // reset speed, pipe gap & pipe spawn speed
            break;
        case state.Play :
            bird.flap();
            break;
        case state.gameOver :
            state.curr = state.getReady;
            bird.speed = 0;
            bird.y = scrn.height / 2.3;
            pipe.pipes=[];
            UI.score.curr = 0;
            SFX.played=false;
            bird.isDead = false;
            break;
    }
 });

 scrn.onkeydown = function keyDown(e) {
 	if (e.keyCode == 32 || e.keyCode == 87 || e.keyCode == 38)   // Space Key or W key or arrow up
 	{
 		switch (state.curr) {
	        case state.getReady :
	            state.curr = state.Play;
	            SFX.start.play();
                resetGame(); // reset speed, pipe gap & pipe spawn speed
	            break;
	        case state.Play :
	            bird.flap();
	            break;
	        case state.gameOver :
	            state.curr = state.getReady;
	            bird.speed = 0;
	            bird.y = scrn.height / 2.3;
	            pipe.pipes=[];
	            UI.score.curr = 0;
	            SFX.played=false;
                bird.isDead = false;
	            break;
   		}
 	}
}

function resetGame() {
    dx = 3;
    pipe.gap = 220;
    pipeSpawnSpeed = 100;
    counter = 0;
}



 let frames = 0;
 let counter = 0; // for increasing speed over time
 let pipeSpawnSpeed = 100; // smaller is faster
 let dx = 3; // speed
 const state = {
     curr : 0,
     getReady : 0,
     Play : 1,
     gameOver : 2
 }
 const SFX = {
     start : new Audio(),
     flap : new Audio(),
     score1 : new Audio(),
     score2 : new Audio(),
     hit : new Audio(),
     die : new Audio(),
     played : false
 }
 const gnd = {
    sprite : new Image(),
     x : 0,
     y : 0,
     draw : function() {
        this.y = parseFloat(scrn.height-this.sprite.height);
        sctx.drawImage(this.sprite,this.x,this.y);
     },
     update : function() {
        if(state.curr != state.Play) return;
        // ground moving
        this.x -= dx;
        if (this.x + this.sprite.width < scrn.width) {
            //console.log("gnd2.x = gnd.width")
            gnd2.x = this.x + this.sprite.width;
        }
        //this.x = this.x % (this.sprite.width/2);    
    }
 };
 const gnd2 = {
    sprite : new Image(),
     x : 0,
     y : 0,
     draw : function() {
        this.y = parseFloat(scrn.height-this.sprite.height);
        sctx.drawImage(this.sprite,this.x,this.y);
     },
     update : function() {
        if(state.curr != state.Play) return;
        // ground moving
        this.x -= dx;
        if (this.x + this.sprite.width < scrn.width) {
            gnd.x = this.x + this.sprite.width;
        }
        //this.x = this.x % (this.sprite.width/2);    
    }
 };
 const bg = {
    sprite : new Image(),
    x : 0,
    y : 0,
     draw : function() {
        y = parseFloat(scrn.height-scrn.height); //this.sprite.height);
        sctx.drawImage(this.sprite,this.x,y);
    },
     update : function() {
        if(state.curr != state.Play) return;
        // bg moving
        this.x -= dx / 3; //speed
        //this.x = this.x % (this.sprite.width/1.3);
        if (this.x + this.sprite.width < 0) {
            this.x = scrn.width;
        }
    }
 };

 const pipe = {
     top : {sprite : new Image()},
     bot : {sprite : new Image()},
     gap: 220, // gap between top and bottom obstacles
     moved: true,
     pipes : [],
     draw : function(){
        for(let i = 0;i<this.pipes.length;i++)
        {
            let p = this.pipes[i];
            sctx.drawImage(this.top.sprite,p.x,p.y)
            sctx.drawImage(this.bot.sprite,p.x,p.y+parseFloat(this.top.sprite.height)+this.gap)
        }
     },
     update : function(){
         if(state.curr!=state.Play) return;
         if(frames % pipeSpawnSpeed == 0)
         {
             this.pipes.push({x:parseFloat(scrn.width), y:-210*Math.min(Math.random()+1, 1.8)});
         }
         this.pipes.forEach(pipe=>{
             pipe.x -= dx;
         })

         if(this.pipes.length && this.pipes[0].x < -this.top.sprite.width)
         {
            this.pipes.shift();
            this.moved = true;
         }

     }

 };
 const bird = {
    animations :
        [
            {sprite : new Image()},
            {sprite : new Image()},
            {sprite : new Image()},
            {sprite : new Image()},
        ],
    dead : {sprite : new Image()},
    rotatation : 0,
    x : 150,
    y : scrn.height / 2.3,
    speed : 0,
    gravity : .125,
    thrust : 3.6,
    frame: 0,
    isDead : false,

    draw : function() {
        let h = this.animations[this.frame].sprite.height;
        let w = this.animations[this.frame].sprite.width;
        sctx.save();
        sctx.translate(this.x,this.y);
        sctx.rotate(this.rotatation*RAD);
        if (!this.isDead) {  // draw bird
            sctx.drawImage(this.animations[this.frame].sprite,-w/2,-h/2);
        } else {
            sctx.drawImage(this.dead.sprite,-w/2,-h/2);
        }
        sctx.restore();
    },

    update : function() {
        let r = parseFloat( this.animations[0].sprite.width)/2;
        switch (state.curr) {
            case state.getReady :
                this.rotatation = 0;
                this.y +=(frames%10==0) ? Math.sin(frames*RAD) : 0;
                this.frame += (frames%10==0) ? 1 : 0;
                break;
            case state.Play :
                this.frame += (frames%5==0) ? 1 : 0; // animate bird ?
                this.y += this.speed;
                this.setRotation()
                this.speed += this.gravity;
                setCounter();
                if(this.y + r  >= gnd.y || this.collisioned())
                {
                    state.curr = state.gameOver;
                }
                
                break;
            case state.gameOver : 
                this.frame = 1;
                if(this.y + r  < gnd.y) {
                    this.y += this.speed;
                    this.setRotation()
                    this.speed += this.gravity*2;
                }
                else { // frank on ground, dead
                this.isDead = true;
                this.speed = 0;
                this.y = gnd.y-r;
                this.rotatation = 90;
                if(!SFX.played) {
                    SFX.die.play();
                    SFX.played = true;
                }
                }
                
                break;
        }
        this.frame = this.frame%this.animations.length;       
    },
    flap : function(){
        if(this.y > 0)
        {
            SFX.flap.play();
            this.speed = -this.thrust;
        }
    },
    setRotation : function(){
        if(this.speed <= 0) {
            this.rotatation = Math.max(-25, -25 * this.speed/(-1*this.thrust));
        }
        else if(this.speed > 0 )
        {
            this.rotatation = Math.min(90, 90 * this.speed/(this.thrust*9));
        }
    },
    collisioned : function(){
        if(!pipe.pipes.length) return;
        let bird = this.animations[0].sprite;
        let x = pipe.pipes[0].x;
        let y = pipe.pipes[0].y;
        let r = bird.height/4 +bird.width/4;
        let roof = y + parseFloat(pipe.top.sprite.height);
        let floor = roof + pipe.gap;
        let w = parseFloat(pipe.top.sprite.width);
        if(this.x + r>= x + 20) // 20 px leeway on left of pipe
        {
            if(this.x + r < x + w - 12) // 20 px leeway on right of pipe
            {
                if(this.y - r <= roof - 10 || this.y + r>= floor + 10) // 10 px leeway on top/bottom of pipe
                {
                    // collision
                    SFX.hit.play();
                    return true;
                }

            }
            else if(pipe.moved)
            {
                UI.score.curr++;
                if (scoreCounter == 1) {
                    SFX.score1.play();
                    scoreCounter = 0;
                } else {
                    SFX.score2.play();
                    scoreCounter = 1;
                }
                
                pipe.moved = false;
            }
        }
    }
 };
 const UI = {
        getReady : {sprite : new Image()},
        gameOver : {sprite : new Image()},
        tap :
        [
            {sprite : new Image()},
            {sprite : new Image()}
        ],
    score : {
        curr : 0,
        best : 0,
    },
    x :0,
    y :0,
    tx :0,
    ty :0,
    frame : 0,
    draw : function() {
        switch (state.curr) {
            case state.getReady :
                this.y = parseFloat(scrn.height-this.getReady.sprite.height)/2;
                this.x = parseFloat(scrn.width-this.getReady.sprite.width)/2;
                this.tx = parseFloat(scrn.width - this.tap[0].sprite.width)/2;
                this.ty = this.y + this.getReady.sprite.height- this.tap[0].sprite.height;
                sctx.drawImage(this.getReady.sprite,this.x,this.y);
                sctx.drawImage(this.tap[this.frame].sprite,this.tx,this.ty);
                break;
            case state.gameOver :
                this.y = parseFloat(scrn.height-this.gameOver.sprite.height)/2;
                this.x = parseFloat(scrn.width-this.gameOver.sprite.width)/2;
                this.tx = parseFloat(scrn.width - this.tap[0].sprite.width)/2;
                this.ty = this.y + this.gameOver.sprite.height- this.tap[0].sprite.height;
                sctx.drawImage(this.gameOver.sprite,this.x,this.y);
                sctx.drawImage(this.tap[this.frame].sprite,this.tx,this.ty);
                break;
        }
        this.drawScore();
    },
    drawScore : function() {
            sctx.fillStyle = "#FFFFFF";
            sctx.strokeStyle = "#FFFFFF";
        switch (state.curr) {
            case state.Play :
                sctx.lineWidth = "0.1";
                sctx.font = "26px balsamiq sans";
                sctx.fillText(this.score.curr,scrn.width/2-5,50);
                sctx.strokeText(this.score.curr,scrn.width/2-5,50);
                break;
            case state.gameOver :
                    sctx.lineWidth = "0.1";
                    sctx.font = "20px Balsamiq sans";
                    let sc = `SCORE :     ${this.score.curr}`;
                    try {
                        this.score.best = Math.max(this.score.curr,localStorage.getItem("best"));
                        localStorage.setItem("best",this.score.best);
                        let bs = `BEST :        ${this.score.best}`;
                        sctx.fillText(sc,scrn.width/2-80,scrn.height/2+0);
                        sctx.strokeText(sc,scrn.width/2-80,scrn.height/2+0);
                        sctx.fillText(bs,scrn.width/2-80,scrn.height/2+30);
                        sctx.strokeText(bs,scrn.width/2-80,scrn.height/2+30);
                    }
                    catch(e) {
                        sctx.fillText(sc,scrn.width/2-85,scrn.height/2+15);
                        sctx.strokeText(sc,scrn.width/2-85,scrn.height/2+15);
                    }
                    
                break;
        }
    },
    update : function() {
        if(state.curr == state.Play) return;
        this.frame += (frames % 10==0) ? 1 :0;
        this.frame = this.frame % this.tap.length;
    }
 };

 function setCounter() {
    counter ++;
    if (counter % 100 == 0) {
        dx += 0.1;
        //console.log("speed = " + dx)

        if (pipe.gap > 140) {
            pipe.gap -= 2;
        }
        //console.log("pipe gap = " + pipe.gap)
    }
    if (counter % 1000 == 0) {
        if (pipeSpawnSpeed > 50 ) {
            pipeSpawnSpeed -= 10;
        }
        //console.log("pipe spawn rate = 1/" + pipeSpawnSpeed)
    }
 }

gnd.sprite.src="img/cave_ground.png";
gnd2.sprite.src="img/cave_ground.png";
bg.sprite.src="img/cave_background_new.png";
pipe.top.sprite.src="img/cave_top_obstacle.png";
pipe.bot.sprite.src="img/cave_bottom_obstacle.png";
UI.gameOver.sprite.src="img/well_done.png";
UI.getReady.sprite.src="img/tap_to_start.png";
UI.tap[0].sprite.src="img/tap0.png";
UI.tap[1].sprite.src="img/tap1.png";
bird.animations[0].sprite.src="img/frank_wings_middle.png";
bird.animations[1].sprite.src="img/frank_wings_down.png";
bird.animations[2].sprite.src="img/frank_wings_up.png";
bird.animations[3].sprite.src="img/frank_wings_middle.png";
bird.dead.sprite.src="img/frank_laugh.png";
SFX.start.src = "sfx/start.wav";
SFX.flap.src = "sfx/flap.wav";
SFX.score1.src = "sfx/bloop.wav";
SFX.score2.src = "sfx/bloop.wav";
SFX.hit.src = "sfx/hit.wav";
SFX.die.src = "sfx/die.wav";

resizeCanvas(); 
gameLoop();

function gameLoop() { 
    update();
    draw();
    frames++;
    requestAnimationFrame(gameLoop);
}

function update() {    
    bird.update();  
    gnd.update();
    gnd2.update();
    bg.update();
    pipe.update();
    UI.update();
}

function draw() {
    sctx.fillStyle = "#564d48"; //bg color
    sctx.fillRect(0,0,scrn.width,scrn.height);
    bg.draw();
    pipe.draw();

    bird.draw();
    gnd.draw();
    gnd2.draw();
    UI.draw();
}