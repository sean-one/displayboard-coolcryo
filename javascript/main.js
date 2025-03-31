const rightColumn = document.getElementById('right-column');
const menuSections = document.getElementsByClassName('service-section')
let images = []
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    setBaseMeasurement()
    startSlideshow()
    // getImageData().then(() => {
    //     serviceDetailRotation(); // immediately show the first item
    //     setInterval(serviceDetailRotation, 15000); // start cycling
    // });
});

document.addEventListener('resize', function() {
    setBaseMeasurement()
});

// test function - gives information on the screen when needed
function setBaseMeasurement() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    // const testData = document.getElementById('testData')
    // testData.innerHTML = ""

    // define a reference virtual screen size
    const virtualWidth = 1920;
    const virtualHeight = 1080;

    // calculate scaling factor based on the larger ratio
    const scaleFactor = Math.max(screenWidth / virtualWidth, screenHeight / virtualHeight);

    // set the base root font size but prevent it from shrinking below 10px
    const baseFontSize = Math.max(scaleFactor * 10, 10); // ensures minimum of 10px
    document.documentElement.style.fontSize = baseFontSize + 'px';

    // testData.innerHTML = `
    //     <div>width: ${screenWidth}, height: ${screenHeight}, font: ${document.documentElement.style.fontSize}</div>
    // `

    console.log('Adjusted font size: ', document.documentElement.style.fontSize);
}

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

    const imgElement = document.getElementById("slideImage")

    function changeImage() {
        if (images.length === 0) return;

        imgElement.src = images[currentImageIndex];
        currentImageIndex++;

        if (currentImageIndex >= images.length) {
            // end of cycle -> reshuffle and restart
            shuffleImages();
            currentImageIndex = 0;
        }
    }

    changeImage(); // show first image
    setInterval(changeImage, 3000); // change image every 3 seconds
}