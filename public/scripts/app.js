
function createTweetElement(data) {
  let name = data.user.name;
  let handle = data.user.handle;
  let content = data.content.text;
  let timeStamp = new Date(data.created_at);
  let avatar = data.user.avatars.small;


  var $tweet = $('section.tweet-feed').append(`
    <article class="tweet">
          <header>
            <img src="${avatar}">
            <h2>${name}</h2>
            <p>${handle}</p>
          </header>
          <div class="body">
            <p>${content}</p>
          </div>
          <footer>
            <p>${timeStamp}</p>
            <div>
              <i class="fa fa-flag" aria-hidden="true"></i>
              <i class="fa fa-retweet" aria-hidden="true"></i>
              <i class="fa fa-heart" aria-hidden="true"></i>
            </div>
          </footer>
        </article>`);

  return $tweet;
}

function loadTweets() {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        renderTweets(data);
      }
    });
  }

function renderTweets(data) {
  data.forEach(function(tweet) {
    createTweetElement(tweet);
  });
}

function toggleForm() {
  $('#nav-bar').on('click', '#toggle-form', function() {
    $('.new-tweet').slideToggle("slow");
    $('input[type=text], textarea').focus();
  });
}

function resetNewTweetForm() {
  $('input[type=text], textarea').val('');
  $('.counter').text(140);
}

$(document).ready(function() {

  toggleForm();

  loadTweets();

  $(function() {
          const $form = $('.new-tweet');
          $form.on('submit', function(event) {
            event.preventDefault();
            const $tweetLength = 140 - +$('.counter').text();
            if ($tweetLength <= 140 && $tweetLength > 0) {
              const $data = $('.new-tweet :input').serialize();
              $.ajax({
                url: '/tweets',
                method: 'POST',
                data: $data,
                success: function(data) {
                  $('article').remove();
                  loadTweets();
                  resetNewTweetForm();
                }
              });
            } else if ($tweetLength > 140){
              $('#plus-140').css({display: 'block' });
              $('#empty-tweet').css({display: 'none'});

            } else {
              $('#empty-tweet').css({display: 'block'});
              $('#plus-140').css({display: 'none' });
            }
          });
        });

});

