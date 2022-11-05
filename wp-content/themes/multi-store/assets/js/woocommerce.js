(function( $ ){
	var UI = {
		block: function( $node ) {
	        if ( ! this.is_blocked( $node ) ) {
	            $node.addClass( 'processing' ).block( {
	                message: null,
	                overlayCSS: {
	                    background: '#fff',
	                    opacity: 0.6
	                }
	            } );
	        }
	    },
	    is_blocked: function( $node ) {
            return $node.is( '.processing' ) || $node.parents( '.processing' ).length;
        },
        unblock: function( $node ) {
            $node.removeClass( 'processing' ).unblock();
        }
	};

	var CART = {
		update: function( $html ){
			
			$( '.multi-store-woocommerce-mini-cart-product-wrapper' ).replaceWith( 
				$( '.multi-store-woocommerce-mini-cart-product-wrapper', $html ) 
			);

			$( '.multi-store-mini-cart-btn' ).replaceWith( 
				$( '.multi-store-mini-cart-btn', $html ) 
			);

		},
		updateCount: function( $html ){
			$( '.multi-store-cart-icon-container' ).replaceWith( 
				$( '.multi-store-cart-icon-container', $html ) 
			);
		}
	};

	var BuyNow = {
		init: function(){
			$( document ).ready(function(){
				$( '.variations_form' ).on( 'hide_variation', function(){ 
					$( '.multi-store-buy-now' ).prop( 'disabled', true );
				});

				$( '.variations_form' ).on( 'show_variation', function(){ 
					$( '.multi-store-buy-now' ).prop( 'disabled', false );
				});

				$( '.multi-store-buy-now' ).on( 'click', function( e ){
					e.preventDefault()

					var $form   = $( this ).closest( 'form.cart' ),
						$button = $( this );
					
					$button.addClass( 'loading' );

					var data = $form.serialize();

					if( 'simple' == $button.data( 'product-type' ) ){
						var id = $form.find( 'button[name="add-to-cart"]' ).val();
						data += '&add-to-cart=' + id;
					}
					
					// Make call to actual form post URL.
					$.ajax( {
					    type:     $form.attr( 'method' ),
					    url:      $form.attr( 'action' ),
					    data:     data,
					    dataType: 'html',
					    success:  function( response ) {
					       window.location.href = MULTISTORE.checkout_url;
					    },
					    complete: function() {
					    	$button.removeClass( 'loading' );
					    }
					});	
				});
			});
		}
	};

	BuyNow.init();

	$(document).on( 'click', '.multi-store-remove-mini-cart-item', function( e ) {
	    e.preventDefault();

	    var $ele     = $( e.currentTarget );
	    var $wrapper = $ele.parents( '.multi-store-woocommerce-mini-cart-product-wrapper' );
	    var $item    = $ele.parents( '.multi-store-woocommerce-mini-cart-product-single' );

	    UI.block( $wrapper );
	    
	    $.ajax({
	        type: 'GET',
	        url: $ele.attr( 'href' ),
	        dataType: 'html',
	        success: function( response ) {
	            $item.css({ 
	                "height": $item.outerHeight(), 
	                "overflow": 'hidden', 
	                "width": '100%'
	            }).animate({ "margin-left": '350' }, 250, 'swing', function(){
	            	var $html = $.parseHTML( response );
	                CART.update( $html );
	                CART.updateCount( $html );
	                UI.unblock( $wrapper );
	            });
	        },
	        complete: function() {
	            UI.unblock( $wrapper );
	        }
	    });
	});

	$(document).on( 'added_to_cart', function( e, fragments, hash ){
	    var $html = $.parseHTML( fragments['div.widget_shopping_cart_content'] );
	    CART.update( $html );
	    $( '.multi-store-cart-icon-container .count' ).text( fragments[ 'total-cart-items' ] );
	    $('body').toggleClass( 'multi-store-show-mini-cart' );
	});

	$( document ).on( 'click', '.mini-cart-toggler, .multi-store-mini-cart-close, .multi-store-wc-addon-overlay', function( e ){
	    e.preventDefault();

	    $( 'body' ).toggleClass( 'multi-store-show-mini-cart' );

	    setTimeout(function(){
	        if( $( 'body' ).hasClass( 'multi-store-show-mini-cart' ) ){
	            $( '.multi-store-woocommerce-mini-cart .multi-store-mini-cart-close' ).focus();
	        }else{
	            $( '.mini-cart-toggler' ).focus();
	        }
	    });
	});

	$(document).on( 'click', '.multi-store-woocommerce-addon-empty-cart', function(e){
	    e.preventDefault();
	    var $wrapper = $( '.multi-store-woocommerce-mini-cart-product-wrapper' );
	    UI.block( $wrapper );

	    $.ajax( {
	        type : 'get',
	        url  : MULTISTORE.admin_url,
	        data : {
	        	action : 'multi_store_empty_cart'
	        },
	        dataType : 'html',
	        success  : function( response ) {
				var $html = $.parseHTML(response);
				CART.update( $html );
	            $( '.multi-store-cart-icon-container .count' ).text( '0' );
	        },
	        complete: function() {
	            UI.unblock( $wrapper );
	        }
	    });
	});

	$(document).on('click', '.quantity button', function (e) {

	    var input = $( this ).parents( 'div.quantity' ).children( 'input' );
	    var hidden_input = input.attr( 'id' );
	    
	    var value = parseFloat( input.val() ).toFixed( 0 );
	   		value = parseInt( isNaN( value ) ? 0 : value );

	    var min  = parseInt( input.attr( 'min' ) ),
	        max  = parseInt( input.attr( 'max' ) ),
	        step = parseFloat( input.attr( 'step' ) );

	    if( isNaN( max ) ){
	    	max = 99999999999;
	    }
  
	    if( $( this ).hasClass( 'up' ) ){
	        if (max == value) {
	            return;
	        }
	        var op = +step;
	    } else {
	        if (min == value) {
	            return;
	        }
	        var op = -step;
	    }

	    if (!(min == value && op == -step) && !(max == value && op == +step)) {
	        
	        let v = parseFloat(value) + op;

	        $('#' + hidden_input).val( v );
	        jQuery('button[name="update_cart"]').prop( "disabled", false );
	        jQuery('button[name="update_cart"]').trigger( "click" );
	    }
	});

	$( document ).on( 'click', '.multi-store-coupon-trigger', function( e ){
	    e.preventDefault();
	    $( this ).next().slideToggle();
	});

})( jQuery );