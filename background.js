//alert("HelloWorld");
//var test = 'test';
//console.log(test);
/*var selected = document.getElementById('selectphoto');
while(1){
    if(selected.value!='') break;
    selected = document.getElementById('selectphoto');
}
var url = URL.createObjectURL(selected.files[0]);
console.log(url);
if(selected){
    selected.addEventListener('onload',handleSelected,false);
}
function handleSelected(evt) 
*/
document.querySelector('#selectphoto').onchange = function(e){
//document.getElementById('selectphoto').onchange = function(e){
    //evt.stopPropagation();
   // evt.preventDefault();

    //var selected_file = this.files[0]; // FileList object.
    var selected = document.getElementsByClassName('compose-image');
    //var selected = document.querySelector('input[type="file"]');
    //var myfile = selected.files[0];
    //var img = document.createElement("img");
    //if(selected_file==null) console.log('wrong111');
    //if(selected==null) console.log('wrong222');
    console.log(selected[0].src);
    //console.log(selected.src);
    //var myurl = window.url.createObjectURL(selected);
   //alert(selected.innerHTML);
    // ...
	
	selected[0].onload = function() {
		var ctx = document.createElement('canvas').getContext('2d');
		ctx.canvas.width = selected[0].width;
		ctx.canvas.height = selected[0].height;
		ctx.drawImage(selected[0], 0, 0);
		alert(ctx.canvas.width);
		alert(ctx.canvas.height);
		alert(decode(ctx));
	}
}

// artificially limit the message size
var maxMessageSize = 1000;

// decode the image and display the contents if there is anything
var decode = function(ctx) {
	//document.write("<script src='sjcl.js' type='text/javascript'></script>");
	
    var password = "";
    var passwordFail = 'Password is incorrect or there is nothing here.';

    // decode the message with the supplied password
    var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    var message = decodeMessage(imgData.data, sjcl.hash.sha256.hash(password));

	alert("message=");
	alert(message);
    // try to parse the JSON
    var obj = null;
    try {
        obj = JSON.parse(message);
    } catch (e) {
        // display the "choose" view

        //document.getElementById('choose').style.display = 'block';
        //document.getElementById('reveal').style.display = 'none';

        if (password.length > 0) {
            alert(passwordFail);
        }
    }

    // display the "reveal" view
    if (obj) {
        //document.getElementById('choose').style.display = 'none';
        //document.getElementById('reveal').style.display = 'block';

        // decrypt if necessary
        if (obj.ct) {
            try {
                obj.text = sjcl.decrypt(password, message);
            } catch (e) {
                alert(passwordFail);
            }
        }

        // escape special characters
        var escChars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
            '/': '&#x2F;',
            '\n': '<br/>'
        };
        var escHtml = function(string) {
            return String(string).replace(/[&<>"'\/\n]/g, function (c) {
                return escChars[c];
            });
        };
        //document.getElementById('messageDecoded').innerHTML = escHtml(obj.text);
		return obj.text;
	}
};

// returns a 1 or 0 for the bit in 'location'
var getBit = function(number, location) {
   return ((number >> location) & 1);
};

// sets the bit in 'location' to 'bit' (either a 1 or 0)
var setBit = function(number, location, bit) {
   return (number & ~(1 << location)) | (bit << location);
};

// returns the next 2-byte number
var getNumberFromBits = function(bytes, history, hash) {
    var number = 0, pos = 0;
    while (pos < 16) {
        var loc = getNextLocation(history, hash, bytes.length);
        var bit = getBit(bytes[loc], 0);
        number = setBit(number, pos, bit);
        pos++;
    }
    return number;
};

// gets the next location to store a bit
var getNextLocation = function(history, hash, total) {
    var pos = history.length;
    var loc = Math.abs(hash[pos % hash.length] * (pos + 1)) % total;
    while (true) {
        if (loc >= total) {
            loc = 0;
        } else if (history.indexOf(loc) >= 0) {
            loc++;
        } else if ((loc + 1) % 4 === 0) {
            loc++;
        } else {
            history.push(loc);
            return loc;
        }
    }
};

// returns the message encoded in the CanvasPixelArray 'colors'
var decodeMessage = function(colors, hash) {
    // this will store the color values we've already read from
    var history = [];

    // get the message size
    var messageSize = getNumberFromBits(colors, history, hash);

    // exit early if the message is too big for the image
    if ((messageSize + 1) * 16 > colors.length * 0.75) {
        return '';
    }

    // exit early if the message is above an artificial limit
    if (messageSize === 0 || messageSize > maxMessageSize) {
        return '';
    }

    // put each character into an array
    var message = [];
    for (var i = 0; i < messageSize; i++) {
        var code = getNumberFromBits(colors, history, hash);
        message.push(String.fromCharCode(code));
    }

    // the characters should parse into valid JSON
    return message.join('');
};