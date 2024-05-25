<template>
  <div class="container">
    <h1 class="title">Image and Video Capture</h1>
    <select v-model="selectedCamera" @change="handleCameraChange" class="select">
      <option v-for="device in cameraDevices" :key="device.deviceId" :value="device.deviceId">
        {{ device.label || `Camera ${device.deviceId}` }}
      </option>
    </select>
    <div class="video-container">
      <video ref="videoRef" autoplay class="video"></video>
    </div>
    <div class="button-container">
      <button @click="handleCaptureClick" class="button">Capture Image</button>
      <button @click="handleStartStopRecording" class="button">
        {{ isRecording ? 'Stop Recording' : 'Start Recording' }}
      </button>
    </div>
    <div class="image-container">
      <img v-if="imageURL" :src="imageURL" alt="Captured Image" class="image" />
      <a v-if="imageURL" :href="imageURL" download="captured-image.png" class="download-link">Download Image</a>
      <a v-if="imageURL" @click="cancelImageCapture" class="download-link">Cancel</a>
    </div>
    <canvas ref="canvasRef" class="canvas"></canvas>
    <div v-if="videoURL">
      <video :src="videoURL" controls class="video"></video>
      <a :href="videoURL" download="captured-video.webm" class="download-link">Download Video</a>
      <a @click="cancelVideoCapture" class="download-link">Cancel</a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const videoRef = ref(null);
const canvasRef = ref(null);
const mediaRecorder = ref(null);
const videoURL = ref(null);
const imageURL = ref(null);
const isRecording = ref(false);
const cameraDevices = ref([]);
const selectedCamera = ref('');

const fetchCameras = async () => {
  try {
    console.log('Fetching camera devices...');
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    cameraDevices.value = videoDevices;
    if (videoDevices.length > 0) {
      selectedCamera.value = videoDevices[0].deviceId;
    }
    console.log('Camera devices fetched:', cameraDevices.value);
  } catch (error) {
    console.error('Error fetching camera devices:', error);
  }
};

const startVideoStream = async (deviceId) => {
  const videoElement = videoRef.value;
  try {
    console.log('Starting video stream with deviceId:', deviceId);
    const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId } });
    videoElement.srcObject = stream;
    const recorder = new MediaRecorder(stream);
    mediaRecorder.value = recorder;

    const chunks = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      videoURL.value = url;
      console.log('Video recording stopped, URL:', url);
    };
    console.log('Video stream started successfully');
  } catch (error) {
    console.error('Error starting video stream:', error);
  }
};

const handleCaptureClick = () => {
  console.log('Capturing image...');
  const videoElement = videoRef.value;
  const canvas = canvasRef.value;
  const context = canvas.getContext('2d');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  const imageUrl = canvas.toDataURL('image/png');
  imageURL.value = imageUrl;
  console.log('Image captured, URL:', imageUrl);
};

const handleStartStopRecording = () => {
  if (isRecording.value) {
    console.log('Stopping recording...');
    mediaRecorder.value.stop();
    isRecording.value = false;
  } else {
    console.log('Starting recording...');
    mediaRecorder.value.start();
    isRecording.value = true;
  }
};

const handleCameraChange = (event) => {
  console.log('Camera changed:', event.target.value);
  selectedCamera.value = event.target.value;
};

const cancelImageCapture = () => {
  console.log('Cancelling image capture...');
  imageURL.value = null;
};

const cancelVideoCapture = () => {
  console.log('Cancelling video capture...');
  videoURL.value = null;
};

onMounted(() => {
  console.log('Component mounted, checking HTTPS and fetching cameras...');
  if (window.location.protocol !== 'https:') {
    console.error('Camera access requires HTTPS.');
    return;
  }
  fetchCameras();
});

watch(selectedCamera, (newCamera) => {
  if (newCamera) {
    console.log('Selected camera changed, starting video stream...');
    startVideoStream(newCamera);
  }
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.video-container {
  margin-bottom: 20px;
}

.video {
  width: 100%;
  max-width: 300px;
}

.button-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #0056b3;
}

.select {
  padding: 10px;
  margin-bottom: 20px;
}

.image-container {
  margin-bottom: 20px;
}

.image {
  width: 100%;
  max-width: 300px;
}

.download-link {
  display: block;
  margin-top: 10px;
  text-decoration: none;
  color: #007bff;
  cursor: pointer;
}

.download-link:hover {
  text-decoration: underline;
}

.canvas {
  display: none;
}
</style>
