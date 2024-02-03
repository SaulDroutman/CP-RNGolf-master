class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
        this.count = 0
         this.score = 0
        this.percent= 100
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X_MIN =100
        this.SHOT_VELOCITY_X_MAX =500
        this.SHOT_VELOCITY_Y_MIN=700
        this.SHOT_VELOCITY_Y_MAX=1100
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {

        
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            align: 'right',
            padding: {
              top: 5,
              bottom: 5,
            },
         
          }
        
        this.scoreLeft = this.add.text(width /10,height/15,"score: "+this.score,scoreConfig)
        this.countLeft = this.add.text(width /10,height/9,"count: "+this.count,scoreConfig)
        this.perLeft = this.add.text(width /10,height/6.4,"accuracy: "+this.percent+"%",scoreConfig)


        // add cup
        this.cup = this.physics.add.sprite(width /2, height/10, 'cup')
        this.cup.body.setCircle(this.cup.width /4)
        this.cup.body.setOffset(this.cup.width/4)
        this.cup.body.setImmovable(true)
        
        // add ball

        this.ball = this.physics.add.sprite(width/2, height- height/10,'ball' )
           
        //debug
        //this.ball = this.physics.add.sprite(width /2, (height/10)-100 ,'ball' )
        
        this.ball.body.setCircle(this.ball.width/2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0,height/4,'wall')
        wallA.setX(Phaser.Math.Between(0+wallA.width/2, width - wallA.width/2))
        wallA.body.setImmovable(true)

        let wallB = this.physics.add.sprite(0,height/2,'wall')
        wallB.setX(Phaser.Math.Between(0+wallB.width/2, width - wallB.width/2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA,wallB])

        // add one-way

        this.oneWay = this.physics.add.sprite(width/2, height/4*3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 +this.oneWay.width/2, width-this.oneWay.width/2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirectionX = pointer.x <= this.ball.x ? 1 : -1
            let shotDirectionY = pointer.y <= this.ball.y ? 1 : -1
            this.ball.body.setVelocityX(Phaser.Math.Between(this.SHOT_VELOCITY_X_MIN,this.SHOT_VELOCITY_X_MAX )* shotDirectionX )
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN,this.SHOT_VELOCITY_Y_MAX) * shotDirectionY) 
            this.count++
        })

        // cup/ball collision
        this.physics.add.collider(this.ball,this.cup, (ball,cup)=> {
            this.score ++
            this.reset()
        })

        // ball/wall collision

        this.physics.add.collider(this.ball,this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball,this.oneWay)
    }

    update() {
        if(this.count!=0){
            this.percent= Math.round((this.score/this.count)*100)
        }
        this.countLeft.text ="count: "+this.count
        this.scoreLeft.text ="score: "+this.score
        this.perLeft.text = "accuracy: "+this.percent+"%"

    }
    reset(){
        this.ball.body.setVelocity(0)
        this.ball.setPosition(width/2, height- height/10)
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[X] Add ball reset logic on successful shot
[X] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[ ] Make one obstacle move left/right and bounce against screen edges
[X] Create and display shot counter, score, and successful shot percentage
*/