chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('bayes.html', {
    'bounds': {
      'width': 640,
      'height': 480
    }
  });
});
