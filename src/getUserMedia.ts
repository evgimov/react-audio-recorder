export default navigator.mediaDevices ?
  navigator.mediaDevices.getUserMedia.bind(navigator) :
  (
    navigator.getUserMedia.bind(navigator) ||
    navigator.webkitGetUserMedia.bind(navigator) ||
    navigator.mozGetUserMedia.bind(navigator)
  );
