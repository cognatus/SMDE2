$.noConflict();

jQuery(document).ready(function(){
	
	resizeImg();

	setTimeout(function(){
		resizeImg();
	}, 2000);

	jQuery(window).scroll(function(event){
		var scrollTop = jQuery(window).scrollTop();
		var height = jQuery('app-bar').height();

		if(jQuery(window).scrollTop() > 20){
			jQuery('app-bar .bar').addClass('bg_darkgray shadow');
		}
		else{
			jQuery('app-bar .bar').removeClass('bg_darkgray shadow');	
		}
	});

});

function resizeImg(){
	jQuery('img.adjustable').each(function(){
		var imgWidth = parseFloat(jQuery(this).get(0).naturalWidth);
		var imgHeight = parseFloat(jQuery(this).get(0).naturalHeight);
		var width = parseFloat(jQuery(this).parent().css('width'));
		var height = parseFloat(jQuery(this).parent().css('height'));
		var parentProp = width/height;
		var imgProp = imgWidth / imgHeight;

		//console.log('Parent_prop: ' + parentProp + '\n' + 'imgProp: ' + imgProp + '\n' + 'img_w: ' + imgWidth + '\n' + 'img_h: ' + imgHeight);

		if ( imgProp > parentProp ) {
			jQuery(this).removeClass('img_w100').addClass('img_h100');
		}
		else{
			jQuery(this).removeClass('img_h100').addClass('img_w100');
		}
	}).each(function(){
		if(this.complete) jQuery(this).load();
	});
}

var menu_flag = true;
function showMenu(){
	var width = jQuery('#menu_hidden').width();
	if(menu_flag === true){
		jQuery('#menu_hidden').animate({
			'right': 0
		}).addClass('menu_shadow');
		jQuery('#menu_button').find('span').eq(0).css({
			'transform' : 'rotate(45deg)',
			'top': '3px'
		});
		jQuery('#menu_button').find('span').eq(1).hide();
		jQuery('#menu_button').find('span').eq(2).css({
			'transform' : 'rotate(-45deg)',
			'top' : '-3px'
		});
		menu_flag = false;
	}
	else{
		jQuery('#menu_hidden').animate({
			'right': -(width + 5)
		}).removeClass('menu_shadow');
		jQuery('#menu_button').find('span').removeAttr('style').show();
		menu_flag = true;
	}
}