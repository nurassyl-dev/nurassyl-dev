document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  const yearEl = document.querySelector('[data-year]');
  const waNumber = '77713226575';

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 50);
  };

  const buildWaUrl = (message) =>
    `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

  const scrollToTarget = (target) => {
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      event.preventDefault();
      scrollToTarget(href);
    });
  });

  document.querySelectorAll('[data-scroll]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-scroll');
      if (target) {
        scrollToTarget(target);
      }
    });
  });

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.classList.toggle('is-open', isOpen);
    });

    mobileMenu.querySelectorAll('a, button').forEach((item) => {
      item.addEventListener('click', () => {
        menuToggle.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('is-open');
      });
    });
  }

  const faqItems = document.querySelectorAll('.faq-item');
  const setFaqState = (item, isOpen) => {
    const button = item.querySelector('.faq-question');
    const content = item.querySelector('.faq-answer');
    if (!button || !content) return;

    item.classList.toggle('is-open', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      content.hidden = false;
      content.style.maxHeight = `${content.scrollHeight}px`;
    } else {
      content.style.maxHeight = '0px';
      content.addEventListener(
        'transitionend',
        () => {
          if (!item.classList.contains('is-open')) {
            content.hidden = true;
          }
        },
        { once: true }
      );
    }
  };

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    const content = item.querySelector('.faq-answer');
    if (!button || !content) return;

    content.style.maxHeight = '0px';
    content.hidden = true;

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach((other) => setFaqState(other, false));
      setFaqState(item, !isOpen);
    });
  });

  window.addEventListener('resize', () => {
    faqItems.forEach((item) => {
      if (item.classList.contains('is-open')) {
        const content = item.querySelector('.faq-answer');
        if (content) {
          content.style.maxHeight = `${content.scrollHeight}px`;
        }
      }
    });
  });

  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const name = (data.name || '').trim();
      const contact = (data.contact || '').trim();
      const message = (data.message || '').trim();
      const lines = [
        'Здравствуйте! Заявка с сайта.',
        `Имя: ${name || 'Не указано'}`,
        `Контакт: ${contact || 'Не указан'}`,
        `Сообщение: ${message || 'Без сообщения'}`,
      ];
      window.open(buildWaUrl(lines.join('\n')), '_blank');
      form.reset();
    });
  }

  document.querySelectorAll('#price .price-card .btn-secondary').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.price-card');
      if (!card) return;
      const title = card.querySelector('h4')?.textContent?.trim() || 'Проект';
      const price = card.querySelector('.price')?.textContent?.trim();
      let message = `Здравствуйте! Меня интересует: ${title}`;
      if (price) {
        message += ` (${price})`;
      }
      message += '. Хотел(а) бы обсудить детали.';
      window.open(buildWaUrl(message), '_blank');
    });
  });

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  window.addEventListener('scroll', setHeaderState);
  setHeaderState();
});
