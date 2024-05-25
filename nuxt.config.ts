// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@vite-pwa/nuxt"],
  pwa:{
    manifest:{
      name:"nuxt 3 PWA",
      short_name:"nuxt 3 pwa",
      description:"testing PWA",
      theme_color :"#000000",
      icons:[{
        src:"icons/icon.png",
        sizes:"64x64",
        type:"image/png",
        
      },
    {
      src:"icons/icon.png",
        sizes:"144x144",
        type:"image/png",
    },
  {
    src:"icons/icon.png",
        sizes:"192x192",
        type:"image/png",
  },
{
  src:"icons/icon.png",
        sizes:"512x512",
        type:"image/png",
        purpose:"maskable",
}]
    },
    workbox:{
      navigateFallback:'/',
    },
    devOptions:{
      enabled:true,
      type:'module',
    },
  },

});