const rightColumn = document.getElementById('right-column');
const menuSections = document.getElementsByClassName('service-section')
let images = []
let currentImageIndex = 0;
let slideCounter = 0;
const slideDelay = 10000; // 10 seconds per image
const adDisplayTime = 15000; // 15 seconds for ad image

document.addEventListener('DOMContentLoaded', function() {
    setBaseMeasurement()
    startSlideshow()
});

document.addEventListener('resize', function() {
    setBaseMeasurement()
});

// set base font size based on the screen size
function setBaseMeasurement() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // define a reference virtual screen size
    const virtualWidth = 1920;
    const virtualHeight = 1080;

    // calculate scaling factor based on the larger ratio
    const scaleFactor = Math.max(screenWidth / virtualWidth, screenHeight / virtualHeight);

    // set the base root font size but prevent it from shrinking below 10px
    const baseFontSize = Math.max(scaleFactor * 10, 10); // ensures minimum of 10px
    document.documentElement.style.fontSize = baseFontSize + 'px';

    // console.log('Adjusted font size: ', document.documentElement.style.fontSize);
}

// get list of all image src text
async function fetchImages() {
    try {
        const response = await fetch("../images.json");
        const jsonData = await response.json()

        images = jsonData.map(file => `images/slide_media/${file}`);
        shuffleImages();
        
    } catch (error) {
        console.error('Error loading images:', error);
    }
}

// shuffle images src links and create a random order
// none of images at the end of the previous array at the start of the new one
function shuffleImages() {
    if (images.length < 6) {
        // If fewer than 6 images, just do a simple shuffle
        randomShuffle(images);
        return;
    }

    let quarterSize = Math.max(1, Math.floor(images.length / 4));

    // **Step 1: Remove the last 25% (these should NOT appear in the first 25% of the new cycle)**
    let lastQuarter = images.slice(-quarterSize);  // Extract last 25%
    let remainingImages = images.slice(0, -quarterSize);  // Remaining 75%

    // **Step 2: Shuffle the remaining 75%**
    randomShuffle(remainingImages);

    // **Step 3: Extract a new first 25% from the shuffled remaining images**
    let firstQuarter = remainingImages.splice(0, quarterSize);

    // **Step 4: Combine remaining images + last quarter and shuffle again**
    let middleImages = [...remainingImages, ...lastQuarter];
    randomShuffle(middleImages);  // Ensure last quarter doesn't just stay grouped

    // **Step 5: Construct the final shuffled list**
    images = [...firstQuarter, ...middleImages];
}

function randomShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function startSlideshow() {
    await fetchImages(); // load images at start up
    const adFrequency = Math.floor(images.length/3);

    const imgElement = document.getElementById("slideImage")

    function showAdThenResume() {
        imgElement.src = 'images/slide_ads/care-credit.webp'

        setTimeout(() => {
            changeImage();
        }, adDisplayTime);
    }

    function changeImage() {
        if (images.length === 0) return;

        if (slideCounter > 0 && slideCounter % adFrequency === 0) {
            slideCounter++
            showAdThenResume();
            return;
        }

        imgElement.src = images[currentImageIndex];
        currentImageIndex++;
        console.log(`currentImageIndex: ${currentImageIndex}`)
        slideCounter++
        console.log(`slideCounter: ${slideCounter}`)

        if (currentImageIndex >= images.length) {
            // end of cycle -> reshuffle and restart
            shuffleImages();
            currentImageIndex = 0;
            slideCounter = 0;
        }
    }

    changeImage(); // show first image
    setInterval(changeImage, slideDelay); // change image every 3 seconds
}