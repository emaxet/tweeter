
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
  $('.nav-bar').on('click', '.toggle-form', function() {
    $('.new-tweet').slideToggle("slow");
    $('input[type=text], textarea').focus();
  });
}

function resetNewTweetForm() {
  $('input[type=text], textarea').val('');
  $('.counter').text(140);
  $('.error').css({display: 'none'});
}

