let scale = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let startX, startY;

const whiteboard = document.getElementById('whiteboard');
const whiteboardContainer = document.querySelector('.whiteboard-container');

const WHITEBOARD_WIDTH = 2400;
const WHITEBOARD_HEIGHT = 1080;

function updateTransform() {
    const containerWidth = whiteboardContainer.offsetWidth;
    const containerHeight = whiteboardContainer.offsetHeight;
    
    const minScaleX = containerWidth / WHITEBOARD_WIDTH;
    const minScaleY = containerHeight / WHITEBOARD_HEIGHT;
    const minScale = Math.min(minScaleX, minScaleY);
    
    scale = Math.max(scale, minScale);
    
    const scaledWidth = WHITEBOARD_WIDTH * scale;
    const scaledHeight = WHITEBOARD_HEIGHT * scale;
    
    let maxPanX, minPanX, maxPanY, minPanY;
    
    if (scaledWidth <= containerWidth) {
        maxPanX = minPanX = (containerWidth - scaledWidth) / 2;
    } else {
        maxPanX = 0;
        minPanX = containerWidth - scaledWidth;
    }
    
    if (scaledHeight <= containerHeight) {
        maxPanY = minPanY = (containerHeight - scaledHeight) / 2;
    } else {
        maxPanY = 0;
        minPanY = containerHeight - scaledHeight;
    }
    
    panX = Math.max(minPanX, Math.min(maxPanX, panX));
    panY = Math.max(minPanY, Math.min(maxPanY, panY));
    
    whiteboard.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
}

function initializeWhiteboard() {
    const containerWidth = whiteboardContainer.offsetWidth;
    const containerHeight = whiteboardContainer.offsetHeight;
    
    if (WHITEBOARD_WIDTH <= containerWidth) {
        panX = (containerWidth - WHITEBOARD_WIDTH) / 2;
    } else {
        panX = 0;
    }
    
    if (WHITEBOARD_HEIGHT <= containerHeight) {
        panY = (containerHeight - WHITEBOARD_HEIGHT) / 2;
    } else {
        panY = 0;
    }
    
    updateTransform();
}

whiteboard.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('widget')) return;
    if (e.button !== 0) return;
    
    isPanning = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    whiteboard.style.cursor = 'grabbing';
    e.preventDefault();
});

document.addEventListener('mousemove', function(e) {
    if (isPanning) {
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        updateTransform();
    }
});

document.addEventListener('mouseup', function() {
    if (isPanning) {
        isPanning = false;
        whiteboard.style.cursor = 'grab';
    }
});

whiteboardContainer.addEventListener('wheel', function(e) {
    e.preventDefault();
    
    const rect = whiteboardContainer.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const beforeZoomX = (mouseX - panX) / scale;
    const beforeZoomY = (mouseY - panY) / scale;
    
    const containerWidth = whiteboardContainer.offsetWidth;
    const containerHeight = whiteboardContainer.offsetHeight;
    const minScaleX = containerWidth / WHITEBOARD_WIDTH;
    const minScaleY = containerHeight / WHITEBOARD_HEIGHT;
    const minScale = Math.min(minScaleX, minScaleY);
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(minScale, scale * zoomFactor), 5.0);
    
    const afterZoomX = beforeZoomX * newScale;
    const afterZoomY = beforeZoomY * newScale;
    
    panX = mouseX - afterZoomX;
    panY = mouseY - afterZoomY;
    scale = newScale;
    
    updateTransform();
}, { passive: false });

document.getElementById('zoom-in').addEventListener('click', function() {
    const centerX = whiteboardContainer.offsetWidth / 2;
    const centerY = whiteboardContainer.offsetHeight / 2;
    
    const beforeZoomX = (centerX - panX) / scale;
    const beforeZoomY = (centerY - panY) / scale;
    
    scale = Math.min(scale * 1.2, 5.0);
    
    const afterZoomX = beforeZoomX * scale;
    const afterZoomY = beforeZoomY * scale;
    
    panX = centerX - afterZoomX;
    panY = centerY - afterZoomY;
    
    updateTransform();
});

document.getElementById('zoom-out').addEventListener('click', function() {
    const centerX = whiteboardContainer.offsetWidth / 2;
    const centerY = whiteboardContainer.offsetHeight / 2;
    
    const beforeZoomX = (centerX - panX) / scale;
    const beforeZoomY = (centerY - panY) / scale;
    
    scale = Math.max(scale * 0.8, minScale);
    
    const afterZoomX = beforeZoomX * scale;
    const afterZoomY = beforeZoomY * scale;
    
    panX = centerX - afterZoomX;
    panY = centerY - afterZoomY;
    
    updateTransform();
});

document.getElementById('reset-view').addEventListener('click', function() {
    scale = 1;
    initializeWhiteboard();
});
