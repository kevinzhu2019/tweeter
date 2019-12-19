/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// const tweetData = {
//   "user": {
//     "name": "Newton",
//     "avatars": "https://i.imgur.com/73hZDYK.png",
//       "handle": "@SirIsaac"
//     },
//   "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//   "created_at": 1461116232227
// }

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

// const $tweet = createTweetElement(tweetData);

// console.log($tweet);

const renderTweets = function(tweets) {
  for (const item of tweets) {
    let $tweet = createTweetElement(item);
    // console.log("tweet", $tweet);
    $('#tweets-container').prepend($tweet);
  }
};

// const renderTweets = function(tweets) {
//   for (let i = (tweets.length - 1); i >= 0; i--) {
//     let $tweet = createTweetElement(tweets[i]);
//     console.log($tweet);
//     $('#tweets-container').append($tweet);
//   }
// }

$(document).ready(function() {
  // renderTweets(data);
  $('#myForm').hide();
  $('.container .new-tweet form').on("submit", function(event) {
    event.preventDefault();
    let $formContent = $(this).serialize();
    // console.log($formContent);
    let tweetContent = $(this).find("textarea").val();//this is to grab the exact contents of the tweet you submit
    // console.log($formContent);
    if (tweetContent.length === 0) {
      // alert("Do not submit empty content!");
      $('.errorEmpty').show();
    } else if (tweetContent.length > 140) {
      // alert("Your content is too long!");
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
    }
    $('#myTextarea').val('');
    $('.buttonCounter .counter').text(140);
  });

  const loadTweets = function() {
    $.ajax('/tweets', {method: 'GET'})
      .then(function(tweetData) {
        renderTweets(tweetData);
      });
  };
  loadTweets();

  // $('#myTextarea').focus();
  // const handleFocus = function() {
  //   console.log("hello1");
  //   window.location = '#myForm';
  //   $('#myTextarea').focus();
  // }

  $('body nav .upperRightCorner a').on("click", function(event) {
    // window.location = '#myForm';
    $('#myForm').toggle();
    $('html, body').animate({
      scrollTop: $("#myTextarea").offset().top - 120
    }, 2000);
    $('#myTextarea').focus();
  });
});