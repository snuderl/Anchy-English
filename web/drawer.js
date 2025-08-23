var width = 15;
var height = 10;
var rowHeight = 60;
var spacing = 3;

////
var lineWidth = 2;
var color = "blue";

function drawer(){
	$("canvas").each(function(index){
        //clear the canvas
        var word = $(this).attr("word");
        var drawn = $(this).attr("drawn");

        if(word != drawn){     
        	var ctx = this.getContext("2d");
	        ctx.clearRect(0,0, this.width, this.height);
	        ctx.lineWidth = lineWidth;
	        ctx.strokeStyle = color;
	        var elements = [];
	        for(var i = 0; i<word.length;i++){
	        	var mode = words[word[i]];
	        	h1 = height;
	        	h2 = height;
	        	if(mode==1){
	        		h1 = 0;
	        		h2 = 2*height;
	        	}else if(mode == 2){
	        		h2=2*height;
	        	}
	        	ctx.rect(10 + i*(width + spacing) , 10+h1, width, 10+h2);
	        }
	        ctx.stroke();

	        $(this).attr("drawn", word);


        	addListener(this);
    	}

	});
};


function addListener(elem, elements){
	elem.addEventListener('click', function(event) {
    var x = event.pageX - elem.offsetLeft,
        y = event.pageY - elem.offsetTop;

    // Collision detection between clicked offset and element.
    elements.forEach(function(element) {
        if (y > element.top && y < element.top + element.height 
            && x > element.left && x < element.left + element.width) {
            alert('clicked an element');
        }
    });
	}, false);
}


setInterval(drawer, 200);


///0 - normal small word
///1 - big words such as l
///3 - word that goes below the line g
///4 - big word bellow the line such as 
