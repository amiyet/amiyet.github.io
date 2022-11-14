var handsEle, handsSprite, musicEle;

var sfx = {
    beckons: {
        "cmon_catch_me.wav": null,
        "catch_me.wav": null,
    },
    encouragements: {
        "you_almost_got_me.wav": null
    }
};

function loadSfx () {

    Object.keys(sfx).forEach(sfxGroup => {
        Object.keys(sfx[sfxGroup]).forEach(sfxFile => {
            let audioEle = document.createElement('audio');
            audioEle.src = sfxFile;
            sfx[sfxGroup][sfxFile] = audioEle;
        });
    });

}

function encourage() {
    var phrase = Object.keys(sfx.encouragements)[0];
    console.log(phrase);
    sfx.encouragements[phrase].play();
}

function beckon () {
    var phraseIndex = Math.round(Math.random());
    var phrase = Object.keys(sfx.beckons)[phraseIndex];
    console.log(phrase);
    sfx.beckons[phrase].play();
    setTimeout(beckon, (4000 * Math.random()) + 3000);
};

var DivSprite = function (ele, noOfFrames, durationMs) {
    this.ele = ele;
    this.noOfFrames = noOfFrames;
    this.maxFrame = noOfFrames - 1;
    this.frameWidthPercent = 100 / this.maxFrame;
    this.currentFrame = 0;
    this.animateForwardTimeout = null;
    this.animateBackwardTimeout = null;

}
DivSprite.prototype.next = function () {
    let nextFrame = this.currentFrame + 1;
    if (nextFrame > this.maxFrame) {
        return;
    } else {
        console.log((nextFrame * this.frameWidthPercent) + '%');
        this.ele.style.backgroundPositionX = (nextFrame * this.frameWidthPercent) + '%';
        this.currentFrame = nextFrame;
    }
};

DivSprite.prototype.animateForward = function () {
    if (this.animateBackwardTimeout) {
        cancelTimeout(this.animateBackwardTimeout);
    }

    console.log('HAND, anim forward, ' + 'currentFrame + 1', this.currentFrame + 1);
    if (this.currentFrame + 1 == this.maxFrame) {
        this.animateForwardTimeout = null;
        this.next();
    } else if (this.currentFrame + 1 <= this.maxFrame) {
        this.animateForwardTimeout = setTimeout(this.animateForward.bind(this), 333);
        this.next();
    }
};

DivSprite.prototype.previous = function () {
    let nextFrame = this.currentFrame - 1;
    if (nextFrame < 0) {
        return;
    } else {
        console.log((nextFrame * this.frameWidthPercent) + '%');
        this.ele.style.backgroundPositionX = (nextFrame * this.frameWidthPercent) + '%';
        this.currentFrame = nextFrame;
    }
};

DivSprite.prototype.animateBackward = function () {
    if (this.animateForwardTimeout) {
        clearTimeout(this.animateForwardTimeout);
    }

    console.log('HAND, anim backwards, ' + 'currentFrame - 1', this.currentFrame - 1);
    if (this.currentFrame - 1 == 0) {
        this.animateBackwardTimeout = null;
        this.previous();
        encourage();
    } else if (this.currentFrame - 1 >= 0) {
        this.animateBackwardTimeout = setTimeout(this.animateBackward.bind(this), 333);
        this.previous();
    }
}

function loadMusic () {
    musicEle = document.createElement('audio');
    musicEle.loop = true;

    musicEle.addEventListener('canplaythrough', (e) => {
        console.log('music: play');
        e.target.play();
    });
    musicEle.src = 'music.wav';
    
};

function run () {    
    //hide play button, prevent double interaction
    document.getElementById('play').disabled = 'disabled';
    document.getElementById('play').style.display = 'none';

    //setup hand sprite
    handsEle = document.getElementById('hands');
    handsSprite = new DivSprite(handsEle, 3);

    //set-up canvas
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    

    canvas.width = screen.width;
    canvas.height = screen.height / 2;
    document.body.appendChild(canvas);

    //start sfx loops
    loadMusic();
    loadSfx();
    beckon();

    //handle user input 
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('keypress', handleKeyDown);
}


function shootUp() {
    if (!handsSprite.animateForwardTimeout && handsSprite.currentFrame < handsSprite.maxFrame) {
        console.log('SPACE LATCH');
        handsSprite.animateForward();
    }
}

function stopShootingUp() {
    handsSprite.animateBackward();
}

function handleKeyUp(e) {
    switch(e.keyCode) {
        case 32: //SPACE
                console.log('SPACE UP');
                stopShootingUp();
            break;
        default:
            break; 
    }
}

function handleKeyDown(e) {
    switch(e.keyCode) {
        case 32: //SPACE
                console.log('SPACE DOWN');
                shootUp();
            break;
        default:
            break; 
    }
}

function showPlayButton () {
    document.getElementById('play').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', showPlayButton);
