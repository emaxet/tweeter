function tweetLike() {
  $('.fa-heart').on('click', (e) => {
    const $likes = $(e.target).siblings('p');
    const $id = $(e.target).parents('article').data('id');
    $.ajax({
      url: `/tweets/${$id}/like`,
      method: 'POST',
      success: (data) => {
        const dataObject = JSON.parse(data);
        $likes.text(`${dataObject}`);
        $(e.target).toggleClass('likedTweet');
      }
    });
  });
}

