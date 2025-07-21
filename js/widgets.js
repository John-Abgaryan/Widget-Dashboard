let draggingWidget = null;
let widgetOffsetX = 0;
let widgetOffsetY = 0;

document.querySelectorAll('.widget-btn').forEach(btn => {
    btn.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('widget-type', btn.dataset.type);
    });
});

whiteboard.addEventListener('dragover', function(e) {
    e.preventDefault();
});

whiteboard.addEventListener('drop', function(e) {
    e.preventDefault();
    const type = e.dataTransfer.getData('widget-type');
    if (type) {
        addWidgetToWhiteboard(type, e.clientX, e.clientY);
    }
});

function addWidgetToWhiteboard(type, clientX, clientY) {
    const widget = document.createElement('div');
    widget.className = 'widget';
    widget.id = 'widget-' + Date.now();
    widget.dataset.type = type;

    let defaultWidth, defaultHeight;

    let contentHTML = '';
    switch(type) {
        case 'text':
            defaultWidth = 250;
            defaultHeight = 200;
            contentHTML = '<div class="widget-content-text" contenteditable="true">Edit me...</div>';
            break;
        case 'image':
            defaultWidth = 250;
            defaultHeight = 200;
            contentHTML = '<div class="widget-content-image">Click to upload image</div>';
            break;
        case 'clock':
            defaultWidth = 280;
            defaultHeight = 160;
            contentHTML = '<div class="widget-content-clock"></div>';
            break;
        case 'weather':
            defaultWidth = 280;
            defaultHeight = 160;
            contentHTML = '<div class="widget-content-weather">Loading weather...</div>';
            break;
        case 'chart':
            defaultWidth = 450;
            defaultHeight = 280;
            contentHTML = '<canvas class="widget-content-chart"></canvas>';
            break;
        case 'table':
            defaultWidth = 400;
            defaultHeight = 300;
            contentHTML = '<div class="widget-content-table"></div>';
            break;
        case 'video':
            defaultWidth = 300;
            defaultHeight = 180;
            contentHTML = '<div class="widget-content-video"></div>';
            break;
        case 'news':
            defaultWidth = 300;
            defaultHeight = 250;
            contentHTML = '<div class="widget-content-news">Loading news...</div>';
            break;
        default:
            defaultWidth = 200;
            defaultHeight = 150;
            contentHTML = type.charAt(0).toUpperCase() + type.slice(1);
    }

    widget.innerHTML = `
        <div class="widget-header">
            <span class="widget-drag-handle"></span>
            <span class="widget-title">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
            <button class="widget-close-btn">×</button>
        </div>
        <div class="widget-content">${contentHTML}</div>
        <div class="widget-resize-handle"></div>
    `;

    const rect = whiteboardContainer.getBoundingClientRect();
    const whiteboardX = (clientX - rect.left - panX) / scale;
    const whiteboardY = (clientY - rect.top - panY) / scale;
    
    widget.style.width = `${defaultWidth}px`;
    widget.style.height = `${defaultHeight}px`;
    widget.style.left = (whiteboardX - defaultWidth / 2) + 'px';
    widget.style.top = (whiteboardY - defaultHeight / 2) + 'px';
    
    whiteboard.appendChild(widget);
    makeWidgetInteractive(widget);
    initializeWidgetContent(widget);
}

function createWidgetFromData(widgetData) {
    const widget = document.createElement('div');
    widget.className = 'widget';
    widget.id = widgetData.id;
    widget.setAttribute('style', widgetData.style);
    widget.dataset.type = widgetData.type;

    const decodedContent = decodeURIComponent(escape(atob(widgetData.content)));

    widget.innerHTML = `
        <div class="widget-header">
            <span class="widget-drag-handle"></span>
            <span class="widget-title">${widgetData.type.charAt(0).toUpperCase() + widgetData.type.slice(1)}</span>
            <button class="widget-close-btn">×</button>
        </div>
        <div class="widget-content">${decodedContent}</div>
        <div class="widget-resize-handle"></div>
    `;
    
    makeWidgetInteractive(widget);
    initializeWidgetContent(widget);
    
    return widget;
}

function initializeWidgetContent(widget) {
    const type = widget.dataset.type;
    const content = widget.querySelector('.widget-content');

    switch(type) {
        case 'clock':
            const clockElement = content.querySelector('.widget-content-clock');
            if (clockElement) {
                const updateClock = () => {
                    const now = new Date();
                    const timeString = now.toLocaleTimeString();
                    const dateString = now.toLocaleDateString();
                    clockElement.innerHTML = `<div class="clock-time">${timeString}</div><div class="clock-date">${dateString}</div>`;
                };
                updateClock();
                setInterval(updateClock, 1000);
            }
            break;
        case 'weather':
             const weatherElement = content.querySelector('.widget-content-weather');
            if (weatherElement) {
                setTimeout(() => {
                    weatherElement.innerHTML = `
                        <div class="weather-location">New York</div>
                        <div class="weather-temp">68°F</div>
                        <div class="weather-desc">Partly Cloudy</div>
                    `;
                }, 1000);
            }
            break;
        case 'chart':
            const canvas = content.querySelector('.widget-content-chart');
            if (canvas) {
                new Chart(canvas, {
                    type: 'bar',
                    data: {
                        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                        datasets: [{
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 2, 3],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            }
            break;
        case 'table':
            const tableContainer = content.querySelector('.widget-content-table');
            if (tableContainer) {
                tableContainer.innerHTML = `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td contenteditable="true">1</td>
                                <td contenteditable="true">Item 1</td>
                                <td contenteditable="true">100</td>
                            </tr>
                            <tr>
                                <td contenteditable="true">2</td>
                                <td contenteditable="true">Item 2</td>
                                <td contenteditable="true">250</td>
                            </tr>
                        </tbody>
                    </table>
                `;
            }
            break;
        case 'video':
            const videoContainer = content.querySelector('.widget-content-video');
            if (videoContainer) {
                videoContainer.innerHTML = `
                    <input type="text" class="video-url-input" placeholder="Enter YouTube Video URL">
                    <button class="video-load-btn">Load</button>
                `;
                const input = videoContainer.querySelector('.video-url-input');
                const button = videoContainer.querySelector('.video-load-btn');
                button.onclick = () => {
                    try {
                        const url = new URL(input.value);
                        let videoId = url.searchParams.get('v');
                        if (url.hostname === 'youtu.be') {
                            videoId = url.pathname.substring(1);
                        }
                        if (videoId) {
                            content.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                        }
                    } catch (e) {
                        console.error("Invalid URL for video widget", e);
                        alert("Please enter a valid YouTube URL.");
                    }
                };
            }
            break;
        case 'news':
            const newsContainer = content.querySelector('.widget-content-news');
            if (newsContainer) {
                const apiKey = '0a423181c8b54764ab04461d935b5259';
                const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

                if (apiKey === 'YOUR_API_KEY') {
                    newsContainer.innerHTML = 'Please add your NewsAPI.org API key to widgets.js';
                    return;
                }

                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'ok') {
                            const articles = data.articles.slice(0, 5);
                            const newsList = articles.map(article => `
                                <li><a href="${article.url}" target="_blank">${article.title}</a></li>
                            `).join('');
                            newsContainer.innerHTML = `<ul class="news-list">${newsList}</ul>`;
                        } else {
                            newsContainer.innerHTML = `Error: ${data.message}`;
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching news:', error);
                        newsContainer.innerHTML = 'Failed to load news.';
                    });
            }
            break;
        case 'image':
            const imageContent = content.querySelector('.widget-content-image');
            if (imageContent) {
                 imageContent.addEventListener('click', () => {
                    const fileInput = document.createElement('input');
                    fileInput.type = 'file';
                    fileInput.accept = 'image/*';
                    fileInput.onchange = (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                imageContent.innerHTML = `<img src="${event.target.result}" alt="User Image" style="width: 100%; height: 100%; object-fit: cover;">`;
                            };
                            reader.readAsDataURL(file);
                        }
                    };
                    fileInput.click();
                });
            }
            break;
    }
}

const panelToggle = document.getElementById('panel-toggle');
const widgetPanel = document.getElementById('widget-panel');

panelToggle.addEventListener('click', function() {
    widgetPanel.classList.toggle('open');
});

function makeWidgetInteractive(widget) {
    widget.addEventListener('contextmenu', e => e.preventDefault());

    const header = widget.querySelector('.widget-header');
    const closeBtn = widget.querySelector('.widget-close-btn');
    const resizeHandle = widget.querySelector('.widget-resize-handle');
    const content = widget.querySelector('.widget-content');
    let isResizing = false;

    const startDrag = (e) => {
        if (e.target === closeBtn) {
            return;
        }

        draggingWidget = widget;
        widget.classList.add('dragging');
        
        const rect = whiteboardContainer.getBoundingClientRect();
        const whiteboardX = (e.clientX - rect.left - panX) / scale;
        const whiteboardY = (e.clientY - rect.top - panY) / scale;
        
        widgetOffsetX = whiteboardX - parseInt(widget.style.left || 0);
        widgetOffsetY = whiteboardY - parseInt(widget.style.top || 0);
        
        document.body.style.cursor = 'grabbing';
        e.preventDefault();
        e.stopPropagation();
    };

    if (header) {
        header.addEventListener('mousedown', startDrag);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            widget.remove();
        });
    }

    if (resizeHandle) {
        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            widget.classList.add('resizing');
            document.body.style.cursor = 'nwse-resize';
            
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = parseInt(document.defaultView.getComputedStyle(widget).width, 10);
            const startHeight = parseInt(document.defaultView.getComputedStyle(widget).height, 10);

            const doResize = (e) => {
                window.requestAnimationFrame(() => {
                    if (!isResizing) return;

                    const newWidth = startWidth + (e.clientX - startX) / scale;
                    const newHeight = startHeight + (e.clientY - startY) / scale;

                    const minWidth = 150;
                    const minHeight = 100;
                    const maxWidth = 1000;
                    const maxHeight = 800;

                    widget.style.width = `${Math.min(maxWidth, Math.max(minWidth, newWidth))}px`;
                    widget.style.height = `${Math.min(maxHeight, Math.max(minHeight, newHeight))}px`;
                });
            };

            const stopResize = () => {
                isResizing = false;
                widget.classList.remove('resizing');
                document.body.style.cursor = '';
                window.removeEventListener('mousemove', doResize);
                window.removeEventListener('mouseup', stopResize);
            };

            window.addEventListener('mousemove', doResize);
            window.addEventListener('mouseup', stopResize);

            e.preventDefault();
            e.stopPropagation();
        });
    }
}

document.addEventListener('mousemove', function(e) {
    if (draggingWidget) {
        const rect = whiteboardContainer.getBoundingClientRect();
        const whiteboardX = (e.clientX - rect.left - panX) / scale;
        const whiteboardY = (e.clientY - rect.top - panY) / scale;
        
        draggingWidget.style.left = (whiteboardX - widgetOffsetX) + 'px';
        draggingWidget.style.top = (whiteboardY - widgetOffsetY) + 'px';
    }
});

document.addEventListener('mouseup', function() {
    if (draggingWidget) {
        draggingWidget.classList.remove('dragging');
        draggingWidget = null;
        document.body.style.cursor = '';
    }
});

const clearBtn = document.getElementById('clear-widgets');
let clearConfirm = false;

clearBtn.addEventListener('click', function() {
    if (!clearConfirm) {
        clearBtn.textContent = '⚠️ Are you sure?';
        clearConfirm = true;
        setTimeout(() => {
            clearBtn.textContent = '🗑️ Clear All';
            clearConfirm = false;
        }, 2000);
    } else {
        const widgets = whiteboard.querySelectorAll('.widget');
        widgets.forEach(w => w.remove());
        clearBtn.textContent = '🗑️ Clear All';
        clearConfirm = false;
    }
});
