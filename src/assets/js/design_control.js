$(document).ready( function() {
	$('html, body').click( function() {
		showHiddenBlock( false, $('#notif-mini') );
		showHiddenBlock( false, $('#options-mini' ) );
		showHiddenBlock( false, $('.hidden_options') );
	}); 

	$('#notif-mini, #options-mini, .hidden_options').click( function( event ) {
		event.stopPropagation();
	});

	$('#notif-open-button').click( function( event ) {
		event.stopPropagation();
		if ( $('#notif-mini').css('display') === 'block' ) {
			showHiddenBlock( false, $('#notif-mini' ))
		} else {
			showHiddenBlock( true, $('#notif-mini' ))
		}
		showHiddenBlock( false, $('.hidden_options') )
	});

	$('#menu-pphoto').click( function( event ) {
		event.stopPropagation();
		if ( $('#options-mini').css('display') === 'block' ) {
			showHiddenBlock( false, $('#options-mini') )
		} else {
			showHiddenBlock( true, $('#options-mini') )
		}
		showHiddenBlock( false, $('.hidden_options') )
	});

	$('.options_button').click( function( event ) {
		event.preventDefault();
		event.stopPropagation();
		var sibling = $(this).siblings('.hidden_options');
		if ( $(this).siblings('.hidden_options').css('display') === 'none' ) {
			showHiddenBlock(true, sibling);
		} else {
			showHiddenBlock(false, sibling);
		}
		showHiddenBlock( false, $('#notif-mini') );
		showHiddenBlock( false, $('#options-mini' ) );
	});

	var readyStateCheckInterval = setInterval( function() {
	    if (document.readyState === "complete") {
	        clearInterval( readyStateCheckInterval );
	        resizeImg();
	    }
	}, 500);

});

// Funcion para mover el carousel de imagenes
function moveCarousel( carousel_id, indicator_selector, position ) {
	var selector = $(carousel_id);
	var items = selector.find('.carousel_element');
	var indicator = $(indicator_selector);

	var positioner = parseInt( items.eq(1).attr('data-idposition') );

	if ( typeof position == typeof undefined ) {
		selector.animate({
			'left': '-100%',
		}, 1200, function() {
			items.eq(0).insertAfter( items.eq(items.length - 1) );
			selector.css('left', '0');
		});

		indicator.find('i.indicator').animate({
			'left': indicator.find('span').eq(positioner).position().left,
		}, 1200);
	} else {
		var initialBlock =  parseInt( items.eq(0).attr('data-idposition') );

		if ( initialBlock !== 0 ) {
			selector.find('.carousel_element').sort( function(a, b) {
	    		return +a.getAttribute('data-idposition') - +b.getAttribute('data-idposition');
			}).appendTo(selector);

			selector.css({
				'left': - parseInt( selector.find('.carousel_element[data-idposition="' + initialBlock + '"]').position().left )
			});
		}

		selector.animate({
			'left': - parseInt( selector.find('.carousel_element[data-idposition="' + position + '"]').position().left ),
		}, 1200);

		indicator.find('i.indicator').animate({
			'left': indicator.find('span').eq(position).position().left,
		}, 1200);
	}

}

function showHiddenBlock( status, selector ) {
	if ( status ) {
		selector.fadeIn();
	} else {
		selector.fadeOut();
	}
}

function showSearchBar( status ) {
	var selector = $('#search-bar');
	if ( status ) {
		selector.fadeIn();
	} else {
		selector.fadeOut();
	}
}

function showPopup( status, pop_up_id ) {
	var selector = $(pop_up_id);
	if ( status ) {
		selector.animate({
			'left': '0'
		});
		if ( $(window).width() >= 620 ) {
			selector.css('background-color', 'rgba(255,255,255,0.7)');
			selector.find('.pop_up').css('box-shadow', '0 0 6px rgba(0,0,0,0.3)');
		}
	} else {
		selector.animate({
			'left': '-100%'
		}).removeAttr('style');
		selector.find('.pop_up').removeAttr('style');
	}
}

function resizeImg() {
	$('img[adjustable], video[adjustable]').each( function() {

		var imgWidth = parseFloat( $(this).get(0).naturalWidth );
		var imgHeight = parseFloat( $(this).get(0).naturalHeight );
		var width = parseFloat( $(this).parent().css('width') );
		var height = parseFloat( $(this).parent().css('height') );
		var parentProp = width / height;
		var imgProp = imgWidth / imgHeight;

		if ( imgProp > parentProp ) {
			$(this).removeClass('w_100').addClass('h_100');
		} else{
			$(this).removeClass('h_100').addClass('w_100');
		}
	});
}

function previewPhoto( input, img_selector ) {
	if ( input.files.length > 0 ) {
	    var reader = new FileReader();

	    reader.onload = function ( event ) {
	        jQuery(img_selector).attr('src', event.target.result);
	    }
	    reader.readAsDataURL( input.files[0] );
	}
}

function triggerClick( selector ) {
	jQuery(selector).click();
}