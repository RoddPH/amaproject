document.addEventListener('DOMContentLoaded', function() {
    let viewer = null;
    let clickEnabled = true;
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (typeof pannellum !== 'undefined') {
        try {
            const baseHfov = isMobile ? 70 : 80;
            const minPitch = isMobile ? -5 : -15;
            const maxPitch = isMobile ? 5 : 15;
            
            const viewerConfig = {
                type: 'equirectangular',
                panorama: './images/hallway1.jpg',
                autoLoad: true,
                hfov: baseHfov,
                minHfov: baseHfov,
                maxHfov: baseHfov,
                pitch: 0,
                yaw: 180, // Changed from 0 to 180 - camera starts facing backwards
                mouseZoom: false,
                touchZoom: false,
                showZoomCtrl: false,
                compass: true,
                showFullscreenCtrl: true,
                drag: true,
                minPitch: minPitch,
                maxPitch: maxPitch,
                hotSpots: [
                    {
                        pitch: isMobile ? -3 : -12,
                        yaw: 195, // Positioned to the right
                        type: 'custom',
                        text: 'Click to move to next area',
                        createTooltipFunc: function(hotSpotDiv, args) {
                            hotSpotDiv.classList.add('custom-hotspot');
                            // Only create the icon, no tooltip
                            const icon = document.createElement('i');
                            icon.className = 'fas fa-map-marker-alt';
                            icon.style.fontSize = isMobile ? '28px' : '32px';
                            icon.style.color = '#ffd966';
                            icon.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
                            icon.style.animation = 'none';
                            icon.style.transition = 'none';
                            hotSpotDiv.appendChild(icon);
                            
                            // No tooltip added
                            hotSpotDiv.style.transition = 'none';
                            hotSpotDiv.style.animation = 'none';
                            
                            return hotSpotDiv;
                        },
                        clickHandlerFunc: function() {
                            if (!clickEnabled) return;
                            clickEnabled = false;
                            viewer.setPanorama('./images/hallway2.jpg');
                            
                            const notification = document.createElement('div');
                            notification.className = 'click-notification';
                            notification.textContent = 'Moving to next area...';
                            document.body.appendChild(notification);
                            
                            setTimeout(function() {
                                notification.remove();
                                clickEnabled = true;
                            }, 2000);
                        }
                    }
                ]
            };
            
            if (isMobile) {
                viewerConfig.touchPan = true;
                viewerConfig.touchZoom = false;
                viewerConfig.drag = true;
            }
            
            viewer = pannellum.viewer('panorama', viewerConfig);
            
            if (viewer) {
                viewer.on('pitchchanged', function() {
                    let currentPitch = viewer.getPitch();
                    if (currentPitch < minPitch) {
                        viewer.setPitch(minPitch, true);
                    } else if (currentPitch > maxPitch) {
                        viewer.setPitch(maxPitch, true);
                    }
                });
                
                viewer.on('zoomchanged', function() {
                    if (viewer.getHfov() !== baseHfov) {
                        viewer.setHfov(baseHfov, true);
                    }
                });
                
                if (isMobile) {
                    const container = document.getElementById('panorama');
                    if (container) {
                        let touchStartTime = 0;
                        container.addEventListener('touchstart', function(e) {
                            touchStartTime = Date.now();
                        });
                        
                        container.addEventListener('touchend', function(e) {
                            const touchDuration = Date.now() - touchStartTime;
                            if (touchDuration < 200 && e.target.closest('.custom-hotspot')) {
                                e.preventDefault();
                            }
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error initializing Pannellum:', error);
            document.getElementById('panorama').innerHTML = '<div style="display:flex; align-items:center; justify-content:center; height:100%; background:#1a1a2e; color:white; text-align:center; padding:20px;">⚠️ Panorama image could not be loaded.</div>';
        }
    } else {
        console.error('Pannellum library not loaded');
        document.getElementById('panorama').innerHTML = '<div style="display:flex; align-items:center; justify-content:center; height:100%; background:#111; color:white;">Error: Pannellum JS not found.</div>';
    }

    const homeBtn = document.getElementById('homeOverlay');
    if (homeBtn) {
        homeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../index.html';
        });
        
        if (isMobile) {
            homeBtn.addEventListener('touchstart', function(e) {
                e.preventDefault();
                window.location.href = '../index.html';
            });
        }
    }
    
    if (isMobile) {
        setTimeout(function() {
            const instruction = document.getElementById('mobileInstruction');
            if (instruction) {
                setTimeout(function() {
                    instruction.style.display = 'none';
                }, 3000);
            }
        }, 100);
    } else {
        const instruction = document.getElementById('mobileInstruction');
        if (instruction) {
            instruction.style.display = 'none';
        }
    }
});