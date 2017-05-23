$(document).ready( function() {
	$('html, body').click( function() {
		showHiddenBlock( false, '#notif-mini' );
		showHiddenBlock( false, '#options-mini' );
	}); 

	$('#notif-mini, #options-mini').click( function( event ) {
		event.stopPropagation();
	});

	$('#notif-open-button').click( function( event ) {
		event.stopPropagation();
		if ( $('#notif-mini').css('display') === 'block' ) {
			showHiddenBlock( false, '#notif-mini' )
		} else {
			showHiddenBlock( true, '#notif-mini' )
		}
		showHiddenBlock( false, '#options-mini' )
	});

	$('#menu-pphoto').click( function( event ) {
		event.stopPropagation();
		if ( $('#options-mini').css('display') === 'block' ) {
			showHiddenBlock( false, '#options-mini' )
		} else {
			showHiddenBlock( true, '#options-mini' )
		}
		showHiddenBlock( false, '#notif-mini' )
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
		$(selector).fadeIn();
	} else {
		$(selector).fadeOut();
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
		$('.pop_up_container').css('z-index', '98');
		selector.fadeIn().css('z-index', '99');
	} else {
		selector.fadeOut( function() {
			selector.removeAttr('style');
		});
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