document.addEventListener('DOMContentLoaded', function() {
    let viewer = null;
    let clickEnabled = true;
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Store current camera angle to preserve between scenes
    let currentAngle = { yaw: 180, pitch: 0 };
    let isFirstScene = true;
    
    // Store hallway9's original angle to restore when returning
    let hallway9StoredAngle = null;
    
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
                
                // Handle hallway9 restoration - use stored angle if available (NO OFFSET)
                if (sceneName === 'hallway9' && hallway9StoredAngle !== null) {
                    sceneYaw = hallway9StoredAngle.yaw;
                    scenePitch = hallway9StoredAngle.pitch;
                    console.log(`RESTORING hallway9 angle (NO OFFSET): yaw=${sceneYaw.toFixed(2)}, pitch=${scenePitch.toFixed(2)}`);
                    hallway9StoredAngle = null; // Clear after restoring
                }
                
                // Handle hallway10 - add 180 offset when going TO hallway10
                if (sceneName === 'hallway10') {
                    // Store the current hallway9 angle before applying offset
                    if (hallway9StoredAngle === null && (currentAngle.yaw !== 180 || !isFirstScene)) {
                        hallway9StoredAngle = { yaw: currentAngle.yaw, pitch: currentAngle.pitch };
                        console.log(`STORED hallway9 angle for later return: yaw=${hallway9StoredAngle.yaw.toFixed(2)}`);
                    }
                    // Apply 180 offset to make hallway10 look forward
                    sceneYaw = (sceneYaw + 180) % 360;
                    console.log(`Applied 180° offset for hallway10, new yaw: ${sceneYaw.toFixed(2)}`);
                }
                
                if (sceneName === 'hallway1') {
                    panoramaPath = './images/hallway1.jpg';
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
                                const notification = document.createElement('div');
                                notification.className = 'click-notification';
                                notification.textContent = 'Moving to Hallway 4...';
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
                                const notification = document.createElement('div');
                                notification.className = 'click-notification';
                                notification.textContent = 'Moving to Hallway 5...';
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
                                const notification = document.createElement('div');
                                notification.className = 'click-notification';
                                notification.textContent = 'Returning to Hallway 4...';
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
                                const notification = document.createElement('div');
                                notification.className = 'click-notification';
                                notification.textContent = 'Moving to Hallway 6...';
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
                                const notification = document.createElement('div');
                                notification.className = 'click-notification';
                                notification.textContent = 'Returning to Hallway 5...';
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
                                const notification = document.createElement('div');
                                notification.className = 'click-notification';
                                notification.textContent = 'Moving to Hallway 7...';
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
                                const notification = document.createElement('div');
                                notification.className = 'click-notification';
                                notification.textContent = 'Returning to Hallway 6...';
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
                                const notification = document.createElement('div');
                                notification.className = 'click-notification';
                                notification.textContent = 'Moving to Hallway 8...';
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
                                const notification = document.createElement('div');
                                notification.className = 'click-notification';
                                notification.textContent = 'Returning to Hallway 7...';
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
                                const notification = document.createElement('div');
                                notification.className = 'click-notification';
                                notification.textContent = 'Moving to Hallway 9...';
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
                                const notification = document.createElement('div');
                                notification.className = 'click-notification';
                                notification.textContent = 'Returning to Hallway 8...';
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
                                const notification = document.createElement('div');
                                notification.className = 'click-notification';
                                notification.textContent = 'Moving to Hallway 10...';
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
                } else if (sceneName === 'hallway10') {
                    panoramaPath = './images/hallway10.jpg';
                    hotspots = [{
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
                            console.log('Hallway10 return hotspot clicked');
                            if (!clickEnabled) return;
                            clickEnabled = false;
                            // Reverse the 180° offset so hallway9 resumes
                            // from wherever the camera is looking in hallway10
                            hallway9StoredAngle = {
                                yaw: (viewer.getYaw() + 180) % 360,
                                pitch: viewer.getPitch()
                            };
                            console.log(`Set hallway9 return angle (reversed offset): yaw=${hallway9StoredAngle.yaw.toFixed(2)}`);
                            saveCurrentAngle();
                            loadScene('hallway9');
                            const notification = document.createElement('div');
                            notification.className = 'click-notification';
                            notification.textContent = 'Returning to Hallway 9...';
                            document.body.appendChild(notification);
                            setTimeout(function() {
                                if (notification && notification.remove) {
                                    notification.remove();
                                }
                                clickEnabled = true;
                            }, 2000);
                        }
                    }];
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