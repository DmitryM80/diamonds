const   sortingList = document.getElementById('sorting-list'),
        sortElements = $('#sorting-list a');

let     isDraggingSorting = false,
        startPosSorting = 0,
        currentTranslateSorting = 0,
        prevTranslateSorting = 0,
        currentIndexSorting = 0,
        itemHeightSorting = 18,
        sortingDirection = 1;

// Touch
sortingList.addEventListener('touchstart', touchStartSorting);
sortingList.addEventListener('touchend', touchEndSorting);
sortingList.addEventListener('touchmove', touchMoveSorting);

// Mouse
sortingList.addEventListener('mousedown', touchStartSorting);
sortingList.addEventListener('mouseup', touchEndSorting);
sortingList.addEventListener('mouseleave', touchEndSorting);
sortingList.addEventListener('mousemove', touchMoveSorting);

function touchStartSorting(e) {

    startPosSorting = getPositionSortingY(e);
    isDraggingSorting = true;
        
    animationId = requestAnimationFrame(animation);
}

function touchEndSorting() {

    isDraggingSorting = false;
    cancelAnimationFrame(animationId);

    const movedBy = currentTranslateSorting - prevTranslateSorting;
    
    if (movedBy < -itemHeightSorting && currentIndexSorting < sortElements.length - 1) {
        currentIndexSorting += 1;
        sortingDirection = 1;
    }
    
    if (movedBy > itemHeightSorting && currentIndexSorting > 0) {
        currentIndexSorting -= 1;
        sortingDirection = 0;
    }
  
    setPositionByIndexSorting();
    setCurrentSorting();
}

function touchMoveSorting(event) {
    event.preventDefault();
    if (isDraggingSorting) {
        const currentPositionSorting = getPositionSortingY(event);
        currentTranslateSorting = prevTranslateSorting + currentPositionSorting - startPosSorting;
    }
}

function getPositionSortingY(e) {
    return e.type.includes('mouse') ? e.pageY : e.touches[0].clientY;
}

function animation() {
    setSortingPosition();    
    if (isDraggingSorting) {
        requestAnimationFrame(animation);
    }
}

function setSortingPosition() {
    sortingList.style.transform = 'translateY('+ currentTranslateSorting +'px)';
}

function setPositionByIndexSorting() {
    
    currentTranslateSorting = currentIndexSorting * -itemHeightSorting;    
    prevTranslateSorting = currentTranslateSorting;

    setSortingPosition();
}

function setCurrentSorting() {
    $('.modal.sorting .close').attr('href', $(sortElements[currentIndexSorting]).attr('href'));
    
    if (sortingDirection) sortingUp();

    if (!sortingDirection) sortingDn();
}

function sortingUp() {
    sortElements[currentIndexSorting].className = 'sorting-1';       
    if (sortElements[currentIndexSorting - 1] !== undefined) { 
        sortElements[currentIndexSorting - 1].className = 'sorting-r2';
        if (sortElements[currentIndexSorting + 1] !== undefined)            
            sortElements[currentIndexSorting + 1].className = 'sorting-2';            
        if (sortElements[currentIndexSorting + 2] !== undefined)            
            sortElements[currentIndexSorting + 2].className = 'sorting-3';            
    }
    if (sortElements[currentIndexSorting - 2] !== undefined) {
        sortElements[currentIndexSorting - 2].className = 'sorting-r3';
    }
    if (sortElements[currentIndexSorting - 3] !== undefined) {
        sortElements[currentIndexSorting - 3].className = 'sorting-r4';
    }      
}

function sortingDn() {
    sortElements[currentIndexSorting].className = 'sorting-1';
    if (sortElements[currentIndexSorting + 1] !== undefined) {
        sortElements[currentIndexSorting + 1].className = 'sorting-2';
        if (sortElements[currentIndexSorting - 1] !== undefined)
            sortElements[currentIndexSorting - 1].className = 'sorting-r2';
        if (sortElements[currentIndexSorting - 2] !== undefined)
            sortElements[currentIndexSorting - 2].className = 'sorting-r3';
    }
    if (sortElements[currentIndexSorting + 2] !== undefined) {
        sortElements[currentIndexSorting + 2].className = 'sorting-3';
    }
    if (sortElements[currentIndexSorting + 3] !== undefined) {
        sortElements[currentIndexSorting + 3].className = 'sorting-4';
    }
}
