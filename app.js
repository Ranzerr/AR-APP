(() => {
  'use strict';

  const elements = {
    loading: document.querySelector('#loading-screen'),
    loadingMessage: document.querySelector('#loading-message'),
    error: document.querySelector('#error-screen'),
    errorMessage: document.querySelector('#error-message'),
    retry: document.querySelector('#retry-button'),
    scene: document.querySelector('#ar-scene'),
    hud: document.querySelector('#ar-hud'),
    message: document.querySelector('#ar-message'),
    target: document.querySelector('#target'),
    grid: document.querySelector('#department-grid'),
    overlay: document.querySelector('#info-overlay'),
    logo: document.querySelector('#department-logo'),
    name: document.querySelector('#department-name'),
    description: document.querySelector('#department-description'),
    mascot: document.querySelector('#department-mascot'),
    viewer: document.querySelector('#mascot-viewer'),
    modelFallback: document.querySelector('#model-fallback'),
    back: document.querySelector('#back-button')
  };

  let departments = [];
  let targetFound = false;
  let activeDepartment = null;

  function setScreen(screen) {
    elements.loading.classList.toggle('is-hidden', screen !== 'loading');
    elements.error.classList.toggle('is-hidden', screen !== 'error');
    elements.scene.classList.toggle('is-hidden', screen !== 'ready');
    elements.hud.classList.toggle('is-hidden', screen !== 'ready');
  }

  function showError(message) {
    elements.errorMessage.textContent = message;
    setScreen('error');
  }

  async function checkCameraAccess() {
    if (!window.isSecureContext || !['https:', 'http:'].includes(window.location.protocol) || (window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')) {
      throw new Error('Camera access requires HTTPS. Open the GitHub Pages HTTPS address, not an http:// or file:// address.');
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('This browser does not support camera access. Open the app in the latest Chrome or Safari.');
    }

    elements.loadingMessage.textContent = 'Requesting camera access...';
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: 'environment' } }
      });
    } catch (error) {
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        throw new Error('Camera permission was blocked. Allow Camera for this site in your browser settings, then tap Try again.');
      }
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        throw new Error('No camera was found. Check that your device has a camera and try again.');
      }
      throw new Error(`Camera access failed: ${error.message || 'check your browser and site permissions.'}`);
    } finally {
      stream?.getTracks().forEach((track) => track.stop());
    }
  }

  function createDepartmentGrid() {
    elements.grid.replaceChildren();
    departments.forEach((department, index) => {
      const column = index % 4;
      const row = Math.floor(index / 4);
      const image = document.createElement('a-image');
      image.classList.add('clickable');
      image.setAttribute('src', department.logo);
      image.setAttribute('width', '0.72');
      image.setAttribute('height', '0.72');
      image.setAttribute('position', `${(column - 1.5) * 0.9} ${(0.45 - row * 0.9)} 0`);
      image.setAttribute('material', 'shader: flat; transparent: true; alphaTest: 0.05');
      image.setAttribute('animation__pop', `property: scale; from: 0 0 0; to: 1 1 1; dur: 360; delay: ${index * 55}; easing: easeOutBack; startEvents: targetFound`);
      image.addEventListener('click', () => openDepartment(index));
      elements.grid.appendChild(image);
    });
  }

  function openDepartment(index) {
    activeDepartment = departments[index];
    elements.logo.src = activeDepartment.logo;
    elements.logo.alt = `${activeDepartment.name} logo`;
    elements.name.textContent = activeDepartment.name;
    elements.description.textContent = activeDepartment.description;
    elements.mascot.textContent = activeDepartment.mascot;
    elements.modelFallback.classList.add('is-hidden');
    elements.viewer.src = activeDepartment.model;
    elements.overlay.classList.remove('is-hidden');
    elements.back.focus();
    history.pushState({ departmentOpen: true }, '');
  }

  function closeDepartment(popHistory = true) {
    if (elements.overlay.classList.contains('is-hidden')) return;
    elements.overlay.classList.add('is-hidden');
    elements.viewer.removeAttribute('src');
    activeDepartment = null;
    if (popHistory && history.state && history.state.departmentOpen) history.back();
  }

  function handleModelError() {
    elements.modelFallback.classList.remove('is-hidden');
  }

  async function loadDepartments() {
    const response = await fetch('./departments.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Department data returned ${response.status}.`);
    const data = await response.json();
    if (!Array.isArray(data) || data.length !== 8 || data.some((item) => !item.name || !item.logo || !item.mascot || !item.model || !item.description)) {
      throw new Error('Department data must contain exactly 8 complete entries.');
    }
    departments = data;
  }

  function bindArEvents() {
    elements.target.addEventListener('targetFound', () => {
      targetFound = true;
      elements.message.textContent = 'CU logo recognized. Tap a department.';
      elements.grid.querySelectorAll('.clickable').forEach((image) => image.emit('targetFound'));
    });
    elements.target.addEventListener('targetLost', () => {
      targetFound = false;
      elements.message.textContent = 'Point the camera at the CU logo';
    });
    elements.viewer.addEventListener('error', handleModelError);
    elements.back.addEventListener('click', () => closeDepartment());
    elements.retry.addEventListener('click', startApp);
    window.addEventListener('popstate', () => closeDepartment(false));
  }

  async function startApp() {
    closeDepartment(false);
    setScreen('loading');
    try {
      if (!departments.length) await loadDepartments();
      createDepartmentGrid();
      await checkCameraAccess();
      if (!elements.scene.hasLoaded) {
        await new Promise((resolve, reject) => {
          const timeout = window.setTimeout(() => reject(new Error('The AR camera took too long to start.')), 15000);
          elements.scene.addEventListener('loaded', () => { window.clearTimeout(timeout); resolve(); }, { once: true });
          elements.scene.addEventListener('arError', () => { window.clearTimeout(timeout); reject(new Error('AR initialization failed. Check camera permission and reload the page.')); }, { once: true });
        });
      }
      setScreen('ready');
      elements.message.textContent = targetFound ? 'CU logo recognized. Tap a department.' : 'Point the camera at the CU logo';
    } catch (error) {
      showError(error.message || 'An unexpected error occurred.');
    }
  }

  bindArEvents();
  startApp();
})();
