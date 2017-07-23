var action = process.argv[2];
var nodeArgs = process.argv;
var followUpCommand = "";
var writeFirstCommand = "";
var writeSecondCommand = "";
var stuffToLog = "";
var dashes = "-----------------------------------------------";
var readScopeLogString = "";
var writeScopeLogString = "";
var doWhatAction = "";

var Twitter = require('twitter');
var moment = require('moment');
var Spotify = require('node-spotify-api');
var twitterKeys = require("./keys.js").twitterKeys;
var spotifyKeys = require("./keys.js").spotifyKeys;
var request = require("request");
var fs = require("fs");
var inquirer = require('inquirer');
const chalk = require('chalk');

var client = new Twitter(twitterKeys);
var spotify = new Spotify(spotifyKeys);

//This for loop takes the command line arguments after the action and puts them all together in a string as the followUpCommand variable
for (var i = 3; i < nodeArgs.length; i++) {
  if (i > 3 && i < nodeArgs.length) {
    followUpCommand += " " + nodeArgs[i];
  } else {
      followUpCommand = nodeArgs[i];
    }
}

if ((typeof action) != (typeof "") || action == "help" || action == "-help") {
  instructions();
}

switch (action) {
  case "my-tweets":
    myTweets();
    break;

  case "spotify-this-song":
    spotifySong();
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-what-it-says":
    doWhatItSays();
    break;

  case "write-what-it-does":
    writeWhatItDoes();
    break;
}
//This function sends an API request to twitter and gets the 20 most recent tweets
function myTweets() {
  action = "my-tweets";
  var scopeLogString = "";
  console.log(dashes);
  console.log("Retrieving this application's most recent tweets.");
  //Put a timeout function just to kind of make it look cool
  setTimeout(function (){
    //The from:project_node is how to get the tweets from the username
    var params = {q : 'from:project_node', count : 20};
    //Uses the twitter NPM to do the request
    client.get('search/tweets', params, function(error, tweets, response) {
      if (!error) {
        var returnedTweetData = tweets.statuses;
        //Loops through the object and console logs the tweets in a neat format
        for (var i = 0; i < returnedTweetData.length; i++) {
          console.log(dashes);
          console.log("");
          console.log(chalk.green("Tweet from: " + moment(returnedTweetData[i].created_at, "ddd MMM D HH:mm:ss ZZ YYYY").format('MMMM Do YYYY, h:mm:ss a')));
          console.log("");
          console.log(chalk.blue(returnedTweetData[i].text));
          console.log("");

          scopeLogString += dashes;
          scopeLogString += "\n";
          scopeLogString +=("Tweet from: " + moment(returnedTweetData[i].created_at, "ddd MMM D HH:mm:ss ZZ YYYY").format('MMMM Do YYYY, h:mm:ss a'));
          scopeLogString += "\n";
          scopeLogString +=(returnedTweetData[i].text);
          scopeLogString += "\n";
        }
        console.log(dashes);
        scopeLogString += dashes;
        scopeLogString += "\n";
        logThis(scopeLogString);
      }
    });
  }, 1000);
}

function spotifySong() {
  action = "spotify-this-song";
  var scopeLogString = "";
  if (followUpCommand == "") {
    console.log(dashes);
    console.log("You didn't provide a song name.");
    console.log(dashes);

    scopeLogString += dashes;
    scopeLogString += "\n";
    scopeLogString += "You didn't provide a song name.";
    scopeLogString += "\n";
    scopeLogString += dashes;
    scopeLogString += "\n";
      setTimeout(function() {
        console.log("So here is some information on 'The Sign' by Ace of Base.");
        console.log(dashes);

        scopeLogString += "So here is some information on 'The Sign' by Ace of Base.";
        scopeLogString += "\n";
        scopeLogString += dashes;
          setTimeout(function() {
            spotify.search({ type: 'track', query: 'The Sign Ace of Base', limit: 1}, function(err, data) {
              if (err) {
                return console.log('Error occurred: ' + err);
              }
              console.log("");
              console.log(chalk.bold("Song") + ": " + chalk.green(data.tracks.items[0].name));
              console.log("");
              console.log(chalk.bold("Artist") + ": " + chalk.green(data.tracks.items[0].artists[0].name));
              console.log("");
              console.log(chalk.bold("Album") + ": " + chalk.green(data.tracks.items[0].album.name));
              console.log("");
              console.log(chalk.bold("Preview link") + ": " + chalk.green.underline(data.tracks.items[0].external_urls.spotify));
              console.log("");
              console.log(dashes);

              scopeLogString += ("\n");
              scopeLogString += "Song: " + data.tracks.items[0].name;
              scopeLogString += ("\n");
              scopeLogString += "Artist: " + data.tracks.items[0].artists[0].name;
              scopeLogString += ("\n");
              scopeLogString += "Album: " + data.tracks.items[0].album.name;
              scopeLogString += ("\n");
              scopeLogString += "Preview link: " + data.tracks.items[0].external_urls.spotify;
              scopeLogString += ("\n");
              scopeLogString += (dashes);
              scopeLogString += ("\n");
              logThis(scopeLogString);
            });
          }, 1000);
    },1000);
    return;
  }
  console.log(dashes);
  console.log("Retrieving this song's Spotify information.");
  console.log(dashes);
  setTimeout(function() {
    spotify.search({ type: 'track', query: followUpCommand, limit: 3 }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      var length = (data.tracks.items).length;
      if (length == 0 ) {
        console.log("");
        console.log("Sorry there were no results for that song name.");
        console.log("");
        console.log(dashes);

        scopeLogString += ("\n");
        scopeLogString += "Sorry there were no results for that song name.";
        scopeLogString += ("\n");
        scopeLogString += (dashes);
        scopeLogString += ("\n");
        logThis(scopeLogString);
        return;
      } else if (length == 1) {
        console.log("Populating the only search result...");
        console.log(dashes);
      } else if (length == 2) {
        console.log("Populating the only two results...");
        console.log(dashes);
      } else {
        console.log("Populating the top three search results...");
        console.log(dashes);
      }
      setTimeout(function() {
        for (var i = 0; i < (data.tracks.items).length && i < 3; i++) {
          console.log("");
          console.log(chalk.bold("Song") + ": " + chalk.green(data.tracks.items[i].name));
          console.log("");
          console.log(chalk.bold("Artist") + ": " + chalk.green(data.tracks.items[i].artists[0].name));
          console.log("");
          console.log(chalk.bold("Album") + ": " + chalk.green(data.tracks.items[i].album.name));
          console.log("");
          console.log(chalk.bold("Preview link") + ": " + chalk.green.underline(data.tracks.items[i].external_urls.spotify));
          console.log("");
          console.log(dashes);

          scopeLogString += ("\n");
          scopeLogString += "Song: " + data.tracks.items[i].name;
          scopeLogString += ("\n");
          scopeLogString += "Artist: " + data.tracks.items[i].artists[0].name;
          scopeLogString += ("\n");
          scopeLogString += "Album: " + data.tracks.items[i].album.name;
          scopeLogString += ("\n");
          scopeLogString += "Preview link: " + data.tracks.items[i].external_urls.spotify;
          scopeLogString += ("\n");
          scopeLogString += (dashes);
          scopeLogString += ("\n");
        }
        logThis(scopeLogString);
      }, 1000);
    });
  }, 1000);
}

function movieThis() {
  action = "movie-this";
  var scopeLogString = "";
  if (followUpCommand == "") {
    console.log(dashes);
    console.log("You didn't provide a movie title.");
    console.log(dashes);

    scopeLogString += dashes;
    scopeLogString += "\n";
    scopeLogString += "You didn't provide a movie title.";
    scopeLogString += "\n";
    scopeLogString += dashes;
    scopeLogString += "\n";
      setTimeout(function() {
        console.log("So here is some information on 'Mr. Nobody.'");
        console.log(dashes);

        scopeLogString += "So here is some information on 'Mr. Nobody.'";
        scopeLogString += "\n";
        scopeLogString += dashes;
          setTimeout(function() {
            request("http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=40e9cece", function(error, response, body) {
              if (!error && response.statusCode === 200) {
                var rating;
                for (var i = 0; i < (JSON.parse(body).Ratings).length; i++) {
                  if (JSON.parse(body).Ratings[i].Source == "Rotten Tomatoes") {
                    rating = JSON.parse(body).Ratings[i].Value;
                  }
                }

                console.log("");
                console.log(chalk.bold("Title") + ": " + chalk.blue(JSON.parse(body).Title));
                console.log("");
                console.log(chalk.bold("Year") + ": " + chalk.blue(JSON.parse(body).Year));
                console.log("");
                console.log(chalk.bold("Actors") + ": " + chalk.blue(JSON.parse(body).Actors));
                console.log("");
                console.log(chalk.bold("IMDB Rating") + ": " + chalk.blue(JSON.parse(body).imdbRating));
                console.log("");
                console.log(chalk.bold("Rotten Tomatoes Rating") + ": " + chalk.blue(rating));
                console.log("");
                console.log(chalk.bold("Country or countries where movie was produced") + ": " + chalk.blue(JSON.parse(body).Country));
                console.log("");
                console.log(chalk.bold("Language(s)") +": " + chalk.blue(JSON.parse(body).Language));
                console.log("");
                console.log(chalk.bold("Plot") + ": " + chalk.blue(JSON.parse(body).Plot));
                console.log("");
                console.log(dashes);

                scopeLogString += "\n";
                scopeLogString += "Title: " + JSON.parse(body).Title;
                scopeLogString += "\n";
                scopeLogString += "Year: " + JSON.parse(body).Year;
                scopeLogString += "\n";
                scopeLogString += "Actors: " + JSON.parse(body).Actors;
                scopeLogString += "\n";
                scopeLogString += "IMDB Rating: " + JSON.parse(body).imdbRating;
                scopeLogString += "\n";
                scopeLogString += "Rotten Tomatoes Rating: " + rating;
                scopeLogString += "\n";
                scopeLogString += "Country or countries where movie was produced: " + JSON.parse(body).Country;
                scopeLogString += "\n";
                scopeLogString += "Language(s): " + JSON.parse(body).Language;
                scopeLogString += "\n";
                scopeLogString += "Plot: " + JSON.parse(body).Plot;
                scopeLogString += "\n";
                scopeLogString += (dashes);
                scopeLogString += "\n";
                logThis(scopeLogString);
              }
            });
          }, 1000);
    },1000);
    return;
  }

  var movieTitle = followUpCommand.replace(/ /g, '+');
  var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=40e9cece";

  console.log(dashes);
  console.log("Retrieving movie information...");
  console.log(dashes);

  setTimeout(function() {
    request(queryUrl, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        if (JSON.parse(body).Reponse == "False" || JSON.parse(body).Error == "Movie not found!") {
          console.log("");
          console.log("Sorry! That movie wasn't found!");
          console.log("");
          console.log(dashes);

          scopeLogString += ("\n");
          scopeLogString += "Sorry! That movie wasn't found!";
          scopeLogString += ("\n");
          scopeLogString += (dashes);
          scopeLogString += ("\n");
          logThis(scopeLogString);
          return;
        }
        var rating;
        for (var i = 0; i < (JSON.parse(body).Ratings).length; i++) {
          if (JSON.parse(body).Ratings[i].Source == "Rotten Tomatoes") {
            rating = JSON.parse(body).Ratings[i].Value;
          }
        }

        console.log("");
        console.log(chalk.bold("Title") + ": " + chalk.blue(JSON.parse(body).Title));
        console.log("");
        console.log(chalk.bold("Year") + ": " + chalk.blue(JSON.parse(body).Year));
        console.log("");
        console.log(chalk.bold("Actors") + ": " + chalk.blue(JSON.parse(body).Actors));
        console.log("");
        console.log(chalk.bold("IMDB Rating") + ": " + chalk.blue(JSON.parse(body).imdbRating));
        console.log("");
        console.log(chalk.bold("Rotten Tomatoes Rating") + ": " + chalk.blue(rating));
        console.log("");
        console.log(chalk.bold("Country or countries where movie was produced") + ": " + chalk.blue(JSON.parse(body).Country));
        console.log("");
        console.log(chalk.bold("Language(s)") +": " + chalk.blue(JSON.parse(body).Language));
        console.log("");
        console.log(chalk.bold("Plot") + ": " + chalk.blue(JSON.parse(body).Plot));
        console.log("");
        console.log(dashes);

        scopeLogString += "\n";
        scopeLogString += "Title: " + JSON.parse(body).Title;
        scopeLogString += "\n";
        scopeLogString += "Year: " + JSON.parse(body).Year;
        scopeLogString += "\n";
        scopeLogString += "Actors: " + JSON.parse(body).Actors;
        scopeLogString += "\n";
        scopeLogString += "IMDB Rating: " + JSON.parse(body).imdbRating;
        scopeLogString += "\n";
        scopeLogString += "Rotten Tomatoes Rating: " + rating;
        scopeLogString += "\n";
        scopeLogString += "Country or countries where movie was produced: " + JSON.parse(body).Country;
        scopeLogString += "\n";
        scopeLogString += "Language(s): " + JSON.parse(body).Language;
        scopeLogString += "\n";
        scopeLogString += "Plot: " + JSON.parse(body).Plot;
        scopeLogString += "\n";
        scopeLogString += (dashes);
        scopeLogString += "\n";
        logThis(scopeLogString);
      }
    });
  }, 1000);
}

function doWhatItSays() {
  readScopeLogString = "";
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }

    var textCommands = data.split(",");
    doWhatAction = textCommands[0];
    followUpCommand = textCommands[1];

    readScopeLogString += "\n";
    readScopeLogString += dashes;
    readScopeLogString += "\n";
    readScopeLogString += "Command read was: " + doWhatAction;
    if (doWhatAction == "movie-this" || doWhatAction == "spotify-this-song") {
      readScopeLogString += " and the song or movie was: " + followUpCommand;
    }
    readScopeLogString += "\n";
    readScopeLogString += dashes;
    readScopeLogString += "\n";
    logThis(readScopeLogString);
    switch (doWhatAction) {
      case "my-tweets":
        myTweets();
        break;

      case "spotify-this-song":
        spotifySong();
        break;

      case "movie-this":
        movieThis();
        break;
    }
  });
}

function writeWhatItDoes() {
  writeScopeLogString = "";
  console.log(dashes);
  console.log("Hello! This function allows you to store a command for later.");
  console.log(dashes);
  setTimeout(function() {
  inquirer.prompt([
    {
      type: "list",
      name: "firstCommand",
      message: "Choose the command you would like to save for later.",
      choices: ["spotify-this-song", "my-tweets", "movie-this"]
    }
  ]).then(function(choice) {
    writeFirstCommand = choice.firstCommand;

    console.log("");
    console.log(dashes);
    console.log("Great! Your first command is: " + writeFirstCommand);
    console.log(dashes);
    console.log("");

    if (choice.firstCommand != "my-tweets") {
      console.log(dashes);
      console.log("Now type in the song or movie name that you want to store for later.");
      console.log(dashes);
      setTimeout(function() {
      inquirer.prompt([
        {
            type: "input",
            name: "secondCommand",
            message: "Type in the song or movie name."
        }
      ]).then(function(second){
        writeSecondCommand = second.secondCommand.trim();
        console.log("");
        console.log(dashes);
        console.log("Great! Your song or movie name is: " + writeSecondCommand);
        console.log(dashes);

        writeScopeLogString += "\n";
        writeScopeLogString += dashes;
        writeScopeLogString += "\n";
        writeScopeLogString += "Command saved was: " + writeFirstCommand + " and the movie or song title was: " + writeSecondCommand;
        writeScopeLogString += "\n";
        writeScopeLogString += dashes;
        writeScopeLogString += "\n";
        logThis(writeScopeLogString);
        fs.writeFile("random.txt", writeFirstCommand + "," + "'" + writeSecondCommand + "'", function(err) {

          // If the code experiences any errors it will log the error to the console.
          if (err) {
            return console.log(err);
          }
        });
      });
      }, 1000);
    } else {
      console.log(dashes);
      console.log("... and that's it! Try using do-what-it-says as a command line argument to test it out!");
      console.log(dashes);

      writeScopeLogString += "\n";
      writeScopeLogString += dashes;
      writeScopeLogString += "\n";
      writeScopeLogString += "Command saved was: " + writeFirstCommand;
      writeScopeLogString += "\n";
      writeScopeLogString += dashes;
      writeScopeLogString += "\n";

      logThis(writeScopeLogString);
      fs.writeFile("random.txt", writeFirstCommand, function(err) {

        // If the code experiences any errors it will log the error to the console.
        if (err) {
          return console.log(err);
        }
      });
    }
  });
  }, 1000);

}

function instructions() {
  console.log(dashes);
  console.log("Hello! Welcome to LIRI.");
  console.log("");
  console.log("Here are a list of the available command line functions to input after '" + chalk.green("node liri.js") +"':");
  console.log("'" + chalk.blue("my-tweets") + "', '" + chalk.blue("spotify-this-song") + "', '" + chalk.blue("movie-this") + "', '" + chalk.blue("do-what-it-says") + "', '" + chalk.blue("write-what-it-does") + "'");
  console.log("");
  console.log("Note: '" + chalk.blue("spotify-this-song") + "' & '" + chalk.blue("movie-this") + "' require additional command line arguments for the movie or song title you want to use.");
  console.log("");
  console.log("Enjoy!");
  console.log(dashes);
}

function logThis(scopeString) {
  stuffToLog += "\n";
  stuffToLog += "***********************************************";
  stuffToLog += "\n";
  stuffToLog += "Action logged: " + action;
  stuffToLog += "\n";
  if ((action == "movie-this" || action == "spotify-this-song") && followUpCommand != "") {
    stuffToLog += "Song or Movie searched: " + followUpCommand;
    stuffToLog += "\n";
  }
  stuffToLog += moment().format('MMMM Do YYYY, h:mm:ss a');
  stuffToLog += "\n";
  stuffToLog += "***********************************************";
  stuffToLog += "\n";
  stuffToLog += scopeString;

  fs.appendFile('log.txt', stuffToLog, function(err) {

    // If an error was experienced we say it.
    if (err) {
      console.log(err);
    }
    stuffToLog = "";
  });
}
