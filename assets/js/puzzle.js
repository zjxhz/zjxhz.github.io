var selected;
var shiftClasses = ['line-1-morning-shift', 'line-2-morning-shift', 'line-3-morning-shift', 
					'line-1-late-shift', 'line-2-late-shift', 'line-3-late-shift'];
document.addEventListener('click', function(event){
	var clicked = event.target.id;
	var clickedElement = document.getElementById(clicked);
	if(selected){
        if(selected == clickedElement){
            deselect(selected);
            return;
        }
	    if(isDriverCell(clickedElement)){
            if(isOffDay(clickedElement)){
                alert("It is an off day.");
                return;
            }
            if(isMorningShift(clickedElement) && hasLateShiftLastNight(clickedElement)){
                alert("You can not align an early shift immediately after a late shift");
                return;
            }
            if(hasShiftOnDay(clickedElement)){
                alert("A driver can only do one shift per day; early or late.");
                return;
            }
	    }
        if(!hasShift(clickedElement)){
            if(!canMoveTo(clickedElement)){
                alert("You can't move it here, check whether it is the correct line and shift");
                return;
            }
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

//function canMoveBackToLine(element){
//    return (isMorningShift(element) && isMorningShift(selected))
//           || (!isMorningShift(element) && !isMorningShift(selected));
//}

function isDriverCell(element){
    return element.getAttribute("data-driver");
}

function isLineCell(element){
    return element.getAttribute("data-line") != null;
}


function isSelected(element){
	return element.selected == "true";
}

function select(element){
	element.selected = "true";
	addClass(element, "selected");
	selected = element;
	highlightQualifiedDrivers(element);
}

function highlightQualifiedDrivers(element){
//    var day = element.getAttribute("data-line-day");
//    var line = element.id.substring(1,2);
//    if(isDriverCell(element)){
//        day = element.getAttribute("data-day");
//        line = findShiftClass(element).substring(5,6);
//    }
//
//    var morning = isMorningShift(element);
//    var sameDayCells = document.querySelectorAll("[data-day='" + day + "']");
//    sameDayCells.forEach(function(cell){
//        if(isQualified(cell, line, morning) && !isOffDay(cell)){
//            addClass(cell, "qualified");
//        } else {
//            removeClass(cell, "qualified");
//        }
//    })

//    var sameDayDriverCells = document.querySelectorAll("[data-driver]");
//    var sameDayLineCells = document.querySelectorAll("[data-line]");
    getDriverCells().forEach(function(cell){
        if(canMoveTo(cell)){
            addClass(cell, "qualified");
        } else {
            removeClass(cell, "qualified");
        }
    });
    getLineCells().forEach(function(cell){
        if(canMoveTo(cell)){
            addClass(cell, "qualified");
        } else {
            removeClass(cell, "qualified");
        }
    })

}

function canMoveTo(element){
    if(!selected || selected == element){
        return false;
    }
    var selectedDay = getSelectedDay();
    var selectedLine = getSelectedLine();
    var morning = isMorningShift(selected);
    if(isDriverCell(element)){
        var day = element.getAttribute("data-day");
        return element && day == selectedDay && isQualified(element, selectedLine, morning) && !isOffDay(element);
    } else if(isLineCell(element)){
        var line = getLine(element);
        return getLine(element) == selectedLine &&
                element.getAttribute("data-line-day") == selectedDay &&
                    isSameShift(morning, element);
    }

}



function isSameShift(isMorning, element){
    return (isMorning && isMorningShift(element)) || (!isMorning && !isMorningShift(element));
}

function getSelectedDay(){
    var selectedDay = selected.getAttribute("data-line-day");
    if(isDriverCell(selected)){
        selectedDay = selected.getAttribute("data-day");
    }
    return selectedDay;
}

function getSelectedLine(){
    return getLine(selected);
}

function getLine(element){
    var line = element.id.substring(1,2);
    if(isDriverCell(element)){
        line = findShiftClass(element).substring(5,6);
    }
    return line;
}

function unhighlightAll(){
    getDriverCells().forEach(function(cell){
        removeClass(cell, "qualified");
    });

    getLineCells().forEach(function(cell){
        removeClass(cell, "qualified");
    });
}

function isQualified(element, line, morning){
    if((morning && isMorningShift(element)) || (!morning && !isMorningShift(element))){
        var qualifiedLines = element.getAttribute("data-qualified");
        return qualifiedLines.indexOf(line) != -1;
    }
}

function deselect(element){
	element.selected = "false";
	removeClass(element, "selected");
	selected = null;
	unhighlightAll();
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

function findShiftClass(element){
    var foundShiftClass;
    shiftClasses.forEach(function(shiftClass){
        if(element.className && element.className.indexOf(shiftClass) != -1){
            foundShiftClass = shiftClass;
        }
    })
	return foundShiftClass;
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

function isOffDay(element){
	return hasClass(element, 'off-day') && !hasClass(element, 'preferred-off-day');
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
	return element && element.className && element.className.indexOf(className) != -1;
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
    return hasMorningShift(element) || hasLateShift(element);
}

function hasRestOnDay(element){
    return !hasShiftOnDay(element);
}

function hasLateShift(element){
    var nextSiblingId = element.id.substring(0, element.id.length - 1) + "l";
    var nextSibling = document.getElementById(nextSiblingId);
    return hasShift(nextSibling);
}

function hasMorningShift(element){
    var nextSiblingId = element.id.substring(0, element.id.length - 1) + "m";
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
