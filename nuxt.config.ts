
export default defineNuxtConfig({
  
  modules: ["@vite-pwa/nuxt"],
  pwa:{
    manifest:{
      name:"nuxt 3PWA",
      short_name:"nuxt 3 pwa",
      theme_color :"#000000",
      
  
      icons:[
      {
        src: "icons/icon_64x64.png",
        sizes: "64x64",
        type: "image/png",
        purpose:"maskable"
      },
      {
        src: "icons/icon_144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "icons/icon_192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "icons/icon_512x512.png",
        sizes: "512x512",
        type: "image/png",
      },],
      description:"testing",
      screenshots:[{
        src:"icons/home.png",
        sizes:"512x512",
        type:"image/png",
        form_factor:"wide",

      },
      {
        src:"icons/install.png",
        sizes:"144x144",
        type:"image/png",
        form_factor:"narrow",
        
      },]
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style',
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources',
          }
        },
        {
          urlPattern: ({ request }) => request.destination === 'image' || request.destination === 'video',
          handler: 'CacheFirst',
          options: {
            cacheName: 'media-resources',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
      ],
    },
  
    
    devOptions:{
      enabled:true,
      type:'module',
    },
    },
    ssr:false,

});