
function tweetLike() {
  $('.fa-heart').on('click', (e) => {
    $(e.target).toggleClass('likedTweet');
    const $id = $(e.target).siblings('.tweetId').text();
    $.ajax({
      url: `/tweets/${$id}/like`,
      method: 'POST',
      success: (data) => {
        alert(data);
      }
    })
  });
}

