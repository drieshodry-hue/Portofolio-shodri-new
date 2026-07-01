// ============================================
// DATA.JS - Default Data & localStorage CMS
// Version 7 - Projects (refactored from categories)
// ============================================

var PortfolioCMS = {
    STORAGE_KEY: 'msr_portfolio_v7',

    // ponytail: one-time migration from v6 → v7, bump key if schema breaks again
    _migrate() {
        var old = localStorage.getItem('msr_portfolio_v6');
        if (old) {
            try {
                var d = JSON.parse(old);
                if (d.categories && !d.projects) {
                    d.projects = d.categories.map(function(c) {
                        return {
                            id: c.id,
                            title: c.title,
                            description: c.description,
                            cover: c.cover,
                            gallery: c.gallery || []
                        };
                    });
                    delete d.categories;
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(d));
                }
            } catch (e) {}
            localStorage.removeItem('msr_portfolio_v6');
        }
    },

    defaults: {
        about: {
            description: "With over six years of dedicated experience in corporate multimedia, I bridge the gap between technical precision and creative storytelling. My work transforms complex infrastructure and corporate visions into compelling visual experiences that drive engagement and deliver measurable impact.",
            years: "6+",
            projects: "150+",
            hours: "500+",
            clients: "30+",
            photo: "profile-shodri.png"
        },
        projects: [
            {
                id: "photography",
                title: "Photography",
                description: "Corporate and event photography with cinematic aesthetics, capturing moments that tell stories.",
                cover: "photo-1.jpg",
                gallery: ["photo-1.jpg", "photo-2.jpg", "photo-3.jpg", "photo-4.jpg", "photo-5.jpg", "photo-6.jpg", "photo-7.jpg", "photo-8.jpg", "photo-9.jpg"]
            },
            {
                id: "social-media",
                title: "Social Media Campaign",
                description: "Multi-platform content strategy and production for brand engagement across digital channels.",
                cover: "social-media-1.jpg",
                gallery: ["social-media-1.jpg", "social-media-2.jpg", "social-media-3.jpg", "social-media-4.jpg", "social-media-5.jpg", "social-media-6.jpg", "social-media-7.jpg"]
            },
            {
                id: "live-streaming",
                title: "Live Corporate Streaming",
                description: "Professional multi-camera live streaming for corporate events, town halls, and press conferences.",
                cover: "stream-1.jpg",
                gallery: ["stream-1.jpg", "stream-2.jpg", "stream-3.jpg", "stream-4.jpg", "stream-5.jpg", "stream-6.jpg", "stream-7.jpg", "stream-8.jpg", "stream-9.jpg"]
            },
            {
                id: "corporate-design",
                title: "Corporate Design",
                description: "Motion graphics, brand identity, and visual design that elevates corporate communications.",
                cover: "corporate-design-1.jpg",
                gallery: ["corporate-design-1.jpg", "corporate-design-2.jpg"]
            },
            {
                id: "corporate-video",
                title: "Corporate Video",
                description: "Premium corporate video production for annual reports, brand stories, and stakeholder communications.",
                cover: "video-1.jpg",
                gallery: ["video-1.jpg", "video-2.jpg", "video-3.jpg", "video-4.jpg", "video-5.jpg", "video-6.jpg"]
            }
        ],
        videoPortfolio: [
            { title: "2024 Showreel", videoId: "xE7n58FTbeM", description: "Compilation of best works across corporate, infrastructure, and social media." },
            { title: "Corporate Annual Report", videoId: "yHuhohiAgKs", description: "Premium corporate video for stakeholder communications." },
            { title: "Infrastructure Documentary", videoId: "MiQ7zXbN7VE", description: "Cinematic documentation of national construction milestones." },
            { title: "Social Media Campaign", videoId: "6dy-ascS0EE", description: "Multi-platform content strategy for brand engagement." },
            { title: "Brand Intro - WIKA Beton", videoId: "BjOA2OnJFkY", description: "Cinematic brand intro animation with 3D elements." }
        ],
        skills: [
            { icon: "movie_edit", title: "Video Editing", description: "Premiere Pro, DaVinci Resolve, After Effects", value: 95 },
            { icon: "photo_camera", title: "Photography", description: "Sony A7 Series, Cinematic Lighting", value: 90 },
            { icon: "live_tv", title: "Live Production", description: "vMix, OBS, Multi-cam Stream", value: 88 },
            { icon: "draw", title: "Creative Design", description: "Motion Graphics, Layout, Typography", value: 85 },
            { icon: "gif", title: "Animation", description: "After Effects, Lottie, Kinetic Type", value: 82 },
            { icon: "mic", title: "Audio Production", description: "Mixing, Mastering, Voice-over", value: 80 },
            { icon: "videocam", title: "Drone Cinematography", description: "DJI Mavic, FPV, Aerial Videography", value: 87 },
            { icon: "palette", title: "Color Grading", description: "DaVinci Resolve, LUTs, Film Look", value: 90 }
        ],
        process: [
            { step: 1, title: "Discover", description: "Defining goals, audience, and project scope through deep collaboration and strategic consultation.", icon: "travel_explore" },
            { step: 2, title: "Concept", description: "Storyboard, mood-board, and creative direction development for visual storytelling.", icon: "auto_awesome" },
            { step: 3, title: "Shoot", description: "Professional capture using industry-leading camera, lighting, and audio equipment.", icon: "camera_enhance" },
            { step: 4, title: "Edit", description: "Crafting the narrative through precise cutting, color grading, and sound design.", icon: "edit" },
            { step: 5, title: "Deliver", description: "Final review, multi-format export, and deployment across all platforms.", icon: "done_all" }
        ],
        testimonials: [
            {
                quote: "Muhammad brought a level of professionalism and visual clarity to our infrastructure documentation that we hadn't seen before. The results were truly cinematic.",
                author: "Director of Operations",
                role: "Regional Engineering Corp",
                avatar: "🏗️"
            },
            {
                quote: "Working with Shodri elevated our brand content to another level. His eye for composition and storytelling is unmatched.",
                author: "Marketing Manager",
                role: "WIKA Beton",
                avatar: "🏢"
            },
            {
                quote: "The corporate video he produced for us received exceptional feedback from stakeholders. Truly premium quality work.",
                author: "VP of Communications",
                role: "National Infrastructure Group",
                avatar: "🌉"
            },
            {
                quote: "His live streaming production for our annual event was flawless. Professional, reliable, and creative.",
                author: "Event Director",
                role: "Corporate Communications",
                avatar: "🎬"
            }
        ],
        contact: {
            email: "drieshodry@gmail.com",
            subject: "Portfolio Inquiry",
            phone: "+62-812-XXXX-XXXX",
            location: "Jakarta, Indonesia"
        },
        social: {
            linkedin: "https://www.linkedin.com/in/muhammad-shodri-rahmanto-957955178",
            instagram: "https://www.instagram.com/drieshodry/",
            behance: "https://www.behance.net/",
            youtube: "https://www.youtube.com/"
        },
        footer: {
            text: "© 2026 Muhammad Shodri Rahmanto. Crafted for impact.",
            links: [
                { name: "LinkedIn", url: "https://www.linkedin.com/in/muhammad-shodri-rahmanto-957955178" },
                { name: "Instagram", url: "https://www.instagram.com/drieshodry/" },
                { name: "WhatsApp", url: "https://wa.me/6285156698852" },
                { name: "Email", url: "mailto:drieshodry@gmail.com" }
            ]
        },
        cvUrl: "Muhammad_Shodri_Rahmanto_CV.pdf"
    },

    getAll() {
        this._migrate();
        var stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(this.defaults));
    },

    saveAll(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    getProjects() {
        return this.getAll().projects || [];
    },

    getProjectById(id) {
        return this.getProjects().find(function(p) { return p.id === id; });
    },

    addProject(project) {
        var data = this.getAll();
        project.id = project.id || project.title.toLowerCase().replace(/\s+/g, '-');
        data.projects.push(project);
        this.saveAll(data);
        return project;
    },

    updateProject(id, updates) {
        var data = this.getAll();
        var index = data.projects.findIndex(function(p) { return p.id === id; });
        if (index !== -1) {
            data.projects[index] = Object.assign({}, data.projects[index], updates);
            this.saveAll(data);
            return data.projects[index];
        }
        return null;
    },

    deleteProject(id) {
        var data = this.getAll();
        data.projects = data.projects.filter(function(p) { return p.id !== id; });
        this.saveAll(data);
    },

    duplicateProject(id) {
        var proj = this.getProjectById(id);
        if (!proj) return null;
        var copy = JSON.parse(JSON.stringify(proj));
        copy.id = proj.id + '-copy-' + Date.now();
        copy.title = proj.title + ' (Copy)';
        return this.addProject(copy);
    },

    updateAbout(aboutData) {
        const data = this.getAll();
        data.about = { ...data.about, ...aboutData };
        this.saveAll(data);
    },

    updateSkills(skills) {
        const data = this.getAll();
        data.skills = skills;
        this.saveAll(data);
    },

    updateProcess(process) {
        const data = this.getAll();
        data.process = process;
        this.saveAll(data);
    },

    updateTestimonials(testimonials) {
        const data = this.getAll();
        data.testimonials = testimonials;
        this.saveAll(data);
    },

    updateSocial(socialData) {
        const data = this.getAll();
        data.social = { ...data.social, ...socialData };
        this.saveAll(data);
    },

    updateFooter(footerData) {
        const data = this.getAll();
        data.footer = { ...data.footer, ...footerData };
        this.saveAll(data);
    },

    updateContact(contactData) {
        const data = this.getAll();
        data.contact = { ...data.contact, ...contactData };
        this.saveAll(data);
    },

    updateCvUrl(url) {
        const data = this.getAll();
        data.cvUrl = url;
        this.saveAll(data);
    },

    resetAll() {
        localStorage.removeItem('msr_portfolio_v6');
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.defaults));
    },

    exportData() {
        return JSON.stringify(this.getAll(), null, 2);
    },

    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            this.saveAll(data);
            return true;
        } catch (e) {
            return false;
        }
    }
};
