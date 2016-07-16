//Connect to the server with socket.io
var socket = io.connect();
//If we're running on the STB, set the resolution
if (!!navigator.setResolution) navigator.setResolution(1920, 1080);
// //The canvas object
// var canvas;
// //The canvas context, used to draw the snapshot
// var canvasCtx;
// //Image object used to cache the latest image
// var imager = new Image(320, 240);
// //Boolean to block drawing when we're not ready
// var imagerLoading = false;


function currentChannel(){
  return Channel.getCurrentChannel().getMajorNumber();
}

function init() {

  $(document).ready(function(){
    $('#h1').after('<div>Loaded jquery</div>');

    socket.on('msg', function(){
      $('#h1').html($('#h1').html() + '1');
    });


    socket.on('channel', function(channel){
      if(channel != currentChannel()){
        // change channel!
        $('#mac').text('Channel changed to ' + channel);
        var myChannel = Channel.getChannelsByViewerChannel(channel);
        $('#mac').text('Channel changed to2 ' + myChannel.getMajorNumber());
        myChannel.tune();
      }
    });


    var myMac = navigator.getMacAddress();
    $('#mac').text(myMac);

    function updateMac(){
      socket.emit('mac', {
        mac: myMac,
        channel: currentChannel()
      });
    }
    updateMac();
    setInterval(updateMac,2000);

    $('#h2').text('Channel: ' + currentChannel());

  });


  function keyHandler(e){
    var code = e.keyCode;
    $('#h1').html(code);

    //Don't for get to put a BREAK after every case OR it will
    //Fall through like it does below.
    switch(code){
      case 13: // Select / Enter
      case 48 : // 0
      case 49 : // 1
      case 50 : // 2
      case 51 : // 3
      case 52 : // 4
      case 53 : // 5
      case 54 : // 6
      case 55 : // 7
      case 56 : // 8
      case 57 : // 9
      case 79 : // Info
      case 87 : // Rewind Trick play
      case 9 : // FF Trick play
      case 65 : //Active
      case 67 : // Next Trick play
      case 72 : // red
      case 74 : // green
      case 75 : // yellow
      case 76 : // blue
      case 80: // Play Trick play
      case 82 : // Record Trick play
      case 83 : // Stop Trick play
      case 85 : // Pause Trick play
      case 46 : // Back Trick play
      case 37: //left
      case 33: //pageup channelUp
      case 34: //pagedown channelDown
      case 38: //up
      case 39: //right
      case 40: //down
      case 47: //back
      case 189 : //dash
      default :
        $('#h1').html(code);
        break;
      }

    // return false prevents keys from bubbling to UI
    return false;
  }

  window.onkeydown = keyHandler;

  window.onerror = function(errorMsg, url, lineNumber){
     // If Webkit throws an error on the STB - the app crashes.
     // To prevent the propagation and therefore the crash
     // return true

     // Look for this console.log message in the logs
     // To access the logs use http://{STB_IP}/itv/getLogs
     console.log(errorMsg);
     return true;
   };

}


