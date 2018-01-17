/* global firebase */

// Initialize Firebase
// Make sure that your configuration matches your firebase script version
// (Ex. 3.0 != 3.7.1)
var config = {
  /**
   * PUT YOUR FIREBASE CONFIG HERE
   */
  
    apiKey: "AIzaSyANvlxklooewHdK1tpPZuhLyUvS9LD64Jg",
    authDomain: "multi-rps-bcec7.firebaseapp.com",
    databaseURL: "https://multi-rps-bcec7.firebaseio.com",
    projectId: "multi-rps-bcec7",
    storageBucket: "multi-rps-bcec7.appspot.com",
    messagingSenderId: "523969582381"
  };
  

firebase.initializeApp(config);
// Create a variable to reference the database
var database = firebase.database();

$("#start").on("click", function () {
  var user = $("#user").val();
  //var message = $("#message").val();

    saveUser(user);
  
});

function getGiphy(user, message) {
  var topic = message.split(" ")[1];
  $.ajax({
    method: "GET",
    url: "https://api.giphy.com/v1/gifs/search?api_key=" + API_KEY + "&q=" + topic + "&limit=10&offset=0&rating=G&lang=en"
  }).done(function (result) {
    if (result.data.length > 0) {
      console.log(result.data[0].images.downsized.url);
      var gif = result.data[0].images.downsized.url;
      saveGifMessage(user, message, gif);
    } else {
      // do something here about default image
    }
  })
}

function saveGifMessage(user, message, url) {
  database.ref().push({
    "message": message,
    "user": user,
    "url": url
  });
}

function saveUser(user) {
    database.ref().push({
    //"message": message,
    "player 1": user,});
    database.ref().push({
      //"message": message,
      "player 2": user,
                        });
    }


database.ref().on("value", function (snapshot) {
  if (snapshot.val() == null) {
    return;
  }
  $("#message-list").empty();
  console.log(snapshot.val());
  var messages = snapshot.val();
  var keys = Object.keys(messages);

  for (var i = 0; i < keys.length; i++) {
    var aKey = keys[i];
    var messageUser = messages[aKey].user;
    var currentUser = $("#user").val();
    var color = currentUser === messageUser ? "purple" : "";
    var messageHTML = "";

    if (messages[aKey].url) {
      // it is a giphy message
      messageHTML = `<div><b style="color: ${color}">${messages[aKey].user}</b>: 
      <img src="${snapshot.val()[aKey].url}" /></div>`
    } else {
      messageHTML = `<div><b style="color: ${color}">${messages[aKey].user}</b>: ${snapshot.val()[aKey].message}</div>`;
    }

    $("#message-list").append(messageHTML);
  }
});