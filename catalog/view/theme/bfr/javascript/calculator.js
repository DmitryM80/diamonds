const   carats = Array.from(document.querySelectorAll('.carat')),
        numbers = document.querySelector('.carat-list'),
        quantities = document.querySelector('.qty-list'),
        qty = Array.from(document.querySelectorAll('.qty')),
        resHolder = document.querySelector('.cost-result'),
        prices = Array.from(document.querySelectorAll('.lot-price')),
        caratsResultWindow = document.querySelector('.recomend-buy'),
        diametersValue = document.getElementById('diameter-value'),
        diameters = [3.4, 3.8, 4.1, 4.4, 4.6],
        heightCorrectionCoeff = (window.outerWidth < 767) ? 0.3 : 0.9;


const caratsQty = [
    [0,0], [1,0], [2,0], [3,0], [4,0],
    [0,1], [1,1], [2,1], [3,1], [4,1],
    [0,2], [1,2], [2,2], [3,2], [4,2],
    [0,3], [1,3], [2,3], [3,3], [4,3],
    [0,4], [1,4], [2,4], [3,4], [4,4],
];


let     isDragging = false,
        isDraggingQty = false,
        startPos = 0,
        currentTranslate = 0,
        prevTranslate = 0,
        animationId = 0,
        qtyAnimationId = 0,
        startPosQty = 0,
        startPosCost = 0,
        currentTranslateQty = 0,
        currentTranslateCost = 0,
        prevTranslateQty = 0,
        prevTranslateCost = 0,
        currentIndex = 0,
        currentIndexQty = 0,
        currentIndexCost = 0,
        currentCarat = 1,
        currentQty = 10,
        currentCost = 159500,
        premiumCoeff = 0,
        itemHeight = prices[0].getBoundingClientRect().height + heightCorrectionCoeff,
        lotObj;

updateLotObj();

window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
}

// Караты
// Touch
numbers.addEventListener('touchstart', touchStart);
numbers.addEventListener('touchend', touchEnd);
numbers.addEventListener('touchmove', touchMove);

// Mouse
numbers.addEventListener('mousedown', touchStart);
numbers.addEventListener('mouseup', touchEnd);
numbers.addEventListener('mouseleave', touchEnd);
numbers.addEventListener('mousemove', touchMove);


function touchStart(e) {

    startPos = getPositionY(e);
    isDragging = true;
        
    animationId = requestAnimationFrame(animation);
}

function touchEnd() {

    isDragging = false;
    cancelAnimationFrame(animationId);

    const movedBy = currentTranslate - prevTranslate;
    
    if (movedBy < -itemHeight && (currentIndex < (carats.length - 2))) {
        currentCarat = currentIndex += 1;
    }
    
    if (movedBy > itemHeight && currentIndex > 0) {
        currentCarat = currentIndex -= 1;        
    }

    setCurrentCarat();    
    setPositionByIndex();
}

function touchMove(event) {
    event.preventDefault();
    if (isDragging) {
        const currentPosition = getPositionY(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }
}

function getPositionY(e) {
    return e.type.includes('mouse') ? e.pageY : e.touches[0].clientY;
}

function animation() {
    setNumberPosition();    
    if (isDragging) {
        requestAnimationFrame(animation);
    }
}

function setNumberPosition() {
    // console.log('Carat', currentIndex);
    numbers.style.transform = 'translateY('+ currentTranslate +'px)';
}

function setPositionByIndex() {
    
    currentTranslate = currentIndex * -itemHeight;
    
    prevTranslate = currentTranslate;

    setNumberPosition();
    setResultPosition();
    showResultCarats();
    setCurrentDiameter();
}


function setCurrentCarat() {
    document.querySelector('.now-vis.carat').classList.remove('now-vis');
    carats[currentIndex + 1].classList.add('now-vis');
}

function setCurrentDiameter() {
    diametersValue.innerText = diameters[currentIndex];
}

// Караты


// --------------------- //

// Количество


// Touch
quantities.addEventListener('touchstart', touchStartQty);
quantities.addEventListener('touchend', touchEndQty);
quantities.addEventListener('touchmove', touchMoveQty);

// Mouse
quantities.addEventListener('mousedown', touchStartQty);
quantities.addEventListener('mouseup', touchEndQty);
quantities.addEventListener('mouseleave', touchEndQty);
quantities.addEventListener('mousemove', touchMoveQty);


function touchStartQty(e) {

    startPosQty = getPositionQtyY(e);
    isDraggingQty = true;
        
    qtyAnimationId = requestAnimationFrame(qtyAnimation);
}

function touchEndQty() {

    isDraggingQty = false;
    cancelAnimationFrame(qtyAnimationId);

    const qtyMovedBy = currentTranslateQty - prevTranslateQty;
    
    if (qtyMovedBy < -itemHeight && (currentIndexQty < (qty.length - 2))) {
        // currentQty = currentIndexQty += 1;
        currentIndexQty += 1;
    }
    
    if (qtyMovedBy > itemHeight && currentIndexQty > 0) {
        // currentQty = currentIndexQty -= 1;        
        currentIndexQty -= 1;        
    }

    setCurrentQty();    
    setQtyPositionByIndex();
}

function touchMoveQty(event) {
    event.preventDefault();
    if (isDraggingQty) {
        const currentPositionQty = getPositionQtyY(event);
        currentTranslateQty = prevTranslateQty + currentPositionQty - startPosQty;
    }
}

function getPositionQtyY(e) {
    return e.type.includes('mouse') ? e.pageY : e.touches[0].clientY;
}

function qtyAnimation() {
    setQtyPosition();    
    if (isDraggingQty) {
        requestAnimationFrame(qtyAnimation);
    }
}

function setQtyPositionByIndex() {
    
    currentTranslateQty = currentIndexQty * -itemHeight;
    
    prevTranslateQty = currentTranslateQty;

    setQtyPosition();
    // setCurrentCost();
    setQtyResultPosition();
    showResultCarats();
}

function setQtyPosition() {
    // console.log(currentIndexQty);
    quantities.style.transform = 'translateY('+ currentTranslateQty +'px)';
}

function setCurrentQty() {
    document.querySelector('.now-vis.qty').classList.remove('now-vis');
    qty[currentIndexQty + 1].classList.add('now-vis');
    // console.log('Qty', currentIndexQty);
    currentQty = qty[currentIndexQty + 1].innerText;
}

function setResultPosition() {
    resHolder.style.transform = 'translateY(-'+ (((5*(currentQty/10)-5) + currentIndex) * itemHeight) +'px)';
    
    updatePricesClasses();
}

function showResultCarats() {
    let selectedCarat = carats[currentIndex + 1].innerText;
    let selectedResult = selectedCarat * currentQty;
    
    caratsResultWindow.innerText = selectedResult.toFixed(2) + ' ct';
}

function setQtyResultPosition() {
    resHolder.style.transform = 'translateY(-'+ ((5*(currentQty/10)-5) + currentIndex) * itemHeight +'px)';
    updatePricesClasses();
}

function updatePricesClasses() {
    let allVisPrices = Array.from(document.querySelectorAll('.now-vis.lot-price'));    
    allVisPrices.forEach((priceUnit) => {
        priceUnit.classList.remove('now-vis');
    });
    
    prices[currentIndex + ((5*(currentQty/10)-5) + premiumCoeff) + 1].classList.add('now-vis');
}

$('.search-product-box :radio').on('change', function(){
    if ($(this).val() == 'premium') {
        
        premiumCoeff = 26;
        $('#collection').hide();
        $('#premium').show();

    } else {
        $('#collection').show();
        $('#premium').hide();
        premiumCoeff = 0;
    }
    
    updatePricesClasses();
});
// Количество

// ----------- //

// Цена

// Touch
resHolder.addEventListener('touchstart', touchStartCost);
resHolder.addEventListener('touchend', touchEndCost);
resHolder.addEventListener('touchmove', touchMoveCost);

// Mouse
resHolder.addEventListener('mousedown', touchStartCost);
resHolder.addEventListener('mouseup', touchEndCost);
resHolder.addEventListener('mouseleave', touchEndCost);
resHolder.addEventListener('mousemove', touchMoveCost);

function touchStartCost(e) {
    startPosCost = getPositionY(e);
    isDragging = true;
        
    costAnimationId = requestAnimationFrame(costAnimation);
}

function touchEndCost() {
    isDragging = false;
    cancelAnimationFrame(costAnimationId);

    const costMovedBy = currentTranslateCost - prevTranslateCost;
    
    // if (costMovedBy < -itemHeight && (currentIndexCost < (prices.length - 2))) {
    if (costMovedBy < -itemHeight && (currentIndexCost < (prices.length - 28))) {
        currentCost = currentIndexCost += 1;
    }
    
    if (costMovedBy > itemHeight && currentIndexCost > 0) {
        currentCost = currentIndexCost -= 1;        
    }

    setCurrentCost();
    setCostPositionByIndex();
}


function touchMoveCost(event) {
    event.preventDefault();
    if (isDragging) {
        const currentPositionCost = getPositionY(event);
        currentTranslateCost = prevTranslateCost + currentPositionCost - startPosCost;
    }
}


function costAnimation() {
    setCostPosition();    
    if (isDragging) {
        requestAnimationFrame(costAnimation);
    }
}

function setCostPositionByIndex() {
    
    currentTranslateCost = currentIndexCost * -itemHeight;
    
    prevTranslateCost = currentTranslateCost;
    console.log('CostIndex', currentIndexCost);
    console.log('CaratCarat', caratsQty[currentIndexCost][0]);
    console.log('CaratQty', caratsQty[currentIndexCost][1]);

    currentIndex = caratsQty[currentIndexCost][0];
    currentIndexQty = caratsQty[currentIndexCost][1];

    // console.log('curQtyIdx', currentIndexQty);

    setCostPosition();
    setPositionByIndex();
    setQtyPositionByIndex();
    setCurrentCarat();
    setCurrentQty();
    setCurrentCost();
    updateLotObj();
}

function setCostPosition() {
    // resHolder.classList.add('moving-column');
    resHolder.style.transform = 'translateY('+ currentTranslateCost +'px)';
    // resHolder.classList.remove('moving-column');
}

function setCurrentCost() {
    document.querySelector('.now-vis.lot-price').classList.remove('now-vis');
    // prices[currentIndexCost + 1].classList.add('now-vis');
    prices[currentIndexCost + premiumCoeff + 1].classList.add('now-vis');
    
    currentCost = prices[currentIndexCost + 1].innerText;
}

// Цена

// Лот
function updateLotObj () {
    lotObj = {
        ct: carats[currentIndex + 1].innerText,
        qty: qty[currentIndexQty + 1].innerText,
        cost: prices[currentIndexCost + 1].innerText.replace(/\s/g, '')
    };
}
