const dialogs = {
  create: document.querySelector('#create-dialog'),
  records: document.querySelector('#records-dialog'),
  account: document.querySelector('#account-dialog'),
  work: document.querySelector('#work-dialog'),
  notice: document.querySelector('#notice-dialog'),
};

const navButtons = [...document.querySelectorAll('[data-action]')];
const toast = document.querySelector('.toast');
let toastTimer;
let previewUrl;

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 2600);
}

function openDialog(name) {
  const dialog = dialogs[name];
  if (!dialog || dialog.open) return;
  dialog.showModal();
}

function closeAllDialogs() {
  Object.values(dialogs).forEach((dialog) => {
    if (dialog.open) dialog.close();
  });
}

function setHomeActive() {
  document.querySelectorAll('.nav-item, .mobile-navigation button').forEach((button) => {
    const active = button.dataset.action === 'home';
    button.classList.toggle('is-active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
}

function handleAction(action) {
  if (action === 'home') {
    closeAllDialogs();
    setHomeActive();
    document.querySelector('#content').scrollIntoView({ block: 'start' });
    return;
  }
  if (action === 'create' && dialogs.records.open) dialogs.records.close();
  openDialog(action);
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => handleAction(button.dataset.action));
});

Object.values(dialogs).forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

document.querySelectorAll('.gallery-card').forEach((card) => {
  card.addEventListener('click', () => {
    const source = card.querySelector('img');
    const title = card.dataset.work;
    dialogs.work.querySelector('#work-title').textContent = title;
    const target = dialogs.work.querySelector('.work-image');
    target.src = source.currentSrc || source.src;
    target.alt = source.alt;
    openDialog('work');
  });
});

const photoInput = document.querySelector('#photo-input');
const createMessage = dialogs.create.querySelector('.form-message');
const preview = dialogs.create.querySelector('.upload-preview');
const previewImage = preview.querySelector('img');
const fileName = preview.querySelector('.file-name');
const bindButton = document.querySelector('#bind-button');

photoInput.addEventListener('change', () => {
  const file = photoInput.files?.[0];
  createMessage.hidden = true;
  bindButton.disabled = true;
  preview.hidden = true;
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    createMessage.textContent = '请选择 JPG、PNG 或 WebP 图片。';
    createMessage.hidden = false;
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    createMessage.textContent = '图片超过 8 MB，请压缩后重试。';
    createMessage.hidden = false;
    return;
  }
  previewUrl = URL.createObjectURL(file);
  previewImage.src = previewUrl;
  fileName.textContent = file.name;
  preview.hidden = false;
  bindButton.disabled = false;
});

bindButton.addEventListener('click', () => {
  showToast('照片已进入装订预览。本地演示不上传文件。');
  dialogs.create.close();
});

dialogs.create.addEventListener('close', () => {
  photoInput.value = '';
  preview.hidden = true;
  createMessage.hidden = true;
  bindButton.disabled = true;
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
    previewUrl = undefined;
  }
});

const loginForm = document.querySelector('#login-form');
const accountMessage = loginForm.querySelector('.form-message');
loginForm.addEventListener('submit', (event) => {
  if (event.submitter?.value !== 'login') return;
  event.preventDefault();
  const email = loginForm.elements.email;
  if (!email.validity.valid) {
    accountMessage.textContent = '请输入有效邮箱地址。';
    accountMessage.hidden = false;
    email.focus();
    return;
  }
  accountMessage.hidden = true;
  showToast('演示站未连接账户服务，邮箱不会被发送。');
  dialogs.account.close();
  loginForm.reset();
});

dialogs.account.addEventListener('close', () => {
  accountMessage.hidden = true;
});

document.querySelectorAll('img').forEach((image) => {
  image.addEventListener('error', () => {
    image.closest('.gallery-card')?.setAttribute('data-media-error', 'true');
    image.alt = '图片暂时无法加载';
  }, { once: true });
});
