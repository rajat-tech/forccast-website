$( document ).ready(function() {

  var footnotesLink = $('.footnote-ref a').click(function(e){
    e.preventDefault();
    var id = $(this).attr('href');
    var container = $('.notes-container'),
    scrollTo = $('.notes-container '+ id);
    container.animate({
        scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop() - parseInt(container.css("padding-top")) -10
    },        function(){
                $('.notes-container li').removeClass('active-footnotes')
                scrollTo.addClass('active-footnotes')
            })
  })
})
