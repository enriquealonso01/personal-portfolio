'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
    testimonialsModalFunc();
  });
}

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
let filterItems = [];

// Always update filterItems before filtering
function filterFunc(selectedValue) {
  const filterItems = document.querySelectorAll("[data-filter-item]");
  selectedValue = selectedValue.toLowerCase();
  filterItems.forEach(item => {
    const itemCategory = (item.dataset.category || '').toLowerCase();
    if (selectedValue === "all" || selectedValue === itemCategory) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// After rendering categories, re-attach listeners
function addFilterEventListeners() {
  const filterBtn = document.querySelectorAll("[data-filter-btn]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const select = document.querySelector("[data-select]");
  const selectValue = document.querySelector("[data-selecct-value]");

  let lastClickedBtn = filterBtn[0];

  filterBtn.forEach(btn => {
    btn.addEventListener("click", function () {
      let selectedValue = this.innerText;
      selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      if (lastClickedBtn) lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  });

  selectItems.forEach(item => {
    item.addEventListener("click", function () {
      let selectedValue = this.innerText;
      selectValue.innerText = this.innerText;
      select.classList.remove("active");
      filterFunc(selectedValue);
    });
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

// Enhanced project detail functionality with smooth transitions and gallery modal
const projectsSection = document.querySelector('.projects');
const projectDetailSection = document.querySelector('#project-detail');
const backBtn = document.querySelector('#back-to-projects');
const impactToggle = document.querySelector('#impact-toggle');
const impactContent = document.querySelector('#impact-content');

// Gallery modal variables
const galleryModal = document.getElementById('gallery-modal');
const galleryModalImg = document.getElementById('gallery-modal-img');
const galleryModalClose = document.getElementById('gallery-modal-close');
const galleryPrev = document.getElementById('gallery-prev');
const galleryNext = document.getElementById('gallery-next');
const galleryCounter = document.getElementById('gallery-counter');

let currentGallery = [];
let currentImageIndex = 0;
let projectData = {};
let allProjects = [];

// Load projects from JSON file
async function loadProjects() {
  try {
    const response = await fetch('./projects.json');
    const projects = await response.json();
    
    allProjects = projects;
    
    // Create project data object with IDs
    projects.forEach((project, index) => {
      const projectId = `project-${index}`;
      projectData[projectId] = {
        title: project.title,
        year: project.year,
        description: project.description,
        technologies: project.tech_used,
        impact: Object.values(project.impact).filter(impact => impact !== "..."),
        gallery: Object.values(project.pictures_path).map(pic => `./assets/project_images/${pic}`)
      };
    });
    
    // Render projects
    renderProjects();
    
    // Populate categories
    populateCategories();
    
    // Add event listeners
    addProjectEventListeners();
    
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

// Render projects in the portfolio
function renderProjects() {
  const projectList = document.querySelector('.project-list');
  projectList.innerHTML = '';
  
  allProjects.forEach((project, index) => {
    const projectId = `project-${index}`;
    const projectItem = document.createElement('li');
    projectItem.className = 'project-item active';
    projectItem.setAttribute('data-filter-item', '');
    projectItem.setAttribute('data-category', project.category.toLowerCase());
    
    // Get the first picture as the main project image
    const mainImage = Object.values(project.pictures_path)[0];
    
    projectItem.innerHTML = `
      <a href="#" data-project="${projectId}" class="project-link">
        <figure class="project-img">
          <div class="project-item-icon-box">
            <ion-icon name="eye-outline"></ion-icon>
          </div>
          <img src="./assets/project_images/${mainImage}" alt="${project.title}" loading="lazy">
          <div class="tech-bar" data-tech-bar="${projectId}">
            <div class="tech-scroll">
              <!-- Tech icons will be populated by JavaScript -->
            </div>
          </div>
        </figure>
        <h3 class="project-title">${project.title}</h3>
      </a>
    `;
    
    projectList.appendChild(projectItem);
  });
  
  // Populate tech bars after rendering
  populateTechBars();
}

// Populate categories based on available projects
function populateCategories() {
  const categories = [...new Set(allProjects.map(project => project.category))];
  
  // Update filter list (desktop)
  const filterList = document.querySelector('.filter-list');
  if (filterList) {
    filterList.innerHTML = `
      <li class="filter-item">
        <button class="active" data-filter-btn>All</button>
      </li>
      ${categories.map(category => `
        <li class="filter-item">
          <button data-filter-btn>${category}</button>
        </li>
      `).join('')}
    `;
  }
  
  // Update select list (mobile)
  const selectList = document.querySelector('.select-list');
  if (selectList) {
    selectList.innerHTML = `
      <li class="select-item">
        <button data-select-item>All</button>
      </li>
      ${categories.map(category => `
        <li class="select-item">
          <button data-select-item>${category}</button>
        </li>
      `).join('')}
    `;
  }
  
  // Re-add event listeners for filter buttons
  addFilterEventListeners();
}

// Add event listeners to project links
function addProjectEventListeners() {
  const projectLinks = document.querySelectorAll('.project-link');
  
  projectLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const projectId = this.getAttribute('data-project');
      showProjectDetail(projectId);
    });
  });
}

// Populate technology bars
function populateTechBars() {
  const techBars = document.querySelectorAll('[data-tech-bar]');
  
  techBars.forEach(techBar => {
    const projectId = techBar.getAttribute('data-tech-bar');
    const project = projectData[projectId];
    
    if (project && project.technologies) {
      const techScroll = techBar.querySelector('.tech-scroll');
      
      // Create tech icons
      const techIcons = project.technologies.map(tech => {
        return `<img src="./assets/logo/${tech}.png" alt="${tech}" class="tech-icon" onerror="this.onerror=null;this.src='./assets/logo/${tech}.png';this.onerror=function(){this.style.display=\'none\'}">`;
      }).join('');
      
      // Duplicate the icons for seamless scrolling (add extra space to ensure smooth transition)
      techScroll.innerHTML = techIcons + techIcons + techIcons;
      
      // Start the initial animation via JavaScript
      setTimeout(() => {
        // Start with normal speed animation
        const initialAnimation = techScroll.animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(-33.33%)' }
        ], {
          duration: 5000, // 5 seconds (normal speed)
          iterations: Infinity,
          easing: 'linear'
        });
        
        // Store the animation reference
        techScroll._currentAnimation = initialAnimation;
      }, 100);
    }
  });
}

// Initialize projects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  loadProjects();
});

// Back button functionality with smooth transition
backBtn.addEventListener('click', function() {
  hideProjectDetail();
});

// Impact dropdown toggle with smooth animation
impactToggle.addEventListener('click', function() {
  toggleImpactSection();
});

// Gallery modal event listeners
galleryModalClose.addEventListener('click', closeGalleryModal);
galleryPrev.addEventListener('click', () => navigateGallery(-1));
galleryNext.addEventListener('click', () => navigateGallery(1));

// Close modal when clicking outside the image
galleryModal.addEventListener('click', function(e) {
  if (e.target === galleryModal) {
    closeGalleryModal();
  }
});

// Keyboard navigation for gallery
document.addEventListener('keydown', function(e) {
  if (galleryModal.classList.contains('show')) {
    if (e.key === 'Escape') {
      closeGalleryModal();
    } else if (e.key === 'ArrowLeft') {
      navigateGallery(-1);
    } else if (e.key === 'ArrowRight') {
      navigateGallery(1);
    }
  }
});

// Show project detail function with smooth animation
function showProjectDetail(projectId) {
  const project = projectData[projectId];
  if (!project) return;

  // Update project detail content
  document.getElementById('project-detail-title').textContent = project.title;
  document.getElementById('project-year').textContent = project.year;
  document.getElementById('project-description-text').innerHTML = project.description;

  // Update tech icons bar
  updateProjectDetailTechBar(project.technologies);

  // Update impact list
  const impactList = document.getElementById('impact-list');
  impactList.innerHTML = '';
  project.impact.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    impactList.appendChild(li);
  });

  // Update gallery with count and preview logic
  updateGallery(project.gallery);

  // Show detail section with smooth transition
  projectsSection.style.display = 'none';
  projectDetailSection.style.display = 'block';
  
  // Add smooth entrance animation
  setTimeout(() => {
    projectDetailSection.classList.add('show');
  }, 10);

  // Reset impact section to closed state
  impactContent.classList.remove('show');
  impactToggle.classList.remove('active');
}

// Hide project detail function with smooth transition
function hideProjectDetail() {
  projectDetailSection.classList.remove('show');
  
  setTimeout(() => {
    projectDetailSection.style.display = 'none';
    projectsSection.style.display = 'block';
  }, 300);
}

// Toggle impact section with smooth animation
function toggleImpactSection() {
  const isOpen = impactContent.classList.contains('show');
  
  if (isOpen) {
    impactContent.classList.remove('show');
    impactToggle.classList.remove('active');
  } else {
    impactContent.classList.add('show');
    impactToggle.classList.add('active');
  }
}

// Update gallery with count and preview functionality
function updateGallery(gallery) {
  currentGallery = gallery;
  const galleryGrid = document.getElementById('gallery-grid');
  const galleryTitle = document.querySelector('.project-gallery h3');
  
  // Update gallery title with count
  galleryTitle.textContent = `Gallery (${gallery.length})`;
  
  // Clear existing gallery
  galleryGrid.innerHTML = '';
  
  // Show max 3 images
  const maxPreview = 3;
  const imagesToShow = gallery.slice(0, maxPreview);
  
  imagesToShow.forEach((imageSrc, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('data-index', index);
    
    // Add overlay for "more" indicator if this is the 3rd image and there are more
    if (index === maxPreview - 1 && gallery.length > maxPreview) {
      galleryItem.classList.add('more-overlay');
      const remainingCount = gallery.length - maxPreview + 1;
      galleryItem.innerHTML = `
        <img src="${imageSrc}" alt="Project gallery image" loading="lazy">
        <div class="more-count">
          <ion-icon name="add-outline"></ion-icon>
          <span>+${remainingCount}</span>
        </div>
      `;
    } else {
      galleryItem.innerHTML = `<img src="${imageSrc}" alt="Project gallery image" loading="lazy">`;
    }
    
    // Add click event to open modal
    galleryItem.addEventListener('click', () => openGalleryModal(index));
    
    galleryGrid.appendChild(galleryItem);
  });
}

// Open gallery modal
function openGalleryModal(index) {
  currentImageIndex = index;
  updateModalImage();
  galleryModal.classList.add('show');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close gallery modal
function closeGalleryModal() {
  galleryModal.classList.remove('show');
  document.body.style.overflow = ''; // Restore scrolling
}

// Navigate gallery (direction: -1 for prev, 1 for next)
function navigateGallery(direction) {
  currentImageIndex += direction;
  
  // Loop around
  if (currentImageIndex < 0) {
    currentImageIndex = currentGallery.length - 1;
  } else if (currentImageIndex >= currentGallery.length) {
    currentImageIndex = 0;
  }
  
  updateModalImage();
}

// Update modal image and counter
function updateModalImage() {
  galleryModalImg.src = currentGallery[currentImageIndex];
  galleryModalImg.alt = `Gallery image ${currentImageIndex + 1}`;
  galleryCounter.textContent = `${currentImageIndex + 1} / ${currentGallery.length}`;
  
  // Hide/show navigation buttons based on gallery size
  if (currentGallery.length <= 1) {
    galleryPrev.style.display = 'none';
    galleryNext.style.display = 'none';
  } else {
    galleryPrev.style.display = 'flex';
    galleryNext.style.display = 'flex';
  }
}

// Update project detail tech icons bar
function updateProjectDetailTechBar(technologies) {
  const techBar = document.getElementById('project-detail-tech-bar');
  techBar.innerHTML = '';
  
  if (technologies && technologies.length > 0) {
    technologies.forEach(tech => {
      const techIcon = document.createElement('img');
      techIcon.src = `./assets/logo/${tech}.png`;
      techIcon.alt = tech;
      techIcon.className = 'tech-icon';
      techIcon.onerror = function() {
        // Fallback to PNG if SVG doesn't exist
        this.onerror = null;
        this.src = `./assets/logo/${tech}.png`;
      };
      techBar.appendChild(techIcon);
    });
  }
}

// Add smooth tech bar hover acceleration using Web Animations API
function addTechBarHoverEffects() {
  const projectItems = document.querySelectorAll('.project-item');
  
  projectItems.forEach(projectItem => {
    const techScroll = projectItem.querySelector('.tech-scroll');
    
    if (techScroll) {
      projectItem.addEventListener('mouseenter', function() {
        // Get current progress to maintain continuity
        const currentAnimation = techScroll._currentAnimation;
        let currentTime = 0;
        
        if (currentAnimation) {
          currentTime = currentAnimation.currentTime || 0;
          currentAnimation.cancel();
        }
        
        // Create new faster animation starting from current position
        const fastAnimation = techScroll.animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(-33.33%)' }
        ], {
          duration: 2000, // 2 seconds (faster hover speed)
          iterations: Infinity,
          easing: 'linear'
        });
        
        // Maintain position continuity - calculate based on actual durations
        const progress = currentTime / 5000; // Normal duration is 6000ms
        fastAnimation.currentTime = progress * 2000; // Fast duration is 2000ms
        techScroll._currentAnimation = fastAnimation;
      });
      
      projectItem.addEventListener('mouseleave', function() {
        // Get current progress to maintain continuity
        const currentAnimation = techScroll._currentAnimation;
        let currentTime = 0;
        
        if (currentAnimation) {
          currentTime = currentAnimation.currentTime || 0;
          currentAnimation.cancel();
        }
        
        // Create new slower animation starting from current position  
        const slowAnimation = techScroll.animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(-33.33%)' }
        ], {
          duration: 5000, // 5 seconds (normal speed)
          iterations: Infinity,
          easing: 'linear'
        });
        
        // Maintain position continuity - calculate based on actual durations
        const progress = currentTime / 2000; // Fast duration is 2000ms
        slowAnimation.currentTime = progress * 5000; // Normal duration is 5000ms
        techScroll._currentAnimation = slowAnimation;
      });
    }
  });
}

// Initialize tech bars when page loads
document.addEventListener('DOMContentLoaded', function() {
  populateTechBars();
  addTechBarHoverEffects();
});