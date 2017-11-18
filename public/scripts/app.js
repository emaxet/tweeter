  $(document).ready(function() {


// Register new user
  // $(function() {
  //     const $registerForm = $('.register-form');
  //     $registerForm.on('submit', function(e) {
  //       e.preventDefault();
  //       const $data = $('.register-form :input').serialize();
  //       $.ajax({
  //         url: "/register",
  //         method: "PUT",
  //         data: $data
  //       });
  //     });
  // });



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
        console.log($data);
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

