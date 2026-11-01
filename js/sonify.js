//SONIFY UPDATES


//straight up pixel arrays
var red = new Array(),
		green = new Array(),
		blue = new Array();

//averaged pixel arrays
var avgRed = new Array(),
		avgGreen = new Array(),
		avgBlue = new Array();

var redRhythmBuffer = new Array(),
		greenRhythmBuffer = new Array(),
		blueRhythmBuffer = new Array();

var redGainBuffer = new Array(),
		greenGainBuffer = new Array(),
		blueGainBuffer = new Array();

function extractRGB(data,sourceWidth,sourceHeight){
	//loop through row
	for(var x = 0; x < sourceWidth; x++) {
		  //loop through columns
		  for(var y = 0; y < sourceHeight; y++) {
			  //(x*y)+x = pixel position in x column
		    red[(sourceWidth * y) + x] = data[((sourceWidth * y) + x) * 4];
		    green[(sourceWidth * y) + x] = data[((sourceWidth * y) + x) * 4 + 1];
		    blue[(sourceWidth * y) + x] = data[((sourceWidth * y) + x) * 4 + 2];
		  }
		}

	//console.log('Red Length: '+red.length);
};

//this function tells you exact pixel information for a specific location in the image
function getXYImageData(sourceArray, x, y, sourceWidth, sourceHeight) {
	//Error check on x,y (within bounds of image?)
	if (x < 0 || x >= sourceWidth || y < 0 || y >= sourceHeight){
		console.log("Location is outside bounds.");
		return -1;
	}
	
	var dataValue;
	dataValue = sourceArray[((sourceWidth * y) + x)];
	return dataValue; 
}

function bandify(numRows, numCols) {
	
	//console.log("flipVCount: "+flipVCount+", flipHCount: "+flipHCount);
	var canvas = document.getElementById('theCanvas'),
			context = canvas.getContext('2d');
	
	//specify location and size for ImageData instance
	var imageData = context.getImageData(0, 0, canvas.width, canvas.height),
			data = imageData.data;
		
	extractRGB(data, canvas.width, canvas.height);
		
	var colStarts = new Array(),
			colEnds = new Array(),
			rowStarts = new Array(),
			rowEnds = new Array();
	
	var count,
			tempStart,
			tempNextStart,
			tempEnd;
	
	var avgBlockRed = new Array(),
			avgBlockGreen = new Array(),
			avgBlockBlue = new Array();
	
	var redDiff = new Array(),
			greenDiff = new Array(),
			blueDiff = new Array();
	
	//console.log("numRows: "+numRows+", numCols: "+numCols);
		
	//divide image into rows and columns and round row and column values of pixels for each zone
	for(var count = 0; count < numCols; count++) {
		tempStart = Math.round(count*(canvas.width/numCols));
		tempNextStart = Math.round((count+1)*(canvas.width/numCols));
		tempEnd = tempNextStart - 1;
		
		//figure out the starting column numbers and the ending column numbers of each and all bands
		colStarts[count] = tempStart;
		colEnds[count] = tempEnd;
		
		tempStart = Math.round(count*(canvas.height/numRows));
		tempNextStart = Math.round((count+1)*(canvas.height/numRows));
		tempEnd = tempNextStart - 1;
		
		//
		rowStarts[count] = tempStart;
		rowEnds[count] = tempEnd;
		
	}

	//count through each band (x-axis)
	for(var col = 0; col < numCols; col++) {
		
		//count through each block in band (y-axis)
		for(var row = 0; row < numRows; row++) {

			var pixelCount = 0,
					localAvgRed = 0,
					localAvgGreen = 0,
				 	localAvgBlue = 0;

			var localSourceWidth = colEnds[col] - colStarts[col],
					localSourceHeight = rowEnds[row] - rowStarts[row];
					
			//console.log("localSourceWidth: "+localSourceWidth+", localSourceHeight: "+localSourceHeight);
		
			//loop through each band to get block info
			for(var x = colStarts[col]; x <= colEnds[col]; x++) {
	  		// loop through each column
	  	  for(var y = rowStarts[row]; y <= rowEnds[row]; y++) {
					localAvgRed = localAvgRed + getXYImageData(red,x,y,canvas.width,canvas.height);
					localAvgGreen = localAvgGreen + getXYImageData(green,x,y,canvas.width,canvas.height);
					localAvgBlue = localAvgBlue + getXYImageData(blue,x,y,canvas.width,canvas.height);
					pixelCount++; //this should be the same pretty much for all columns
				}
			}
		
			//number of red pixels per column divided by total number of pixels per column gives average color for that block
			// var tempLocalAvgRed = (localAvgRed - (localAvgGreen+localAvgBlue)/2)/pixelCount;
			// var tempLocalAvgGreen = (localAvgGreen - (localAvgBlue+localAvgRed)/2)/pixelCount;
			// var tempLocalAvgBlue = (localAvgBlue - (localAvgRed+localAvgGreen)/2)/pixelCount;
			
			var tempLocalAvgRed = (localAvgRed)/pixelCount,
					tempLocalAvgGreen = (localAvgGreen)/pixelCount,
					tempLocalAvgBlue = (localAvgBlue)/pixelCount;

			
		
			localAvgRed = Math.max(0,tempLocalAvgRed);		
			localAvgGreen = Math.max(0,tempLocalAvgGreen);
			localAvgBlue = Math.max(0,tempLocalAvgBlue);

			avgBlockRed[row] = localAvgRed;
			avgBlockGreen[row] = localAvgGreen;
			avgBlockBlue[row] = localAvgBlue;
		
			//console.log("column: "+col+", row: "+row+"; red: "+localAvgRed+", green: "+localAvgGreen+", blue: "+localAvgBlue);
			
		} //End of each block
		
		
		//Columnwise Calculations
		//Weighted averaging to pop out a pitch
		var redData = weightedAvg(avgBlockRed),
				greenData = weightedAvg(avgBlockGreen),
			 	blueData = weightedAvg(avgBlockBlue);
		
		var redColPitch = redData.avg,
				greenColPitch = greenData.avg,
				blueColPitch = blueData.avg;
	
		redRhythmBuffer[col] = redColPitch;
		greenRhythmBuffer[col] = greenColPitch;
		blueRhythmBuffer[col] = blueColPitch;
		
		redGainBuffer[col] = Math.round(redData.sum / (numRows*255), 2);
		greenGainBuffer[col] = Math.round(greenData.sum / (numRows*255), 2);
		blueGainBuffer[col] = Math.round(blueData.sum / (numRows*255), 2);

	}//end of count through bands
	
	

	//Scaling Red,Green,Blue to melody
	redRhythm = redRhythmBuffer;
	greenRhythm = greenRhythmBuffer;
	blueRhythm = blueRhythmBuffer;
	
	redGain = redGainBuffer;
	greenGain = greenGainBuffer;
	blueGain = blueGainBuffer;
	
	// console.log('Red gain:'+redGain);
	// console.log('Green gain:'+greenGain);
	// console.log('Blue gain:'+blueGain);
	
	
	//
	
	
	
	
} 

function weightedAvg(arrayArg){
	
	var localArray = arrayArg,
			arrayLength = localArray.length;
	
	var finalAvg = 0,
			finalSum = 0;
	
	for (var i = 0; i < arrayLength; i++) {
		
		finalAvg += (16 - i) * localArray[i];		//PITCH MAPPING
		finalSum += localArray[i];	
	}
	
	//Check and correct for very small sum amounts, as dividing by small numbers yields NaNs.
	if (finalSum < 0.001) {
		finalAvg = 0;
	} else {
		finalAvg = Math.round(finalAvg/finalSum);
	}
	
	return {
		'avg': finalAvg,
		'sum': finalSum
	};
}

var _round = Math.round;
Math.round = function(number, decimals)
{
  if (arguments.length == 1) return _round(number);

  var multiplier = Math.pow(10, decimals);
  return _round(number * multiplier) / multiplier;
}