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
    
    // Set initial 
    if(cube) {
        cube.style.transform = `rotateX(${baseRotateX}deg) rotateY(${baseRotateY}deg)`;
    }
    
    if (cube && heroVisual) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            
            // Calculate mouse position relative to the element (-0.5 to 0.5)
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            // Add interaction delta
            const tiltX = baseRotateX - (y * 30);
            const tiltY = baseRotateY + (x * 30);
            
            // Apply transform
            cube.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });
        
        // Reset translation when mouse leaves
        heroVisual.addEventListener('mouseleave', () => {
            cube.style.transform = `rotateX(${baseRotateX}deg) rotateY(${baseRotateY}deg)`;
            cube.style.transition = 'transform 0.5s ease-out';
        });
        
        heroVisual.addEventListener('mouseenter', () => {
            cube.style.transition = 'none';
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
            const days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
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
        // Calculate scroll progress specifically within the process section
        const handleScroll = () => {
            const sectionRect = processSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Start animation when section enters viewport
            // End when section leaves viewport
            
            // Adjust to get a nice progress curve where 0% is top of timeline container in middle of screen 
            // and 100% is bottom of timeline container in middle of screen
            const containerRect = document.querySelector('.timeline-container').getBoundingClientRect();
            
            const totalTravel = containerRect.height;
            const currentTravel = (windowHeight / 2) - containerRect.top;
            
            let progress = (currentTravel / totalTravel) * 100;
            progress = Math.max(0, Math.min(progress, 100)); // clamp between 0 and 100
            
            glowLine.style.height = `${progress}%`;

            // Check which nodes should be lit up based on the line position
            timelineSteps.forEach((step) => {
                const nodeRect = step.querySelector('.tl-node').getBoundingClientRect();
                const nodeCenter = nodeRect.top + nodeRect.height / 2;
                
                // If the glowing line has reached or passed this node's center
                // which is currently somewhere roughly below the window center
                if ((windowHeight / 2) > nodeCenter) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial call
        handleScroll();
    }
});
