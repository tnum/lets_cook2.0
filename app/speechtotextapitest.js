var speechText;
var currentAddress;
var currentLocality;
var isPositionAnnounced;

/**
 * The callback to prepare a segment for play.
 * @param  {string} trigger The trigger type of a segment.
 * @param  {object} args    The input arguments.
 */
da.segment.onpreprocess = function (trigger, args) {
  console.log('[SpeechToText] onpreprocess', {trigger: trigger, args: args});
  speechText = "";
  da.startSegment(null, null);
};

/**
 * The callback to resume a segment for play.
 */
da.segment.onresume = function () {
  console.log('onresume');
  var synthesis = da.SpeechSynthesis.getInstance();
  var currentTime = new Date();
    var storage = new da.Storage();
    var speakData = {
      currentTime: convertTimeFormat(currentTime.getHours(), currentTime.getMinutes()),
      currentSec: currentTime.getSeconds(),
      //address: currentAddress
  };
  if(speechText == "what is the time") {
    speechText = speakData.currentTime;
  } else if(speechText == "what is the date"){
    speechText = "February 12";
  } 
  
  synthesis.speak('The result is ' + speechText, {
      onstart: function () {
          console.log('[SpeechToText] speak start');
      },
      onend: function () {
          console.log('[SpeechToText] speak onend');
          da.stopSegment();
      },
      onerror: function (error) {
          console.log('[SpeechToText] speak cancel: ' + error.message);
          da.stopSegment();
      }
  });

  if (speechText != "") {
      var entry = {
          domain: "Input Speech Text",
          extension: {},
          title: speechText,
          url: "https://translate.google.co.jp/?hl=ja#en/ja/" + speechText,
          imageUrl: "http://www.sony.net/SonyInfo/News/Press/201603/16-025E/img01.gif",
          date: new Date().toISOString()
      };
      da.addTimeline({entries: [entry]});
  }
};

/**
 * The callback to start a segment.
 * @param  {string} trigger The trigger type of a segment.
 * @param  {object} args    The input arguments.
 */
da.segment.onstart = function (trigger, args) {
  console.log('[SpeechToText] onstart', {trigger: trigger, args: args});
  //var hereargs = args.join;
  var synthesis = da.SpeechSynthesis.getInstance();

  var currentTime = new Date();
    var storage = new da.Storage();
    var speakData = {
      currentTime: convertTimeFormat(currentTime.getHours(), currentTime.getMinutes()),
      currentSec: currentTime.getSeconds(),
      //address: currentAddress
  };

  if (da.getApiLevel === undefined) {
    // API_LEVEL = 1;
    synthesis.speak('This device software is not available for speech to text function.', {
      onstart: function () {
          console.log('[SpeechToText] speak start');
      },
      onend: function () {
          da.stopSegment();
      },
      onerror: function (error) {
          da.stopSegment();
      }
    });
  } else {
    // API_LEVEL = 2 or later;
    // if(args == ["time"]){
      synthesis.speak('Good morning John', {
        onstart: function () {
          console.log('[SpeechToText] speak start');
        },
        onend: function () {
          console.log('[SpeechToText] speak onend');

          var speechToText = new da.SpeechToText();
          speechToText.startSpeechToText(callbackobject);
        },
        onerror: function (error) {
          console.log('[SpeechToText] speak cancel: ' + error.message);
          da.stopSegment();
        }
      });
    // } else {
    //   synthesis.speak('Please say something.', {
    //     onstart: function () {
    //       console.log('[SpeechToText] speak start');
    //     },
    //     onend: function () {
    //       console.log('[SpeechToText] speak onend');

    //       var speechToText = new da.SpeechToText();
    //       speechToText.startSpeechToText(callbackobject);
    //     },
    //     onerror: function (error) {
    //       console.log('[SpeechToText] speak cancel: ' + error.message);
    //       da.stopSegment();
    //     }
    //   });
    // }
  }
};

var callbackobject = {
  onsuccess: function (results) {
    console.log('[SpeechToText] : SpeechToText process has finished successfully');
    console.log('[SpeechToText] : Results = ' + results);

    var strResults = results.join(" ");
    speechText = strResults;
  },
  onerror: function (error) {
    console.log('[SpeechToText] : SpeechToText error message = ' + error.message)
    console.log('[SpeechToText] : SpeechToText error code = ' + error.code)

    var synthesis = da.SpeechSynthesis.getInstance();
    synthesis.speak('The speech to text API could not recognize what you said. Reason is ' + error.message, {
      onstart: function () {
        console.log('[SpeechToText] error message speak start');
      },
      onend: function () {
        console.log('[SpeechToText] error message speak onend');
        da.stopSegment();
      },
      onerror: function (error) {
        console.log('[SpeechToText] error message speak cancel: ' + error.message);
        da.stopSegment();
      }
    });
  }

};


var convertTimeFormat = function (hours, minutes) {
  var ampm = 'AM';
  if (hours >= 12) {
      hours = hours - 12;
      ampm = 'PM';
  }
  if (hours === 0) {
      hours = 12;
  }
  return hours + ' ' + minutes + ' ' + ampm;
};
