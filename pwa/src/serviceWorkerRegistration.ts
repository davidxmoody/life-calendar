export function register() {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing
            if (installingWorker == null) {
              return
            }
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  alert("New service worker 2, reloading")
                  window.location.reload()
                }
              }
            }
          }
        })
        .catch((error) => {
          console.error("Error during service worker registration:", error)
        })
    })
  }
}
