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
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    cameraDevices.value = videoDevices;
    if (videoDevices.length > 0) {
      selectedCamera.value = videoDevices[0].deviceId;
    }
  } catch (error) {
    console.error('Error fetching camera devices:', error);
  }
};

const startVideoStream = async (deviceId) => {
  const videoElement = videoRef.value;
  try {
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
    };
  } catch (error) {
    console.error('Error accessing the camera:', error);
  }
};

const handleCaptureClick = () => {
  const videoElement = videoRef.value;
  const canvas = canvasRef.value;
  const context = canvas.getContext('2d');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  const imageUrl = canvas.toDataURL('image/png');
  imageURL.value = imageUrl;
};

const handleStartStopRecording = () => {
  if (isRecording.value) {
    mediaRecorder.value.stop();
    isRecording.value = false;
  } else {
    mediaRecorder.value.start();
    isRecording.value = true;
  }
};

const handleCameraChange = (event) => {
  selectedCamera.value = event.target.value;
};

const cancelImageCapture = () => {
  imageURL.value = null;
};

const cancelVideoCapture = () => {
  videoURL.value = null;
};

onMounted(() => {
  fetchCameras();
});

watch(selectedCamera, (newCamera) => {
  if (newCamera) {
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