$(document).ready(function() {

  $(".register").on("click", (e) => {
    $.ajax({
      url: "/",
      method: "GET"
    });
  });

});