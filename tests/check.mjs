import { readFile, access } from 'node:fs/promises';

const requiredFiles = ['index.html', 'styles.css', 'app.js', ...Array.from({ length: 12 }, (_, index) => `public/assets/zine-${String(index + 1).padStart(2, '0')}.webp`)];
await Promise.all(requiredFiles.map((file) => access(new URL(`../${file}`, import.meta.url))));

const [html, css, js] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../styles.css', import.meta.url), 'utf8'),
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
]);

const assertions = [
  [!html.includes('—') && !html.includes('–'), '页面文案不能包含长破折号'],
  [html.includes('aria-label="主导航"'), '缺少主导航语义'],
  [html.includes('aria-label="移动端主导航"'), '缺少移动端导航语义'],
  [(html.match(/class="gallery-card/g) || []).length === 12, '作品数量应为 12'],
  [css.includes('--color-accent: #ffd84d'), '缺少规范强调色'],
  [css.includes('prefers-reduced-motion: reduce'), '缺少减弱动效支持'],
  [css.includes('forced-colors: active'), '缺少高对比模式支持'],
  [js.includes('showModal()'), '弹层交互未接入'],
  [!js.includes("addEventListener('scroll'"), '禁止逐帧滚动监听'],
];

for (const [condition, message] of assertions) {
  if (!condition) throw new Error(message);
}

console.log(`check passed: ${requiredFiles.length} files, ${assertions.length} assertions`);
