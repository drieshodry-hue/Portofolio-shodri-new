// ============================================
// ADMIN.JS - Admin Dashboard Logic (Complete)
// ============================================

(function() {
    'use strict';

    var ADMIN_PASSWORD='msr2024';

    document.addEventListener('DOMContentLoaded', function() {
        initLogin();
        initNavigation();
        initProjectCRUD();
        initAboutEditor();
        initShowreelEditor();
        initSkillsEditor();
        initProcessEditor();
        initTestimonialsEditor();
        initContactEditor();
        initFooterEditor();
        initLogout();
        initExport();
    });

    // --- Login ---
    function initLogin() {
        var loginForm = document.getElementById('login-form');
        var loginScreen = document.getElementById('login-screen');
        var dashboard = document.getElementById('dashboard');
        var errorEl = document.getElementById('login-error');

        if (sessionStorage.getItem('msr_admin') === 'true') {
            loginScreen.classList.add('hidden');
            dashboard.classList.remove('hidden');
            loadAllSections();
        }

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var password = document.getElementById('login-password').value;
            if (password === ADMIN_PASSWORD) {
                sessionStorage.setItem('msr_admin', 'true');
                loginScreen.classList.add('hidden');
                dashboard.classList.remove('hidden');
                loadAllSections();
            } else {
                errorEl.classList.remove('hidden');
            }
        });
    }

    function initLogout() {
        var logoutBtn = document.getElementById('logout-btn');
        if (!logoutBtn) return;
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('msr_admin');
            location.reload();
        });
    }

    // --- Navigation ---
    function initNavigation() {
        var navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(function(item) {
            item.addEventListener('click', function() {
                var section = this.dataset.section;
                navItems.forEach(function(n) {
                    n.classList.remove('active', 'bg-blue-400/10', 'text-blue-400');
                    n.classList.add('text-gray-400');
                });
                this.classList.add('active', 'bg-blue-400/10', 'text-blue-400');
                this.classList.remove('text-gray-400');

                document.querySelectorAll('.section-panel').forEach(function(p) {
                    p.classList.add('hidden');
                });
                document.getElementById('section-' + section).classList.remove('hidden');
                document.getElementById('section-title').textContent = this.querySelector('span:last-child').textContent;
            });
        });
    }

    // --- Load All Sections ---
    function loadAllSections() {
        loadProjects();
        loadAbout();
        loadShowreel();
        loadSkills();
        loadProcess();
        loadTestimonials();
        loadContact();
        loadFooter();
    }

    // --- Projects CRUD ---
    function loadProjects() {
        var list = document.getElementById('projects-list');
        var allProjects = PortfolioCMS.getProjects();

        list.innerHTML = allProjects.map(function(p) {
            return '<div class="project-item" data-id="' + p.id + '">' +
                '<img src="' + p.cover + '" alt="' + escapeHtml(p.title) + '"/>' +
                '<div class="project-item-info">' +
                    '<div class="project-item-title">' + escapeHtml(p.title) + '</div>' +
                    '<div class="project-item-category">' + (p.gallery ? p.gallery.length : 0) + ' photos</div>' +
                '</div>' +
                '<div class="project-item-actions">' +
                    '<button class="btn-edit" onclick="window.editProject(\'' + p.id + '\')"><span class="material-symbols-outlined text-sm">edit</span></button>' +
                    '<button class="btn-delete" onclick="window.deleteProject(\'' + p.id + '\')"><span class="material-symbols-outlined text-sm">delete</span></button>' +
                '</div>' +
            '</div>';
        }).join('');
    }

    function initProjectCRUD() {
        var addBtn = document.getElementById('add-project-btn');
        var modal = document.getElementById('project-modal');
        var form = document.getElementById('project-form');
        var closeBtn = document.getElementById('modal-close');
        var cancelBtn = document.getElementById('modal-cancel');

        addBtn.addEventListener('click', function() {
            document.getElementById('modal-title').textContent = 'Add Project';
            form.reset();
            document.getElementById('proj-edit-id').value = '';
            modal.classList.remove('hidden');
        });

        closeBtn.addEventListener('click', function() { modal.classList.add('hidden'); });
        cancelBtn.addEventListener('click', function() { modal.classList.add('hidden'); });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var id = document.getElementById('proj-edit-id').value;
            // Collect gallery from dynamic image list
            var galleryImgs = document.querySelectorAll('#gallery-edit-list .gallery-edit-src');
            var gallery = [];
            galleryImgs.forEach(function(inp) {
                if (inp.value) gallery.push(inp.value);
            });

            var projectData = {
                title: document.getElementById('proj-edit-title').value,
                description: document.getElementById('proj-edit-description').value,
                cover: document.getElementById('proj-edit-cover').value,
                gallery: gallery
            };

            if (id) {
                PortfolioCMS.updateProject(id, projectData);
            } else {
                PortfolioCMS.addProject(projectData);
            }

            modal.classList.add('hidden');
            loadProjects();
            showToast(id ? 'Project updated!' : 'Project added!', 'success');
        });
    }

    window.editProject = function(id) {
        var project = PortfolioCMS.getProjectById(id);
        if (!project) return;

        document.getElementById('modal-title').textContent = 'Edit Project';
        document.getElementById('proj-edit-id').value = project.id;
        document.getElementById('proj-edit-title').value = project.title;
        document.getElementById('proj-edit-description').value = project.description || '';
        document.getElementById('proj-edit-cover').value = project.cover || '';

        // Render gallery editor
        var galleryList = document.getElementById('gallery-edit-list');
        galleryList.innerHTML = '';
        if (project.gallery) {
            project.gallery.forEach(function(src) {
                addGalleryEditItem(src);
            });
        }

        document.getElementById('project-modal').classList.remove('hidden');
    };

    function addGalleryEditItem(src) {
        var list = document.getElementById('gallery-edit-list');
        var div = document.createElement('div');
        div.className = 'flex items-center gap-2 mb-2';
        div.innerHTML = '<input type="text" class="gallery-edit-src flex-1 bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white outline-none focus:border-blue-400" placeholder="Image filename or URL" value="' + (src || '') + '"/>' +
            '<button type="button" class="btn-delete" onclick="this.parentElement.remove()"><span class="material-symbols-outlined text-sm">close</span></button>';
        list.appendChild(div);
    }

    window.addGalleryEditItem = addGalleryEditItem;

    window.deleteProject = function(id) {
        if (!confirm('Delete this project?')) return;
        PortfolioCMS.deleteProject(String(id));
        loadProjects();
        showToast('Project deleted', 'error');
    };

    // --- About Editor ---
    function loadAbout() {
        var data = PortfolioCMS.getAll();
        if (data.about) {
            document.getElementById('edit-about-description').value = data.about.description || '';
            document.getElementById('edit-about-years').value = data.about.years || '';
            document.getElementById('edit-about-projects').value = data.about.projects || '';
            document.getElementById('edit-about-hours').value = data.about.hours || '';
            document.getElementById('edit-about-photo').value = data.about.photo || '';
            document.getElementById('preview-about-photo').src = data.about.photo || '';
        }
    }

    function initAboutEditor() {
        var fields = ['edit-about-description', 'edit-about-years', 'edit-about-projects', 'edit-about-hours', 'edit-about-photo'];
        fields.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', function() {
                    var data = {
                        description: document.getElementById('edit-about-description').value,
                        years: document.getElementById('edit-about-years').value,
                        projects: document.getElementById('edit-about-projects').value,
                        hours: document.getElementById('edit-about-hours').value,
                        photo: document.getElementById('edit-about-photo').value
                    };
                    PortfolioCMS.updateAbout(data);
                    // Live preview
                    var photoPreview = document.getElementById('preview-about-photo');
                    if (photoPreview && data.about) photoPreview.src = data.about.photo;
                });
            }
        });
    }

    // --- Showreel Editor ---
    function loadShowreel() {
        var data = PortfolioCMS.getAll();
        if (data.showreel) {
            document.getElementById('edit-showreel-url').value = data.showreel.videoUrl || '';
            document.getElementById('edit-showreel-title').value = data.showreel.title || '';
            document.getElementById('edit-showreel-subtitle').value = data.showreel.subtitle || '';
        }
    }

    function initShowreelEditor() {
        ['edit-showreel-url', 'edit-showreel-title', 'edit-showreel-subtitle'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', function() {
                    var data = {
                        videoUrl: document.getElementById('edit-showreel-url').value,
                        title: document.getElementById('edit-showreel-title').value,
                        subtitle: document.getElementById('edit-showreel-subtitle').value
                    };
                    PortfolioCMS.updateShowreel(data);
                });
            }
        });
    }

    // --- Skills Editor ---
    function loadSkills() {
        var list = document.getElementById('skills-list');
        var data = PortfolioCMS.getAll();
        if (!data.skills) return;

        list.innerHTML = data.skills.map(function(s, i) {
            return '<div class="skill-item" data-index="' + i + '">' +
                '<span class="material-symbols-outlined">' + s.icon + '</span>' +
                '<input value="' + s.title + '" class="skill-title" placeholder="Skill name"/>' +
                '<input value="' + s.description + '" class="skill-desc" placeholder="Description"/>' +
                '<button class="btn-delete" onclick="this.parentElement.remove()"><span class="material-symbols-outlined text-sm">close</span></button>' +
            '</div>';
        }).join('');
    }

    function initSkillsEditor() {
        var addBtn = document.getElementById('add-skill-btn');
        if (!addBtn) return;
        addBtn.addEventListener('click', function() {
            var list = document.getElementById('skills-list');
            var div = document.createElement('div');
            div.className = 'skill-item';
            div.innerHTML = '<select class="skill-icon bg-gray-900 border border-gray-700 rounded-lg px-2 py-2 text-blue-400 outline-none">' +
                '<option value="movie_edit">movie_edit</option>' +
                '<option value="photo_camera">photo_camera</option>' +
                '<option value="live_tv">live_tv</option>' +
                '<option value="draw">draw</option>' +
                '<option value="brush">brush</option>' +
                '<option value="code">code</option>' +
                '<option value="palette">palette</option>' +
                '<option value="camera">camera</option>' +
                '</select>' +
                '<input value="" class="skill-title" placeholder="Skill name"/>' +
                '<input value="" class="skill-desc" placeholder="Description"/>' +
                '<button class="btn-delete" onclick="this.parentElement.remove()"><span class="material-symbols-outlined text-sm">close</span></button>';
            list.appendChild(div);
        });
    }

    // --- Process Editor ---
    function loadProcess() {
        var list = document.getElementById('process-list');
        var data = PortfolioCMS.getAll();
        if (!data.process) return;

        list.innerHTML = data.process.map(function(p, i) {
            return '<div class="process-item" data-index="' + i + '">' +
                '<div class="flex items-center gap-3 mb-2">' +
                    '<span class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-bold">' + p.step + '</span>' +
                    '<input value="' + p.title + '" class="process-title flex-1 bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white outline-none focus:border-blue-400"/>' +
                '</div>' +
                '<textarea class="process-desc w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white outline-none focus:border-blue-400 resize-none" rows="2">' + p.description + '</textarea>' +
                '<button class="btn-delete mt-2" onclick="this.parentElement.remove()"><span class="material-symbols-outlined text-sm">close</span></button>' +
            '</div>';
        }).join('');
    }

    function initProcessEditor() {
        var addBtn = document.getElementById('add-process-btn');
        if (!addBtn) return;
        addBtn.addEventListener('click', function() {
            var list = document.getElementById('process-list');
            var count = list.children.length + 1;
            var div = document.createElement('div');
            div.className = 'process-item';
            div.innerHTML = '<div class="flex items-center gap-3 mb-2">' +
                '<span class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-bold">' + count + '</span>' +
                '<input value="" class="process-title flex-1 bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white outline-none focus:border-blue-400" placeholder="Step title"/>' +
                '</div>' +
                '<textarea class="process-desc w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white outline-none focus:border-blue-400 resize-none" rows="2" placeholder="Step description"></textarea>' +
                '<button class="btn-delete mt-2" onclick="this.parentElement.remove()"><span class="material-symbols-outlined text-sm">close</span></button>';
            list.appendChild(div);
        });
    }

    // --- Testimonials Editor ---
    function loadTestimonials() {
        var list = document.getElementById('testimonials-list');
        var data = PortfolioCMS.getAll();
        if (!data.testimonials) return;

        list.innerHTML = data.testimonials.map(function(t, i) {
            return '<div class="testimonial-item" data-index="' + i + '">' +
                '<div class="flex flex-col gap-2">' +
                    '<textarea class="testimonial-quote w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white outline-none focus:border-blue-400 resize-none" rows="3" placeholder="Quote text">"' + t.quote + '"</textarea>' +
                    '<input value="' + t.author + '" class="testimonial-author w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white outline-none focus:border-blue-400" placeholder="Author name"/>' +
                    '<input value="' + t.role + '" class="testimonial-role w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white outline-none focus:border-blue-400" placeholder="Role / Company"/>' +
                '</div>' +
                '<button class="btn-delete mt-2" onclick="this.parentElement.remove()"><span class="material-symbols-outlined text-sm">close</span></button>' +
            '</div>';
        }).join('');
    }

    function initTestimonialsEditor() {
        var addBtn = document.getElementById('add-testimonial-btn');
        if (!addBtn) return;
        addBtn.addEventListener('click', function() {
            var list = document.getElementById('testimonials-list');
            var div = document.createElement('div');
            div.className = 'testimonial-item';
            div.innerHTML = '<div class="flex flex-col gap-2">' +
                '<textarea class="testimonial-quote w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white outline-none focus:border-blue-400 resize-none" rows="3" placeholder="Quote text"></textarea>' +
                '<input class="testimonial-author w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white outline-none focus:border-blue-400" placeholder="Author name"/>' +
                '<input class="testimonial-role w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white outline-none focus:border-blue-400" placeholder="Role / Company"/>' +
                '</div>' +
                '<button class="btn-delete mt-2" onclick="this.parentElement.remove()"><span class="material-symbols-outlined text-sm">close</span></button>';
            list.appendChild(div);
        });
    }

    // --- Contact & Social Editor ---
    function loadContact() {
        var data = PortfolioCMS.getAll();
        if (data.contact) {
            document.getElementById('edit-contact-email').value = data.contact.email || '';
        }
        if (data.social) {
            document.getElementById('edit-social-linkedin').value = data.social.linkedin || '';
            document.getElementById('edit-social-instagram').value = data.social.instagram || '';
        }
        if (data.cvUrl) {
            document.getElementById('edit-cv-url').value = data.cvUrl || '';
        }
    }

    function initContactEditor() {
        ['edit-contact-email'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', function() {
                    PortfolioCMS.updateContact({ email: document.getElementById('edit-contact-email').value });
                });
            }
        });

        ['edit-social-linkedin', 'edit-social-instagram'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', function() {
                    PortfolioCMS.updateSocial({
                        linkedin: document.getElementById('edit-social-linkedin').value,
                        instagram: document.getElementById('edit-social-instagram').value
                    });
                });
            }
        });

        var cvEl = document.getElementById('edit-cv-url');
        if (cvEl) {
            cvEl.addEventListener('input', function() {
                PortfolioCMS.updateCvUrl(this.value);
            });
        }
    }

    // --- Footer Editor ---
    function loadFooter() {
        var data = PortfolioCMS.getAll();
        if (data.footer) {
            document.getElementById('edit-footer-text').value = data.footer.text || '';
        }
    }

    function initFooterEditor() {
        var textEl = document.getElementById('edit-footer-text');
        if (textEl) {
            textEl.addEventListener('input', function() {
                var data = PortfolioCMS.getAll();
                if (!data.footer) data.footer = {};
                data.footer.text = this.value;
                PortfolioCMS.saveAll(data);
            });
        }
    }

    // --- Save All Button ---
    var saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // Save skills
            var skillItems = document.querySelectorAll('.skill-item');
            var skills = [];
            skillItems.forEach(function(item) {
                var icon = item.querySelector('.skill-icon');
                var title = item.querySelector('.skill-title');
                var desc = item.querySelector('.skill-desc');
                if (icon && title && desc) {
                    skills.push({
                        icon: icon.value || icon.textContent,
                        title: title.value,
                        description: desc.value
                    });
                }
            });
            PortfolioCMS.updateSkills(skills);

            // Save process
            var processItems = document.querySelectorAll('.process-item');
            var process = [];
            processItems.forEach(function(item, i) {
                var title = item.querySelector('.process-title');
                var desc = item.querySelector('.process-desc');
                if (title && desc) {
                    process.push({ step: i + 1, title: title.value, description: desc.value });
                }
            });
            PortfolioCMS.updateProcess(process);

            // Save testimonials
            var testimonialItems = document.querySelectorAll('.testimonial-item');
            var testimonials = [];
            testimonialItems.forEach(function(item) {
                var quote = item.querySelector('.testimonial-quote');
                var author = item.querySelector('.testimonial-author');
                var role = item.querySelector('.testimonial-role');
                if (quote && author && role) {
                    testimonials.push({
                        quote: quote.value,
                        author: author.value,
                        role: role.value
                    });
                }
            });
            PortfolioCMS.updateTestimonials(testimonials);

            // Save footer
            var footerText = document.getElementById('edit-footer-text');
            if (footerText) {
                var data = PortfolioCMS.getAll();
                if (!data.footer) data.footer = {};
                data.footer.text = footerText.value;
                PortfolioCMS.saveAll(data);
            }

            showToast('All changes saved!', 'success');
        });
    }

    // --- Export ---
    function initExport() {
        var exportBtn = document.getElementById('export-btn');
        if (!exportBtn) return;
        exportBtn.addEventListener('click', function() {
            var data = PortfolioCMS.exportData();
            var blob = new Blob([data], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'portfolio-backup.json';
            a.click();
            URL.revokeObjectURL(url);
            showToast('Backup downloaded!', 'success');
        });
    }

    // --- Utility ---
    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // --- Toast ---
    function showToast(message, type) {
        var container = document.getElementById('toast-container');
        if (!container) return;
        var toast = document.createElement('div');
        toast.className = 'toast toast-' + (type || 'success');
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(function() { toast.remove(); }, 300);
        }, 3000);
    }

})();
