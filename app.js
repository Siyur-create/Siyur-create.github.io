const content = window.SIYU_CONTENT;
function el(tag, cls, text) { const node = document.createElement(tag); if (cls) node.className = cls; if (text) node.textContent = text; return node; }
function workLink(url, label) {
  if (url) {
    try { const parsed = new URL(url); if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new Error(); }
    catch { return el('span', 'link-pending', '原作链接待补充'); }
    const a = el('a', 'text-link', label + ' ↗'); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a;
  }
  return el('span', 'link-pending', '原作链接待补充');
}
function coverFor(work) {
  const frame = el('div', 'work-cover' + (work.cover ? '' : ' cover-pending'));
  if (work.cover) {
    const image = el('img'); image.src = work.cover; image.alt = work.suppliedCover ? work.title + '本人提供的原作封面' : work.aiEdited ? work.title + '封面，基于本人真实视频截图进行AI清理' : (work.name ? work.name + '原视频截帧' : work.title + '原视频截帧'); image.loading = 'lazy';
    frame.append(image);
  } else { frame.append(el('span', 'cover-hint', work.name ? '横屏封面待补充' : '竖屏封面待补充')); }
  if (work.coverTitle) frame.append(el('span', 'video-cover-title', work.coverTitle));
  if (work.social) { const social = el('span', 'video-social'); work.social.forEach(value => social.append(el('span', '', value))); frame.append(social); }
  if (!work.name && work.cover) frame.append(el('span', 'video-play', '▶'));
  return frame;
}
content.interviews.forEach((work, index) => {
  const article = el('article', 'interview-card'); article.id = work.id;
  const imageLink = workLink(work.url, ''); imageLink.className = 'cover-link'; imageLink.textContent = ''; imageLink.setAttribute('aria-label', '观看' + work.name + '访谈'); imageLink.append(coverFor(work));
  const info = el('div', 'work-info'); info.append(el('h3', '', work.name), el('p', 'work-description', work.description), workLink(work.url, '观看访谈'));
  article.append(imageLink, info); document.querySelector('#interview-list').append(article);
});
content.shorts.forEach((work, index) => {
  const article = el('article', 'short-card short-' + index); article.id = work.id;
  const imageLink = workLink(work.url, ''); imageLink.className = 'cover-link'; imageLink.textContent = ''; imageLink.setAttribute('aria-label', '观看' + work.title); imageLink.append(coverFor(work));
  const info = el('div', 'short-info');
  info.append(el('p', 'small-label', '短视频 / 微信视频号'), el('h3', '', work.title), el('p', 'short-subtitle', work.subtitle));
  const metric = el('p', 'metric-line', work.metrics.map(([value, label]) => value + ' ' + label).join(' · '));
  info.append(metric, workLink(work.url, '观看短视频')); article.append(imageLink, info); document.querySelector('#short-list').append(article);
});
const albumImage = document.querySelector('#album-image'), albumCaption = document.querySelector('#album-caption'), albumCounter = document.querySelector('#album-counter');
let albumIndex = 0;
const albumButtons = content.album.map((photo, index) => {
  const button = el('button', 'album-thumb'); button.type = 'button'; button.setAttribute('aria-label', '查看第' + (index + 1) + '张：' + photo.caption);
  const img = el('img'); img.src = photo.src; img.alt = ''; img.loading = 'lazy'; button.append(img);
  button.addEventListener('click', () => showPhoto(index)); document.querySelector('#album-thumbnails').append(button); return button;
});
function showPhoto(index) {
  albumIndex = (index + content.album.length) % content.album.length;
  const photo = content.album[albumIndex]; albumImage.src = photo.src; albumImage.alt = photo.alt; albumCaption.textContent = photo.caption;
  albumCounter.textContent = String(albumIndex + 1).padStart(2, '0') + ' / ' + String(content.album.length).padStart(2, '0');
  albumButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === albumIndex)));
}
showPhoto(0);
document.querySelector('#album-prev').addEventListener('click', () => showPhoto(albumIndex - 1));
document.querySelector('#album-next').addEventListener('click', () => showPhoto(albumIndex + 1));
document.querySelector('.album').addEventListener('keydown', event => { if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(albumIndex + 1); } if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(albumIndex - 1); } });
const menu = document.querySelector('.menu-toggle'), navigation = document.querySelector('#navigation');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('is-open', open); });
navigation.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); if (document.activeElement.closest('#navigation')) menu.focus(); } });


const shelfRail = document.querySelector('#shelf-items');
(content.shelf || []).forEach((item, index) => {
  const card = el('article', 'inspiration-card' + (item.type === 'creator' ? ' inspiration-person' : '') + (item.books ? ' inspiration-paired' : '') + (item.prominent ? ' inspiration-prominent' : ' inspiration-secondary'));
  if (item.type === 'video') card.classList.add('inspiration-video');
  const visual = el('div', 'inspiration-cover' + (item.books ? ' paired-covers' : ''));
  for (const book of item.books || [item]) {
    const img = el('img'); img.src = book.cover; img.alt = book.title; img.loading = 'lazy'; visual.append(img);
  }
  const info = el('div', 'inspiration-info');
  const platforms = {'Zara Zhang': 'X 账号', '王逅逅': '小红书账号', '食贫道': 'B站账号', '课代表立正': 'B站账号'};
  info.append(el('p', 'inspiration-kind', item.type === 'book' ? '书籍' : item.type === 'series' ? '电视剧' : item.platform || platforms[item.title] || '创作者'), el('h3', '', item.title));
  if (item.creator) info.append(el('p', 'inspiration-author', item.creator));
  if (item.note) info.append(el('p', 'inspiration-note', item.note));
  const links = el('div', 'inspiration-direct');
  if (item.books) item.books.forEach(book => links.append(workLink(book.url, '《' + book.title + '》· 豆瓣')));
  else if (item.url) links.append(workLink(item.url, item.linkLabel || (item.type === 'creator' ? '去账号主页' : item.url.includes('read.douban') ? '豆瓣阅读' : '去豆瓣看看')));
  else if (item.profile) { const show = el('button','plain-link','查看主页截图 ↗'); show.type = 'button'; show.addEventListener('click', () => { photoGroups.profile = [{src:item.profile,label:item.title + ' · 主页截图'}]; openPhoto('profile',0); }); links.append(show); }
  if (links.childNodes.length) info.append(links);
  card.append(visual, info); shelfRail.append(card);
});
document.querySelector('#inspiration-count').textContent = String((content.shelf || []).reduce((n,item) => n + (item.books?.length || 1), 0)).padStart(2, '0');
const viewer = document.querySelector('#photo-viewer');
const viewerImage = document.querySelector('#photo-viewer-image');
const journeyImages = [...document.querySelectorAll('#experience .journey-photos img')];
const photoGroups = {
  journey: journeyImages.map(img => ({src: img.getAttribute('src'), label: img.closest('figure').querySelector('figcaption')?.textContent || img.alt})),
  inspiration: (content.shelf || []).map(item => ({src: item.cover, label: item.title}))
};
let activePhotoGroup = 'journey', activePhotoIndex = 0, viewerTrigger = null;
function showViewerPhoto(index) {
  const photos = photoGroups[activePhotoGroup]; activePhotoIndex = (index + photos.length) % photos.length;
  const photo = photos[activePhotoIndex]; viewerImage.src = photo.src; viewerImage.alt = photo.label;
  document.querySelector('#photo-viewer-label').textContent = photo.label;
  document.querySelector('#photo-viewer-counter').textContent = (activePhotoIndex + 1) + ' / ' + photos.length;
}
function openPhoto(group, index) {
  viewerTrigger = document.activeElement; activePhotoGroup = group; showViewerPhoto(index); viewer.showModal();
}
journeyImages.forEach((img, index) => {
  const button = el('button', 'journey-photo-button'); button.type = 'button'; button.title = '双击放大；手机轻点查看'; button.setAttribute('aria-label', '放大照片：' + img.alt);
  img.before(button); button.append(img);
  button.addEventListener('dblclick', () => openPhoto('journey', index));
  button.addEventListener('click', event => { if (event.detail === 0 || window.matchMedia('(hover: none), (max-width: 640px)').matches) openPhoto('journey', index); });
});
document.querySelector('#photo-viewer-close').addEventListener('click', () => viewer.close());
document.querySelector('#photo-viewer-prev').addEventListener('click', () => showViewerPhoto(activePhotoIndex - 1));
document.querySelector('#photo-viewer-next').addEventListener('click', () => showViewerPhoto(activePhotoIndex + 1));
viewer.addEventListener('keydown', event => { if (event.key === 'ArrowRight') { event.preventDefault(); showViewerPhoto(activePhotoIndex + 1); } if (event.key === 'ArrowLeft') { event.preventDefault(); showViewerPhoto(activePhotoIndex - 1); } });
viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
viewer.addEventListener('close', () => { viewerImage.removeAttribute('src'); viewerTrigger?.focus(); });

// Everyday experiences are visible immediately; photos may be enlarged independently.
(content.daily || []).forEach((item, i) => {
  const card = el('article', 'daily-card');
  const photos = el('div','daily-photos');
  item.images.forEach((src,j) => { const button=el('button','daily-photo daily-photo-'+i); button.type='button'; button.setAttribute('aria-label','放大'+item.title+'第'+(j+1)+'张照片'); const img=el('img'); img.src=src; img.alt=item.title+(j?' · 手写细节':' · 本人实拍'); img.loading='lazy'; button.append(img); button.addEventListener('click',()=> { photoGroups.daily=item.images.map((src,k)=>({src,label:item.title+(k?' · 手写细节':' · 本人实拍')}));openPhoto('daily',j); });photos.append(button); });
  const copy=el('div','daily-card-copy');copy.append(el('span','daily-number',String(i+1).padStart(2,'0')),el('h3','',item.title),el('p','daily-experience',item.body));card.append(photos,copy);document.querySelector('#daily-items').append(card);
});
photoGroups.build = [{src: 'assets/transcribe-app-v14.png', label: '视频逐字稿 · 实际运行界面'}];
const buildVisual = document.querySelector('.build-visual');
const buildImage = buildVisual.querySelector('img'), buildButton = el('button', 'build-preview'); buildButton.type = 'button'; buildButton.setAttribute('aria-label', '放大视频逐字稿实际界面'); buildImage.before(buildButton); buildButton.append(buildImage); buildButton.addEventListener('click', () => openPhoto('build', 0));

