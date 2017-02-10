'use strict';

var nextId = 0;
function getNextId() {
	return "cjr id " + nextId++;
}

function shadeHexColor(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function shadeRGBColor(color, percent) {
    var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
    return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
}

function shade(color, percent){
    if (color.length > 7 ) return shadeRGBColor(color,percent);
    else return shadeHexColor(color,percent);
}

var processed = {};
$(document).on("DOMNodeInserted", "#gridcontainer", function () {
	var gridContainer = $(this);
	gridContainer.find('dl').each(function(index, element) {
		// TODO do this better; handle refresh
		if (!element.id) element.id = getNextId();
		if (processed[element.id]) return;
		processed[element.id] = true;

		var dl = $(element);
		
		// Single line events will have the title in a span like this:
		// <dt>
		//   <span>[time e.g. 4:30p]
		//     <span>- [title]
		//
		// Otherwise the title span will be a descendant of the dd instead.
		var title;
		var titleSpan = dl.find('dt > span > span');
		if (titleSpan.length > 0) {
			title = titleSpan.text();
			title = title.substr(title.search(/\s+/) + 1); // strip off the leading "- "
		} else {
			titleSpan = dl.find('dd span');
			title = titleSpan.text();
		}
		
		if (title.substr(title.length - 1) === "?") {
			//console.log(element.id + ": " + title);
			
			var backgroundColor = dl.css('background-color');
			var gradient = 'repeating-linear-gradient(45deg, ';
			gradient += backgroundColor + "," + backgroundColor + " 10px,"
			var altBackgroundColor = shade(backgroundColor, 0.35);
			gradient += altBackgroundColor + " 10px," + altBackgroundColor + " 20px)";
			dl.css('background', gradient);
		}
	});
});