document.addEventListener('DOMContentLoaded', function() {
    let viewer = null;
    let clickEnabled = true;
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Store current camera angle to preserve between scenes
    let currentAngle = { yaw: 180, pitch: 0 };
    
    console.log('Page loaded, isMobile:', isMobile);
    
    if (typeof pannellum !== 'undefined') {
        console.log('Pannellum library found');
        try {
            const baseHfov = isMobile ? 70 : 80;
            const minPitch = isMobile ? -5 : -15;
            const maxPitch = isMobile ? 5 : 15;
            
            // Function to save current camera angle
            function saveCurrentAngle() {
                if (viewer) {
                    currentAngle.yaw = viewer.getYaw();
                    currentAngle.pitch = viewer.getPitch();
                    console.log(`Saved angle: yaw=${currentAngle.yaw.toFixed(2)}, pitch=${currentAngle.pitch.toFixed(2)}`);
                }
            }
            
            // Function to load a scene with hotspots
            function loadScene(sceneName) {
                console.log('Loading scene:', sceneName);
                
                let panoramaPath = '';
                let hotspots = [];
                
                if (sceneName === 'hallway1') {
                    panoramaPath = './images/hallway1.jpg';
                    // Hotspot to go to hallway2
                    hotspots = [{
                        pitch: isMobile ? -3 : -12,
                        yaw: 195,
                        type: 'custom',
                        text: 'Click to move to next area',
                        createTooltipFunc: function(hotSpotDiv, args) {
                            hotSpotDiv.classList.add('custom-hotspot');
                            const icon = document.createElement('i');
                            icon.className = 'fas fa-map-marker-alt';
                            icon.style.fontSize = isMobile ? '28px' : '32px';
                            icon.style.color = '#ffd966';
                            icon.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
                            icon.style.animation = 'none';
                            icon.style.transition = 'none';
                            hotSpotDiv.appendChild(icon);
                            hotSpotDiv.style.transition = 'none';
                            hotSpotDiv.style.animation = 'none';
                            return hotSpotDiv;
                        },
                        clickHandlerFunc: function() {
                            if (!clickEnabled) return;
                            clickEnabled = false;
                            
                            // Save current angle before leaving
                            saveCurrentAngle();
                            
                            // Load hallway2
                            loadScene('hallway2');
                            
                            const notification = document.createElement('div');
                            notification.className = 'click-notification';
                            notification.textContent = 'Moving to Hallway 2...';
                            document.body.appendChild(notification);
                            
                            setTimeout(function() {
                                if (notification && notification.remove) {
                                    notification.remove();
                                }
                                clickEnabled = true;
                            }, 2000);
                        }
                    }];
                } else if (sceneName === 'hallway2') {
                    panoramaPath = './images/hallway2.jpg';
                    // Hotspot to go back to hallway1
                    hotspots = [{
                        pitch: isMobile ? -3 : -12,
                        yaw: 20,
                        type: 'custom',
                        text: 'Click to return to previous area',
                        createTooltipFunc: function(hotSpotDiv, args) {
                            hotSpotDiv.classList.add('custom-hotspot');
                            const icon = document.createElement('i');
                            icon.className = 'fas fa-map-marker-alt';
                            icon.style.fontSize = isMobile ? '28px' : '32px';
                            icon.style.color = '#ffd966';
                            icon.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
                            icon.style.animation = 'none';
                            icon.style.transition = 'none';
                            hotSpotDiv.appendChild(icon);
                            hotSpotDiv.style.transition = 'none';
                            hotSpotDiv.style.animation = 'none';
                            return hotSpotDiv;
                        },
                        clickHandlerFunc: function() {
                            if (!clickEnabled) return;
                            clickEnabled = false;
                            
                            // Save current angle before leaving
                            saveCurrentAngle();
                            
                            // Load hallway1
                            loadScene('hallway1');
                            
                            const notification = document.createElement('div');
                            notification.className = 'click-notification';
                            notification.textContent = 'Returning to Hallway 1...';
                            document.body.appendChild(notification);
                            
                            setTimeout(function() {
                                if (notification && notification.remove) {
                                    notification.remove();
                                }
                                clickEnabled = true;
                            }, 2000);
                        }
                    }];
                }
                
                // Create viewer configuration with saved angle
                const viewerConfig = {
                    type: 'equirectangular',
                    panorama: panoramaPath,
                    autoLoad: true,
                    hfov: baseHfov,
                    minHfov: baseHfov,
                    maxHfov: baseHfov,
                    pitch: currentAngle.pitch,
                    yaw: currentAngle.yaw,
                    mouseZoom: false,
                    touchZoom: false,
                    showZoomCtrl: false,
                    compass: true,
                    showFullscreenCtrl: true,
                    drag: true,
                    minPitch: minPitch,
                    maxPitch: maxPitch,
                    hotSpots: hotspots
                };
                
                if (isMobile) {
                    viewerConfig.touchPan = true;
                    viewerConfig.touchZoom = false;
                    viewerConfig.drag = true;
                }
                
                // Destroy existing viewer if it exists
                if (viewer) {
                    viewer.destroy();
                }
                
                // Create new viewer
                viewer = pannellum.viewer('panorama', viewerConfig);
                console.log(`Viewer created for ${sceneName} at yaw=${currentAngle.yaw.toFixed(2)}, pitch=${currentAngle.pitch.toFixed(2)}`);
                
                if (viewer) {
                    // Add pitch limiter
                    viewer.on('pitchchanged', function() {
                        let currentPitch = viewer.getPitch();
                        if (currentPitch < minPitch) {
                            viewer.setPitch(minPitch, true);
                        } else if (currentPitch > maxPitch) {
                            viewer.setPitch(maxPitch, true);
                        }
                        // Update current angle when user looks around
                        currentAngle.yaw = viewer.getYaw();
                        currentAngle.pitch = viewer.getPitch();
                    });
                    
                    // Disable zoom
                    viewer.on('zoomchanged', function() {
                        if (viewer.getHfov() !== baseHfov) {
                            viewer.setHfov(baseHfov, true);
                        }
                    });
                    
                    // Update current angle when user looks around (yaw)
                    viewer.on('yawchanged', function() {
                        currentAngle.yaw = viewer.getYaw();
                        currentAngle.pitch = viewer.getPitch();
                    });
                    
                    // Update current angle when user looks around (pitch)
                    viewer.on('pitchchanged', function() {
                        currentAngle.yaw = viewer.getYaw();
                        currentAngle.pitch = viewer.getPitch();
                    });
                    
                    // Add load error handling
                    viewer.on('error', function(error) {
                        console.error('Pannellum error:', error);
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
            }
            
            // Start with hallway1
            loadScene('hallway1');
            
        } catch (error) {
            console.error('Error initializing Pannellum:', error);
            document.getElementById('panorama').innerHTML = '<div style="display:flex; align-items:center; justify-content:center; height:100%; background:#1a1a2e; color:white; text-align:center; padding:20px;">⚠️ Error: ' + error.message + '</div>';
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