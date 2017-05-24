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
	var img = new Image();
        img.onload = function() {
            var ctx = document.getElementById('canvas').getContext('2d');
            ctx.canvas.width = img.width;
            ctx.canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

			alert(decode());
        };
        img.src = selected[0].src;
}
