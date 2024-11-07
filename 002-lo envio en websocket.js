<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<script>
  async function startAudioCapture() {
    try {
      // Open WebSocket connection
      const socket = new WebSocket("wss://jotauve.es:3000");
      
      // Log connection events for debugging
      socket.onopen = () => console.log("WebSocket connection opened");
      socket.onclose = () => console.log("WebSocket connection closed");
      socket.onerror = (error) => console.error("WebSocket error:", error);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create a MediaRecorder instance with the stream
      const mediaRecorder = new MediaRecorder(stream);

      // Set recording interval to 1 second (1000 ms)
      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
          // Convert Blob to ArrayBuffer and send it over WebSocket
          const arrayBuffer = await event.data.arrayBuffer();
          socket.send(arrayBuffer);
          console.log("Sent audio chunk over WebSocket:", arrayBuffer);
        }
      };

      // Start recording with 1-second intervals
      mediaRecorder.start(1000);
      console.log("Recording audio in 1-second chunks. Check the WebSocket server for data.");

      // Optionally, stop recording and close WebSocket after a certain time
      setTimeout(() => {
        mediaRecorder.stop();
        socket.close();
        console.log("Stopped recording and closed WebSocket.");
      }, 10000); // Stops after 10 seconds, adjust as needed

    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }

  // Call the function to start capturing audio
  startAudioCapture();
</script>
</body>
</html>
