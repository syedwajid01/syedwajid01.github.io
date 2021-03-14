'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "63b2e6fe13b4228c9fd922877723a90e",
"assets/assets/fonts/Custom.ttf": "1ca6e6dcc3925a045545fd0c90e67ae1",
"assets/assets/fonts/Montserrat-Regular.ttf": "ee6539921d713482b8ccd4d0d23961bb",
"assets/assets/images/algorithm.png": "42bf8c1e3fc2c0a91e1ba26f17552d05",
"assets/assets/images/bari_bhai.jpg": "1bab68ab8500fd4fb49c96d4736a9a4b",
"assets/assets/images/code_chef.jpg": "dc7b8126e6d7ca46440cadcd373ef1ef",
"assets/assets/images/dsa_book1.jpg": "8ad13029ebc8dd6a2fe35bc97e5f4f2b",
"assets/assets/images/dsa_book2.jpg": "076c2389178eb3a5584ff0c5c24c1fdf",
"assets/assets/images/dsa_book3.jpg": "44e056917e029ec4d0c88534efcc8711",
"assets/assets/images/dsa_book4.jpg": "855a3aff22f3530b24a99dad109c0288",
"assets/assets/images/dsa_book5.jpg": "d3dac52b570881f944f71043f21cfff1",
"assets/assets/images/dsa_book6.jpg": "59af0b259b5851c05bff182b4d910836",
"assets/assets/images/dsa_book7.jpg": "0e2c7a21f7147f47a6e6ddfbe10e383c",
"assets/assets/images/dsa_book8.jpg": "5972796b566928ce72d65530e743fe1b",
"assets/assets/images/gaurav.jpg": "e96d67399df9011df4daf090e3be0fa3",
"assets/assets/images/gfg.png": "3af424142f923551161665fd7bff3ff3",
"assets/assets/images/intro_to_algos.jpg": "88c444662039c413231085759e3cfc46",
"assets/assets/images/javatpoint.png": "045300d7d414d5e5ffa31504704f0ad6",
"assets/assets/images/programiz_logo.jpg": "a92d28c86af1b997026df04bf668020c",
"assets/assets/images/rachit.jpg": "a7480233ffeb9c7807c8f1fed5f1dd74",
"assets/assets/images/study_tonight.jpg": "6def915e53a6710cb1ec8ba38df38b28",
"assets/assets/images/tushar.jpg": "c508184da866ea2a7feffe21134d35c3",
"assets/assets/images/tutorial_point.png": "80340af85a110c90ef9a47554e9cccd0",
"assets/FontManifest.json": "182c5542ceef215eb418713e2cf2409f",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "e6862d26f63a4c6982f3e9d967e9714c",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b14fcf3ee94e3ace300b192e9e7c8c5d",
"assets/packages/flutter_tindercard/assets/welcome0.png": "97e534de38f2045e9f22ea0c707a2c96",
"assets/packages/flutter_tindercard/assets/welcome1.png": "0e88dad1f73f380fddd50c74a42ae6e8",
"assets/packages/flutter_tindercard/assets/welcome2.png": "b8a1d4b4e68e4413c7d791d742bb97c2",
"assets/packages/material_design_icons_flutter/lib/fonts/materialdesignicons-webfont.ttf": "3e722fd57a6db80ee119f0e2c230ccff",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "783ad51bec4e8411d5c5c1a9e0c8e15a",
"/": "783ad51bec4e8411d5c5c1a9e0c8e15a",
"main.dart.js": "a5a8c19ea97ec64188213a4947f3c251",
"manifest.json": "6751b372e33e9ba5f3e2f8c37000a615",
"version.json": "5e6e78f83baa83b057de97524201b464"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
