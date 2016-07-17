var selected;
var shiftClasses = ['line-1-morning-shift', 'line-2-morning-shift', 'line-3-morning-shift', 
					'line-1-late-shift', 'line-2-late-shift', 'line-3-late-shift'];
document.addEventListener('click', function(event){
	var clicked = event.target.id;
	var clickedElement = document.getElementById(clicked);
	if(selected){
		if(isOffDay(clickedElement)){
			alert("It is an off day.");
			return;
		}
		if(!hasShift(clickedElement)){
			move(selected, clickedElement);
		}
	} else {
		if(hasShift(clickedElement)){
			if(!isSelected(clickedElement)) {
				select(clickedElement);
			} else {
				deselect(clickedElement);
			}
		}	
	}
	countAll();
});



function isSelected(element){
	return element.selected == "true";
}

function select(element){
	element.selected = "true";
	if(element.className.indexOf("selected") == -1){
		element.className += " selected";	
	}
	selected = element;
}

function deselect(element){
	element.selected = "false";
	removeClass(element, "selected");
	selected = null;
}

function hasShift(element){
	for(var i = 0; i < shiftClasses.length; i++){
		var shiftClass = shiftClasses[i];
		if(hasClass(element, shiftClass)){
			return true;
		}
	}
	return false;
}

function move(selectedElement, clickedElement){
	var shiftClass = findAndRemoveShiftClass(selectedElement);
	deselect(selectedElement);
	addClass(clickedElement, shiftClass);
	deselect(clickedElement);
}

function findAndRemoveShiftClass(element){
	for(var i = 0; i < shiftClasses.length; i++){
		var shiftClass = shiftClasses[i];
		if(element.className.indexOf(shiftClass) != -1){
			removeClass(element, shiftClass);
			return shiftClass;
		}
	}
}

function isOffDay(clickedElement){
	return clickedElement.className == 'off-day';
}

function removeClass(element, className){
	if(element.className){
		element.className = element.className.replace(className, '');
	}
}

function addClass(element, className){
	if(!element.className){
		element.className = className;
	} else if(element.className.indexOf(className) == -1){
		element.className += " " + className;
	}
}

function hasClass(element, className){
	return element.className && element.className.indexOf(className) != -1;
}

function countShiftPreferences(){
    return countScore(shiftPreferenceRespected, 'result1', 3);
}

function updateResult(resultId, count, multiplier){
    updateResultWithText(resultId, "" + count + " * " + multiplier + " = " + (count * multiplier));
}

function updateResultWithText(resultId, text){
    var resultCell = document.getElementById(resultId);
    var resultNode = document.createTextNode(text);
    removeChildren(resultCell);
    resultCell.appendChild(resultNode);
}

function countOffDaysPreferences(){
	return countScore(offDaysPreferenceRespected, 'result2', 4);
}

function countLongRest(){
    var total = 0;
    var cells = getDriverCells();
    for(var i = 0; i < 11; i++){
        var count = 0;
        for(var j = 0; j < 28; j += 2){
            var cellIndex = i * (cells.length / 11) + j;
            var morningCell = cells[cellIndex];
            if(!hasShiftOnDay(morningCell)){
                count++;
            } else {
                count = 0;
            }
            if(count == 3){
                total++;
            }
        }
    }
    updateResult('result3', total, 5);
    return total * 5;
}

function countUnassignedShifts(){
    var count = 0;
    var cells = getLineCells();
    cells.forEach(function(cell){
        if(hasShift(cell)){
            count++;
        }
    });
    updateResult('result4', count, '-20');
    return count * (-20);
}

function countEarlyAfterLateShifts(){
    return countScore(isEarlyAfterLateShift, 'result5', -30);
}
function countConsecutiveLateShifts(){
    var total = 0;
    var cells = getDriverCells();
    for(var i = 0; i < 11; i++){
        var count = 0;
        for(var j = 1; j < 28; j += 2){
            var cellIndex = i * (cells.length / 11) + j;
            var lateCell = cells[cellIndex];
            if(hasShift(lateCell)){
                count++;
            } else {
                count = 0;
            }
            if(count >= 4){
                total++;
            }
        }
    }
    updateResult('result6', total, -10);
    return total * -10;
}
function countDeviationTargetLateShifts(){
    var total = 0;
    var cells = getDriverCells();
    for(var i = 0; i < 11; i++){
        var count = 0;
        for(var j = 1; j < 28; j += 2){
            var cellIndex = i * (cells.length / 11) + j;
            var lateCell = cells[cellIndex];
            if(hasShift(lateCell)){
                count++;
            }
        }
        total += Math.abs(count - 4);
    }
    updateResult('result7', total, -8);
    return total * (-8);
}

function isEarlyAfterLateShift(element){
    return isMorningShift(element) && hasShift(element) && hasLateShiftLastNight(element);
}

function hasLateShiftLastNight(element){
    var yesterday = element.getAttribute('data-day') - 1;
    var driver = element.getAttribute('data-driver');
    var lastLateShiftId = driver + "_d" + yesterday + "_l";//e.g. E_d3_l
    var lastLateShift = document.getElementById(lastLateShiftId);
    return lastLateShift && hasShift(lastLateShift);
}

function countScore(evaluateFunc, resultId, multiplier){
    var count = 0;
	var cells = getDriverCells();
	cells.forEach(function(cell){
	    if(evaluateFunc(cell)){
            count++;
        }
	});
    updateResult(resultId, count, multiplier);
    return count * multiplier;
}

function getDriverCells(){
    return document.querySelectorAll('[data-driver]');
}

function shiftPreferenceRespected(element){
	return hasClass(element, 'preferred-shift') && hasShift(element);
}

function offDaysPreferenceRespected(element){
    return hasClass(element, 'preferred-off-day') &&
        isMorningShift(element) && hasRestOnDay(element);
}

function hasShiftOnDay(element){
    return hasShift(element) || hasLateShift(element);
}

function hasRestOnDay(element){
    return !hasShiftOnDay(element);
}

function hasLateShift(element){
    var nextSiblingId = element.id.substring(0, element.id.length - 1) + "l";
    var nextSibling = document.getElementById(nextSiblingId);
    return hasShift(nextSibling);
}
function isMorningShift(element){
    return element.id && element.id.endsWith('_m');
}

function removeChildren(element){
	while (element.firstChild) {
	    element.removeChild(element.firstChild);
	}
}

function getLineCells(){
    return document.querySelectorAll('[data-line]');
}
function countAll(){
    var total = 0;
    total += countShiftPreferences();
    total += countOffDaysPreferences();
    total += countLongRest();
    total += countUnassignedShifts();
    total += countEarlyAfterLateShifts();
    total += countConsecutiveLateShifts();
    total += countDeviationTargetLateShifts();
    countTotal(total);
}

function countTotal(total){
    updateResultWithText('result0', total)
}

window.onload = countAll;
