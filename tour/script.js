document.addEventListener('DOMContentLoaded', function() {
    let viewer = null;
    
    if (typeof pannellum !== 'undefined') {
        try {
            viewer = pannellum.viewer('panorama', {
                type: 'equirectangular',
                panorama: './images/17-03-2026 03.30.41.jpg',
                autoLoad: true,
                hfov: 80,
                minHfov: 80,
                maxHfov: 80,
                pitch: 0,
                yaw: 0,
                mouseZoom: false,
                touchZoom: false,
                showZoomCtrl: false,
                compass: true,
                showFullscreenCtrl: true,
                drag: true,
                vOffset: 0,
                pitch: 0,
                minPitch: -20,
                maxPitch: 20,
            });
            
            if (viewer) {
                viewer.on('pitchchanged', function() {
                    let currentPitch = viewer.getPitch();
                    if (currentPitch < -30) {
                        viewer.setPitch(-30, true);
                    } else if (currentPitch > 30) {
                        viewer.setPitch(30, true);
                    }
                });
                
                viewer.on('zoomchanged', function() {
                    if (viewer.getHfov() !== 80) {
                        viewer.setHfov(80, true);
                    }
                });
            }
        } catch (error) {
            console.error('Error initializing Pannellum:', error);
            document.getElementById('panorama').innerHTML = '<div style="display:flex; align-items:center; justify-content:center; height:100%; background:#1a1a2e; color:white;">⚠️ Panorama image could not be loaded.</div>';
        }
    } else {
        console.error('Pannellum library not loaded');
        document.getElementById('panorama').innerHTML = '<div style="display:flex; align-items:center; justify-content:center; height:100%; background:#111; color:white;">Error: Pannellum JS not found.</div>';
    }

    const homeBtn = document.getElementById('homeOverlay');
    if (homeBtn) {
        homeBtn.addEventListener('click', function(e) {
            window.location.href = '../index.html';
        });
    }
});