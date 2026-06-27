// ============================================
// APP.JS - Frontend Logic & CMS Integration
// Version 5 - Enhanced Portfolio with AI
// ============================================

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initTheme();
        initParticles();
        initCursor();
        initNavbar();
        loadContent();
        setTimeout(() => { initRevealObserver(); }, 100);
    });

    function loadContent() {
        const data = PortfolioCMS.getAll();
        
        // About
        if (data.about) {
            updateText('about-description', data.about.description);
            // Set counter data-target from defaults, display "0" initially for animation
            const statYears = document.getElementById('stat-years');
            const statProjects = document.getElementById('stat-projects');
            const statHours = document.getElementById('stat-hours');
            if (statYears) { statYears.dataset.target = data.about.years.replace('+', ''); statYears.textContent = '0+'; }
            if (statProjects) { statProjects.dataset.target = data.about.projects.replace('+', ''); statProjects.textContent = '0+'; }
            if (statHours) { statHours.dataset.target = data.about.hours.replace('+', ''); statHours.textContent = '0+'; }
            const aboutImg = document.querySelector('#about img[alt="Portrait"]');
            if (aboutImg && data.about.photo) aboutImg.src = data.about.photo;
        }

        // Categories
        renderCategories();

        // Skills with bars
        renderSkills();

        // Video Portfolio Carousel
        renderVideoCarousel(data.videoPortfolio);

        // Process
        renderProcess(data.process);

        // Testimonials
        renderTestimonials(data.testimonials);

        // Contact
        renderContact(data.contact, data.social);

        // Footer
        renderFooter(data.footer);

        // CV Button
        renderCvButton(data.cvUrl);
    }

    // --- Theme Toggle ---
    function initTheme() {
        const savedTheme = localStorage.getItem('msr_theme') || 'dark';
        if (savedTheme === 'light') document.documentElement.classList.add('light');
        
        const toggle = document.getElementById('theme-toggle');
        const toggleMobile = document.getElementById('theme-toggle-mobile');
        
        function switchTheme() {
            document.documentElement.classList.toggle('light');
            const isLight = document.documentElement.classList.contains('light');
            localStorage.setItem('msr_theme', isLight ? 'light' : 'dark');
        }
        
        if (toggle) toggle.onclick = switchTheme;
        if (toggleMobile) toggleMobile.onclick = switchTheme;
    }

    // --- Particles Canvas ---
    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);
        
        const particles = [];
        const particleCount = Math.min(60, Math.floor(window.innerWidth / 25));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.3 + 0.1
            });
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(173, 198, 255, ${p.alpha})`;
                ctx.fill();
            });
            
            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(173, 198, 255, ${0.05 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animate);
        }
        animate();
    }

    // --- Counter Animation ---
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const start = 0;
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
                const current = Math.round(start + (target - start) * eased);
                counter.textContent = current + (target >= 100 ? '+' : '+');
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            requestAnimationFrame(update);
        });
    }

    // --- AI Description Generator ---
    async function generateAIDescription(project) {
        // Simulated AI description (in production, call OpenAI/ClLM API)
        const templates = [
            `A compelling ${project.category.toLowerCase()} project showcasing ${project.tags?.slice(0, 2).join(' and ') || 'professional excellence'}. This work demonstrates technical precision in ${project.tags?.[0] || 'video production'} while maintaining a distinctive creative vision that elevates brand storytelling to new standards.`,
            `This ${project.category} initiative combines ${project.tags?.join(', ') || 'technical expertise'} to deliver impactful visual content. The project highlights a unique approach to corporate storytelling, blending cinematic quality with strategic messaging for maximum audience engagement.`,
            `An innovative ${project.category.toLowerCase()} production featuring ${project.tags?.slice(0, 2).join(' + ') || 'premium techniques'}. This project exemplifies the intersection of creative storytelling and technical mastery, resulting in content that resonates with both stakeholders and general audiences alike.`
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }

    // --- Render Category Cards ---
    function renderCategories() {
        const categories = PortfolioCMS.getCategories();
        const grid = document.getElementById('categories-grid');
        if (!grid) return;

        grid.innerHTML = categories.map((cat, i) => `
            <div class="category-card glass-panel rounded-2xl overflow-hidden relative hover-lift stagger-item" data-category="${cat.id}" onclick="openGallery('${cat.id}')" style="animation-delay: ${i * 0.1}s">
                <div class="aspect-[4/5] relative overflow-hidden">
                    <img alt="${escapeHtml(cat.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" src="${cat.cover}"/>
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
                <div class="absolute inset-0 bg-primary/10 category-overlay flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary category-icon text-6xl">${cat.icon}</span>
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-stack-lg">
                    <h3 class="font-headline-lg text-xl mb-1">${escapeHtml(cat.title)}</h3>
                    <p class="text-on-surface-variant text-sm line-clamp-2">${escapeHtml(cat.description)}</p>
                </div>
            </div>
        `).join('');

        // Re-observe reveals
        document.querySelectorAll('.reveal:not(.active)').forEach(el => {
            if (window.revealObserver) window.revealObserver.observe(el);
        });

        document.querySelectorAll('.stagger-item').forEach(el => {
            el.style.opacity='1';
            el.style.transform='translateY(0)';
        });

        // Event delegation for category clicks
        // Use setTimeout to ensure openGallery is defined
        setTimeout(function() {
            document.addEventListener('click', function(e) {
                var card = e.target.closest('[data-category]');
                if (card) {
                    var catId = card.getAttribute('data-category');
                    if (catId && typeof openGallery === 'function') {
                        openGallery(catId);
                    }
                }
            });
        }, 100);
    }

    // --- Gallery Modal ---
    window.openGallery = function(categoryId) {
        const cat = PortfolioCMS.getCategoryById(categoryId);
        if (!cat || !cat.gallery) return;

        const modal = document.getElementById('gallery-modal');
        const img = document.getElementById('gallery-img');
        const title = document.getElementById('gallery-title');
        const counter = document.getElementById('gallery-counter');

        let currentIndex = 0;
        const gallery = cat.gallery;

        function showImage(index) {
            currentIndex = index;
            counter.textContent = `${index + 1} / ${gallery.length}`;
            title.textContent = cat.title;
            
            img.style.opacity = '0';
            img.style.transform = 'scale(0.95)';
            
            var src = gallery[index];
            img.src = src;
            img.alt = cat.title + ' - Photo ' + (index + 1);
            
            // Fallback: always show after short delay
            setTimeout(function() {
                img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                img.style.opacity = '1';
                img.style.transform = 'scale(1)';
            }, 200);
        }

        showImage(currentIndex);

        // Show modal with animation
        modal.classList.remove('hidden');
        modal.classList.add('show');

        // Navigation
        document.getElementById('gallery-prev').onclick = () => {
            const newIndex = currentIndex === 0 ? gallery.length - 1 : currentIndex - 1;
            showImage(newIndex);
        };

        document.getElementById('gallery-next').onclick = () => {
            const newIndex = currentIndex >= gallery.length - 1 ? 0 : currentIndex + 1;
            showImage(newIndex);
        };

        document.getElementById('gallery-backdrop').onclick = closeGallery;
        document.getElementById('gallery-close').onclick = closeGallery;
        document.onkeydown = (e) => {
            if (!modal.classList.contains('hidden')) {
                if (e.key === 'Escape') closeGallery();
                if (e.key === 'ArrowLeft') document.getElementById('gallery-prev').click();
                if (e.key === 'ArrowRight') document.getElementById('gallery-next').click();
            }
        };
    };

    window.closeGallery = function() {
        const modal = document.getElementById('gallery-modal');
        modal.classList.remove('show');
        modal.classList.add('hide');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('hide');
        }, 300);
    };

    function updateText(id, text) {
        const el = document.getElementById(id);
        if (el && text) el.textContent = text;
    }

    function renderCvButton(cvUrl) {
        const cvBtns = document.querySelectorAll('a[href="#"]');
        cvBtns.forEach(btn => {
            if (btn.textContent.includes('Download CV')) {
                btn.href = cvUrl || '#';
                if (cvUrl && cvUrl !== '#') {
                    btn.setAttribute('download', '');
                    btn.removeAttribute('onclick');
                }
            }
        });
    }

    // --- Render Skills with Progress Bars ---
    function renderSkills() {
        const data = PortfolioCMS.getAll();
        const grid = document.getElementById('skills-grid');
        if (!grid || !data.skills) return;

        grid.innerHTML = data.skills.map((s, i) => `
            <div class="glass-panel p-stack-lg rounded-3xl flex flex-col items-center text-center stagger-item hover-lift group relative overflow-hidden" style="animation-delay: ${i * 0.08}s">
                <div class="card-glow"></div>
                <span class="material-symbols-outlined text-primary text-5xl mb-stack-md group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">${s.icon}</span>
                <h3 class="font-headline-lg text-lg mb-2">${s.title}</h3>
                <p class="text-sm text-on-surface-variant font-body-md mb-stack-md">${s.description}</p>
                <div class="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                    <div class="skill-bar h-full bg-gradient-to-r from-primary to-primary-container rounded-full" data-value="${s.value}" style="width: 0%"></div>
                </div>
                <span class="text-xs text-on-surface-variant mt-2 font-bold counter" data-target="${s.value}">0%</span>
            </div>
        `).join('');

        // Animate bars when visible
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bars = entry.target.querySelectorAll('.skill-bar');
                    bars.forEach((bar, i) => {
                        setTimeout(() => {
                            bar.style.transition = 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
                            bar.style.width = bar.dataset.value + '%';
                        }, i * 200);
                    });
                }
            });
        }, { threshold: 0.3 });
        
        grid.querySelectorAll('.stagger-item').forEach(el => skillObserver.observe(el));
    }

    // --- Video Portfolio Carousel ---
    function renderVideoCarousel(videos) {
        if (!videos || videos.length === 0) return;
        const track = document.getElementById('video-carousel-track');
        const dotsContainer = document.getElementById('video-carousel-dots');
        if (!track) return;

        track.innerHTML = videos.map((v, i) => `
            <div class="video-slide flex-shrink-0 w-full" data-index="${i}">
                <div class="relative w-full rounded-[1.5rem] overflow-hidden" style="padding-top: 56.25%;">
                    <iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/${v.videoId}?rel=0&modestbranding=1&${i === 0 ? 'autoplay=1&mute=1' : ''}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div class="mt-4 text-center">
                    <h3 class="font-headline-lg text-xl md:text-2xl">${escapeHtml(v.title)}</h3>
                    <p class="text-on-surface-variant font-body-md text-sm mt-1">${escapeHtml(v.description)}</p>
                </div>
            </div>
        `).join('');

        // Dots
        if (dotsContainer) {
            dotsContainer.innerHTML = videos.map((v, i) => `
                <button class="video-dot w-3 h-3 rounded-full transition-all duration-300 ${i === 0 ? 'bg-primary w-8' : 'bg-outline-variant hover:bg-primary/50'}" data-index="${i}"></button>
            `).join('');
        }

        // Init carousel
        initVideoCarousel();
    }

    function initVideoCarousel() {
        const track = document.getElementById('video-carousel-track');
        const prevBtn = document.getElementById('video-prev');
        const nextBtn = document.getElementById('video-next');
        const dots = document.querySelectorAll('.video-dot');
        
        if (!track) return;
        
        let current = 0;
        const slides = track.querySelectorAll('.video-slide');
        const total = slides.length;

        function goTo(index) {
            if (index < 0) index = total - 1;
            if (index >= total) index = 0;
            current = index;
            track.style.transform = `translateX(-${current * 100}%)`;
            
            dots.forEach((d, i) => {
                d.className = i === current 
                    ? 'video-dot w-8 h-3 rounded-full transition-all duration-300 bg-primary'
                    : 'video-dot w-3 h-3 rounded-full transition-all duration-300 bg-outline-variant hover:bg-primary/50';
            });
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        if (prevBtn) prevBtn.onclick = prev;
        if (nextBtn) nextBtn.onclick = next;
        dots.forEach(dot => {
            dot.onclick = function() { goTo(parseInt(this.dataset.index)); };
        });

        // Auto-play every 8 seconds
        let autoPlay = setInterval(next, 8000);

        // Pause on hover
        track.addEventListener('mouseenter', () => clearInterval(autoPlay));
        track.addEventListener('mouseleave', () => { autoPlay = setInterval(next, 8000); });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        });
    }

    function renderProcess(process) {
        if (!process) return;
        const container = document.getElementById('process-timeline');
        if (!container) return;

        container.innerHTML = process.map((p, i) => {
            const isFirst = i === 0;
            const isLast = i === process.length - 1;
            const circleClass = isFirst || isLast 
                ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                : 'bg-surface-container-highest border border-primary/30 text-primary';

            return `
                <div class="flex flex-col gap-4 max-w-xs stagger-item" style="animation-delay: ${i * 0.12}s">
                    <div class="w-14 h-14 rounded-2xl ${circleClass} flex items-center justify-center font-bold font-body-md text-xl shadow-xl">
                        ${p.icon ? `<span class="material-symbols-outlined">${p.icon}</span>` : p.step}
                    </div>
                    <div>
                        <h3 class="font-headline-lg text-lg mb-1">${p.title}</h3>
                        <p class="text-on-surface-variant text-sm font-body-md leading-relaxed">${p.description}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderTestimonials(testimonials) {
        if (!testimonials || testimonials.length === 0) return;
        const container = document.getElementById('testimonials-slider');
        if (!container) return;

        container.innerHTML = `
            <div class="testimonial-track relative overflow-hidden min-h-[250px]">
                ${testimonials.map((t, i) => `
                    <div class="testimonial-slide w-full ${i === 0 ? 'active block' : 'hidden'}" data-index="${i}">
                        <span class="text-6xl text-primary/30 mb-stack-md block">${t.avatar || '💬'}</span>
                        <p class="testimonial-quote font-headline-lg text-xl md:text-2xl italic mb-stack-lg leading-relaxed font-bold transition-all duration-500">
                            "${escapeHtml(t.quote)}"
                        </p>
                        <div class="flex flex-col items-center">
                            <span class="font-bold text-on-surface font-body-md text-lg">${escapeHtml(t.author)}</span>
                            <span class="text-on-surface-variant font-label-md">${escapeHtml(t.role)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="flex justify-center items-center gap-6 mt-stack-md">
                <button class="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-white/10 hover:border-primary transition-all active:scale-90" id="testimonial-prev"><span class="material-symbols-outlined">chevron_left</span></button>
                <div class="flex justify-center gap-2">
                    ${testimonials.map((t, i) => `
                        <button class="testimonial-dot w-3 h-3 rounded-full transition-all duration-300 ${i === 0 ? 'bg-primary w-8' : 'bg-outline-variant hover:bg-primary/50'}" data-index="${i}"></button>
                    `).join('')}
                </div>
                <button class="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-white/10 hover:border-primary transition-all active:scale-90" id="testimonial-next"><span class="material-symbols-outlined">chevron_right</span></button>
            </div>
        `;

        initTestimonialSlider();
    }

    function initTestimonialSlider() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.testimonial-dot');
        const prevBtn = document.getElementById('testimonial-prev');
        const nextBtn = document.getElementById('testimonial-next');
        
        if (!slides.length) return;
        if (slides.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return;
        }

        let current = 0;
        let isAnimating = false;
        let autoSlideInterval;

        function showSlide(index) {
            if (index === current || isAnimating) return;
            isAnimating = true;

            slides[current].style.opacity = '0';
            slides[current].style.transform = 'translateY(10px)';
            slides[current].style.filter = 'blur(4px)';

            setTimeout(() => {
                slides[current].classList.remove('active', 'block');
                slides[current].classList.add('hidden');
                slides[current].style.opacity = '';
                slides[current].style.transform = '';
                slides[current].style.filter = '';

                current = index;
                slides[current].classList.remove('hidden');
                slides[current].classList.add('active', 'block');
                slides[current].style.opacity = '0';
                slides[current].style.transform = 'translateY(-10px)';
                slides[current].style.filter = 'blur(4px)';
                void slides[current].offsetHeight;

                requestAnimationFrame(() => {
                    slides[current].style.opacity = '1';
                    slides[current].style.transform = 'translateY(0)';
                    slides[current].style.filter = 'blur(0)';
                });

                dots.forEach((d, i) => {
                    d.className = i === current 
                        ? 'testimonial-dot w-8 h-3 rounded-full transition-all duration-300 bg-primary'
                        : 'testimonial-dot w-3 h-3 rounded-full transition-all duration-300 bg-outline-variant hover:bg-primary/50';
                });

                setTimeout(() => { isAnimating = false; }, 400);
            }, 200);
        }

        function next() { showSlide((current + 1) % slides.length); }
        function prev() { showSlide((current - 1 + slides.length) % slides.length); }

        if (prevBtn) prevBtn.onclick = () => { prev(); resetAutoSlide(); };
        if (nextBtn) nextBtn.onclick = () => { next(); resetAutoSlide(); };
        
        dots.forEach(dot => {
            dot.onclick = function() {
                showSlide(parseInt(this.dataset.index));
                resetAutoSlide();
            };
        });

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(next, 6000);
        }
        autoSlideInterval = setInterval(next, 6000);
    }

    function renderContact(contact, social) {
        const contactBtn = document.getElementById('contact-btn');
        if (contactBtn && contact?.email) {
            contactBtn.href = 'mailto:' + contact.email;
        }
        if (social) {
            const linksContainer = document.getElementById('footer-links');
            if (linksContainer) {
                const links = [];
                if (social.linkedin) links.push({ name: 'LinkedIn', url: social.linkedin });
                if (social.instagram) links.push({ name: 'Instagram', url: social.instagram });
                if (social.behance) links.push({ name: 'Behance', url: social.behance });
                if (contact?.email) links.push({ name: 'Email', url: 'mailto:' + contact.email });
                linksContainer.innerHTML = links.map(l =>
                    `<a class="text-on-surface-variant hover:text-primary transition-colors" href="${l.url}" target="_blank">${l.name}</a>`
                ).join('');
            }
        }
    }

    function renderFooter(footer) {
        if (!footer) return;
        updateText('footer-text', footer.text);
    }

    // --- Custom Cursor ---
    function initCursor() {
        const cursor = document.getElementById('cursor');
        if (!cursor) return;
        if ('ontouchstart' in window) { cursor.style.display = 'none'; return; }

        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, .group, .hover-lift').forEach(function(el) {
            el.addEventListener('mouseenter', function() {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.backgroundColor = 'rgba(173, 198, 255, 0.1)';
            });
            el.addEventListener('mouseleave', function() {
                cursor.style.transform = 'scale(1)';
                cursor.style.backgroundColor = 'transparent';
            });
        });
    }

    // --- Mobile Menu ---
    function initNavbar() {
        const nav = document.getElementById('main-nav');
        if (!nav) return;
        
        // Scroll behavior
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                nav.classList.add('nav-scrolled');
                nav.classList.remove('bg-transparent');
            } else {
                nav.classList.remove('nav-scrolled');
                nav.classList.add('bg-transparent');
            }
        });

        // Mobile menu
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');
        const closeBtn = document.getElementById('mobile-menu-close');
        
        if (btn && menu) btn.onclick = () => menu.classList.add('open');
        if (closeBtn && menu) closeBtn.onclick = () => menu.classList.remove('open');
    }

    // --- Reveal Observer ---
    function initRevealObserver() {
        window.revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    if (entry.target.classList.contains('stagger-active-trigger')) {
                        entry.target.classList.add('stagger-active');
                    }
                    
                    // Trigger counter animation when about section visible
                    if (entry.target.closest('#about')) {
                        setTimeout(animateCounters, 500);
                    }
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.reveal, .stagger-active-trigger').forEach(function(el) {
            window.revealObserver.observe(el);
        });
    }

    // --- Utility ---
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
})();
