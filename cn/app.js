const $ = (s) => document.querySelector(s);
const invite = $('#invite-screen'), app = $('#app');
const initialClips = [
  { title: '1v4 with one bullet left', game: 'Call of Duty', by: 'Mason', color: 'M' },
  { title: 'The accidental aerial', game: 'Rocket League', by: 'Jules', color: 'J' },
  { title: 'When the whole lobby heard it', game: 'Call of Duty', by: 'Kai', color: 'K' }
];
const initialMessages = [
  ['M', 'Mason', '8:42 PM', 'who is on for a few matches?'], ['J', 'Jules', '8:43 PM', 'I’m in after this game 🙌'], ['K', 'Kai', '8:45 PM', 'saved that last clip lol']
];
function clips() { return JSON.parse(localStorage.getItem('squadhq-clips') || 'null') || initialClips; }
function messages() { return JSON.parse(localStorage.getItem('squadhq-chat') || 'null') || initialMessages; }
function renderClips() { $('#clip-feed').innerHTML = clips().map(c => `<article class="clip"><a class="thumb" href="${c.url || '#'}" target="_blank" rel="noopener" aria-label="Open ${c.title}">▶</a><div class="clip-info"><span class="tag">${c.game.toUpperCase()}</span><h4>${escape(c.title)}</h4><p>Shared by ${escape(c.by || 'You')}</p></div></article>`).join(''); }
function renderMessages() { $('#messages').innerHTML = messages().map(m => `<div class="message"><div class="avatar">${m[0]}</div><div><b>${escape(m[1])}</b><time>${m[2]}</time><p>${escape(m[3])}</p></div></div>`).join(''); $('#messages').scrollTop = $('#messages').scrollHeight; }
function escape(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }
function enter() { invite.classList.add('hidden'); app.classList.remove('hidden'); renderClips(); renderMessages(); }
$('#invite-form').addEventListener('submit', e => { e.preventDefault(); if ($('#invite-code').value.trim().toUpperCase() === 'SQUADUP') { localStorage.setItem('squadhq-member', 'true'); enter(); } else $('#invite-error').textContent = 'That invite code does not match.'; });
if (localStorage.getItem('squadhq-member')) enter();
$('#leave').onclick = () => { localStorage.removeItem('squadhq-member'); location.reload(); };
const dialog = $('#share-dialog'); ['#open-share','#open-share-mobile'].forEach(s => $(s).onclick = () => dialog.showModal()); $('#close-share').onclick = () => dialog.close();
$('#clip-form').addEventListener('submit', e => { e.preventDefault(); const list = clips(); list.unshift({ title: $('#clip-title').value, url: $('#clip-url').value, game: $('#clip-game').value, by: 'You' }); localStorage.setItem('squadhq-clips', JSON.stringify(list)); renderClips(); dialog.close(); e.target.reset(); });
$('#chat-form').addEventListener('submit', e => { e.preventDefault(); const text = $('#chat-input').value.trim(); if (!text) return; const list = messages(); list.push(['Y','You',new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}),text]); localStorage.setItem('squadhq-chat', JSON.stringify(list)); $('#chat-input').value=''; renderMessages(); });
