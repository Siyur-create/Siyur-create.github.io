const archiveList = document.querySelector('#archive-list');
function archiveNode(tag, cls, text) { const n = document.createElement(tag); if(cls)n.className=cls;if(text)n.textContent=text;return n; }
function archiveLink(url,label) {
  const u=new URL(url);if(!['https:','http:'].includes(u.protocol))throw new Error('Unsupported work URL');
  const a=archiveNode('a','text-link',label);a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';return a;
}
for(const group of [{title:'更多对话',works:window.SIYU_CONTENT.additionalInterviews || []},{title:'首页精选',works:window.SIYU_CONTENT.interviews || []}]) {
  if(!group.works.length)continue;
  const section=archiveNode('section','archive-section');section.append(archiveNode('h2','archive-group-title',group.title));
  const grid=archiveNode('div','archive-grid');
  group.works.forEach(work=>{
    const article=archiveNode('article','archive-card'+(work.cover?'':' archive-card-without-cover'));article.id=work.id;
    if(work.cover){const a=archiveLink(work.url,'');a.className='cover-link';a.setAttribute('aria-label','观看'+work.name);const img=archiveNode('img');img.src=work.cover;img.alt=work.name+'原视频截帧';img.loading='lazy';a.append(img);article.append(a);}
    const info=archiveNode('div','archive-copy');info.append(archiveNode('p','archive-category',work.category),archiveNode('h3','',work.name),archiveNode('p','work-description',work.description));
    article.append(info,archiveLink(work.url,'观看访谈 ↗'));grid.append(article);
  });
  section.append(grid);archiveList.append(section);
}
