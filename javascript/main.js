document.addEventListener('DOMContentLoaded', function() {
    adjustFontSize()
    displayScreenSize()
});

document.addEventListener('resize', function() {
    adjustFontSize()
    displayScreenSize()
});

function adjustFontSize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;
    const orientation = (screenWidth > screenHeight) ? 'landscape' : 'portrait';
    
    let baseFontSizePercentage;
    
    if (orientation === 'landscape') {
        baseFontSizePercentage = ((screenWidth / 1280) * 62.5) / pixelRatio;
    } else {
        baseFontSizePercentage = ((screenHeight / 1280) * 62.5) / pixelRatio;
    }
    
    document.documentElement.style.fontSize = baseFontSizePercentage + '%';
}

function displayScreenSize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;
    const screenSizeElement = document.getElementById('screen-details');
    const orientation = (screenWidth > screenHeight) ? 'landscape' : 'portrait';

    if (screenSizeElement) {
        screenSizeElement.textContent = `width: ${screenWidth}, height: ${screenHeight}, ratio: ${pixelRatio}, orientation: ${orientation}`;
    }
}