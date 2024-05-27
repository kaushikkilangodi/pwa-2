<template>
  <div class="media-capture">
    <video ref="video" autoplay></video>
    <div v-if="!cameraOpened" class="controls">
      <button @click="openCamera" class="btn open-camera">Open Camera</button>
    </div>
    <div v-else class="controls"year-format="Function">
      <button @click="toggleRecording" class="btn recording">
        {{ isRecording ? 'Stop Recording' : 'Start Recording' }}
      </button>
      <button @click="captureImage" class="btn capture">Capture Image</button>
      <button @click="toggleCamera" class="btn toggle">Switch Camera</button>
      <button @click="closeCamera" class="btn close">Close Camera</button>
    </div>
    <div v-if="mediaUrl" class="media-output">
      <h3>Captured Media</h3>
      <video v-if="isVideo" :src="mediaUrl" controls></video>
      <img v-else :src="mediaUrl" alt="Captured Image">
      <a :href="mediaUrl" :download="fileName" class="btn download">Download {{ isVideo ? 'Video' : 'Image' }}</a>
      <button @click="cancelMedia" class="btn cancel">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const video = ref(null);
const mediaRecorder = ref(null);
const chunks = ref([]);
const mediaUrl = ref(null);
const isVideo = ref(false);
const fileName = ref('');
const cameraOpened = ref(false);
const isRecording = ref(false);
const facingMode = ref('user'); // Default to front camera
const currentStream = ref(null);

const openCamera = async () => {
  cameraOpened.value = true;
  await startCamera();
};

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingMode.value },
      audio: true,
    });
    handleStream(stream);
  } catch (error) {
    console.error("Error accessing camera:", error);
  }
};

const toggleCamera = async () => {
  facingMode.value = facingMode.value === 'user' ? 'environment' : 'user';
  try {
    if (currentStream.value) {
      stopStream(currentStream.value);
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingMode.value },
      audio: true,
    });
    handleStream(stream);
  } catch (error) {
    console.error("Error toggling camera:", error);
  }
};

const handleStream = (stream) => {
  currentStream.value = stream;
  video.value.srcObject = stream;
};

const stopStream = (stream) => {
  const tracks = stream.getTracks();
  tracks.forEach(track => track.stop());
  video.value.srcObject = null;
};

const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
};

const startRecording = () => {
  resetMedia();
  isVideo.value = true;
  fileName.value = 'video.mp4';
  const stream = video.value.srcObject;
  mediaRecorder.value = new MediaRecorder(stream);
  mediaRecorder.value.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.value.push(event.data);
    }
  };
  mediaRecorder.value.onstop = () => {
    const blob = new Blob(chunks.value, { type: 'video/mp4' });
    chunks.value = [];
    mediaUrl.value = URL.createObjectURL(blob);
  };
  mediaRecorder.value.start();
  isRecording.value = true;
};

const stopRecording = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();
    isRecording.value = false;
  }
};

const captureImage = () => {
  resetMedia();
  isVideo.value = false;
  fileName.value = 'image.png';
  const videoElement = video.value;
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  mediaUrl.value = canvas.toDataURL('image/png');
};

const closeCamera = () => {
  cameraOpened.value = false;
  if (currentStream.value) {
    stopStream(currentStream.value);
  }
};

const cancelMedia = () => {
  resetMedia();
};

const resetMedia = () => {
  mediaUrl.value = null;
  isVideo.value = false;
  fileName.value = '';
};
</script>

<style>
.media-capture {
  text-align: center;
  max-width: 600px;
  margin: auto;
}

video, img {
  max-width: 100%;
  margin: 10px 0;
}

.controls {
  margin: 20px 0;
}

.btn {
  background-color: #008cba; /* Blue background */
  border: none; /* Remove borders */
  color: white; /* White text */
  padding: 15px 32px; /* Some padding */
  text-align: center; /* Center the text */
  text-decoration: none; /* Remove underline */
  display: inline-block; /* Make the buttons appear beside each other */
  font-size: 16px; /* Increase font size */
  margin: 4px 2px; /* Add some margin */
  cursor: pointer; /* Add a pointer cursor on hover */
  border-radius: 12px; /* Rounded corners */
  transition: background-color 0.3s; /* Smooth transition for background color */
}

.btn:hover {
  background-color: #005f5f; /* Darker blue on hover */
}

.open-camera {
  background-color: #007bff; /* Blue background */
}

.open-camera:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

.recording {
  background-color: #4CAF50; /* Green background */
}

.recording:hover {
  background-color: #45a049; /* Darker green on hover */
}

.capture {
  background-color: #ff9800; /* Orange background */
}

.capture:hover {
  background-color: #e68900; /* Darker orange on hover */
}

.download {
  background-color: #007bff; /* Blue background */
  text-decoration: none; /* Remove underline */
}

.download:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

.cancel {
  background-color: #6c757d; /* Gray background */
}

.cancel:hover {
  background-color: #5a6268; /* Darker gray on hover */
}

.close {
  background-color: #ff0000; /* Red background */
}

.close:hover {
  background-color: #cc0000; /* Darker red on hover */
}

.toggle {
  background-color: #ff9800; /* Orange background */
}

.toggle:hover {
  background-color: #e68900; /* Darker orange on hover */
}

.media-output {
  margin-top: 20px;
}
</style>
