var game = new Phaser.Game(800, 600, Phaser.AUTO, '',
    { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
   // game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('button', 'assets/sky.png', 193, 71);
}

var color1 = 0;
var color2 = 1;

var player;
var platforms;
var cursors;
var box;
var index = 0;
var canMoveRight = false;
var moveCount = 0;
var space = " ";

var score = 0;

var scoreText;
var inputText;
//var collectText;

var begin = 0;
var end  = 1;

var counter = 0.0;

var canMove = true;
var canType = true;

var finalPos = 0;

var theWord;

var button;

function create() {
    
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.setShowAll();
        window.addEventListener('resize', function () {  this.game.scale.refresh();});
    this.game.scale.refresh();

    //  Sets world bounds
    game.world.setBounds(0,0,4000,600);

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(getRand(-150,400), getRand(400,800), 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(getRand(-150,400), getRand(400,800), 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the playe
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our one animation, walking right.
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    game.camera.follow(player);
    
    //getWord();
    theWord = "nice black flower boom hola freedom chocolate milk is the best ";
    
    //  The score
    scoreText = game.add.text(32, 16, theWord, { font: "32px Verdana", fill: '#000' });
    inputText = game.add.text(380, 200, '', { font: "38px Verdana", fontWeight: 'bold', fill: '#000' });

    //makes initial word yellow
    while (!(theWord.substring(color1, color2) == space)){

        color1++;
        color2++;
    }  

    scoreText.addColor('yellow', 0);
    scoreText.addColor('black', color1);

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addCallbacks(this, null, null, keyPress);
    
   // inputText.fixedToCamera = true;
    //scoreText.fixedToCamera = true;
    // collectText.fixedToCamera = true;
}

function update() {

    inputText.x = player.x;
    game.camera.follow(player);

    //  Collide the player with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(player, box);


    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    // Controls input from arrow buttons
    if (cursors.left.isDown && canMove)
    {
        //nothing happens
    }
    else if (canMoveRight)
    {
        
        if((player.x - counter) >= 200){
           
            counter+=200;
            
            var ground2 = platforms.create(counter*2, game.world.height - 64, 'ground');

            //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            ground2.scale.setTo(2, 2);

            //  This stops it from falling away when you jump on it
            ground2.body.immovable = true;

            //add sky
            sky = game.add.sprite(counter*2, 0, 'sky');
            game.world.sendToBack(sky);

        }
        
        //  Move to the right
        player.body.velocity.x = 90;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && canMove)
    {
        player.body.velocity.y = -350;
    }

    if (canMoveRight) {
        moveCount++;
        if(moveCount > 70){
            canMoveRight = false;
            moveCount = 0;
            //  Stand still
            player.animations.stop();
            player.frame = 4;
        }
    }
}


function keyPress(char){
    if(canType){
        if(game.input.keyboard.event.keyCode == 8){
            inputText.text = inputText.text.substring(0,inputText.text.length - 1);
        }else if(game.input.keyboard.event.keyCode == 32){
            var userText = inputText.text;
            checkWord(userText);
        }else{
            inputText.text += char;
            var code = char.charCodeAt(0);
        }
    }    
}

function checkWord(userWord){

    while (!(theWord.substring(begin, end) == space)){

        begin++;
        end++;
    }  

     if (theWord.length != begin + 1){
        begin2 = begin + 1;
        end2=end + 1;
        while (!(theWord.substring(begin2, end2) == space)){

            begin2++;
            end2++;
        }  
    }

    if(theWord.substring(index, begin) == userWord){
        scoreText.addColor('green', index);
        scoreText.addColor('yellow', end);
        scoreText.addColor('black', end2);

        moveRight();
        console.log("words equal");
        index = end;
        console.log("index: " + index)
        begin = index;
        end = index + 1;
        emptyText();
    }
    else{
        console.log("words not equal");
        emptyText();
    }

    if (theWord.length == begin){
        canType = false;
    }

}


function emptyText(){
    inputText.text = "";
}

function getRand(min, max) {
  return Math.random() * (max - min) + min;
}

function moveRight() {

    finalPos = player.x + ((begin-index)*20);
    
    canMoveRight = true;
}


function move() {
    while (player.x < 200){
        canMove = true;
    }
    canMove = false;
}

function actionOnClick () {

    button.visible =! button.visible;

}

/*
function getWord(){

    $.ajax({
            url: "database.php",
            dataType: "text",
            success: function(data)
            {
                theWord = data;
            }
        });
}
*/