class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1 }){
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 7
    }

    draw(){
    //    c.fillStyle = '#ff000050'
    //    c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(
        this.image,
        this.framesCurrent * (this.image.width / this.framesMax),
        0,
        this.image.width / this.framesMax,
        this.image.height,
        this.position.x - 150,
        this.position.y - 110,
        (this.image.width / this.framesMax) * this.scale, 
        this.image.height * this.scale
        )
    }

    animateFrames(){
        this.framesElapsed++
        if(this.framesElapsed % this.framesHold === 0){
            if(this.framesCurrent < this.framesMax - 1){
                this.framesCurrent++
            }else{ this.framesCurrent = 0 }
        }
    }
    
    update(){
        this.draw()
        this.animateFrames()
    }
}

class Character extends Sprite {
    constructor({ position, velocity, damage = 0.25, color = 'red', offset, imageSrc, scale = 1, framesMax = 1, sprites, nameCode = 'Fighter' }){
        super({
            position,
            imageSrc,
            scale,
            framesMax
        })

        this.velocity = velocity
        this.height = 130
        this.width = 80
        this.lastKey = null
        this.damage = damage
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 150,
            height: 50
        }
        this.color = color
        this.nameCode = nameCode
        this.isAttacking
        this.health = 100
        this.death = false
        this.jumps = 0
        this.attackDirecton = null
    
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites

        for(const sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }
    
    update(){
        document.querySelector('#playerHealth').style.backgroundColor = player.color
        document.querySelector('#enemyHealth').style.backgroundColor = enemy.color
        this.draw()
        if(!this.death){
            c.font = '15px "Press Start 2P"'
            c.fillStyle = 'white'
            c.fillText(this.nameCode, this.position.x, this.position.y - 5)
            if(this.health < 100){
                c.strokeStyle = 'white'
                c.strokeRect(this.position.x, this.position.y, 100, 5);
                c.fillStyle = 'black'
                c.fillRect(this.position.x, this.position.y, 100, 5);
                if(this.health >= 0){
                    c.fillStyle = this.color
                    c.fillRect(this.position.x, this.position.y, this.health, 5);  
                }  
            }
        }
        if(this.isAttacking){
            c.fillStyle = 'transparent'
            c.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            )
        }
        if(!this.death){this.animateFrames()}

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + (this.height/2)

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
            this.canjump = true
            this.jumps = 0
        }else{ this.velocity.y += gravity }
        
        // Paredes
        if(this.position.x <= 0){
            this.position.x = 0
        }
        if(this.position.x + this.width>= canvas.width){
            this.position.x = canvas.width - this.width 
        }
    }
    attack(){
        if(this.attackDirecton != null){
            this.isAttacking = true
            setTimeout(()=>{
                this.isAttacking = false
            }, 100)
        }
    }
    switchSprite(sprite){
        //Si esta animacion esta en curso, no se detiene
        if(
            this.image === this.sprites.attackingRight.image &&
            this.framesCurrent < this.sprites.attackingRight.framesMax - 1
        ){ return }
        if(
            this.image === this.sprites.attackingLeft.image &&
            this.framesCurrent < this.sprites.attackingLeft.framesMax - 1
        ){ return }
        if(
            this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
        ){ return }
        //Muerte del personaje
        if(this.image === this.sprites.death.image){
            if(this.framesCurrent === this.sprites.death.framesMax - 1){
                this.death = true
            }
        }

        switch (sprite) {
            case 'idle':{
            if(this.image !== this.sprites.idle.image){
                this.image = this.sprites.idle.image
                this.framesMax = this.sprites.idle.framesMax
            }
            break;
            }
            case 'runLeft':{  
            if(this.image !== this.sprites.runLeft.image){
                this.image = this.sprites.runLeft.image
                this.framesMax = this.sprites.runLeft.framesMax
            } 
            break;
            }
            case 'runRight':{  
            if(this.image !== this.sprites.runRight.image){
                this.image = this.sprites.runRight.image
                this.framesMax = this.sprites.runRight.framesMax
            } 
            break;
            }
            case 'jumpingLeft':{  
            if(this.image !== this.sprites.jumpingLeft.image){
                this.image = this.sprites.jumpingLeft.image
                this.framesMax = this.sprites.jumpingLeft.framesMax
            } 
            break;
            }
            case 'jumpingRight':{  
            if(this.image !== this.sprites.jumpingRight.image){
                this.image = this.sprites.jumpingRight.image
                this.framesMax = this.sprites.jumpingRight.framesMax
            } 
            break;
            }
            case 'attackingLeft':{  
                if(this.image !== this.sprites.attackingLeft.image){
                this.image = this.sprites.attackingLeft.image
                this.framesMax = this.sprites.attackingLeft.framesMax
            } 
            break;
            }
            case 'attackingRight':{  
            if(this.image !== this.sprites.attackingRight.image){
                this.image = this.sprites.attackingRight.image
                this.framesMax = this.sprites.attackingRight.framesMax
            } 
            break;
            }
            case 'takeHit':{
            if(this.image !== this.sprites.takeHit.image){
                this.image = this.sprites.takeHit.image
                this.framesMax = this.sprites.takeHit.framesMax
            } 
            break;
            }
            case 'death':{
            if(this.image !== this.sprites.death.image){
                this.image = this.sprites.death.image
                this.framesMax = this.sprites.death.framesMax
            } 
            break;
            }
        }
    }
}