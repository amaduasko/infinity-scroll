const imageContainer = document.getElementById('image-container')
const loader = document.getElementById('loader')

let readyToLoad = false
let isInitialLoad = true
let imagesLoaded = 0
let totalImages = 0

// Unsplash api
const initialCount = 5
const apiKey = 'YOUR_ACCESS_KEY'
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`

// helper func

const setReadyToLoad = (state) => (readyToLoad = state)

const setApiUrlCount = (count) =>
    (apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`)

const setIsInitialLoad = (state) => (isInitialLoad = state)

const setAttributes = (element, attributes) => {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key])
    }
}

const imageLoaded = () => {
    imagesLoaded++
    if (imagesLoaded === totalImages) {
        setReadyToLoad(!readyToLoad)
        loader.hidden = true
    }
}

// Create Elements For Links & Photos, add to dom
const displayPhotos = (photosArray) => {
    if (photosArray && photosArray.length) {
        imagesLoaded = 0
        totalImages = photosArray.length
        photosArray.forEach((photo) => {
            // link
            const link = document.createElement('a')
            setAttributes(link, {
                href: photo.links.html,
                target: '_blank',
            })

            // image
            const img = document.createElement('img')
            setAttributes(img, {
                src: photo.urls.regular,
                alt: photo.alt_dersciption,
                title: photo.alt_dersciption,
            })

            //add eventlistener to img

            img.addEventListener('load', imageLoaded)

            // adding to dom
            link.appendChild(img)
            imageContainer.appendChild(link)
        })
    }
}

// Get photos from Unsplash API

const getPhotos = async () => {
    try {
        const response = await fetch(apiUrl)
        const photosArray = await response.json()
        displayPhotos(photosArray)
        if (isInitialLoad) {
            setApiUrlCount(30)
            setIsInitialLoad(!isInitialLoad)
        }
    } catch (error) {
        console.log('Ooops, something went wrong : ', error)
    }
}

//Check scroll position and upload more photos
window.addEventListener('scroll', () => {
    if (
        window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 1000 &&
        readyToLoad
    ) {
        setReadyToLoad(!readyToLoad)
        getPhotos()
    }
})

//onload

window.onload = () => getPhotos()
