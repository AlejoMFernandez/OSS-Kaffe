/* ÖSS Kaffe — demo */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];


  /* INTRO · la taza se llena (una vez por sesión) */
  (() => {
    const intro = $('#intro');
    const done = () => {
      document.body.classList.remove('intro-on');
      try { sessionStorage.setItem('oss-intro', '1'); } catch (e) {}
    };
    if (!intro || document.documentElement.classList.contains('no-intro')) { intro && intro.remove(); done(); return; }
    const coffee = $('#introCoffee'), pct = $('#introPct'), lbl = $('#introLbl');
    let loaded = document.readyState === 'complete', finished = false;
    addEventListener('load', () => { loaded = true; });
    const t0 = performance.now(), MIN = 2200;
    const finish = () => {
      if (finished) return; finished = true;
      intro.classList.add('red');
      setTimeout(() => intro.classList.add('grow'), 280);
      setTimeout(() => { intro.classList.add('gone'); done(); }, 950);
      setTimeout(() => intro.remove(), 1500);
    };
    const frame = now => {
      if (finished) return;
      let k = Math.min(1, (now - t0) / MIN);
      if (!loaded) k = Math.min(k, .92);           // no llega a 100 hasta que cargó la página
      const e = 1 - Math.pow(1 - k, 2);
      coffee.setAttribute('transform', `translate(0 ${70 - e * 64})`);
      const p = Math.round(e * 100);
      pct.textContent = p + '%';
      lbl.textContent = p < 35 ? 'MOLIENDO' : p < 75 ? 'EXTRAYENDO' : p < 100 ? 'TEXTURIZANDO LA LECHE' : 'LISTO, EN MANO';
      if (k >= 1) setTimeout(finish, 250); else requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    setTimeout(() => { loaded = true; }, 6000);       // tope por si alguna imagen tarda
    $('#introSkip').addEventListener('click', finish);
  })();

  /* NAV: sólido al scrollear + hamburguesa */
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  const onScroll = () => nav.classList.toggle('solid', scrollY > 60);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* REVEAL */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .14 });
  $$('.reveal').forEach(el => io.observe(el));

  /* VENTANILLA: fotos dentro de la taza */
  const imgs = $$('#cupWin img'), dots = $('#cupDots'), cap = $('#cupCap');
  let ci = 0, timer;
  imgs.forEach((im, k) => {
    const b = document.createElement('button');
    b.textContent = String(k + 1).padStart(2, '0');
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', im.alt);
    b.addEventListener('click', () => { show(k); clearInterval(timer); });
    dots.appendChild(b);
  });
  const show = k => {
    ci = k;
    imgs.forEach((im, j) => im.classList.toggle('on', j === k));
    $$('button', dots).forEach((b, j) => b.setAttribute('aria-selected', j === k));
    cap.textContent = imgs[k].alt;
  };
  show(0);
  timer = setInterval(() => show((ci + 1) % imgs.length), 3800);

  /* CARTA (foto de la carta, enero 2026) */
  const CARTA = {
    cafes: [
      ['Espresso doppio', '', '$4.000'],
      ['Cortado', 'Espresso simple + leche (4 oz)', '$4.000'],
      ['Cappuccino', 'Espresso simple + leche (6 oz)', '$5.000'],
      ['Batch del bueno', 'Café filtrado (8 oz)', '$5.000'],
      ['Magic', 'Espresso doble + leche (4 oz)', '$6.000'],
      ['Flat white', 'Espresso doble + leche (8 oz)', '$6.000'],
      ['Latte XL', 'Espresso simple + leche (12 oz)', '$6.000'],
      ['+ Extra shot / leche vegetal', '', '$2.000']
    ],
    especiales: [
      ['Soft Vanilla', 'Espresso simple + leche + caramelo (8 oz)', '$7.000'],
      ['Moccaccino', 'Espresso simple + chocolate + leche (8 oz)', '$7.000'],
      ['Choco Marley', 'Espresso simple + chocolate + leche + pimienta de Jamaica (8 oz)', '$7.000'],
      ['Extra Virgen', 'Espresso simple + leche + aceite de oliva (8 oz)', '$7.000']
    ],
    frios: [
      ['Cold brew', 'Café filtrado en frío', '$6.000'],
      ['Iced latte', 'Espresso simple + leche + caramelo + hielo', '$8.000'],
      ['Espresso ginger', 'Espresso simple + ginger ale + hielo', '$8.000'],
      ['Espresso naranja', 'Espresso simple + jugo de naranja + hielo', '$8.000'],
      ['Iced flat white', 'Espresso doble + leche + hielo', '$9.000'],
      ['Affogato', 'Helado de crema + espresso simple', '$10.000']
    ],
    tragos: [
      ['Carajillo', 'Espresso doble + gin o bourbon + miel', '$8.000'],
      ['Össten', 'Cold brew + jugo de limón + ginger ale + sal', '$9.000'],
      ['Angelo Paolo', 'Gin Piel + ginger ale', '$10.000']
    ],
    otras: [
      ['Té', 'Earl Grey, chai o verde', '$4.000'],
      ['Iced tea de hibiscus', '', '$4.000'],
      ['Chai latte', '', '$6.000'],
      ['Matcha latte', '', '$6.000'],
      ['Limonada · Jugo de naranja', '', '$4.000'],
      ['Ginger ale · Agua sin gas', '', '$4.000'],
      ['Agua con gas Perrier', '', '$5.000'],
      ['Chocolatada', '', '$5.000']
    ],
    dulce: [
      ['Cubanito con dulce de leche', '', '$2.000'],
      ['Viaje al oriente', 'Dátil con pasta de maní y chocolate', '$4.000'],
      ['Matrimonio', 'Alfajor de maicena + alfajor de almendra', '$5.000'],
      ['Coquitöss', '', '$5.000'],
      ['Bocado vegano', '', '$5.000'],
      ['Carrot cake', '', '$6.000'],
      ['Budín de banana · Budín de limón', '', '$6.000'],
      ['Marquise con dulce de leche', '', '$6.000'],
      ['Sfogliatella', '', '$6.000'],
      ['Cookie con chocolate', '', '$6.000'],
      ['Torta galesa', '', '$7.000'],
      ['Granola con yogurt y fruta', '', '$10.000']
    ],
    salado: [
      ['Chipá', '', '$3.000'],
      ['Chipá relleno', 'Con lomito y queso', '$6.000'],
      ['Tostada de masa madre', 'Con queso crema y mermelada', '$7.000'],
      ['Tostada de masa madre', 'Con queso sardo, aceite de oliva y pimienta · queso sardo, miel y almendras · queso sardo y mermelada · hummus de remolacha', '$9.000'],
      ['Tostado de lomito y queso', '', '$12.000']
    ]
  };
  const list = $('#list');
  const renderTab = key => {
    list.innerHTML = '';
    CARTA[key].forEach(([n, d, p], i) => {
      const el = document.createElement('div');
      el.className = 'item';
      el.style.animationDelay = (i * 40) + 'ms';
      el.innerHTML = `<b>${n}</b><span class="price">${p}</span>${d ? `<p>${d}</p>` : ''}`;
      list.appendChild(el);
    });
  };
  $$('.tabs button').forEach(b => b.addEventListener('click', () => {
    $$('.tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
    renderTab(b.dataset.tab);
  }));
  renderTab('cafes');

  /* PEDÍ POR LA VENTANILLA */
  const PEDIDO = [
    ['Espresso doppio', 'Doble, corto e intenso. El de siempre.', '$4.000'],
    ['Cortado', 'Espresso simple + leche (4 oz).', '$4.000'],
    ['Flat white', 'Espresso doble + leche (8 oz).', '$6.000'],
    ['Cappuccino', 'Espresso simple + leche (6 oz).', '$5.000'],
    ['Batch del bueno', 'Café filtrado (8 oz).', '$5.000'],
    ['Choco Marley', 'Espresso, chocolate, leche y pimienta de Jamaica.', '$7.000'],
    ['Extra Virgen', 'Espresso, leche y aceite de oliva.', '$7.000'],
    ['Össten', 'Cold brew + limón + ginger ale + sal.', '$9.000']
  ];
  const chips = $('#chips'), cup = $('#cup'), status = $('#status'), num = $('#num');
  let n = 1894, t1;
  PEDIDO.forEach(([name, desc, price], k) => {
    const b = document.createElement('button');
    b.className = 'chip'; b.textContent = name;
    b.setAttribute('aria-pressed', k === 2);
    b.addEventListener('click', () => {
      $$('.chip', chips).forEach(x => x.setAttribute('aria-pressed', x === b));
      $('#dName').textContent = name; $('#dDesc').textContent = desc; $('#dPrice').textContent = price;
      cup.classList.remove('served');
      status.textContent = 'Preparando…';
      num.textContent = ++n;
      clearTimeout(t1);
      t1 = setTimeout(() => {
        $('#cupLabel').textContent = name;
        cup.classList.add('served');
        status.textContent = 'Listo. Café en mano.';
      }, 650);
    });
    chips.appendChild(b);
  });

  /* ¿CUÁNTO TIEMPO TENÉS? */
  (() => {
    const R = $('#rushRange'); if (!R) return;
    const imgs = $$('#rushCup img'), rec = $('#rushRec');
    const T = [
      ['Espresso doppio, en la ventanilla', 'Treinta segundos, de parado, y seguís viaje. $4.000', '#F2362F'],
      ['Flat white para llevar', 'En vaso, con tapa, café en mano. $6.000', '#d0582f'],
      ['Batch del bueno + un chipá', 'Filtrado del día y algo salado al lado. $5.000 + $3.000', '#B7793E'],
      ['Flat white + torta galesa', 'Sentate un rato. La torta galesa no se come apurado. $6.000 + $7.000', '#5f7a5e'],
      ['Össten + tostada de masa madre', 'Cold brew con limón, ginger ale y sal, y una tostada. Quedate. $9.000 + $9.000', '#1E5D68']
    ];
    let last = -1;
    const upd = () => {
      const v = +R.value;
      const tier = v === 0 ? 0 : v <= 3 ? 1 : v <= 9 ? 2 : v <= 19 ? 3 : 4;
      $('#rushNum').textContent = v === 0 ? '30' : v;
      $('#rushUnit').textContent = v === 0 ? 'segundos' : v === 1 ? 'minuto' : 'minutos';
      $('#rushNum').style.setProperty('--rush', T[tier][2]);
      R.setAttribute('aria-valuetext', v === 0 ? '30 segundos' : v + ' minutos');
      if (tier === last) return; last = tier;
      imgs.forEach((im, j) => im.classList.toggle('on', j === tier));
      $('#rushName').textContent = T[tier][0];
      $('#rushDesc').textContent = T[tier][1];
      rec.classList.remove('swap'); void rec.offsetWidth; rec.classList.add('swap');
    };
    R.addEventListener('input', upd); upd();
  })();

  /* GALERÍA: duplicar para loop + lightbox */
  const track = $('#gallery');
  track.innerHTML += track.innerHTML;
  const lb = $('#lightbox'), lbImg = $('#lbImg');
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ''; };
  track.addEventListener('click', e => {
    const im = e.target.closest('button')?.querySelector('img'); if (!im) return;
    lbImg.src = im.src; lbImg.alt = im.alt; lb.hidden = false; document.body.style.overflow = 'hidden';
  });
  $('#lbClose').addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeLb(); setMenu(false); } });

  /* TABLERO DE SALIDAS */
  const SUC = [
    { code: 'BEL', addr: 'Roosevelt 1894', city: 'Belgrano · CABA', img: 'img/cartel-noche.webp', hours: '[HORARIO]' },
    { code: 'RECO', addr: 'Melo 1860', city: 'Recoleta · CABA', hours: '[HORARIO]' },
    { code: 'DEV', addr: 'Lincoln 4247', city: 'Villa Devoto · CABA', hours: 'cierra 20 h', tel: '+541121754045', telTxt: '11 2175-4045' },
    { code: 'PAL', addr: 'Emilio Zola 5107', city: '[BARRIO]', hours: '[HORARIO]' },
    { code: 'POB', addr: 'Av. de Mayo 735', city: '[BARRIO]', hours: '[HORARIO]' },
    { code: 'CF', addr: 'Andrés Bello', city: '[CIUDAD]', hours: '[HORARIO]' },
    { code: 'BCN', addr: 'Joaquín Costa 26', city: 'Barcelona · España', img: 'img/barcelona.webp', hours: 'L a V 8:30–19 · S 9–19 · D 10–19' },
    { code: 'MAD', addr: 'Cortina 1', city: 'Chamberí, Madrid · España', hours: '[HORARIO]' }
  ];
  const AB = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const rows = $('#rows');
  const flapsFor = (txt, len, cls) => {
    const w = document.createElement('span'); w.className = 'flaps ' + cls;
    txt.toUpperCase().padEnd(len, ' ').slice(0, len).split('').forEach(ch => {
      const f = document.createElement('span'); f.className = 'flap'; f.dataset.c = ch; f.textContent = ch === ' ' ? '' : ch; w.appendChild(f);
    });
    return w;
  };
  SUC.forEach((s, k) => {
    const b = document.createElement('button');
    b.className = 'row'; b.setAttribute('role', 'listitem'); b.setAttribute('aria-pressed', k === 0);
    b.setAttribute('aria-label', `${s.code}: ${s.addr}, ${s.city}`);
    b.append(flapsFor(s.code, 4, ''), flapsFor(s.addr, 17, 'flaps--w'));
    const c = document.createElement('span'); c.className = 'row__city'; c.textContent = s.city; b.appendChild(c);
    b.addEventListener('click', () => { pick(k, b); if (innerWidth < 900) card.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
    rows.appendChild(b);
  });
  const flip = () => {
    const all = $$('.row', rows);
    all.forEach((row, r) => $$('.flap', row).forEach((f, i) => {
      const target = f.dataset.c; if (target === ' ') return;
      let steps = 6 + i + r * 2;
      const tt = setInterval(() => {
        if (--steps <= 0) { f.textContent = target; clearInterval(tt); return; }
        f.textContent = AB[(Math.random() * AB.length) | 0];
      }, 45);
    }));
  };
  new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { flip(); o.disconnect(); } }), { threshold: .3 }).observe(rows);

  const card = $('#scard');
  const pick = (k, btn) => {
    const s = SUC[k];
    $$('.row', rows).forEach(r => r.setAttribute('aria-pressed', r === btn));
    $('#sCode').textContent = s.code;
    $('#sName').textContent = s.addr;
    $('#sCity').textContent = s.city;
    $('#sHours').textContent = 'Horario: ' + s.hours;
    const tel = $('#sTel'); tel.hidden = !s.tel; if (s.tel) { tel.href = 'tel:' + s.tel; tel.textContent = 'Llamar · ' + s.telTxt; }
    const img = $('#sImg');
    img.style.backgroundImage = s.img ? `url(${s.img})` : '';
    img.classList.toggle('empty', !s.img);
    $('#sMaps').href = 'https://www.google.com/maps/search/' + encodeURIComponent('ÖSS Kaffe ' + s.addr + ' ' + (s.city.includes('[') ? '' : s.city));
    card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop');
  };
  pick(0, $('.row', rows));
})();
