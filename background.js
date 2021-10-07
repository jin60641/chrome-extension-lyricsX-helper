/**
 * Author: jin60641
 * Date: Oct 07, 2021
 **/

const send = (body) => {
  fetch('http://localhost:15252/chrome', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

setInterval(() => {
  chrome.tabs.query({ url: 'https://www.youtube.com/watch?v=*' }, function (tabs) {
    if (!tabs || !tabs.length) {
      send(null);
      return;
    }
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: myFunction,
      }
    );
  });
}, 1000);

chrome.runtime.onMessage.addListener(send);

function myFunction() {
  try {
    const video = document.querySelector('#movie_player > div.html5-video-container > video');
    if (!video) {
      return null;
    };
    const name = document.querySelector('#container > h1').innerText;
    const { currentTime: position, duration } = video;
      chrome.runtime.sendMessage({ name, duration, position });
  } catch (e) {
    return chrome.runtime.sendMessage(e.message);
  }
}
