const file1 = document.getElementById('easy') || null;
const file2 = document.getElementById('medium') || null;
var PIECE_SIZE;
var GAME_HEIGHT = document.body.clientHeight;
var GAME_WIDTH = document.body.clientWidth;
var n = 3;
var HeightImageReal, HeightImageFake;  
var WallColor;
var time = 0;
var isGameFinished = false, isPaused = false;
var rightPressed = leftPressed = upPressed = downPressed = false;
var sizeIcon;
var isMuted = false;
var audioElement = document.getElementById('audioGame');
var gameSave;
const PARTICLE_SIZE = 5;
const PARTICLE_CHANGE_SIZE_SPEED = 0.07;
const PARTICLE_CHANGE_SPEED = 0.5;
const ACCELEBRATION = 0.12;
const DOT_CHANGE_SIZE_SPEED = 0.2;
const DOT_CHANGE_ALPHA_SPEED = 0.07;
const PARTICLE_MIN_SPEED = 8;
const NUMBER_PARTICLE_PER_BULLET = 20;
var pickUp = new Audio("../mp3/pickup.mp3"); 
var pickDown = new Audio("../mp3/pickdown.mp3"); 
var youWin = new Audio("../mp3/win.mp3"); 
var youLost = new Audio("../mp3/lost.mp3"); 

if(file1!=null) {
    n = 3;
    FileImage = '../img/easy.png';
    gameSave = 'easy';
    WallColor = '#71be34';
} else if(file2!=null) {
    n = 5;
    FileImage = '../img/medium.png';
    gameSave = 'medium';
    WallColor = '#ffb702';
} else {
    n = 7;
    FileImage = '../img/hard.png';
    gameSave = 'hard';
    WallColor = '#ff623d';
}

class particle{
    constructor(bullet, deg){
        this.bullet = bullet;
        this.ctx = bullet.ctx;
        this.deg = deg;
        this.x = this.bullet.x;
        this.y = this.bullet.y;
        this.color = this.bullet.color;
        this.size = PARTICLE_SIZE;
        this.speed = Math.random() * 4 + PARTICLE_MIN_SPEED;
        this.speedX = 0;
        this.speedY = 0;
        this.fallSpeed = 0;

        this.dots = [];
    }

    update(){
        this.speed -= PARTICLE_CHANGE_SPEED;
        if (this.speed < 0) {
            this.speed = 0;
        }

        this.fallSpeed += ACCELEBRATION;

        this.speedX = this.speed * Math.cos(this.deg);
        this.speedY = this.speed * Math.sin(this.deg) + this.fallSpeed;

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > PARTICLE_CHANGE_SIZE_SPEED) {
            this.size -= PARTICLE_CHANGE_SIZE_SPEED;
        }

        if (this.size > 0){
            this.dots.push({
                x: this.x,
                y: this.y,
                alpha: 1,
                size: this.size
            });
        }

        this.dots.forEach(dot => {
            dot.size -= DOT_CHANGE_SIZE_SPEED;
            dot.alpha -= DOT_CHANGE_ALPHA_SPEED;
        });

        this.dots = this.dots.filter( dot => {
            return dot.size > 0;
        });

        if (this.dots.length == 0) {
            this.remove();
        }
    }

    remove(){
        this.bullet.particles.splice(this.bullet.particles.indexOf(this), 1);
    }

    draw(){
        this.dots.forEach( dot => {
            this.ctx.fillStyle = 'rgba('+this.color+',1)';
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.size, 0, 2*Math.PI);
            this.ctx.fill();
        });
    }
}

class bullet{
    constructor(fireworks){
        this.fireworks = fireworks;
        this.ctx = fireworks.ctx;
        this.x = Math.random() * GAME_WIDTH;
        this.y = Math.random() * GAME_HEIGHT / 3 * 2;
        this.color = Math.floor(Math.random() * 255) + ',' +
                    Math.floor(Math.random() * 255) + ',' +
                    Math.floor(Math.random() * 255);

        this.particles = [];
        
        let bulletDeg = Math.PI *2 /NUMBER_PARTICLE_PER_BULLET;
        for(let i = 0; i<NUMBER_PARTICLE_PER_BULLET; i++) {
            let newParticle = new particle(this, i * bulletDeg);
            this.particles.push(newParticle);
        }
    }

    remove(){
        this.fireworks.bullets.splice(this.fireworks.bullets.indexOf(this), 1);
    }

    update(){
        if (this.particles.length ==0) {
            this.remove();
        }
        this.particles.forEach(particle => particle.update());
    }

    draw(){
        this.particles.forEach(particle => particle.draw());
    }
}

class fireworks{
    constructor(){  
        this.canvas = g.canvas;
        this.ctx = g.canvas.getContext('2d');
        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;

        this.bullets = [];

        setInterval(() => {
            let newBullet = new bullet(this);
            this.bullets.push(newBullet);
        }, 300);        

        this.loop();
    }

    loop() {
        this.bullets.forEach(bullet => bullet.update());
        this.draw();
        setTimeout( () => this.loop(), 20);
    }

    draw(){
        g.draw();
        this.ctx.fillStyle = '#ff0000';
        this.ctx.font = `bold ${sizeIcon*15}px Nova Square`;
        this.ctx.fillText("YOU WIN!", GAME_WIDTH/8, GAME_HEIGHT/2+GAME_HEIGHT/10);
        this.bullets.forEach( bullet => bullet.draw());
    }
}

class game{
    constructor(){
        this.init();
        this.loadImage();
        this.loop();
        this.listenMouseEvent();
        this.listenKeyEvent();
    }

    init(){
        this.canvas = document.getElementById('myCanvas');
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;
        this.img = null;
        this.pieces =[];

        this.selectedPiece = {};
        this.emptyPiece = {row : 0, col : 0};
            
        document.body.appendChild(this.canvas);
    }

    loadImage(){
        this.img = new Image();
        this.img.src = FileImage;
        this.img.onload = () => {
            HeightImageReal = this.img.height;
            HeightImageFake = GAME_WIDTH-6;
            PIECE_SIZE =  HeightImageFake/n;
            this.startGame();
        }
        this.iconHome = new Image();
        this.iconHome.src = "../img/home.png";
        this.iconBack = new Image();
        this.iconBack.src = "../img/back.png";
        this.iconPause= new Image();
        this.iconPause.src = "../img/pause.png";
        this.iconNmute= new Image();
        this.iconNmute.src = "../img/notMuted.png";
        this.iconMute= new Image();
        this.iconMute.src = "../img/isMuted.png";
    }
    
    getMousePose(event){
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top 
        }
    }

    getCorByMousePosition(mousePos) {
        return {
            col : Math.floor((mousePos.x - 3) / PIECE_SIZE),
            row : Math.floor((mousePos.y - GAME_HEIGHT + GAME_WIDTH - 3) / PIECE_SIZE + 1)
        }
    }
    
    pointer(){
        let mousePos = this.getMousePose(event);
        if (!isPaused) {
            if ((mousePos.x >= 7*sizeIcon && mousePos.x <= 21*sizeIcon && mousePos.y >= 5 && mousePos.y <= 5+10*sizeIcon) || 
            (mousePos.x >= 27*sizeIcon && mousePos.x <= 37*sizeIcon && mousePos.y >= 5 && mousePos.y <= 5+10*sizeIcon)) {
                document.body.style.cursor = "pointer";
                return;
            }
        }

        if (isPaused) {
            if (mousePos.x >= 15*sizeIcon && mousePos.x <= 32.5*sizeIcon && mousePos.y >= GAME_HEIGHT/2 && mousePos.y <= GAME_HEIGHT/2+12.5*sizeIcon) {
                document.body.style.cursor = "pointer";
                return;
            }
            if (mousePos.x >= 70*sizeIcon && mousePos.x <= 87.5*sizeIcon && mousePos.y >= GAME_HEIGHT/2 && mousePos.y <= GAME_HEIGHT/2+12.5*sizeIcon) {
                document.body.style.cursor = "pointer";
                return;
            }
            if (isMuted && mousePos.x >= 42*sizeIcon && mousePos.x <= 58.25*sizeIcon && mousePos.y >= GAME_HEIGHT/2 && mousePos.y <= GAME_HEIGHT/2+12.5*sizeIcon) {
                document.body.style.cursor = "pointer";
                return;
            } else if (!isMuted && mousePos.x >= 44*sizeIcon && mousePos.x <= 59*sizeIcon && mousePos.y >= GAME_HEIGHT/2 && mousePos.y <= GAME_HEIGHT/2+12.5*sizeIcon) {
                document.body.style.cursor = "pointer";
                return;
            }
        }

        document.body.style.cursor = "auto";
    }

    listenMouseEvent(){
        this.canvas.addEventListener('mousemove', () => this.pointer());
        this.canvas.addEventListener('mousedown', () => this.mouseDown());
        this.canvas.addEventListener('mouseup', () => this.mouseUp());
    }

    mouseDown(){
        let mousePos = this.getMousePose(event);
        this.selectedPiece = this.getCorByMousePosition(mousePos);
        if (!isPaused && !isGameFinished) pickUp.play();
    }

    mouseUp(){
        let mousePos = this.getMousePose(event);
        if (!isPaused) {
            if (mousePos.x >= 7*sizeIcon && mousePos.x <= 21*sizeIcon && mousePos.y >= 5 && mousePos.y <= 5+10*sizeIcon) {
                return window.location.assign('../Puzzle.html');
            }
            if (mousePos.x >= 27*sizeIcon && mousePos.x <= 37*sizeIcon && mousePos.y >= 5 && mousePos.y <= 5+10*sizeIcon) {
                isPaused = true;
                return;
            }
            pickDown.play();
        }

        if (isPaused) {
            if (mousePos.x >= 15*sizeIcon && mousePos.x <= 32.5*sizeIcon && mousePos.y >= GAME_HEIGHT/2 && mousePos.y <= GAME_HEIGHT/2+12.5*sizeIcon) {
                return window.location.assign('../Puzzle.html');
            }
            if (mousePos.x >= 70*sizeIcon && mousePos.x <= 87.5*sizeIcon && mousePos.y >= GAME_HEIGHT/2 && mousePos.y <= GAME_HEIGHT/2+12.5*sizeIcon) {
                isPaused = false;
                return;
            }
            if (isMuted && mousePos.x >= 42*sizeIcon && mousePos.x <= 58.25*sizeIcon && mousePos.y >= GAME_HEIGHT/2 && mousePos.y <= GAME_HEIGHT/2+12.5*sizeIcon) {
                isMuted = false;
                audioElement.play();
                return;
            } else if (!isMuted && mousePos.x >= 44*sizeIcon && mousePos.x <= 59*sizeIcon && mousePos.y >= GAME_HEIGHT/2 && mousePos.y <= GAME_HEIGHT/2+12.5*sizeIcon) {
                isMuted = true;
                audioElement.pause();
                return;
            }
        }

        let mouseUpCor = this.getCorByMousePosition(mousePos);
        if ((mouseUpCor.row != this.emptyPiece.row || mouseUpCor.col != this.emptyPiece.col) &&
            (mouseUpCor.row != this.selectedPiece.row || mouseUpCor.col != this.selectedPiece.col)) {
                return;
        }

        if (Math.abs(this.selectedPiece.row - mouseUpCor.row) + 
            Math.abs(this.selectedPiece.col - mouseUpCor.col) > 1 ||  
            this.selectedPiece.row<0 || this.selectedPiece.row>n ||
            (this.selectedPiece.row==0 && this.selectedPiece.col!=0) ||
            this.selectedPiece.col<0 || this.selectedPiece.col>=n) {
                return;
            }
        
        if (!isGameFinished && !isPaused) {
            if (mouseUpCor.row == this.selectedPiece.row && mouseUpCor.col == this.selectedPiece.col) {
                if (Math.abs(this.selectedPiece.row - this.emptyPiece.row) + Math.abs(this.selectedPiece.col - this.emptyPiece.col) === 1) this.swapPieces(this.selectedPiece, this.emptyPiece);
                else return;
            } else this.swapPieces(this.selectedPiece, mouseUpCor);
        }
        if (this.checkGame()) {
            isGameFinished = true;
            youWin.play();
            var f= new fireworks();
            audioElement.pause();
            setTimeout(() => {
                let value = `${time}`;
                while (value.length < 4) value='0'+value;
                value = gameSave[0] + value;
                localStorage.setItem('mostRecentScore', value);
                return window.location.assign('end.html');
            }, 4000);
        }
    }

    swapByKey(r) {
        if (isGameFinished || isPaused) return;
        let willMove = null;
        switch(r) {
            case 0:
                if (this.emptyPiece.row > 1 || this.emptyPiece.row==1 && this.emptyPiece.col==0){
                    willMove = {row: this.emptyPiece.row-1, col: this.emptyPiece.col};
                }
                break;
            case 1:
                if (this.emptyPiece.row < n){
                    willMove = {row: this.emptyPiece.row+1, col: this.emptyPiece.col};
                }
                break;
            case 2:
                if (this.emptyPiece.col > 0){
                    willMove = {row: this.emptyPiece.row, col: this.emptyPiece.col-1};
                }
                break;
            default:
                if (this.emptyPiece.col < n-1 && this.emptyPiece.row>=1){
                    willMove = {row: this.emptyPiece.row, col: this.emptyPiece.col+1};
                }
        }
        if (willMove != null){
            this.swapPieces(willMove, this.emptyPiece);
        }
    }

    keyDownHandler(event) {
        if (isGameFinished || isPaused) return; 
        if (event.keyCode == 39) {
            rightPressed = true;
            pickUp.play();
        }
        else if (event.keyCode == 37) {
            leftPressed = true;
            pickUp.play();
        }
        else if (event.keyCode == 38) {
            upPressed = true;
            pickUp.play();
        }
        else if (event.keyCode == 40) {
            downPressed = true;
            pickUp.play();
        }
    }

    keyUpHandler(event) {
        if (isGameFinished || isPaused) return;
        if (event.keyCode == 39) {
            rightPressed = false;
            g.swapByKey(2);
            pickDown.play();
        }
        else if (event.keyCode == 37) {
            leftPressed = false;
            g.swapByKey(3);
            pickDown.play();
        }
        else if (event.keyCode == 38) {
            upPressed = false;
            g.swapByKey(1);
            pickDown.play();
        }
        else if (event.keyCode == 40) {
            downPressed = false;
            g.swapByKey(0);
            pickDown.play();
        }
        if (g.checkGame()) {
            isGameFinished = true;
            youWin.play();
            var f= new fireworks();
            audioElement.pause();
            setTimeout(() => {
                let value = `${time}`;
                while (value.length < 4) value='0'+value;
                value = gameSave[0] + value;
                console.log(value);
                localStorage.setItem('mostRecentScore', value);
                return window.location.assign('end.html');
            }, 4000);
        }
    }

    listenKeyEvent(){
        document.addEventListener('keydown', this.keyDownHandler, false);
        document.addEventListener('keyup', this.keyUpHandler, false);
    }
    
    
    swapPieces(piece1, piece2){
        let tg = this.posWin[piece1.row][piece1.col];
        this.posWin[piece1.row][piece1.col] = this.posWin[piece2.row][piece2.col];
        this.posWin[piece2.row][piece2.col] = tg;

        let tmp = this.pieces[piece1.row][piece1.col];
        this.pieces[piece2.row][piece2.col] = tmp;
        this.pieces[piece1.row][piece1.col] = null;

        this.pieces[piece2.row][piece2.col].row = piece2.row;
        this.pieces[piece2.row][piece2.col].col = piece2.col;

        this.emptyPiece = piece1;
    }

    startGame(){

        this.pieces = [
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
        ];

        this.posWin = [
            [{row: 0, cos:0}, {}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}, {}]
        ]
        
        for(let row = 0; row < n; row++){
            for(let col = 0; col < n; col++){
                let pieceCanvas = document.createElement('canvas');
                pieceCanvas.width = PIECE_SIZE;
                pieceCanvas.height = PIECE_SIZE;
                let pieceCtx = pieceCanvas.getContext('2d');
                pieceCtx.drawImage(
                    this.img,
                    col * PIECE_SIZE / HeightImageFake * HeightImageReal,
                    row * PIECE_SIZE / HeightImageFake * HeightImageReal,
                    PIECE_SIZE / HeightImageFake * HeightImageReal,
                    PIECE_SIZE / HeightImageFake * HeightImageReal,

                    0,
                    0,
                    PIECE_SIZE,
                    PIECE_SIZE
                );

                //creat piece
                let newPiece = new piece(this, col, row+1, pieceCanvas);
                this.pieces[row+1][col] = newPiece;
                this.posWin[row+1][col] = {row: row+1, col : col};
            }
        }

        //randomGame
        for(let randomTime = 0; randomTime < 10000; randomTime ++) {
            let r = Math.round(Math.random()*3);
            this.swapByKey(r);
        }
    }

    loop(){
        this.update();
        this.draw();
        setTimeout(() => {
            this.loop();
        }, 50);
    }

    update(){
        this.pieces.forEach(row => {
            row.forEach(piece => {
                if (piece !== null){
                    piece.update();
                }
            })
        })
    }

    timeOver(){
        isGameFinished = true;
        youLost.play();
        this.ctx.fillStyle = "#ff0000";
        this.ctx.font = `${sizeIcon*16}px Nova Square`;
        this.ctx.fillText("TIME OVER!!!" , 5, GAME_HEIGHT/2);
        audioElement.pause();
        setTimeout(() => {
            return window.location.assign('../Puzzle.html');
        }, 3000);
    }

    drawtime(){
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        let strminutes, strseconds;
        if (minutes<10) {
            strminutes = `0${minutes}`;
        } else strminutes = `${minutes}`;
        if (seconds<10) {
            strseconds = `0${seconds}`;
        } else strseconds = `${seconds}`;
        this.ctx.fillStyle = "#000000";
        this.ctx.font = `bold ${sizeIcon*8.3}px Nova Square`;
        this.ctx.fillText(strminutes+ " : " + strseconds, sizeIcon*8.8, (GAME_HEIGHT-GAME_WIDTH-PIECE_SIZE+3)*0.6);
    }

    draw(){
        if (time>=3600) return;
        this.ctx.fillStyle = WallColor;
        this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        if(isPaused) {
            this.ctx.fillStyle = "#000000";
            this.ctx.font = `bold ${sizeIcon*14}px Nova Square`;
            this.ctx.fillText("PAUSED", GAME_WIDTH/4, GAME_HEIGHT/3);
            this.ctx.drawImage(this.iconHome, 0, 0, this.iconHome.width, this.iconHome.height, sizeIcon*15, GAME_HEIGHT/2, 17.5*sizeIcon, 12.5*sizeIcon);
            this.ctx.drawImage(this.iconBack, 0, 0, this.iconBack.width, this.iconBack.height, 70*sizeIcon, GAME_HEIGHT/2, 17.5*sizeIcon, 12.5*sizeIcon);
            if (!isMuted) this.ctx.drawImage(this.iconNmute, 0, 0, this.iconNmute.width, this.iconNmute.height, 42*sizeIcon, GAME_HEIGHT/2, 16.25*sizeIcon, 12.5*sizeIcon)
            else this.ctx.drawImage(this.iconMute, 0, 0, this.iconMute.width, this.iconMute.height, 44*sizeIcon, GAME_HEIGHT/2, 15*sizeIcon, 12.5*sizeIcon);
            return;
        }

        this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, 
            this.canvas.width-3-this.canvas.width/2, 3, this.canvas.width/2, this.canvas.width/2);
        
        sizeIcon = GAME_WIDTH/100;
        this.ctx.drawImage(this.iconHome, 0, 0, this.iconHome.width, this.iconHome.height, sizeIcon*7, 5, 14*sizeIcon, 10*sizeIcon);
        this.ctx.drawImage(this.iconPause, 0, 0, this.iconPause.width, this.iconPause.height, 27*sizeIcon, 5, 14*sizeIcon, 10*sizeIcon);

        this.ctx.beginPath();
        for(let row = 0; row <= n; row++){
            for(let col = 0; col < n; col++)
                if (row!=0 || (row==0 && col==0)) {
                    this.ctx.rect(3+col*PIECE_SIZE, this.canvas.height-this.canvas.width+3+(row-1)*PIECE_SIZE, 
                        PIECE_SIZE, PIECE_SIZE);
                }
        }
        this.drawtime();
        this.ctx.stroke();

        this.pieces.forEach(row => {
            row.forEach(piece => {
                if (piece !== null){
                    piece.draw();
                }
            })
        })
    }

    checkGame(){
        let isSuccess = true;
        if (this.emptyPiece.row!=0 || this.emptyPiece.col!=0) {
            isSuccess = false;
            return isSuccess;
        }
        for(let row=1; row<=n; row++){
            for(let col=0; col<n; col++) {       
                if (row != this.posWin[row][col].row ||
                    col != this.posWin[row][col].col) {
                        isSuccess = false;
                        return isSuccess;
                    }
            }
        }
        return isSuccess;
    }
}

//time count
setInterval(() =>{
    if (isPaused==false && isGameFinished==false) {
        time++;
        if (time>=3600) g.timeOver();
    }}, 1000);

var g = new game();