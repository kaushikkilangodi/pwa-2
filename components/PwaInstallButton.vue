<template>
    <div>
      <button v-if="deferredPrompt" @click="installApp">Install App</button>
      
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useHead } from '#imports';
  useHead({
  meta: [
    { name: 'theme-color', content: '#317EFB' }
  ]
});
  const deferredPrompt = ref(null);
  
  const installApp = async () => {
    if (deferredPrompt.value) {
      deferredPrompt.value.prompt();
      const { outcome } = await deferredPrompt.value.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        deferredPrompt.value = null;
      } else {
        console.log('User dismissed the install prompt');
      }
    }
  };
  
  onMounted(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPrompt.value = e;
    };
  
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  
    onBeforeUnmount(() => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    });
  });
  </script>
  
  <style>
  button {
    padding: 10px 20px;
    background-color: #317EFB;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  button:hover {
    background-color: #255a9d;
  }
  </style>
  