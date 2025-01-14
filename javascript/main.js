
document.addEventListener('DOMContentLoaded', function() {
    adjustFontSize()
    getImageData()
    setInterval(serviceDetailRotation, 5000);
    // startScreenSaver();
});

document.addEventListener('resize', function() {
    adjustFontSize()
});

const test_data_path = '../utils/before-after-test-data.json';
const rightColumn = document.getElementById('right-column');
const menuSections = document.getElementsByClassName('service-section')
let imageSets = []

function getImageData() {
    fetch(test_data_path)
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

// function startScreenSaver() {
//     const menuDisplayTime = 15000; // 15 seconds for TESTING
//     const slideshowImageInterval = 5000; // 5 seconds for TESTING
//     const slideshowElement = document.getElementById('slideshow');
//     const menuElement = document.querySelector('.menu-wrapper');

//    // Dynamically define your image sets here
//     const imageSets = [
//         {
//             before: '../images/before-n-after/before-after-set-01.webp',
//             after: '../images/before-n-after/before-after-set-02.webp' 
//         },
//         {
//             before: '../images/before-n-after/before-after-set-03.webp',
//             after: '../images/before-n-after/before-after-set-04.webp'
//         },
//         {
//             before: '../images/before-n-after/before-after-set-05.webp',
//             after: '../images/before-n-after/before-after-set-06.webp'
//         },
//         {
//             before: '../images/before-n-after/before-after-set-07.webp',
//             after: '../images/before-n-after/before-after-set-08.webp'
//         },
//         // Add more pairs as needed
//     ];

//     let currentSetIndex = 0;

//     function showMenu() {
//         menuElement.style.display = 'flex';
//         slideshowElement.style.display = 'none';

//         // Return to the slideshow after the menu display time
//         setTimeout(showSlideshow, menuDisplayTime);
//     }

//     function showSlideshow() {
//         menuElement.style.display = 'none';
//         slideshowElement.style.display = 'flex';

//         function displayImagePair() {
//             // Clear and update slideshow content dynamically
//             slideshowElement.innerHTML = ''; // Clear previous content

//             if (currentSetIndex >= imageSets.length) {
//                 currentSetIndex = 0; // Reset to the first set
//             }

//             const beforeImage = document.createElement('img');
//             beforeImage.src = imageSets[currentSetIndex].before;
//             beforeImage.classList.add('slideshow-image');

//             const afterImage = document.createElement('img');
//             afterImage.src = imageSets[currentSetIndex].after;
//             afterImage.classList.add('slideshow-image');

//             slideshowElement.appendChild(beforeImage);
//             slideshowElement.appendChild(afterImage);

//             // Show "before" image, then "after" image with a delay
//             beforeImage.style.display = 'block';
//             setTimeout(() => {
//                 beforeImage.style.display = 'none';
//                 afterImage.style.display = 'block';
//             }, slideshowImageInterval / 2);

//             currentSetIndex++;
//         }

//         // Immediately display the first pair
//         displayImagePair()

//         // Start cycling through image pairs
//         const slideshowCycle = setInterval(displayImagePair, slideshowImageInterval);

//         // Stop slideshow and return to menu after all image pairs are shown
//         setTimeout(() => {
//             clearInterval(slideshowCycle);
//             showMenu();
//         }, slideshowImageInterval * imageSets.length);
//     }

//     // Start with the menu
//     showMenu();
// }

function adjustFontSize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    // const pixelRatio = window.devicePixelRatio || 1;
    const orientation = (screenWidth > screenHeight) ? 'landscape' : 'portrait';
    
    let baseFontSizePercentage;
    
    if (orientation === 'landscape') {
        // baseFontSizePercentage = ((screenWidth / 1920) * 62.5) / pixelRatio;
        baseFontSizePercentage = ((screenWidth / 1920) * 62.5);
    } else {
        // baseFontSizePercentage = ((screenHeight / 1920) * 62.5) / pixelRatio;
        baseFontSizePercentage = ((screenHeight / 1920) * 62.5);
    }
    
    document.documentElement.style.fontSize = baseFontSizePercentage + '%';
    console.log(document.documentElement.style.fontSize)
}



function serviceDetailRotation() {
    if (imageSets.length === 0) {
        console.warn('no image sets available yet.');
        return;
    }
    rightColumn.innerHTML = '';

    const randomIndex = Math.floor(Math.random() * imageSets.length);
    const detailItem = imageSets[randomIndex];

    // remove active status from all sections
    if (menuSections.length > 0) {
        Array.from(menuSections).forEach(section => section.classList.remove('section-active'));
    }

    const detailsContainerDiv = document.createElement('div');
    detailsContainerDiv.className = 'details-container';

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

    const menuSectionDiv = document.getElementById(`${detailItem['service-name']}`)
    menuSectionDiv.classList.add('section-active');
    
    rightColumn.appendChild(detailsContainerDiv);   
}