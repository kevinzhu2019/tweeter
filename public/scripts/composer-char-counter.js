$(document).ready(function() {
  // --- our code goes here ---
  $("form textarea").on("keyup", function() {
    let textarea = $(this);
    let counter = textarea.parent().find(".counter");
    let n = 140 - textarea.val().length;
    if (n < 0) {
      counter.text(n).css("color", "red");
    } else {
      counter.text(n).css("color", "black");
    }
  });
});