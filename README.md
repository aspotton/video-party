# video-party

[![Generic badge](https://img.shields.io/badge/status-it%20works%20for%20me-<COLOR>.svg)](https://shields.io/) [![HitCount](http://hits.dwyl.com/aspotton/video-party.svg)](http://hits.dwyl.com/aspotton/video-party) [![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/aspotton/video-party/blob/master/LICENSE) 

Create a video call on top of any web page so you can all watch together. Nothing to install and no third party video applications needed besides your web browser. Simply add and use the bookmarklet.

## Install and usage

Install the bookmarklet as described below.

Have all future members of your video call browse to the same web page (Netflix movie or show, YouTube video, some type of web game like chess or poker, etc.)
Then click the bookmark button and enter a room name, share the room name with everyone else. Have them click their bookmark button and enter the same room name. Accept the prompts to allow the use of the camera/microphone. Presto. Each members video and audio will be inside the webpage.

You can click and drag the individual videos around the web page if they get in the way of the content.

## Bookmarklet

Add a new bookmark to your toolbar and copy/paste this as the URL:
```
javascript:(function(){var script=document.createElement('script');script.type='text/javascript';script.src='https://cdn.adamspotton.com/js/video_party.js';document.getElementsByTagName('head')[0].appendChild(script);})();
```

## Limitations

Known to work on current versions of Chrome and Firefox. Won't work on some websites that have strict security policies in place like Twitter or Facebook since this isn't an extension, it's a bookmarklet.

