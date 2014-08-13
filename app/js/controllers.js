'use strict';

angular.module('myApp.controllers', []);
var dictionary = {"hair": "lasje", "table": "miza"};

  var squareDrawer = {
        /**
         * draw the square on the canvas
         */
        draw: function(height, width, id) {
            console.log("square to draw: " + height + "x" + width + " " + id);

            var canvas = document.getElementById(id);
            if (canvas && canvas.getContext) {
                console.log("drawing");
                var ctx = canvas.getContext("2d");
                //clear the canvas
                ctx.clearRect(0,0, canvas.width, canvas.height);

                ctx.fillRect(0, 0, width, height);
            }
        }
};

