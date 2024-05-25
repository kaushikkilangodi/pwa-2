<template>
    <div>
      <video ref="video" autoplay></video>
      <button @click="startCamera">Start Camera</button>
      <button @click="stopCamera">Stop Camera</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        stream: null
      };
    },
    methods: {
      async startCamera() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          this.$refs.video.srcObject = stream;
          this.stream = stream;
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      },
      stopCamera() {
        if (this.stream) {
          this.stream.getTracks().forEach(track => {
            track.stop();
          });
          this.$refs.video.srcObject = null;
          this.stream = null;
        }
      }
    }
  };
  </script>
  
  <style>
  /* Add your CSS styles here */
  </style>
  