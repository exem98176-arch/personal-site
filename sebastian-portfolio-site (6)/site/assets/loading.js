// SEB POWER SHELL retro loading animation
// Reproduces the 7-frame Figma animation:
// frame 1: _Proj File loading.
// frame 2: _Proj File loading..
// frame 3: _Proj File loading...
// frame 4: _Proj File loading.
// frame 5: _Proj File loading..
// frame 6: _Proj File loading...
// frame 7: _Proj File loading... done :)

function runLoadingAnimation(onComplete, frameDuration = 260) {
  const overlay = document.getElementById('loading-overlay');
  const textEl = document.getElementById('loading-text');
  if (!overlay || !textEl) { if (onComplete) onComplete(); return; }

  const frames = [
    '_Proj File loading.',
    '_Proj File loading..',
    '_Proj File loading...',
    '_Proj File loading.',
    '_Proj File loading..',
    '_Proj File loading...',
    '_Proj File loading... done :)'
  ];

  overlay.classList.remove('hidden');
  let i = 0;

  function step() {
    textEl.textContent = frames[i];
    i++;
    if (i < frames.length) {
      setTimeout(step, frameDuration);
    } else {
      // hold on the "done :)" frame briefly before continuing
      setTimeout(() => {
        overlay.classList.add('hidden');
        if (onComplete) onComplete();
      }, 500);
    }
  }
  step();
}

// Navigate to a URL after playing the boot animation
function navigateWithLoading(url) {
  runLoadingAnimation(() => {
    window.location.href = url;
  });
}
