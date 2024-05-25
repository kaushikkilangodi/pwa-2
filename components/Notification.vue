<template>
    <div class="container">
      <h1 class="title">Notification</h1>
      <form @submit.prevent="handleSubmit" class="form">
        <input
          type="text"
          placeholder="Enter notification message"
          v-model="notificationMessage"
          class="input"
        />
        <button type="submit" class="button">Send Notification</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const notificationMessage = ref('');
  
  const sendNotification = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return;
    }
  
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Permission denied to show notifications');
        return;
      }
    }
  
    const title = 'What PWA Can Do Today';
    const options = {
      body: notificationMessage.value,
    };
  
    if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    } else {
      new Notification(title, options);
    }
  };
  
  const handleSubmit = (e) => {
    sendNotification();
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #ff7600;
    padding: 20px;
  }
  
  .title {
    font-size: 32px;
    margin-bottom: 30px;
    color: #333;
  }
  
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .input {
    width: 300px;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    transition: border-color 0.3s;
  }
  
  .input:focus {
    border-color: #007bff;
    outline: none;
  }
  
  .button {
    padding: 12px 24px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.3s;
  }
  
  .button:hover {
    background-color: #0056b3;
  }
  
  .button:active {
    background-color: #004494;
  }
  </style>
  