class piece{
    constructor(game, col, row, img){
        this.game = game;
        this.col = col;
        this.row = row;

        this.x = 3 + this.col * PIECE_SIZE;
        this.y = GAME_HEIGHT - GAME_WIDTH + 3 + (this.row-1) * PIECE_SIZE;
        
        this. img = img;
    }

    update(){
        let targetX = 3 + this.col * PIECE_SIZE;
        let targetY = GAME_HEIGHT - GAME_WIDTH + 3 + (this.row-1) * PIECE_SIZE;
        let spaceX = Math.abs(targetX-this.x);
        let spaceY = Math.abs(targetY-this.y);
        if (spaceX>15) {
            if (targetX > this.x) {
                this.x+=15;
            } else if (targetX < this.x){
                this.x=this.x-15;
            }
        } else {
            if (targetX > this.x) {
                this.x+=spaceX;
            } else if (targetX < this.x){
                this.x-=spaceX;
            }
        }
    
        if (spaceY>15) {
            if (targetY > this.y) {
                this.y+=15;
            } else if (targetY < this.y){
                this.y-=15;
            }
        } else {
            if (targetY > this.y) {
                this.y+=spaceY;
            } else if (targetY < this.y){
                this.y-=spaceY;
            }
        }
    }

    draw(){
        this.game.ctx.drawImage(
            this.img,
            0,
            0,
            PIECE_SIZE,
            PIECE_SIZE,
            this.x,
            this.y,
            PIECE_SIZE,
            PIECE_SIZE,
        );
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "black";
        this.game.ctx.rect(this.x, this.y, PIECE_SIZE, PIECE_SIZE);
        this.game.ctx.stroke();
    }
}