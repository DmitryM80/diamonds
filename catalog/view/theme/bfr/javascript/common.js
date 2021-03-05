$(function() {
 
	// menu toggle
	$('.login-mobile').click(function(){
	$('nav form').toggle();
	$(this).toggle();
	});

	// product slider
	$('.slider-main').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		fade: true,
		asNavFor: '.slider-nav',
		infinite: true,
	});
	$('.slider-nav').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		asNavFor: '.slider-main',
		dots: false, 
		arrows: true,
		infinite: true,
	});

	// бегущая строка
	$('.running-string').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		// rtl: true,
		arrows: false,
		dots: false,
		infinite: true,
	});

	$('#contact-form').submit(function(e) {
		e.preventDefault();

		var formFilled = true;

		$("#contact-form :text, #contact-form :checkbox").each(function() {
			
			if ($(this).val() == "") {
				formFilled = false;
			}
		});

		
		if (formFilled) {
			
			var form_data = $(this).serialize();
		
			$.ajax({
				url: 'index.php?route=checkout/cart/order',
				type: 'post',
				data: form_data,
				dataType: 'json',
				success: function(json) {
					if (json['success']) {
						$('#checkout-result').modal();
					}
				},
				error: function(xhr, ajaxOptions, thrownError) {
					alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
				}
			});
		} else {
			$('#empty-fields').modal();
		}
	});
});


function getURLVar(key) {
	var value = [];

	var query = String(document.location).split('?');

	if (query[1]) {
		var part = query[1].split('&');

		for (i = 0; i < part.length; i++) {
			var data = part[i].split('=');

			if (data[0] && data[1]) {
				value[data[0]] = data[1];
			}
		}

		if (value[key]) {
			return value[key];
		} else {
			return '';
		}
	}
}


// Стрелка наверх
window.addEventListener('scroll', showUpArrow);

var upArrow = document.getElementById('scroll-to-top');
var showUpArrowPosition;
var checkPageHeight = true;
function showUpArrow() {

	if(checkPageHeight) {
		showUpArrowPosition = (document.body.clientHeight / 100) * 20;
		checkPageHeight = false;
	}

	if (window.pageYOffset > showUpArrowPosition) {
		upArrow.style.display = 'block';
	} else {
		upArrow.style.display = 'none';
	}
}

$('#scroll-to-top').on('click', function() {
	document.body.scrollTop = 0; // Safari
	document.documentElement.scrollTop = 0;
})
// Стрелка наверх


// wishlist
var wishlist = {
	'add': function(product_id) {
		$.ajax({
			url: 'index.php?route=account/wishlist/add',
			type: 'post',
			data: 'product_id=' + product_id,
			dataType: 'json',
			success: function(json) {
				// $('.alert-dismissible').remove();
				console.log(json);

				if (json['redirect']) {
					// location = json['redirect'];
				}

				if (json['success']) {
					// $('#content').parent().before('<div class="alert alert-success alert-dismissible"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');
          			console.log('wishlist_success');
					$('#wishlist-added').modal();

					setTimeout(function() {
						$('#wishlist-added').modal('hide');
						$('#favorite-ico').show();
					}, 1500);
				}

				// $('#wishlist-total span').html(json['total']);
				// $('#wishlist-total').attr('title', json['total']);

				// $('html, body').animate({ scrollTop: 0 }, 'slow');
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	},
	'remove': function() {

	}
}


// Cart add remove functions
var cart = {
	'add': function(product_id, quantity) {
		$.ajax({
			url: 'index.php?route=checkout/cart/add',
			type: 'post',
			data: 'product_id=' + product_id + '&quantity=' + (typeof(quantity) != 'undefined' ? quantity : 1),
			dataType: 'json',
			beforeSend: function() {
				// $('#cart > button').button('loading');
			},
			complete: function() {
				// $('#cart > button').button('reset');
			},
			success: function(json) {
				// $('.alert-dismissible, .text-danger').remove();

				if (json['redirect']) {
					// location = json['redirect'];
				}

				if (json['success']) {
					// $('#content').parent().before('<div class="alert alert-success alert-dismissible"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');
					// console.log('success', json);
					// Need to set timeout otherwise it wont update the total
					setTimeout(function () {
						// $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
						$('#items-in-cart').text(json['products_qty']);
						$('#items-in-cart').show();
						// $('#footerLine span.mark').text(json['products_qty']);

						$('#add-to-cart-modal').modal();
					}, 100);

					// $('html, body').animate({ scrollTop: 0 }, 'slow');

					// $('#cart > ul').load('index.php?route=common/cart/info ul li');




				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	},
	'lotAdd': function(lot) {
		$.ajax({
			url: 'index.php?route=checkout/cart/lot_add',
			type: 'post',
			data: 'carats=' + lot.ct + '&quantity=' + (typeof(lot.qty) != 'undefined' ? lot.qty : 1) + '&cost=' + (typeof(lot.cost) != 'undefined' ? lot.cost : 1),
			dataType: 'json',
			success: function(json) {

				if (json['success']) {

					// Need to set timeout otherwise it wont update the total
					setTimeout(function () {
						$('#items-in-cart').text(json['total']);
						$('#items-in-cart').show();
						$('#lot-add-to-cart-modal').modal();
					}, 100);
				} else if (json['error']) {
					alert('Function ERROR !!!');
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	},
	'update': function(key, quantity) {
		$.ajax({
			url: 'index.php?route=checkout/cart/edit',
			type: 'post',
			data: 'key=' + key + '&quantity=' + (typeof(quantity) != 'undefined' ? quantity : 1),
			dataType: 'json',
			beforeSend: function() {
				$('#cart > button').button('loading');
			},
			complete: function() {
				$('#cart > button').button('reset');
			},
			success: function(json) {
				// Need to set timeout otherwise it wont update the total
				setTimeout(function () {
					$('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
				}, 100);

				if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
					location = 'index.php?route=checkout/cart';
				} else {
					$('#cart > ul').load('index.php?route=common/cart/info ul li');
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	},
	'remove': function(key) {
		$.ajax({
			url: 'index.php?route=checkout/cart/remove',
			type: 'post',
			data: 'key=' + key,
			dataType: 'json',
			beforeSend: function() {
				$('#cart > button').button('loading');
			},
			complete: function() {
				$('#cart > button').button('reset');
			},
			success: function(json) {
				// Need to set timeout otherwise it wont update the total
				setTimeout(function () {
					$('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
				}, 100);

				if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
					location = 'index.php?route=checkout/cart';
				} else {
					$('#cart > ul').load('index.php?route=common/cart/info ul li');
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	},
	
	'lotRemove': function(lot_id) {
		$.ajax({
			url: 'index.php?route=checkout/cart/lot_remove',
			type: 'post',
			data: 'lot_id=' + lot_id,
			dataType: 'json',
			success: function(json) {

				// Need to set timeout otherwise it wont update the total
				setTimeout(function () {
					console.log(json['total']);
				}, 100);

				if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
					location = 'index.php?route=checkout/cart';
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	}
}
