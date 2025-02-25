const test_data_path = '../utils/before-after-test-data.json';
const rightColumn = document.getElementById('right-column');
const menuSections = document.getElementsByClassName('service-section')
let imageSets = []
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    adjustFontSize()
    getImageData().then(() => {
        serviceDetailRotation(); // immediately show the first item
        setInterval(serviceDetailRotation, 15000); // start cycling
    });
});

document.addEventListener('resize', function() {
    adjustFontSize()
});

function getImageData() {
    return fetch(test_data_path)
        .then(resp => {
            if (!resp.ok) {
                throw new Error(`http error! status: ${resp.status}`);
            }
            return resp.json();
        })
        .then(data => {
            imageSets = data;
        })
        .catch(error => {
            console.error(`error fetching json:`, error);
        });
}

function adjustFontSize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const testData = document.getElementById('testData')
    testData.innerHTML = ""

    // define a reference virtual screen size
    const virtualWidth = 1920;
    const virtualHeight = 1080;

    // calculate scaling factor based on the smaller dimension
    const scaleFactor = Math.min(screenWidth / virtualWidth, screenHeight / virtualHeight);

    // set the root font size based on this scaling facor
    const baseFontSize = scaleFactor * 10; // 10px at scale 1
    document.documentElement.style.fontSize = baseFontSize + 'px';

    testData.innerHTML = `
        <div>width: ${screenWidth}, height: ${screenHeight}, font: ${document.documentElement.style.fontSize}</div>
    `
    
    console.log('Adjusted font size: ', document.documentElement.style.fontSize);
}

function serviceDetailRotation() {
    if (imageSets.length === 0) {
        console.warn('no image sets available yet.');
        return;
    }

    const existingDetails = rightColumn.querySelector('.details-container');

    // remove the active status from the currently active card
    const activeSection = document.querySelector('.section-active');
    if (activeSection) {
        activeSection.classList.remove('section-active');
    }

    // get the current item and increment the index
    const detailItem = imageSets[currentImageIndex];
    currentImageIndex = (currentImageIndex + 1) % imageSets.length; // wrap around to the start if at the end

    // add active status to the new section
    const newActiveSection = document.getElementById(detailItem['service-name']);
    if (newActiveSection) {
        newActiveSection.classList.add('section-active')
    }

    // smooth transition for right column updates
    if (existingDetails) {
        existingDetails.style.opacity = '0'; // fade out slightly
        existingDetails.style.transform = 'scale(0.98)';
        setTimeout(() => {
            existingDetails.remove();
            addNewDetails(detailItem);
        }, 500); // match the css transition duration
    } else {
        addNewDetails(detailItem);
    }
}

function addNewDetails(detailItem) {
    const detailsContainerDiv = document.createElement('div');
    detailsContainerDiv.className = 'details-container active';
    
    const imageWrapperDiv = document.createElement('div');
    imageWrapperDiv.className = `image-wrapper ${detailItem['aspect-layout']}`;
    
    const beforeImage = document.createElement('img');
    beforeImage.className = `${detailItem['aspect-layout']}-layout`;
    beforeImage.src = detailItem['before-image'];
    
    const afterImage = document.createElement('img');
    afterImage.className = `${detailItem['aspect-layout']}-layout`;
    afterImage.src = detailItem['after-image'];
    
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'description';
    descriptionDiv.textContent = detailItem['service-details'];
    
    imageWrapperDiv.appendChild(beforeImage);
    imageWrapperDiv.appendChild(afterImage);
    
    detailsContainerDiv.appendChild(imageWrapperDiv);
    detailsContainerDiv.appendChild(descriptionDiv);
    
    rightColumn.appendChild(detailsContainerDiv);
    
    setTimeout(() => {
        detailsContainerDiv.classList.add('active');
    }, 10); // slight delay to ensure the transition is noticeable

}