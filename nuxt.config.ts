
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
        src:"icons/icon_512x512.png",
        sizes:"512x512",
        type:"image/png",
      }]
    },
    workbox: {
      navigateFallback: "/",
    },
    
    devOptions:{
      enabled:true,
      type:'module',
    },
    },
    ssr:false,

});