// Main interactivity for Aroma Identica
document.addEventListener('DOMContentLoaded', function(){
  const taglines = [
    'Un aroma que cuenta tu historia',
    'Notas que perduran: bergamota, ámbar y vetiver',
    'Diseñado para recordar',
    'Una estela dorada en cada paso'
  ];
  let taglineIdx = 0;

  const taglineEl = document.getElementById('tagline');
  const dynamicTaglines = document.getElementById('dynamicTaglines');
  const nameInput = document.getElementById('perfumeName');
  const previewLabel = document.getElementById('previewLabel');
  const priceEl = document.getElementById('priceValue');
  const gamaRadios = document.querySelectorAll('input[name="gama"]');
  const gamaInfoBtn = document.getElementById('gamaInfo');
  const gamaTooltip = document.getElementById('gamaTooltip');
  const shareBtn = document.getElementById('shareBtn');
  const copyBtn = document.getElementById('copyBtn');
  const previewShare = document.getElementById('previewShare');
  const bestsellerBadge = document.getElementById('bestseller');

  // Initial price data
  const PRICES = { estandar: 49.99, alta: 79.99 };
  let currentPrice = PRICES.estandar;
  priceEl.textContent = currentPrice.toFixed(2);

  // Taglines rotate
  function rotateTaglines(){
    taglineIdx = (taglineIdx + 1) % taglines.length;
    // fade out/in
    taglineEl.animate([{opacity:1},{opacity:0}],{duration:250,fill:'forwards'}).onfinish = () => {
      taglineEl.textContent = taglines[taglineIdx];
      taglineEl.animate([{opacity:0},{opacity:1}],{duration:250,fill:'forwards'});
    };
    // also update dynamic taglines (subtle)
    dynamicTaglines.textContent = 'Notas: ' + ['bergamota','ámbar','vetiver','sándalo'][taglineIdx % 4];
  }
  setInterval(rotateTaglines, 4200);

  // Live preview of name with animated label
  let nameTimeout;
  nameInput.addEventListener('input', () => {
    clearTimeout(nameTimeout);
    const val = nameInput.value.trim() || 'Tu perfume';
    // slide label up then set text then slide
    previewLabel.classList.remove('settled');
    previewLabel.classList.add('rolling');
    previewLabel.style.transform = 'translateY(-16px)';
    previewLabel.style.opacity = '0';
    nameTimeout = setTimeout(() => {
      previewLabel.textContent = val;
      previewLabel.style.transform = 'translateY(0)';
      previewLabel.style.opacity = '1';
      previewLabel.classList.remove('rolling');
      previewLabel.classList.add('settled');
    }, 160);
  });

  // Price animation (count-up)
  function animatePrice(to){
    const from = currentPrice;
    const start = performance.now();
    const duration = 480;
    function step(ts){
      const t = Math.min(1, (ts - start)/duration);
      const eased = t*t*(3 - 2*t);
      const value = from + (to - from) * eased;
      priceEl.textContent = value.toFixed(2);
      if(t < 1){
        requestAnimationFrame(step);
      } else {
        currentPrice = to;
        // micro settle animation
        priceEl.classList.add('settled');
        setTimeout(()=>priceEl.classList.remove('settled'), 420);
      }
    }
    priceEl.classList.remove('settled');
    requestAnimationFrame(step);
  }

  gamaRadios.forEach(r => r.addEventListener('change', e => {
    const val = e.target.value;
    const target = PRICES[val];
    // update badge visibility (Estándar = más vendido)
    if(val === 'estandar'){
      bestsellerBadge.style.opacity = '1';
    } else {
      bestsellerBadge.style.opacity = '0';
    }
    animatePrice(target);
  }));

  // Tooltip for Gama Alta
  let tooltipTimeout;
  gamaInfoBtn.addEventListener('mouseenter', (e) => {
    clearTimeout(tooltipTimeout);
    const rect = e.target.getBoundingClientRect();
    gamaTooltip.style.left = (rect.right + 12) + 'px';
    gamaTooltip.style.top = (rect.top - 8) + 'px';
    gamaTooltip.hidden = false;
  });
  gamaInfoBtn.addEventListener('mouseleave', () => {
    tooltipTimeout = setTimeout(()=>gamaTooltip.hidden = true, 350);
  });

  // Share / Copy features
  function buildShareText(){
    const name = nameInput.value.trim() || 'Aroma Identica';
    const gama = document.querySelector('input[name="gama"]:checked').value;
    const price = priceEl.textContent;
    return `"${name}" — ${gama === 'alta' ? 'Gama Alta' : 'Estándar'} • ${price} USD\nDescubre tu aroma: Aroma Identica`;
  }

  shareBtn.addEventListener('click', async () => {
    const text = buildShareText();
    if(navigator.share){
      try{ await navigator.share({title: 'Aroma Identica', text});
        showToast('Compartido correctamente');
      }catch(err){ /* user cancelled */ }
    } else {
      // fallback: copy
      try{ await navigator.clipboard.writeText(text); showToast('Texto copiado al portapapeles'); }
      catch(err){ showToast('No fue posible compartir'); }
    }
  });

  copyBtn.addEventListener('click', async () => {
    const text = buildShareText();
    try{ await navigator.clipboard.writeText(text); showToast('Texto copiado al portapapeles'); }
    catch(err){ showToast('No fue posible copiar'); }
  });

  previewShare.addEventListener('click', () => {
    // quick micro interaction: pulse bottle
    const bottle = document.querySelector('.bottle-group');
    bottle.animate([{transform:'scale(1)'},{transform:'scale(1.04)'},{transform:'scale(1)'}],{duration:420});
    showToast('Vista previa activada');
  });

  // small toast helper
  function showToast(msg){
    const t = document.createElement('div');
    t.className = 'success-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(()=>t.style.opacity = '1',20);
    setTimeout(()=>{ t.style.opacity='0'; t.addEventListener('transitionend', ()=>t.remove()) }, 1600);
  }

  // Accessibility: allow tooltip toggle via keyboard on info button
  gamaInfoBtn.addEventListener('focus', (e) => {
    const rect = e.target.getBoundingClientRect();
    gamaTooltip.style.left = (rect.right + 12) + 'px';
    gamaTooltip.style.top = (rect.top - 8) + 'px';
    gamaTooltip.hidden = false;
  });
  gamaInfoBtn.addEventListener('blur', ()=>gamaTooltip.hidden = true);

  // small on-load micro animation
  setTimeout(()=>document.querySelector('.bottle-group').animate([{opacity:0, transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,easing:'cubic-bezier(.2,.9,.2,1)'}),200);

});
