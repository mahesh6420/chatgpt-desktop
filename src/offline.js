// const fs = require('fs')
// const path = require('path')
// const { ipcRenderer } = require('electron')

// // Set up variables for tracking visited pages
// const pagesDirectory = path.join(__dirname, 'pages')
// const pages = new Map()
// let currentPage = null
// let currentUrl = null

// // Load index.html if we are offline
// function loadOffline() {
//   const indexPath = path.join(__dirname, 'index.html')
//   fs.readFile(indexPath, 'utf-8', (err, data) => {
//     if (err) {
//       console.error(`Error loading offline page: ${err}`)
//       return
//     }
//     document.documentElement.innerHTML = data
//   })
// }

// // Load a page from disk
// function loadPage(pageUrl) {
//   const filename = encodeURIComponent(pageUrl) + '.html'
//   const pagePath = path.join(pagesDirectory, filename)
//   fs.readFile(pagePath, 'utf-8', (err, data) => {
//     if (err) {
//       console.error(`Error loading page ${pageUrl}: ${err}`)
//       return
//     }
//     document.documentElement.innerHTML = data
//     currentPage = pageUrl
//   })
// }

// // Save a page to disk
// function savePage(pageUrl, pageTitle) {
//   if (pages.has(pageUrl)) {
//     // Update the last visited time if we already have the page in our map
//     pages.get(pageUrl).lastVisited = Date.now()
//     return
//   }

//   // Create a new entry in our pages map
//   const newPage = {
//     title: pageTitle,
//     lastVisited: Date.now()
//   }
//   pages.set(pageUrl, newPage)

//   // Write the page to disk
//   const filename = encodeURIComponent(pageUrl) + '.html'
//   const pagePath = path.join(pagesDirectory, filename)
//   fs.writeFile(pagePath, document.documentElement.innerHTML, err => {
//     if (err) {
//       console.error(`Error saving page ${pageUrl}: ${err}`)
//       return
//     }
//     console.log(`Saved page ${pageUrl} to disk.`)
//   })
// }

// // Delete pages that haven't been visited in a while
// function deleteOldPages() {
//   const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
//   const now = Date.now()
//   for (let [pageUrl, pageInfo] of pages.entries()) {
//     if (now - pageInfo.lastVisited > maxAge) {
//       pages.delete(pageUrl)
//       const filename = encodeURIComponent(pageUrl) + '.html'
//       const pagePath = path.join(pagesDirectory, filename)
//       fs.unlink(pagePath, err => {
//         if (err) {
//           console.error(`Error deleting page ${pageUrl}: ${err}`)
//           return
//         }
//         console.log(`Deleted page ${pageUrl} from disk.`)
//       })
//     }
//   }
// }

// // Load the index.html file if we are offline
// if (!navigator.onLine) {
//   loadOffline()
// }

// // Listen for messages from the main process
// ipcRenderer.on('load-page', (event, url) => {
//   currentUrl = url
//   if (pages.has(url)) {
//     // Load the page from our map if we have it
//     loadPage(url)
//   } else {
//     // Otherwise, load the page from the server and save it to disk
//     const title = document.title
//     savePage(url, title)
//   }
// })

// // Save visited pages every 10 seconds
// setInterval(() => {
//   deleteOldPages()
// }, 60 * 60 * 1000) // Delete old pages every hour