/**
 * Kabeer Ahmed - AI Developer Portfolio Core Script
 * - Interactive 3D Particle Sphere (AI Core)
 * - Custom Cursor Avatar Lerp Follower
 * - Scroll Reveal & Section Highlighting (IntersectionObserver)
 * - Custom Video Player Controls
 */

document.addEventListener('DOMContentLoaded', () => {
    initCursorFollower();
    init3DParticles();
    initScrollAnimations();
    initVideoControls();
    initChatbot();
});

/* ==========================================================================
   CUSTOM CURSOR AVATAR FOLLOWER (LERP ANIMATION)
   ========================================================================== */
function initCursorFollower() {
    const avatar = document.getElementById('cursor-avatar');
    if (!avatar) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isInitialized = false;

    // Track real mouse positions
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isInitialized) {
            // Instantly place avatar on first movement to avoid slide-in from (0,0)
            currentX = mouseX;
            currentY = mouseY;
            avatar.style.opacity = '1';
            isInitialized = true;
        }
    });

    // Handle mouse leaving the window
    document.addEventListener('mouseleave', () => {
        avatar.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        avatar.style.opacity = '1';
    });

    // Smooth Lerping (Linear Interpolation) Loop
    // Target position is (mouseX, mouseY). Current position moves delta toward target.
    const lerpFactor = 0.12; // Controls how much the avatar "lags" (0.1 = slow/fluid, 0.2 = fast)

    function updateFollower() {
        if (isInitialized) {
            currentX += (mouseX - currentX) * lerpFactor;
            currentY += (mouseY - currentY) * lerpFactor;
            
            // Render transform translate3d for hardware acceleration
            avatar.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
        }
        requestAnimationFrame(updateFollower);
    }
    requestAnimationFrame(updateFollower);

    // Interactive Hover States
    // Scale up avatar when hovering clickable elements
    const clickables = document.querySelectorAll('a, button, .btn, .project-card, .social-icon, .contact-link');
    clickables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        item.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });
}

/* ==========================================================================
   3D PARTICLE SPHERE (AI CORE CANVAS ENGINE)
   ========================================================================== */
function init3DParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Responsive configurations
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        updateCenter();
    });

    let centerX = width / 2;
    let centerY = height / 2;
    
    // Position the sphere: center it in the background or offset it
    function updateCenter() {
        if (window.innerWidth > 1024) {
            // Position behind left/mid area for aesthetic spacing on split layout
            centerX = width * 0.35;
            centerY = height * 0.52;
        } else {
            // Centered on mobile/tablets
            centerX = width * 0.5;
            centerY = height * 0.45;
        }
    }
    updateCenter();

    // Math & Perspective parameters
    const particleCount = 300;
    const particles = [];
    const sphereRadius = Math.min(width, height) * 0.32; // Scale based on screen size
    const focalLength = 400; // Focal depth

    // Rotation angles and speeds
    let angleX = 0.0015;
    let angleY = 0.0025;
    let angleZ = 0.0005;

    // Interactive mouse drag/influence states
    let mouse = { x: 0, y: 0, active: false, speedX: 0, speedY: 0 };
    let lastMouse = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;

        // Calculate velocity of mouse to rotate sphere in response
        mouse.speedX = (mouse.x - lastMouse.x) * 0.0005;
        mouse.speedY = (mouse.y - lastMouse.y) * 0.0005;

        lastMouse.x = mouse.x;
        lastMouse.y = mouse.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.active = false;
        mouse.speedX = 0;
        mouse.speedY = 0;
    });

    // Particle Constructor
    class Particle {
        constructor() {
            // Generate points uniformly on a 3D sphere surface
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            this.x = sphereRadius * Math.sin(phi) * Math.cos(theta);
            this.y = sphereRadius * Math.sin(phi) * Math.sin(theta);
            this.z = sphereRadius * Math.cos(phi);
            
            // Store original coordinates to allow recovery after hover warping
            this.origX = this.x;
            this.origY = this.y;
            this.origZ = this.z;

            this.colorAlpha = Math.random() * 0.4 + 0.3; // Glow variation
            this.size = Math.random() * 3 + 1.5; // Size variation
        }

        // Apply 3D Rotations
        rotate() {
            // Speed decay toward default rotation
            let rotX = angleX + (mouse.active ? mouse.speedY * 0.5 : 0);
            let rotY = angleY + (mouse.active ? mouse.speedX * 0.5 : 0);
            let rotZ = angleZ;

            // Rotation Y (Yaw)
            let cosY = Math.cos(rotY);
            let sinY = Math.sin(rotY);
            let x1 = this.x * cosY - this.z * sinY;
            let z1 = this.z * cosY + this.x * sinY;

            // Rotation X (Pitch)
            let cosX = Math.cos(rotX);
            let sinX = Math.sin(rotX);
            let y2 = this.y * cosX - z1 * sinX;
            let z2 = z1 * cosX + this.y * sinX;

            // Rotation Z (Roll)
            let cosZ = Math.cos(rotZ);
            let sinZ = Math.sin(rotZ);
            let x3 = x1 * cosZ - y2 * sinZ;
            let y3 = y2 * cosZ + x1 * sinZ;

            this.x = x3;
            this.y = y3;
            this.z = z2; // Keep tracking z for depth projection
        }

        // Mouse hover warp effect
        warp() {
            if (mouse.active) {
                // Approximate projected screen coordinates of the particle
                const scale = focalLength / (focalLength + this.z);
                const scrX = centerX + this.x * scale;
                const scrY = centerY + this.y * scale;

                // Distance to cursor
                const dx = scrX - mouse.x;
                const dy = scrY - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // If close to cursor, push the particle outward
                const threshold = 120;
                if (dist < threshold) {
                    const force = (threshold - dist) / threshold * 35;
                    const angle = Math.atan2(dy, dx);
                    // Push vector
                    this.x += Math.cos(angle) * force * 0.5;
                    this.y += Math.sin(angle) * force * 0.5;
                }
            }

            // Gradually spring back to sphere shape
            const springStrength = 0.08;
            const currentRadius = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
            if (Math.abs(currentRadius - sphereRadius) > 1) {
                const ratio = sphereRadius / currentRadius;
                this.x += (this.x * ratio - this.x) * springStrength;
                this.y += (this.y * ratio - this.y) * springStrength;
                this.z += (this.z * ratio - this.z) * springStrength;
            }
        }

        // Render Projected 2D Dot
        draw() {
            // Perspective Projection Formula
            const scale = focalLength / (focalLength + this.z);
            const projX = centerX + this.x * scale;
            const projY = centerY + this.y * scale;

            // Don't draw if projected off-canvas
            if (projX < 0 || projX > width || projY < 0 || projY > height) return;

            // Depth opacity (fade items that are further away in background)
            const depthFactor = (focalLength - this.z) / (focalLength * 2);
            const opacity = this.colorAlpha * Math.max(0.1, depthFactor + 0.3);

            // Draw glowing core particles
            ctx.beginPath();
            ctx.arc(projX, projY, this.size * scale, 0, Math.PI * 2);
            
            // Alternating cyan/green theme colors
            if (this.origX > 0) {
                ctx.fillStyle = `rgba(0, 210, 255, ${opacity})`; // Cyan
            } else {
                ctx.fillStyle = `rgba(0, 255, 136, ${opacity * 0.8})`; // Green
            }
            ctx.fill();

            // Web effect - Draw connecting neural lines for nearby particles
            // (Only draw lines between front-facing particles to reduce clutter)
            if (this.z < 0) {
                for (let i = 0; i < particles.length; i++) {
                    const other = particles[i];
                    if (other !== this && other.z < 0) {
                        const dx = this.x - other.x;
                        const dy = this.y - other.y;
                        const dz = this.z - other.z;
                        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                        
                        // Connect if close enough
                        if (dist < sphereRadius * 0.55) {
                            const lineOpacity = (1 - (dist / (sphereRadius * 0.55))) * 0.25 * opacity;
                            ctx.beginPath();
                            ctx.moveTo(projX, projY);
                            
                            const otherScale = focalLength / (focalLength + other.z);
                            const otherProjX = centerX + other.x * otherScale;
                            const otherProjY = centerY + other.y * otherScale;
                            
                            ctx.lineTo(otherProjX, otherProjY);
                            ctx.strokeStyle = `rgba(0, 210, 255, ${lineOpacity})`;
                            ctx.lineWidth = 0.55 * scale;
                            ctx.stroke();
                        }
                    }
                }
            }
        }
    }

    // Populate particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    let lastScrollY = window.scrollY;

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Adjust rotation speed dynamically based on scroll velocity (Warp effect)
        const currentScrollY = window.scrollY;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);
        const scrollInfluence = scrollDelta * 0.0003;
        
        angleY = 0.0025 + scrollInfluence;
        angleX = 0.0015 + scrollInfluence * 0.5;
        
        lastScrollY = currentScrollY;

        // Render sorted particles based on Z-depth so background draws first (painter's algorithm)
        particles.sort((p1, p2) => p2.z - p1.z);

        particles.forEach(p => {
            p.rotate();
            p.warp();
            p.draw();
        });

        // Slow decay mouse velocity back to 0
        if (mouse.active) {
            mouse.speedX *= 0.95;
            mouse.speedY *= 0.95;
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   SCROLL REVEAL & NAV HIGHLIGHTING (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
    // 1. Header scroll changes (add blur/shadow when scrolled down)
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scroll-scrolled');
        } else {
            header.classList.remove('scroll-scrolled');
        }
    });

    // 2. Initial hero elements fade-in sequence
    const heroElements = document.querySelectorAll('.hero-left > *');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('animate-in');
        }, 150 + index * 100);
    });

    // 3. Section Reveal Fade-in as you scroll down
    const sections = document.querySelectorAll('.content-section');
    const sectionObserverOptions = {
        root: null,
        threshold: 0.15, // Trigger when 15% of section enters viewport
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, sectionObserverOptions);

    sections.forEach(sec => {
        sectionObserver.observe(sec);
    });

    // 4. Update Navigation active tab based on visible sections
    const navLinks = document.querySelectorAll('.nav-link');
    const navObserverOptions = {
        root: null,
        threshold: 0.35, // Trigger active when 35% of section is visible
        rootMargin: '-5% 0px -40% 0px' // Offset top/bottom bounds
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    // Observe hero as well as standard content sections
    navObserver.observe(document.getElementById('hero'));
    sections.forEach(sec => {
        navObserver.observe(sec);
    });
}

/* ==========================================================================
   VIDEO CONTROLS & INTERACTIVE BEHAVIORS
   ========================================================================== */
function initVideoControls() {
    const video = document.getElementById('hero-video');
    const muteToggle = document.getElementById('video-mute-toggle');
    if (!video || !muteToggle) return;

    // Since browsers block autoplay with sound, video starts muted.
    // Allow users to toggle sound.
    muteToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering container click events
        video.muted = !video.muted;
        
        const icon = muteToggle.querySelector('i');
        if (video.muted) {
            icon.className = 'fa-solid fa-volume-xmark';
            muteToggle.setAttribute('title', 'Unmute Video');
        } else {
            icon.className = 'fa-solid fa-volume-high';
            muteToggle.setAttribute('title', 'Mute Video');
        }
    });

    // Subtly speed up video playback slightly on hover for tech feeling
    const container = document.querySelector('.video-container-glass');
    if (container) {
        container.addEventListener('mouseenter', () => {
            video.playbackRate = 1.25; // 25% faster
        });
        container.addEventListener('mouseleave', () => {
            video.playbackRate = 1.0;  // Reset speed
        });
    }
}

/* ==========================================================================
   INTERACTIVE AI CHATBOT SYSTEM
   ========================================================================== */
function initChatbot() {
    const toggle = document.getElementById('chatbot-toggle');
    const windowEl = document.getElementById('chatbot-window');
    const close = document.getElementById('chatbot-close');
    const messagesContainer = document.getElementById('chatbot-messages');
    const replies = document.querySelectorAll('.reply-btn');

    if (!toggle || !windowEl || !close || !messagesContainer) return;

    // Response Data Bank
    const botReplies = {
        skills: "Here is a breakdown of my engineering core:\n\n🤖 **Deep Learning**: PyTorch, TensorFlow, Transformers (HuggingFace), Scikit-Learn\n👁️ **Computer Vision**: OpenCV, YOLOv8, MediaPipe, CUDA optimization\n⚙️ **MLOps & Infra**: FastAPI (Python), Docker containerization, MLflow, AWS & GCP deployments",
        projects: "Here is my featured AI work:\n\n📹 **Real-time Tracker**: Custom YOLOv8 + DeepSORT on Jetson edge devices (98% tracking accuracy @ 30 FPS).\n📖 **RAG Document Engine**: LangChain + Pinecone chatbot with semantic search, document citation, and source tracking.\n🔄 **AutoML CI/CD**: Scalable Kubernetes continuous retraining pipeline integrated with MLflow.",
        contact: "Let's build together!\n\n✉️ Email: **kabeer.ahmed@example.com**\n💼 Hire Kabeer on [Upwork](https://www.upwork.com/freelancers/~01c2ce9b75ca001aac)\n⚡ Find Kabeer on [Fiverr](https://www.fiverr.com/sellers/kabeer_ahmed_ai/edit)\n🔗 Connect on [LinkedIn](https://www.linkedin.com/in/kabeer-ahmed-ai/)",
        about: "I am an AI Developer & Engineer dedicated to building production-ready neural architectures and robust backend pipelines. I prefer clean performance, FastAPI servers, CUDA acceleration, and containerized scalable MLOps."
    };

    // Open/Close Window
    toggle.addEventListener('click', () => {
        windowEl.classList.add('open');
        toggle.style.transform = 'scale(0) rotate(90deg)';
        toggle.style.pointerEvents = 'none';
    });

    close.addEventListener('click', () => {
        windowEl.classList.remove('open');
        setTimeout(() => {
            toggle.style.transform = 'scale(1) rotate(0deg)';
            toggle.style.pointerEvents = 'auto';
        }, 300);
    });

    // Helper to append message
    function appendMessage(text, sender) {
        const bubble = document.createElement('div');
        bubble.className = `chat-message ${sender}`;
        
        // Render simple Markdown-like text (bolding & links)
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #00d2ff; font-weight:600;">$1</a>')
            .replace(/\n/g, '<br>');

        bubble.innerHTML = `<p>${formattedText}</p>`;
        messagesContainer.appendChild(bubble);
        
        // Auto scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Quick Replies Click Listeners
    replies.forEach(button => {
        button.addEventListener('click', () => {
            const questionType = button.getAttribute('data-question');
            const questionText = button.textContent;
            
            // Append User Message
            appendMessage(questionText, 'user');
            
            // Show typing indicator
            const typingBubble = document.createElement('div');
            typingBubble.className = 'chat-message bot typing';
            typingBubble.innerHTML = '<p>Agent is typing<span class="dot-typing">...</span></p>';
            messagesContainer.appendChild(typingBubble);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Simulate typing lag
            setTimeout(() => {
                typingBubble.remove();
                const response = botReplies[questionType] || "I'm not sure about that. Try selecting a quick reply!";
                appendMessage(response, 'bot');
            }, 750);
        });
    });
}
