(function ($) {

    function multiStoreLoadMorePosts() {
        var page = 2;
        jQuery( document ).on( 'click', 'a.multi-store-load-more', function( e ) {
            e.preventDefault();
            var button = jQuery(this);
            var load_more_text = $( this ).text();
            var max_num_pages = $( this ).data( 'maxpage' );
            jQuery.ajax({
                type: 'POST',
                url: MULTISTORE.admin_url,
                data: {
                    nonce: MULTISTORE.nonce,
                    action: 'view_more_posts',
                    query: MULTISTORE.posts,
                    page: page,
                },  
                beforeSend: function() {
                    button.html( '<i class="fa fa-spinner fa-spin"></i>&nbsp; Loading' );
                },
                success:function( data ) {
                    if( data ) {
                        jQuery( "#multi-store-main-content" ).append( data );
                        $( button ).text( load_more_text );            
                        if( page == max_num_pages ) {
                            button.remove();
                        }                    
                        page++;
                    } else {
                        button.remove();
                    }
                }
            });
        });
    }
    

    //banner slider
    $(document).ready(function () {       

        $(window).on( 'scroll', function () {
            if ($(window).scrollTop() > 50) {
                $( 'body' ).addClass( 'multi-store-scrolled-down' );
            } else {
                $( 'body' ).removeClass('multi-store-scrolled-down' );
            }
        });

        $( '.multi-store-scroll-top' ).click(function( e ) {
            e.preventDefault();
            $( 'body, html' ).animate({
                scrollTop: 0,
            }, 500 );
            return false;
        }); 

        /* sticky button on footer */

        $( window ).on( "scroll", function () {
            if ($( window ).scrollTop() > 150) {
                $( 'body' ).addClass( 'show-header-button' );
            } else {
                $( 'body' ).removeClass( 'show-header-button' );
            }
        });

        //load more posts
        multiStoreLoadMorePosts();

        //mobile menu init
        $('#site-navigation').multiStoreMobileMenu();

        $( document ).on( 'focus', '.circular-focus', function () {
            $( $( this ).data( "goto" ) ).focus();
        });

        $( document ).on( 'click', '.multi-store-mobile-menu ul li:not(".menu-item-has-children") a', function () {
            $( 'button#multi-store-close' ).trigger( 'click' );
        });
    });   

    $( document ).on( 'click', '.multi-store-product-menu-toggler', function( e ){
        e.preventDefault();
        $('.multi-store-menu-wrapper').toggleClass('product-menu-visible');
        $( 'body' ).toggleClass( 'multi-store-show-product-menu' );
    });

    $(document).click(function(e) {
        var container = $(".multi-store-product-menu-toggler");
        if (!container.is(e.target) && !container.has(e.target).length) {
            $('.multi-store-menu-wrapper').removeClass('product-menu-visible');
            $( 'body' ).removeClass( 'multi-store-show-product-menu' );
        }
    });

})(jQuery)