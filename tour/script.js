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
                    // Hotspot to go to hallway2 - UNCHANGED
                    hotspots = [{
                        pitch: -12,
                        yaw: 195,
                        type: 'custom',
                        text: 'Click to move to next area',
                        createTooltipFunc: function(hotSpotDiv, args) {
                            hotSpotDiv.classList.add('custom-hotspot');
                            hotSpotDiv.innerHTML = '';
                            const icon = document.createElement('i');
                            icon.className = 'fas fa-map-marker-alt';
                            icon.style.fontSize = isMobile ? '40px' : '32px';
                            icon.style.color = '#ffd966';
                            icon.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
                            icon.style.animation = 'none';
                            icon.style.transition = 'none';
                            icon.style.pointerEvents = 'auto';
                            hotSpotDiv.appendChild(icon);
                            hotSpotDiv.style.transition = 'none';
                            hotSpotDiv.style.animation = 'none';
                            hotSpotDiv.style.pointerEvents = 'auto';
                            return hotSpotDiv;
                        },
                        clickHandlerFunc: function() {
                            console.log('Hallway1 hotspot clicked');
                            if (!clickEnabled) return;
                            clickEnabled = false;
                            saveCurrentAngle();
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
                    // Hotspots - ALL LOCATION PINS UNCHANGED
                    hotspots = [
                        {
                            // Return to hallway1 hotspot - UNCHANGED
                            pitch: -12,
                            yaw: 20,
                            type: 'custom',
                            text: 'Click to return to previous area',
                            createTooltipFunc: function(hotSpotDiv, args) {
                                hotSpotDiv.classList.add('custom-hotspot');
                                hotSpotDiv.innerHTML = '';
                                const icon = document.createElement('i');
                                icon.className = 'fas fa-map-marker-alt';
                                icon.style.fontSize = isMobile ? '40px' : '32px';
                                icon.style.color = '#ffd966';
                                icon.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
                                icon.style.animation = 'none';
                                icon.style.transition = 'none';
                                icon.style.pointerEvents = 'auto';
                                hotSpotDiv.appendChild(icon);
                                hotSpotDiv.style.transition = 'none';
                                hotSpotDiv.style.animation = 'none';
                                hotSpotDiv.style.pointerEvents = 'auto';
                                return hotSpotDiv;
                            },
                            clickHandlerFunc: function() {
                                console.log('Hallway2 return hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
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
                        },
                        {
                            // Library door hotspot - UNCHANGED
                            pitch: -12,
                            yaw: 90,
                            type: 'custom',
                            text: 'Click to enter Library',
                            createTooltipFunc: function(hotSpotDiv, args) {
                                hotSpotDiv.classList.add('custom-hotspot');
                                hotSpotDiv.innerHTML = '';
                                const icon = document.createElement('i');
                                icon.className = 'fas fa-door-open';
                                icon.style.fontSize = isMobile ? '44px' : '36px';
                                icon.style.color = '#ffd966';
                                icon.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
                                icon.style.animation = 'none';
                                icon.style.transition = 'none';
                                icon.style.pointerEvents = 'auto';
                                hotSpotDiv.appendChild(icon);
                                hotSpotDiv.style.transition = 'none';
                                hotSpotDiv.style.animation = 'none';
                                hotSpotDiv.style.pointerEvents = 'auto';
                                return hotSpotDiv;
                            },
                            clickHandlerFunc: function() {
                                console.log('Library door hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('library');
                                const notification = document.createElement('div');
                                notification.className = 'click-notification';
                                notification.textContent = 'Entering Library...';
                                document.body.appendChild(notification);
                                setTimeout(function() {
                                    if (notification && notification.remove) {
                                        notification.remove();
                                    }
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            // Hallway 3 hotspot - location pin to go to hallway3 - UNCHANGED
                            pitch: -12,
                            yaw: 198,
                            type: 'custom',
                            text: 'Click to move to Hallway 3',
                            createTooltipFunc: function(hotSpotDiv, args) {
                                hotSpotDiv.classList.add('custom-hotspot');
                                hotSpotDiv.innerHTML = '';
                                const icon = document.createElement('i');
                                icon.className = 'fas fa-map-marker-alt';
                                icon.style.fontSize = isMobile ? '40px' : '32px';
                                icon.style.color = '#ffd966';
                                icon.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
                                icon.style.animation = 'none';
                                icon.style.transition = 'none';
                                icon.style.pointerEvents = 'auto';
                                hotSpotDiv.appendChild(icon);
                                hotSpotDiv.style.transition = 'none';
                                hotSpotDiv.style.animation = 'none';
                                hotSpotDiv.style.pointerEvents = 'auto';
                                return hotSpotDiv;
                            },
                            clickHandlerFunc: function() {
                                console.log('Hallway 3 hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway3');
                                const notification = document.createElement('div');
                                notification.className = 'click-notification';
                                notification.textContent = 'Moving to Hallway 3...';
                                document.body.appendChild(notification);
                                setTimeout(function() {
                                    if (notification && notification.remove) {
                                        notification.remove();
                                    }
                                    clickEnabled = true;
                                }, 2000);
                            }
                        }
                    ];
                } else if (sceneName === 'hallway3') {
                    panoramaPath = './images/hallway3.jpg';
                    // Hotspots in hallway3
                    hotspots = [
                        {
                            // Return to hallway2 hotspot - LOCATION PIN UNCHANGED
                            pitch: -12,
                            yaw: 20,
                            type: 'custom',
                            text: 'Click to return to Hallway 2',
                            createTooltipFunc: function(hotSpotDiv, args) {
                                hotSpotDiv.classList.add('custom-hotspot');
                                hotSpotDiv.innerHTML = '';
                                const icon = document.createElement('i');
                                icon.className = 'fas fa-map-marker-alt';
                                icon.style.fontSize = isMobile ? '40px' : '32px';
                                icon.style.color = '#ffd966';
                                icon.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
                                icon.style.animation = 'none';
                                icon.style.transition = 'none';
                                icon.style.pointerEvents = 'auto';
                                hotSpotDiv.appendChild(icon);
                                hotSpotDiv.style.transition = 'none';
                                hotSpotDiv.style.animation = 'none';
                                hotSpotDiv.style.pointerEvents = 'auto';
                                return hotSpotDiv;
                            },
                            clickHandlerFunc: function() {
                                console.log('Hallway3 return hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway2');
                                const notification = document.createElement('div');
                                notification.className = 'click-notification';
                                notification.textContent = 'Returning to Hallway 2...';
                                document.body.appendChild(notification);
                                setTimeout(function() {
                                    if (notification && notification.remove) {
                                        notification.remove();
                                    }
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            // Computer Lab door hotspot in hallway3 - MOVED 20 DEGREES TO THE RIGHT
                            // Changed from 120 to 140 (20 degrees to the right)
                            pitch: -12,
                            yaw: isMobile ? 125 : 140, // Desktop: 140°, Mobile: 125° (adjusted for CSS transform)
                            type: 'custom',
                            text: 'Click to enter Computer Lab',
                            createTooltipFunc: function(hotSpotDiv, args) {
                                hotSpotDiv.classList.add('custom-hotspot');
                                hotSpotDiv.innerHTML = '';
                                const icon = document.createElement('i');
                                icon.className = 'fas fa-door-open';
                                icon.style.fontSize = isMobile ? '44px' : '36px';
                                icon.style.color = '#ffd966';
                                icon.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
                                icon.style.animation = 'none';
                                icon.style.transition = 'none';
                                icon.style.pointerEvents = 'auto';
                                hotSpotDiv.appendChild(icon);
                                hotSpotDiv.style.transition = 'none';
                                hotSpotDiv.style.animation = 'none';
                                hotSpotDiv.style.pointerEvents = 'auto';
                                return hotSpotDiv;
                            },
                            clickHandlerFunc: function() {
                                console.log('Computer Lab door hotspot clicked in hallway3');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('comlab2');
                                const notification = document.createElement('div');
                                notification.className = 'click-notification';
                                notification.textContent = 'Entering Computer Lab...';
                                document.body.appendChild(notification);
                                setTimeout(function() {
                                    if (notification && notification.remove) {
                                        notification.remove();
                                    }
                                    clickEnabled = true;
                                }, 2000);
                            }
                        }
                    ];
                } else if (sceneName === 'library') {
                    panoramaPath = './images/Library.jpg';
                    // Hotspot to go back to hallway2 - UNCHANGED
                    hotspots = [{
                        pitch: -2,
                        yaw: 376,
                        type: 'custom',
                        text: 'Click to return to Hallway',
                        createTooltipFunc: function(hotSpotDiv, args) {
                            hotSpotDiv.classList.add('custom-hotspot');
                            hotSpotDiv.innerHTML = '';
                            const icon = document.createElement('i');
                            icon.className = 'fas fa-door-open';
                            icon.style.fontSize = isMobile ? '44px' : '36px';
                            icon.style.color = '#ffd966';
                            icon.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
                            icon.style.animation = 'none';
                            icon.style.transition = 'none';
                            icon.style.pointerEvents = 'auto';
                            hotSpotDiv.appendChild(icon);
                            hotSpotDiv.style.transition = 'none';
                            hotSpotDiv.style.animation = 'none';
                            hotSpotDiv.style.pointerEvents = 'auto';
                            return hotSpotDiv;
                        },
                        clickHandlerFunc: function() {
                            console.log('Library return hotspot clicked');
                            if (!clickEnabled) return;
                            clickEnabled = false;
                            saveCurrentAngle();
                            loadScene('hallway2');
                            const notification = document.createElement('div');
                            notification.className = 'click-notification';
                            notification.textContent = 'Returning to Hallway...';
                            document.body.appendChild(notification);
                            setTimeout(function() {
                                if (notification && notification.remove) {
                                    notification.remove();
                                }
                                clickEnabled = true;
                            }, 2000);
                        }
                    }];
                } else if (sceneName === 'comlab2') {
                    panoramaPath = './images/comlab2.jpg';
                    // Hotspot to go back to hallway3 - UNCHANGED
                    hotspots = [{
                        pitch: -10,
                        yaw: isMobile ? 275 : 290,
                        type: 'custom',
                        text: 'Click to return to Hallway 3',
                        createTooltipFunc: function(hotSpotDiv, args) {
                            hotSpotDiv.classList.add('custom-hotspot');
                            hotSpotDiv.innerHTML = '';
                            const icon = document.createElement('i');
                            icon.className = 'fas fa-door-open';
                            icon.style.fontSize = isMobile ? '44px' : '36px';
                            icon.style.color = '#ffd966';
                            icon.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
                            icon.style.animation = 'none';
                            icon.style.transition = 'none';
                            icon.style.pointerEvents = 'auto';
                            hotSpotDiv.appendChild(icon);
                            hotSpotDiv.style.transition = 'none';
                            hotSpotDiv.style.animation = 'none';
                            hotSpotDiv.style.pointerEvents = 'auto';
                            return hotSpotDiv;
                        },
                        clickHandlerFunc: function() {
                            console.log('Computer Lab return hotspot clicked');
                            if (!clickEnabled) return;
                            clickEnabled = false;
                            saveCurrentAngle();
                            loadScene('hallway3');
                            const notification = document.createElement('div');
                            notification.className = 'click-notification';
                            notification.textContent = 'Returning to Hallway 3...';
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
                    autoRotate: false,
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
                        currentAngle.yaw = viewer.getYaw();
                        currentAngle.pitch = viewer.getPitch();
                    });
                    
                    // Disable zoom
                    viewer.on('zoomchanged', function() {
                        if (viewer.getHfov() !== baseHfov) {
                            viewer.setHfov(baseHfov, true);
                        }
                    });
                    
                    // Update current angle when user looks around
                    viewer.on('yawchanged', function() {
                        currentAngle.yaw = viewer.getYaw();
                        currentAngle.pitch = viewer.getPitch();
                    });
                    
                    viewer.on('pitchchanged', function() {
                        currentAngle.yaw = viewer.getYaw();
                        currentAngle.pitch = viewer.getPitch();
                    });
                    
                    // Add load error handling
                    viewer.on('error', function(error) {
                        console.error('Pannellum error:', error);
                    });
                    
                    // Mobile touch optimization
                    if (isMobile) {
                        setTimeout(function() {
                            const hotspotsElements = document.querySelectorAll('.custom-hotspot');
                            hotspotsElements.forEach(function(el) {
                                el.style.pointerEvents = 'auto';
                                el.style.touchAction = 'manipulation';
                            });
                        }, 100);
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