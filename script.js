(function (window, document) {
    /**
                                * CAN\VAS Plugin - Adding line breaks to canvas
                                * @arg {string} [str=Hello World] - text to be drawn
                                * @arg {number} [x=0]             - top left x coordinate of the text
                                * @arg {number} [y=textSize]      - top left y coordinate of the text
                                * @arg {number} [w=canvasWidth]   - maximum width of drawn text
                                * @arg {number} [lh=1]            - line height
                                * @arg {number} [method=fill]     - text drawing method, if 'none', text will not be rendered
                                */

    CanvasRenderingContext2D.prototype.drawBreakingText = function (str, x, y, w, lh, method) {
        // local variables and defaults
        var textSize = parseInt(this.font.replace(/\D/gi, ''));
        var textParts = [];
        var textPartsNo = 0;
        var words = [];
        var currLine = '';
        var testLine = '';
        str = str || '';
        x = x || 0;
        y = y || 0;
        w = w || this.canvas.width;
        lh = lh || 1;
        method = method || 'fill';

        // manual linebreaks
        textParts = str.split('\n');
        textPartsNo = textParts.length;

        // split the words of the parts
        for (var i = 0; i < textParts.length; i++) {
            if (window.CP.shouldStopExecution(0)) break;
            words[i] = textParts[i].split(' ');
        }

        // now that we have extracted the words
        // we reset the textParts
        window.CP.exitedLoop(0); textParts = [];

        // calculate recommended line breaks
        // split between the words
        for (var i = 0; i < textPartsNo; i++) {
            if (window.CP.shouldStopExecution(1)) break;

            // clear the testline for the next manually broken line
            currLine = '';

            for (var j = 0; j < words[i].length; j++) {
                if (window.CP.shouldStopExecution(2)) break;
                testLine = currLine + words[i][j] + ' ';

                // check if the testLine is of good width
                if (this.measureText(testLine).width > w && j > 0) {
                    textParts.push(currLine);
                    currLine = words[i][j] + ' ';
                } else {
                    currLine = testLine;
                }
            }
            // replace is to remove trailing whitespace
            window.CP.exitedLoop(2); textParts.push(currLine);
        }

        // render the text on the canvas
        window.CP.exitedLoop(1); for (var i = 0; i < textParts.length; i++) {
            if (window.CP.shouldStopExecution(3)) break;
            if (method === 'fill') {
                this.fillText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x, y + textSize * lh * i);
                // this.fillText(textParts[i], x, y + textSize * lh * i);
            } else if (method === 'stroke') {
                this.strokeText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x, y + textSize * lh * i);
            } else if (method === 'none') {
                return { 'textParts': textParts, 'textHeight': textSize * lh * textParts.length };
            } else {
                console.warn('drawBreakingText: ' + method + 'Text() does not exist');
                return false;
            }
        } window.CP.exitedLoop(3);

        return { 'textParts': textParts, 'textHeight': textSize * lh * textParts.length };
    };
})(window, document);





var canvas = document.createElement('canvas');

var canvasWrapper = document.getElementById('canvasWrapper');
canvasWrapper.appendChild(canvas);
canvas.width = 1000;
canvas.height = 600;
var ctx = canvas.getContext('2d');
var padding = 50;
var textPadding = 30;
var textTop = 'Meme title'; // default head text
var textBottom = 'Meme body text'; //default body text
var textSizeTop = 4;
var textSizeBottom = 2;
var image = document.createElement('img');
var textType = 1;// 1 = padding mode, 2= full mode


image.onload = function (ev) {
    // delete and recreate canvas do untaint it
    canvas.outerHTML = '';
    canvas = document.createElement('canvas');
    canvasWrapper.appendChild(canvas);
    ctx = canvas.getContext('2d');
    document.getElementById('trueSize').click();
    document.getElementById('trueSize').click();

    draw();
};

document.getElementById('imgURL').oninput = function (ev) {
    image.src = this.value;
};

document.getElementById('imgFile').onchange = function (ev) {
    var reader = new FileReader();
    reader.onload = function (ev) {
        image.src = reader.result;
    };
    reader.readAsDataURL(this.files[0]);
};

document.getElementById('textTop').oninput = function (ev) {
    textTop = this.value;
    draw();
};

document.getElementById('textBottom').oninput = function (ev) {
    textBottom = this.value;
    draw();
};

document.getElementById('selectType').oninput = function (ev) {
    textType = this.value;
    draw();
};

document.getElementById('trueSize').onchange = function (ev) {
    if (document.getElementById('trueSize').checked) {
        canvas.classList.remove('fullwidth');
    } else {
        canvas.classList.add('fullwidth');
    }
};

document.getElementById('export').onclick = function () {
    var img = canvas.toDataURL('image/png');
    var link = document.createElement("a");
    link.download = 'My Meme';
    link.href = img;
    link.click();

    var win = window.open('', '_blank');
    win.document.write('<img style="box-shadow: 0 0 1em 0 dimgrey;" src="' + img + '"/>');
    win.document.write('<h1 style="font-family: Helvetica; font-weight: 300">Right Click > Save As<h1>');
    win.document.body.style.padding = '1em';
};

function style(font, size, align, base, type) {
    ctx.font =  size + 'px ' + font;
    if(type == 'head'){
        ctx.font =  'bold ' + size + 'px ' + font;    
    }    
    ctx.textAlign = align;
    ctx.textBaseline = base;
}

function draw() {
    // uppercase the text if you want
    // var top = textTop.toUpperCase();
    // var bottom = textBottom.toUpperCase();

    //normal case
    var top = textTop;
    var bottom = textBottom;

    // set appropriate canvas size
    canvas.width = 1000;//image.width;
    canvas.height = 600;//image.height;

    ratioY = canvas.height / image.height;
    fullHeight = image.height * ratioY;
    ratioX = canvas.width / image.width;
    newWidth = image.width * ratioY;
    
    canvas.setAttribute("crossorigin", "anonymous");//crossorigin="anonymous"
    // draw the image
    ctx.drawImage(image, 0, 0, newWidth, fullHeight);
    
    //draw text background
    ctx.fillStyle = '#000';
    if(textType == 1){
        ctx.fillRect(canvas.width/2 + padding, padding, canvas.width/2 - 2*padding, canvas.height - 2 * padding);
    }else{
        ctx.fillRect(canvas.width/2, 0, canvas.width/2, canvas.height);
    }

    // styles
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = canvas.width * 0.004;  
    ctx.textAlign = "start";  

    var _textSizeTop = textSizeTop / 100 * canvas.width;
    var _textSizeBottom = textSizeBottom / 100 * canvas.width;
    
    if(textType == 1){
        style('Arial', _textSizeTop, 'start', 'bottom' , 'head');
        // draw top text
        ctx.drawBreakingText(top, canvas.width / 2 + padding + textPadding, _textSizeTop + padding + textPadding, canvas.width / 2 - 2 * padding - textPadding, 1, 'fill');
        
        // draw bottom text
        style('Arial', _textSizeBottom, 'start', 'bottom', 'body');
        var height = ctx.drawBreakingText(bottom, 0, 0, null, 1, 'none').textHeight;
        console.log(ctx.drawBreakingText(bottom, 0, 0, null, 1, 'none'));
        ctx.drawBreakingText(bottom, canvas.width / 2 + padding + textPadding, canvas.height / 2, canvas.width / 2 - 2 * padding - textPadding, 1, 'fill');
    }else{
        style('Arial', _textSizeTop, 'start', 'bottom' , 'head');
        ctx.drawBreakingText(top, canvas.width / 2 + padding, _textSizeTop + padding, canvas.width / 2 - padding, 1, 'fill');
        // ctx.drawBreakingText(top, canvas.width * 3 / 4, _textSizeTop + padding, 500, 1, 'stroke');

        // draw bottom text
        style('Arial', _textSizeBottom, 'start', 'bottom', 'body');
        var height = ctx.drawBreakingText(bottom, 0, 0, null, 1, 'none').textHeight;
        console.log(ctx.drawBreakingText(bottom, 0, 0, null, 1, 'none'));
        ctx.drawBreakingText(bottom, canvas.width / 2 + padding, canvas.height / 2, canvas.width / 2 - padding, 1, 'fill');
    }
        
}

//default background image
image.src = 'https://imgflip.com/s/meme/The-Most-Interesting-Man-In-The-World.jpg';
