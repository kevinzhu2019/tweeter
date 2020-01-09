/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
];

const createTweetElement = function(data) {
  const markup = `
      <article class="tweet">
        <div class="nameAndPicture">
          <div class="tweetAvatar">
            <img src="${data.user.avatars}">
          </div>
          <div class="tweetName">
            <h4>${data.user.name}</h4>
          </div>
          <div class="hidden">
            <h4>${data.user.handle}</h4>
          </div>
        </div>
        <div class="contents">
          <p>${escape(data.content.text)}</p>
        </div>
        <footer>
          <div class="timeStamp">
            <p>${Math.round((Date.now() - data.created_at) / 1000 / 3600 / 24)} days ago</p>
          </div>
          <div class="icons">
            <ul>
              <li><a href="#"><i class="fas fa-flag"></i></a></li>
              <li><a href="#"><i class="fas fa-retweet"></i></a></li>
              <li><a href="#"><i class="fas fa-heart"></i></a></li>
            </ul>
          </div>
        </footer>
      </article>
  `;
  return markup;
};

const renderTweets = function(tweets) {
  for (const item of tweets) {
    let $tweet = createTweetElement(item);
    $('#tweets-container').prepend($tweet);
  }
};

$(document).ready(function() {
  $('#myForm').hide();
  $('.container .new-tweet form').on("submit", function(event) {
    event.preventDefault();
    let $formContent = $(this).serialize();
    let tweetContent = $(this).find("textarea").val();//this is to grab the exact contents of the tweet you submit
    if (tweetContent.length === 0) {
      //only relevant error should display, show one and hide the other
      $('.errorEmpty').show();
      $('.errorExceed').hide();
    } else if (tweetContent.length > 140) {
      //only relevant error should display, show one and hide the other 
      $('.errorEmpty').hide();
      $('.errorExceed').show();
    } else if (tweetContent.length > 0 && tweetContent.length <= 140) {
      $('.errorEmpty').hide();
      $('.errorExceed').hide();
      $.ajax({ url: '/tweets', method: 'POST', data: $formContent })
        .then(function(msg) {
          console.log(msg);
          $('#tweets-container').empty();
          loadTweets();
        });
      $('#myTextarea').val(''); 
      $('.buttonCounter .counter').text(140).css("color", "black");
    }
    //move below 2 rows into last IF condition since if tween exedds length the content should not be clear out
    // $('#myTextarea').val(''); 
    // $('.buttonCounter .counter').text(140).css("color", "black");
  });

  const loadTweets = function() {
    $.ajax({url: '/tweets', method: 'GET'})
      .then(function(tweetData) {
        renderTweets(tweetData);
      });
  };
  loadTweets();

  $('body nav .upperRightCorner a').on("click", function(event) {
    $('#myForm').toggle();
    $('html, body').animate({
      scrollTop: $("#myTextarea").offset().top - 120
    }, 2000);
    $('#myTextarea').focus();
  });
});