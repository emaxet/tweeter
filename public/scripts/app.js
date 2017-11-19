$(document).ready(function() {

  // All functions called are found in ./tweet-helpers.js

  toggleForm();

  loadTweets();

  $(function() {

    const $form = $('.new-tweet');
    $form.on('submit', function(event) {
      event.preventDefault();
      const $tweetLength = 140 - Number($('.counter').text());

      if ($tweetLength <= 140 && $tweetLength > 0) {
        const $data = $('.new-tweet :input').serialize();

        $.ajax({
          url: '/tweets',
          method: 'POST',
          data: $data,
          success: function(data) {
            $('.tweet-feed article').remove();
            loadTweets();
            resetNewTweetForm();
          }
        });

      } else if ($tweetLength > 140){
        $('.plus-140').css({display: 'block' });
        $('.empty-tweet').css({display: 'none'});
      } else {
        $('.empty-tweet').css({display: 'block'});
        $('.plus-140').css({display: 'none' });
      }
    });

  });

});

