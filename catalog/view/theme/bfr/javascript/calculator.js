const   carats = Array.from(document.querySelectorAll('.carat')),
        numbers = document.querySelector('.carat-list'),
        quantities = document.querySelector('.qty-list'),
        qty = Array.from(document.querySelectorAll('.qty')),
        resHolder = document.querySelector('.cost-result'),
        prices = Array.from(document.querySelectorAll('.lot-price')),
        caratsResultWindow = document.querySelector('.recomend-buy');

        console.log(prices);

const heightCorrectionCoeff = (window.outerWidth < 767) ? 0.3 : 0.9;

let     isDragging = false,
        isDraggingQty = false,
        startPos = 0,
        currentTranslate = 0,
        prevTranslate = 0,
        animationId = 0,
        qtyAnimationId = 0,
        startPosQty = 0,
        currentTranslateQty = 0,
        prevTranslateQty = 0,
        currentIndex = 0,
        currentIndexQty = 0,
        currentCarat = 1,
        currentQty = 10,
        premiumCoeff = 0,
        itemHeight = prices[0].getBoundingClientRect().height + heightCorrectionCoeff;


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
    numbers.style.transform = 'translateY('+ currentTranslate +'px)';
}

function setPositionByIndex() {
    
    currentTranslate = currentIndex * -itemHeight;
    
    prevTranslate = currentTranslate;

    setNumberPosition();
    setResultPosition();
    showResultCarats();
}


function setCurrentCarat() {
    document.querySelector('.now-vis.carat').classList.remove('now-vis');
    carats[currentIndex + 1].classList.add('now-vis');
}

// Караты




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
    setQtyResultPosition();
    showResultCarats();
}

function setQtyPosition() {
    quantities.style.transform = 'translateY('+ currentTranslateQty +'px)';
}

function setCurrentQty() {
    document.querySelector('.now-vis.qty').classList.remove('now-vis');
    qty[currentIndexQty + 1].classList.add('now-vis');
    
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
    resHolder.style.transform = 'translateY(-'+ ((5*(currentQty/10)-5) + currentIndex) * itemHeight +'px)'; // 0203    
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

    } else {
        $('#collection').show();
        premiumCoeff = 0;
    }
    
    updatePricesClasses();
});

// Количество
