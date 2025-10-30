# Replit WakaTime Hackatime Extension

## How do you use this!

It's not that hard I promise, just install some chrome ext's, userscripts and you're all done!

## Pre Requisites

* tampermonkey! ([https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)) (**please make sure you allow user scripts on the ext**)
* hackatime account ([https://hackatime.hackclub.com](https://hackatime.hackclub.com))

## Installation

1. Click on the tampermonkey icon on your browser toolbar
   ![](https://hc-cdn.hel1.your-objectstorage.com/s/v3/8866050228b834c5200031613c986ae25ec12642_image.png)

2. Click on create a new script
   ![](https://hc-cdn.hel1.your-objectstorage.com/s/v3/4f4a21fc5bacf6951c6355a1e68c33a92280a833_image.png)

3. Paste the code from [`userscript.js`](./userscript.js) into the editor that opens up
   ![](https://hc-cdn.hel1.your-objectstorage.com/s/v3/7fb22c75db3a2eef403348f2dc95d0ad99058b58_image.png)

4. Grab your hackatime **api key** from [here](https://hackatime.hackclub.com/my/settings)
   ![](https://hc-cdn.hel1.your-objectstorage.com/s/v3/b41c38a32184e5b5ea19d8fa6c12c6613f3cfd7c_image.png)

5. Open replit and paste your api key into the prompt popup
   *psst.. you can always change your key by clearing you localstorage! `localStorage.removeItem("hkey")`*

![](https://hc-cdn.hel1.your-objectstorage.com/s/v3/b6e4746c469ece9191392d1b68638a070b0be27f_image.png)

6. Start hacking away! Every 30s of when you are coding it will send a heartbeat to hackatime (aka track your coding time!)

If you encounter any issues please email [me](mailto:neon+hackatime@hackclub.com) or `@Neon` on slack!
