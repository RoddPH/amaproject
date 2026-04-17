// ========== YOUR ORIGINAL JAVASCRIPT (COMPLETELY UNCHANGED) ==========
const hamMenu = document.querySelector(".ham-menu");
const offScreenMenu = document.querySelector(".off-screen-menu");

hamMenu.addEventListener("click", () => {
    hamMenu.classList.toggle("active");
    offScreenMenu.classList.toggle("active");
});

console.log("Helo");

// ========== ADDITIONAL ENHANCEMENTS ==========
(function addEnhancements() {
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.background = `rgba(255, ${180 + Math.random() * 75}, ${50 + Math.random() * 50}, ${0.3 + Math.random() * 0.4})`;
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle && particle.remove) particle.remove();
        }, 18000);
    }
    
    setInterval(createParticle, 500);
    
    const container = document.getElementById('containerContent');
    if (container) {
        container.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 40;
            const rotateY = (centerX - x) / 40;
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });
        
        container.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
        });
    }
    
    const hamBtn = document.querySelector('.ham-menu');
    if (hamBtn) {
        hamBtn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = '100%';
            ripple.style.height = '100%';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0) 70%)';
            ripple.style.top = '50%';
            ripple.style.left = '50%';
            ripple.style.transform = 'translate(-50%, -50%) scale(0)';
            ripple.style.transition = 'transform 0.4s ease-out, opacity 0.3s ease-out';
            ripple.style.pointerEvents = 'none';
            ripple.style.zIndex = '10';
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.style.transform = 'translate(-50%, -50%) scale(3)';
                ripple.style.opacity = '0';
            }, 10);
            
            setTimeout(() => {
                if (ripple && ripple.remove) ripple.remove();
            }, 400);
        });
    }
    
    const tourLink = document.querySelector('#tour a');
    if (tourLink) {
        tourLink.addEventListener('click', function(e) {
            if (offScreenMenu.classList.contains('active')) {
                hamMenu.classList.remove('active');
                offScreenMenu.classList.remove('active');
            }
            console.log("Tour link clicked - navigating to tour page");
        });
        
        tourLink.addEventListener('mouseenter', () => {
            tourLink.style.transform = 'translateX(8px)';
        });
        tourLink.addEventListener('mouseleave', () => {
            tourLink.style.transform = 'translateX(0)';
        });
    }
    
    // ========== TEAM CARD FUNCTIONALITY ==========
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    const teamCard = document.getElementById('teamCard');
    const closeCardBtn = document.getElementById('closeCardBtn');
    
    if (learnMoreBtn && teamCard) {
        // Show card when Learn More button is clicked
        learnMoreBtn.addEventListener('click', function() {
            teamCard.classList.add('show');
            // Prevent body scrolling when card is open
            document.body.style.overflow = 'hidden';
        });
        
        // Close card when close button is clicked
        if (closeCardBtn) {
            closeCardBtn.addEventListener('click', function() {
                teamCard.classList.remove('show');
                document.body.style.overflow = '';
            });
        }
        
        // Close card when clicking outside the card content
        teamCard.addEventListener('click', function(e) {
            if (e.target === teamCard) {
                teamCard.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
        
        // Close card with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && teamCard.classList.contains('show')) {
                teamCard.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
    
    const tourIcon = document.querySelector('#tour i');
    if (tourIcon) {
        tourIcon.style.pointerEvents = 'auto';
        tourIcon.style.cursor = 'pointer';
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'm' || e.key === 'M') {
            e.preventDefault();
            const ham = document.querySelector('.ham-menu');
            const menu = document.querySelector('.off-screen-menu');
            if (ham && menu) {
                ham.classList.toggle('active');
                menu.classList.toggle('active');
            }
        }
        if (e.key === 'Escape') {
            const ham = document.querySelector('.ham-menu');
            const menu = document.querySelector('.off-screen-menu');
            if (menu && menu.classList.contains('active')) {
                ham.classList.remove('active');
                menu.classList.remove('active');
            }
        }
    });
    
    console.log("%c✨ AMA Virtual Tour - Enhanced Edition ✨", "color: #ffd700; font-size: 14px; font-weight: bold;");
    console.log("%c🎮 Tip: Press 'M' to toggle menu | Press 'Esc' to close", "color: #ffaa33; font-size: 12px");
    
    setTimeout(() => {
        const toast = document.createElement('div');
        toast.innerHTML = '✨ Welcome to AMA Virtual Tour! ✨<br><small style="font-size:11px;">Click <i class="fa-regular fa-map"></i> Start Tour to begin your journey!</small>';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = 'rgba(0,0,0,0.85)';
        toast.style.backdropFilter = 'blur(10px)';
        toast.style.color = '#ffd700';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '40px';
        toast.style.fontSize = '14px';
        toast.style.fontFamily = 'system-ui, sans-serif';
        toast.style.textAlign = 'center';
        toast.style.zIndex = '10000';
        toast.style.border = '1px solid rgba(255,215,0,0.3)';
        toast.style.pointerEvents = 'none';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 100);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast && toast.remove) toast.remove();
            }, 500);
        }, 5000);
    }, 500);
})();