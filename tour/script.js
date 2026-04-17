document.addEventListener('DOMContentLoaded', function() {
    let viewer = null;
    let clickEnabled = true;
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Store current camera angle to preserve between scenes
    let currentAngle = { yaw: 180, pitch: 0 };
    let isFirstScene = true;
    
    // Store hallway angles to restore when returning
    let hallway9StoredAngle = null;
    let hallway10StoredAngle = null;
    let hallway11StoredAngle = null;
    let hallway12StoredAngle = null;
    let hallway13StoredAngle = null;
    let hallway14StoredAngle = null;
    let hallway15StoredAngle = null;
    
    // Function to show/hide room label
    function updateRoomLabel(sceneName) {
        let label = document.getElementById('roomLabel');
        if (!label) {
            label = document.createElement('div');
            label.id = 'roomLabel';
            label.style.position = 'fixed';
            label.style.top = '20px';
            label.style.left = '20px';
            label.style.zIndex = '30';
            label.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            label.style.backdropFilter = 'blur(8px)';
            label.style.padding = '8px 16px';
            label.style.borderRadius = '8px';
            label.style.color = '#ffd966';
            label.style.fontFamily = 'system-ui, sans-serif';
            label.style.fontSize = '18px';
            label.style.fontWeight = '600';
            label.style.border = '1px solid rgba(255, 215, 0, 0.3)';
            label.style.pointerEvents = 'none';
            document.body.appendChild(label);
        }
        
        if (sceneName === 'library') {
            label.textContent = '📚 LIBRARY';
            label.style.display = 'block';
        } else if (sceneName === 'comlab2') {
            label.textContent = '💻 Computer Laboratory 2 (Room 304)';
            label.style.display = 'block';
        } else if (sceneName === 'genphysicslab') {
            label.textContent = '⚛️ General Physics Laboratory';
            label.style.display = 'block';
        } else if (sceneName === 'room307') {
            label.textContent = '🚪 Room 307';
            label.style.display = 'block';
        } else {
            label.style.display = 'none';
        }
    }
    
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
                
                // Update the room label
                updateRoomLabel(sceneName);
                
                let panoramaPath = '';
                let hotspots = [];
                
                // Determine the yaw to use for this scene
                let sceneYaw = currentAngle.yaw;
                let scenePitch = currentAngle.pitch;
                
                // For hallway1, always use 180 on first load
                if (sceneName === 'hallway1' && isFirstScene) {
                    sceneYaw = 180;
                    scenePitch = 0;
                    isFirstScene = false;
                    console.log('First scene hallway1 set to yaw: 180');
                }
                
                // Handle hallway9 restoration
                if (sceneName === 'hallway9' && hallway9StoredAngle !== null) {
                    sceneYaw = hallway9StoredAngle.yaw;
                    scenePitch = hallway9StoredAngle.pitch;
                    console.log(`RESTORING hallway9 angle: yaw=${sceneYaw.toFixed(2)}, pitch=${scenePitch.toFixed(2)}`);
                    hallway9StoredAngle = null;
                }
                
                // Handle hallway10 restoration
                if (sceneName === 'hallway10' && hallway10StoredAngle !== null) {
                    sceneYaw = hallway10StoredAngle.yaw;
                    scenePitch = hallway10StoredAngle.pitch;
                    console.log(`RESTORING hallway10 angle: yaw=${sceneYaw.toFixed(2)}, pitch=${scenePitch.toFixed(2)}`);
                    hallway10StoredAngle = null;
                }
                
                // Handle hallway11 restoration
                if (sceneName === 'hallway11' && hallway11StoredAngle !== null) {
                    sceneYaw = hallway11StoredAngle.yaw;
                    scenePitch = hallway11StoredAngle.pitch;
                    console.log(`RESTORING hallway11 angle: yaw=${sceneYaw.toFixed(2)}, pitch=${scenePitch.toFixed(2)}`);
                    hallway11StoredAngle = null;
                }
                
                // Handle hallway12 restoration
                if (sceneName === 'hallway12' && hallway12StoredAngle !== null) {
                    sceneYaw = hallway12StoredAngle.yaw;
                    scenePitch = hallway12StoredAngle.pitch;
                    console.log(`RESTORING hallway12 angle: yaw=${sceneYaw.toFixed(2)}, pitch=${scenePitch.toFixed(2)}`);
                    hallway12StoredAngle = null;
                }
                
                // Handle hallway13 restoration
                if (sceneName === 'hallway13' && hallway13StoredAngle !== null) {
                    sceneYaw = hallway13StoredAngle.yaw;
                    scenePitch = hallway13StoredAngle.pitch;
                    console.log(`RESTORING hallway13 angle: yaw=${sceneYaw.toFixed(2)}, pitch=${scenePitch.toFixed(2)}`);
                    hallway13StoredAngle = null;
                }
                
                // Handle hallway14 restoration
                if (sceneName === 'hallway14' && hallway14StoredAngle !== null) {
                    sceneYaw = hallway14StoredAngle.yaw;
                    scenePitch = hallway14StoredAngle.pitch;
                    console.log(`RESTORING hallway14 angle: yaw=${sceneYaw.toFixed(2)}, pitch=${scenePitch.toFixed(2)}`);
                    hallway14StoredAngle = null;
                }
                
                // Handle hallway15 restoration
                if (sceneName === 'hallway15' && hallway15StoredAngle !== null) {
                    sceneYaw = hallway15StoredAngle.yaw;
                    scenePitch = hallway15StoredAngle.pitch;
                    console.log(`RESTORING hallway15 angle: yaw=${sceneYaw.toFixed(2)}, pitch=${scenePitch.toFixed(2)}`);
                    hallway15StoredAngle = null;
                }
                
                // Handle hallway10 offset
                if (sceneName === 'hallway10' && hallway9StoredAngle === null && hallway10StoredAngle === null) {
                    if (hallway9StoredAngle === null && (currentAngle.yaw !== 180 || !isFirstScene)) {
                        hallway9StoredAngle = { yaw: currentAngle.yaw, pitch: currentAngle.pitch };
                        console.log(`STORED hallway9 angle for later return: yaw=${hallway9StoredAngle.yaw.toFixed(2)}`);
                    }
                    sceneYaw = (sceneYaw + 180) % 360;
                    console.log(`Applied 180° offset for hallway10, new yaw: ${sceneYaw.toFixed(2)}`);
                }
                
                // Handle hallway11 offset
                if (sceneName === 'hallway11' && hallway10StoredAngle === null && hallway11StoredAngle === null) {
                    if (hallway10StoredAngle === null) {
                        hallway10StoredAngle = { yaw: currentAngle.yaw, pitch: currentAngle.pitch };
                        console.log(`STORED hallway10 angle for later return: yaw=${hallway10StoredAngle.yaw.toFixed(2)}`);
                    }
                    sceneYaw = (sceneYaw + 180) % 360;
                    console.log(`Applied 180° offset for hallway11, new yaw: ${sceneYaw.toFixed(2)}`);
                }
                
                // Handle hallway12 - no offset, preserve exact camera angle
                if (sceneName === 'hallway12' && hallway11StoredAngle === null && hallway12StoredAngle === null) {
                    if (hallway11StoredAngle === null) {
                        hallway11StoredAngle = { yaw: currentAngle.yaw, pitch: currentAngle.pitch };
                        console.log(`STORED hallway11 angle for later return: yaw=${hallway11StoredAngle.yaw.toFixed(2)}`);
                    }
                    console.log(`No offset for hallway12, preserving yaw: ${sceneYaw.toFixed(2)}`);
                }
                
                // Handle hallway13 - no offset, preserve exact camera angle
                if (sceneName === 'hallway13' && hallway12StoredAngle === null && hallway13StoredAngle === null) {
                    if (hallway12StoredAngle === null) {
                        hallway12StoredAngle = { yaw: currentAngle.yaw, pitch: currentAngle.pitch };
                        console.log(`STORED hallway12 angle for later return: yaw=${hallway12StoredAngle.yaw.toFixed(2)}`);
                    }
                    console.log(`No offset for hallway13, preserving yaw: ${sceneYaw.toFixed(2)}`);
                }
                
                // Handle hallway14 - no offset, preserve exact camera angle
                if (sceneName === 'hallway14' && hallway13StoredAngle === null && hallway14StoredAngle === null) {
                    if (hallway13StoredAngle === null) {
                        hallway13StoredAngle = { yaw: currentAngle.yaw, pitch: currentAngle.pitch };
                        console.log(`STORED hallway13 angle for later return: yaw=${hallway13StoredAngle.yaw.toFixed(2)}`);
                    }
                    console.log(`No offset for hallway14, preserving yaw: ${sceneYaw.toFixed(2)}`);
                }
                
                // Handle hallway15 - store hallway14 angle, no offset (preserve camera direction)
                if (sceneName === 'hallway15') {
                    if (hallway14StoredAngle === null) {
                        hallway14StoredAngle = { yaw: currentAngle.yaw, pitch: currentAngle.pitch };
                        console.log(`STORED hallway14 angle for later return: yaw=${hallway14StoredAngle.yaw.toFixed(2)}`);
                    }
                    console.log(`No offset for hallway15, preserving yaw: ${sceneYaw.toFixed(2)}`);
                }
                
                if (sceneName === 'hallway1') {
                    panoramaPath = './images/hallway1.jpg';
                    hotspots = [
                        {
                            // Hotspot to go to hallway2
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
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            // Direct hotspot to hallway15
                            pitch: -12,
                            yaw: 105,
                            type: 'custom',
                            text: 'Click to jump to Hallway 15',
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
                                console.log('Direct jump to Hallway 15 clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                hallway14StoredAngle = { yaw: currentAngle.yaw, pitch: currentAngle.pitch };
                                hallway15StoredAngle = { yaw: currentAngle.yaw, pitch: currentAngle.pitch };
                                loadScene('hallway15');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        }
                    ];
                } else if (sceneName === 'hallway2') {
                    panoramaPath = './images/hallway2.jpg';
                    hotspots = [
                        {
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
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
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
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
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
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        }
                    ];
                } else if (sceneName === 'hallway3') {
                    panoramaPath = './images/hallway3.jpg';
                    hotspots = [
                        {
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
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            pitch: -13,
                            yaw: isMobile ? 100 : 120,
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
                                console.log('Computer Lab entrance door hotspot clicked in hallway3');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('comlab2');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            pitch: -4,
                            yaw: 198,
                            type: 'custom',
                            text: 'Click to move to Hallway 4',
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
                                console.log('Hallway 4 hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway4');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        }
                    ];
                } else if (sceneName === 'hallway4') {
                    panoramaPath = './images/hallway4.jpg';
                    hotspots = [
                        {
                            pitch: -8,
                            yaw: 28,
                            type: 'custom',
                            text: 'Click to return to Hallway 3',
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
                                console.log('Hallway4 return hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway3');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            pitch: -8,
                            yaw: 205,
                            type: 'custom',
                            text: 'Click to move to Hallway 5',
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
                                console.log('Hallway 5 hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway5');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        }
                    ];
                } else if (sceneName === 'hallway5') {
                    panoramaPath = './images/hallway5.jpg';
                    hotspots = [
                        {
                            pitch: -11,
                            yaw: 380,
                            type: 'custom',
                            text: 'Click to return to Hallway 4',
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
                                console.log('Hallway5 return hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway4');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            pitch: -2,
                            yaw: 198,
                            type: 'custom',
                            text: 'Click to move to Hallway 6',
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
                                console.log('Hallway 6 hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway6');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            // General Physics Lab door hotspot
                            pitch: -9,
                            yaw: 130,
                            type: 'custom',
                            text: 'Click to enter General Physics Lab',
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
                                console.log('General Physics Lab door hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('genphysicslab');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        }
                    ];
                } else if (sceneName === 'hallway6') {
                    panoramaPath = './images/hallway6.jpg';
                    hotspots = [
                        {
                            pitch: -5,
                            yaw: 378,
                            type: 'custom',
                            text: 'Click to return to Hallway 5',
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
                                console.log('Hallway6 return hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway5');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            pitch: -14,
                            yaw: 175,
                            type: 'custom',
                            text: 'Click to move to Hallway 7',
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
                                console.log('Hallway 7 hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway7');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        }
                    ];
                } else if (sceneName === 'hallway7') {
                    panoramaPath = './images/hallway7.jpg';
                    hotspots = [
                        {
                            pitch: -13,
                            yaw: 393,
                            type: 'custom',
                            text: 'Click to return to Hallway 6',
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
                                console.log('Hallway7 return hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway6');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            pitch: -2,
                            yaw: 213,
                            type: 'custom',
                            text: 'Click to move to Hallway 8',
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
                                console.log('Hallway 8 hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway8');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        }
                    ];
                } else if (sceneName === 'hallway8') {
                    panoramaPath = './images/hallway8.jpg';
                    hotspots = [
                        {
                            pitch: -13,
                            yaw: 410,
                            type: 'custom',
                            text: 'Click to return to Hallway 7',
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
                                console.log('Hallway8 return hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway7');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            pitch: -10,
                            yaw: 206,
                            type: 'custom',
                            text: 'Click to move to Hallway 9',
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
                                console.log('Hallway 9 hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway9');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        }
                    ];
                } else if (sceneName === 'hallway9') {
                    panoramaPath = './images/hallway9.jpg';
                    hotspots = [
                        {
                            pitch: -20,
                            yaw: 393,
                            type: 'custom',
                            text: 'Click to return to Hallway 8',
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
                                console.log('Hallway9 return hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway8');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            pitch: -1,
                            yaw: 203,
                            type: 'custom',
                            text: 'Click to move to Hallway 10',
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
                                console.log('Hallway 10 hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway10');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        }
                    ];
                } else if (sceneName === 'hallway10') {
                    panoramaPath = './images/hallway10.jpg';
                    hotspots = [
                        {
                            pitch: -2,
                            yaw: 200,
                            type: 'custom',
                            text: 'Click to return to Hallway 9',
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
                                console.log('Hallway10 return to hallway9 clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                hallway9StoredAngle = {
                                    yaw: (viewer.getYaw() + 180) % 360,
                                    pitch: viewer.getPitch()
                                };
                                console.log(`Set hallway9 return angle (reversed offset): yaw=${hallway9StoredAngle.yaw.toFixed(2)}`);
                                saveCurrentAngle();
                                loadScene('hallway9');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            pitch: -20,
                            yaw: -60,
                            type: 'custom',
                            text: 'Click to move to Hallway 11',
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
                                console.log('Hallway 11 hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway11');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        }
                    ];
                } else if (sceneName === 'hallway11') {
                    panoramaPath = './images/hallway11.jpg';
                    hotspots = [
                        {
                            pitch: -16,
                            yaw: 310,
                            type: 'custom',
                            text: 'Click to return to Hallway 10',
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
                                console.log('Hallway11 return to hallway10 clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                hallway10StoredAngle = {
                                    yaw: (viewer.getYaw() + 180) % 360,
                                    pitch: viewer.getPitch()
                                };
                                console.log(`Set hallway10 return angle (reversed offset): yaw=${hallway10StoredAngle.yaw.toFixed(2)}`);
                                saveCurrentAngle();
                                loadScene('hallway10');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            pitch: -13,
                            yaw: 180,
                            type: 'custom',
                            text: 'Click to move to Hallway 12',
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
                                console.log('Hallway 12 hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway12');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        }
                    ];
                } else if (sceneName === 'hallway12') {
                    panoramaPath = './images/hallway12.jpg';
                    hotspots = [
                        {
                            pitch: -10,
                            yaw: 30,
                            type: 'custom',
                            text: 'Click to return to Hallway 11',
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
                                console.log('Hallway12 return to hallway11 clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                hallway11StoredAngle = {
                                    yaw: viewer.getYaw(),
                                    pitch: viewer.getPitch()
                                };
                                console.log(`Set hallway11 return angle (no offset): yaw=${hallway11StoredAngle.yaw.toFixed(2)}`);
                                saveCurrentAngle();
                                loadScene('hallway11');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            pitch: -4,
                            yaw: 200,
                            type: 'custom',
                            text: 'Click to move to Hallway 13',
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
                                console.log('Hallway 13 hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway13');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        }
                    ];
                } else if (sceneName === 'hallway13') {
                    panoramaPath = './images/hallway13.jpg';
                    hotspots = [
                        {
                            pitch: -8,
                            yaw: 20,
                            type: 'custom',
                            text: 'Click to return to Hallway 12',
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
                                console.log('Hallway13 return to hallway12 clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                hallway12StoredAngle = {
                                    yaw: viewer.getYaw(),
                                    pitch: viewer.getPitch()
                                };
                                console.log(`Set hallway12 return angle (no offset): yaw=${hallway12StoredAngle.yaw.toFixed(2)}`);
                                saveCurrentAngle();
                                loadScene('hallway12');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            pitch: 0,
                            yaw: 200,
                            type: 'custom',
                            text: 'Click to move to Hallway 14',
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
                                console.log('Hallway 14 hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway14');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            // NEW: Room 307 door hotspot
                            pitch: -3,
                            yaw: 158,
                            type: 'custom',
                            text: 'Click to enter Room 307',
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
                                console.log('Room 307 door hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('room307');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        }
                    ];
                } else if (sceneName === 'hallway14') {
                    panoramaPath = './images/hallway14.jpg';
                    hotspots = [
                        {
                            pitch: -6,
                            yaw: 380,
                            type: 'custom',
                            text: 'Click to return to Hallway 13',
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
                                console.log('Hallway14 return to hallway13 clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                hallway13StoredAngle = {
                                    yaw: viewer.getYaw(),
                                    pitch: viewer.getPitch()
                                };
                                console.log(`Set hallway13 return angle (no offset): yaw=${hallway13StoredAngle.yaw.toFixed(2)}`);
                                saveCurrentAngle();
                                loadScene('hallway13');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            pitch: -3,
                            yaw: 201,
                            type: 'custom',
                            text: 'Click to move to Hallway 15',
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
                                console.log('Hallway 15 hotspot clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                saveCurrentAngle();
                                loadScene('hallway15');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        }
                    ];
                } else if (sceneName === 'hallway15') {
                    panoramaPath = './images/hallway15.jpg';
                    hotspots = [
                        {
                            pitch: -3,
                            yaw: 370,
                            type: 'custom',
                            text: 'Click to return to Hallway 14',
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
                                console.log('Hallway15 return to hallway14 clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                hallway14StoredAngle = {
                                    yaw: viewer.getYaw(),
                                    pitch: viewer.getPitch()
                                };
                                console.log(`Set hallway14 return angle (no offset): yaw=${hallway14StoredAngle.yaw.toFixed(2)}`);
                                saveCurrentAngle();
                                loadScene('hallway14');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        },
                        {
                            // Return to Hallway 1 (Start)
                            pitch: -3,
                            yaw: 190,
                            type: 'custom',
                            text: 'Click to return to Start (Hallway 1)',
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
                                hotSpotDiv.appendChild(icon);
                                hotSpotDiv.style.transition = 'none';
                                hotSpotDiv.style.animation = 'none';
                                hotSpotDiv.style.pointerEvents = 'auto';
                                return hotSpotDiv;
                            },
                            clickHandlerFunc: function() {
                                console.log('Return to Hallway 1 (Start) clicked');
                                if (!clickEnabled) return;
                                clickEnabled = false;
                                // Store current hallway15 angle before leaving
                                hallway15StoredAngle = {
                                    yaw: viewer.getYaw(),
                                    pitch: viewer.getPitch()
                                };
                                console.log(`Stored hallway15 angle: yaw=${hallway15StoredAngle.yaw.toFixed(2)}`);
                                // Reset to hallway1 with default angle
                                currentAngle = { yaw: 180, pitch: 0 };
                                loadScene('hallway1');
                                setTimeout(function() {
                                    clickEnabled = true;
                                }, 2000);
                            }
                        }
                    ];
                } else if (sceneName === 'library') {
                    panoramaPath = './images/Library.jpg';
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
                            setTimeout(function() {
                                clickEnabled = true;
                            }, 2000);
                        }
                    }];
                } else if (sceneName === 'comlab2') {
                    panoramaPath = './images/comlab2.jpg';
                    hotspots = [{
                        pitch: -8,
                        yaw: isMobile ? 200 : 290,
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
                            console.log('Computer Lab return door hotspot clicked');
                            if (!clickEnabled) return;
                            clickEnabled = false;
                            saveCurrentAngle();
                            loadScene('hallway3');
                            setTimeout(function() {
                                clickEnabled = true;
                            }, 2000);
                        }
                    }];
                } else if (sceneName === 'genphysicslab') {
                    panoramaPath = './images/genphysicslab.jpg';
                    // Hotspot to return to hallway5
                    hotspots = [{
                        pitch: -2,
                        yaw: 453,
                        type: 'custom',
                        text: 'Click to return to Hallway 5',
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
                            console.log('General Physics Lab return hotspot clicked');
                            if (!clickEnabled) return;
                            clickEnabled = false;
                            saveCurrentAngle();
                            loadScene('hallway5');
                            setTimeout(function() {
                                clickEnabled = true;
                            }, 2000);
                        }
                    }];
                } else if (sceneName === 'room307') {
                    panoramaPath = './images/room307.jpg';
                    // Hotspot to return to hallway13
                    hotspots = [{
                        pitch: 2.5,
                        yaw: 185,
                        type: 'custom',
                        text: 'Click to return to Hallway 13',
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
                            console.log('Room 307 return hotspot clicked');
                            if (!clickEnabled) return;
                            clickEnabled = false;
                            saveCurrentAngle();
                            loadScene('hallway13');
                            setTimeout(function() {
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
                    pitch: scenePitch,
                    yaw: sceneYaw,
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
                console.log(`Viewer created for ${sceneName} at yaw=${sceneYaw.toFixed(2)}, pitch=${scenePitch.toFixed(2)}`);
                
                if (viewer) {
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
                    
                    viewer.on('zoomchanged', function() {
                        if (viewer.getHfov() !== baseHfov) {
                            viewer.setHfov(baseHfov, true);
                        }
                    });
                    
                    viewer.on('yawchanged', function() {
                        currentAngle.yaw = viewer.getYaw();
                        currentAngle.pitch = viewer.getPitch();
                    });
                    
                    viewer.on('pitchchanged', function() {
                        currentAngle.yaw = viewer.getYaw();
                        currentAngle.pitch = viewer.getPitch();
                    });
                    
                    viewer.on('error', function(error) {
                        console.error('Pannellum error:', error);
                    });
                    
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