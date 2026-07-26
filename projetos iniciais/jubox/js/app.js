// App entry point & router
import { renderHomePage, renderListsPage, renderListDetailPage, renderProfilePage } from './pages.js';
import { exportData, importData } from './store.js';
import { showToast } from './components.js';

// ===== ROUTER =====
function router() {
  const hash = window.location.hash || '#/';
  const parts = hash.replace('#/', '').split('/');
  const page = parts[0] || 'home';

  switch (page) {
    case '':
    case 'home':
      renderHomePage();
      break;
    case 'lists':
      renderListsPage();
      break;
    case 'list':
      renderListDetailPage(parts[1]);
      break;
    case 'profile':
      renderProfilePage(parts[1]);
      break;
    default:
      renderHomePage();
  }

  window.scrollTo(0, 0);
}

// ===== KEYBOARD SHORTCUTS =====
function setupKeyboard() {
  document.addEventListener('keydown', (e) => {
    // Escape closes modals
    if (e.key === 'Escape') {
      const modals = document.getElementById('modals');
      if (modals.innerHTML) {
        modals.innerHTML = '';
        // Re-render current page if search was open
        router();
      }
    }

    // Ctrl+E export
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      exportData();
      showToast('dados exportados!');
    }

    // Ctrl+I import
    if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (ev) => {
        try {
          await importData(ev.target.files[0]);
          showToast('dados importados!');
          router();
        } catch (err) {
          showToast(err.message, 'error');
        }
      };
      input.click();
    }
  });
}

// ===== INIT =====
function init() {
  setupKeyboard();

  window.addEventListener('hashchange', router);
  router();

  console.log('%cjulisisboxd', 'font-size:20px; font-weight:bold; background:linear-gradient(135deg,#FF8A00,#E84855); -webkit-background-clip:text; -webkit-text-fill-color:transparent;');
  console.log('%cfeito para Isis & Julia', 'color:#9AB; font-size:12px;');
}

document.addEventListener('DOMContentLoaded', init);
