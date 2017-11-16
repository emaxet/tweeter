$(document).ready(function() {
  $(".new-tweet").on('input', 'input[type=text], textarea', function () {
    var $charsLeft = 140 - this.value.length;
    var $counter = $(this).siblings('.counter');
    $charsLeft < 0 ? $counter.addClass('over-length-limit') : $counter.removeClass('over-length-limit');
    $counter.text($charsLeft);
  });
});