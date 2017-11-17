
// function liveUpdateLikeCount(data) {
//   const dataObject = JSON.parse(data);
//   return dataObject;
// }

function tweetLike() {
  $('.fa-heart').on('click', (e) => {
    const $likes = $(e.target).siblings('p');
    const $id = $(e.target).siblings('.tweetId').text();
    $.ajax({
      url: `/tweets/${$id}/like`,
      method: 'POST',
      success: (data) => {
        const dataObject = JSON.parse(data);
        console.log('data', data, dataObject, $likes);
        $likes.text(`${dataObject}`);
        $(e.target).toggleClass('likedTweet');
      }
    })
  });
}

