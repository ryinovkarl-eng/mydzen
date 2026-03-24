function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
}

function initRubiksCube() {
    const cube = document.getElementById('rubiks-cube');
    if (!cube) return;
    
    const cubieSize = 75;
    const gap = 4;
    
    // Logos map from the image
    const logos = [
        {
            x: -1, y: -1, z: 1, face: 'front', color: '#56afff',
            html: `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`
        },
        {
            x: -1, y: 0, z: 1, face: 'front', color: '#4CAF50',
            html: `<div style="line-height:1; font-weight:700; font-family:sans-serif; text-align:center;">
                   <div style="font-size:12px; margin-bottom:2px;">Bitrix</div>
                   <div style="font-size:18px; display:flex; align-items:center;">24<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:2px"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
                   </div>`
        },
        {
            x: 1, y: 0, z: 1, face: 'front', color: '#B351E6',
            html: `<div style="font-size:24px; font-weight:300; font-family:sans-serif; letter-spacing:-1px;">WB</div>`
        },
        {
            x: 1, y: 1, z: 1, face: 'front', color: '#f74d6c',
            html: `<div style="font-size:16px; font-weight:700; font-family:sans-serif;">OZON</div>`
        },
        {
            x: 0, y: -1, z: 0, face: 'top', color: '#F9A826',
            html: `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>`
        }
    ];

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                if (x === 0 && y === 0 && z === 0) continue; // inner core
                
                const cubie = document.createElement('div');
                cubie.className = 'cubie';
                
                const posX = x * (cubieSize + gap);
                const posY = y * (cubieSize + gap);
                const posZ = z * (cubieSize + gap);
                cubie.style.transform = `translate3d(${posX}px, ${posY}px, ${posZ}px)`;
                
                // Outer glass faces
                const faces = ['front', 'back', 'top', 'bottom', 'left', 'right'];
                faces.forEach(face => {
                    const faceEl = document.createElement('div');
                    faceEl.className = `cubie-face cubie-${face}`;
                    
                    const logoData = logos.find(l => l.x === x && l.y === y && l.z === z && l.face === face);
                    if (logoData) {
                        const logoEl = document.createElement('div');
                        logoEl.className = 'cubie-logo';
                        logoEl.innerHTML = logoData.html;
                        logoEl.style.color = logoData.color;
                        logoEl.style.filter = `drop-shadow(0 0 4px ${logoData.color})`;
                        faceEl.appendChild(logoEl);
                        
                        // Add tint
                        faceEl.style.background = `rgba(${hexToRgb(logoData.color)}, 0.15)`;
                        faceEl.style.borderColor = `rgba(${hexToRgb(logoData.color)}, 0.6)`;
                        faceEl.style.boxShadow = `inset 0 0 20px rgba(${hexToRgb(logoData.color)}, 0.3)`;
                    }
                    
                    cubie.appendChild(faceEl);
                });
                
                // Inner dark core
                const innerCore = document.createElement('div');
                innerCore.className = 'cubie-core';
                faces.forEach(face => {
                    const coreFace = document.createElement('div');
                    coreFace.className = `core-face core-${face}`;
                    innerCore.appendChild(coreFace);
                });
                cubie.appendChild(innerCore);
                
                cube.appendChild(cubie);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initRubiksCube();

    // 3D Tilt Effect on the visual block
    const cube = document.querySelector('.cube');
    const heroVisual = document.querySelector('.hero-visual');
    
    // Base rotation values for the isometric look
    const baseRotateX = -25;
    const baseRotateY = -35;
    
    // Start with idle auto-rotation
    if (cube) {
        cube.classList.add('idle-rotate');
    }
    
    if (cube && heroVisual) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            const tiltX = baseRotateX - (y * 30);
            const tiltY = baseRotateY + (x * 30);
            
            cube.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });
        
        // When mouse enters: stop idle animation, switch to interactive
        heroVisual.addEventListener('mouseenter', () => {
            cube.classList.remove('idle-rotate');
            cube.style.animation = 'none';
            cube.style.transition = 'none';
        });
        
        // When mouse leaves: smoothly return then resume idle
        heroVisual.addEventListener('mouseleave', () => {
            cube.style.transition = 'transform 0.8s ease-out';
            cube.style.transform = `rotateX(${baseRotateX}deg) rotateY(${baseRotateY}deg)`;
            // Resume idle after transition completes
            setTimeout(() => {
                cube.style.transition = '';
                cube.style.transform = '';
                cube.style.animation = '';
                cube.classList.add('idle-rotate');
            }, 900);
        });
    }

    // Live Clock Widget
    function updateClock() {
        const timeElement = document.getElementById('clock-time');
        const dateElement = document.getElementById('clock-date');
        if (!timeElement) return;
        
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        
        if (dateElement) {
            const days = ['\u0412\u0421', '\u041f\u041d', '\u0412\u0422', '\u0421\u0420', '\u0427\u0422', '\u041f\u0422', '\u0421\u0411'];
            const day = days[now.getDay()];
            const date = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            dateElement.textContent = `${day}, ${date}.${month}.${year}`;
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);

    // Process Timeline Scroll Animation
    const processSection = document.getElementById('process');
    const glowLine = document.getElementById('tl-progress');
    const timelineSteps = document.querySelectorAll('.timeline-step');

    if (processSection && glowLine && timelineSteps.length > 0) {
        const handleScroll = () => {
            const sectionRect = processSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            const containerRect = document.querySelector('.timeline-container').getBoundingClientRect();
            
            const totalTravel = containerRect.height;
            const currentTravel = (windowHeight / 2) - containerRect.top;
            
            let progress = (currentTravel / totalTravel) * 100;
            progress = Math.max(0, Math.min(progress, 100));
            
            glowLine.style.height = `${progress}%`;

            timelineSteps.forEach((step) => {
                const nodeRect = step.querySelector('.tl-node').getBoundingClientRect();
                const nodeCenter = nodeRect.top + nodeRect.height / 2;
                
                if ((windowHeight / 2) > nodeCenter) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // ==================== SCROLL REVEAL (IntersectionObserver) ====================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // Auto-stagger grid children (problem cards, bento cards)
    document.querySelectorAll('.problems-grid, .bento-grid').forEach(grid => {
        Array.from(grid.children).forEach((child, i) => {
            if (!child.classList.contains('reveal')) {
                child.classList.add('reveal');
            }
            child.classList.add(`reveal-delay-${Math.min(i + 1, 6)}`);
            
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
            obs.observe(child);
        });
    });
});
