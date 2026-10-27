'use strict';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 851px)').addEventListener('change', closeMenu);

const demoContent = document.querySelector('#demo-content');
const portalDemo = demoContent.innerHTML;
const demos = {
  portal: portalDemo,
  flow: `<div class="demo-app-heading"><div><small>SLIMME WORKFLOW</small><h3>Eén aanvraag. Alles in gang.</h3></div><span class="avatar">⇄</span></div>
    <div class="flow-step"><span>↘</span><div><strong>Aanvraag ontvangen</strong><small>Via je website of klantenportaal</small></div></div><div class="flow-link"></div>
    <div class="flow-step"><span>⊞</span><div><strong>Klant en opdracht aangemaakt</strong><small>Gegevens rechtstreeks naar je CRM</small></div></div><div class="flow-link"></div>
    <div class="flow-step"><span>✓</span><div><strong>Je team kan aan de slag</strong><small>De juiste collega krijgt een taak</small></div></div>
    <div class="demo-notice"><span>✓</span> Elke stap zichtbaar. Geen dubbel invoerwerk.</div>`,
  insight: `<div class="demo-app-heading"><div><small>JE DAGELIJKS OVERZICHT</small><h3>Zie waar je staat.</h3></div><span class="avatar">▥</span></div>
    <div class="demo-stats"><div><small>Lopende opdrachten</small><strong>12</strong></div><div><small>Vragen aandacht</small><strong>02 <span class="tiny-dot"></span></strong></div><div><small>Afgerond</small><strong>28</strong></div></div>
    <div class="chart" role="img" aria-label="Voorbeeldgrafiek met afgeronde opdrachten van maandag tot vrijdag"><div style="height:40%"><small>MA</small></div><div style="height:65%"><small>DI</small></div><div style="height:50%"><small>WO</small></div><div style="height:76%"><small>DO</small></div><div style="height:92%"><small>VR</small></div></div>
    <p class="chart-note">Voorbeeldcijfers · overzicht van je opdrachten</p>`
};
const tabs = [...document.querySelectorAll('[data-demo]')];
function activateTab(tab) {
  tabs.forEach(item => {
    item.setAttribute('aria-selected', String(item === tab));
    item.tabIndex = item === tab ? 0 : -1;
  });
  demoContent.innerHTML = demos[tab.dataset.demo];
  document.querySelector('#demo-panel').setAttribute('aria-labelledby', tab.id);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let nextIndex;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    tabs[nextIndex].focus();
    activateTab(tabs[nextIndex]);
  });
});

document.querySelectorAll('[data-interest]').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('#interest').value = link.dataset.interest;
  });
});
