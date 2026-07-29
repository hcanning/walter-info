(function(){
  // ---- Feedback overlay (mockup) ----
  var feedbackData = {
    part1: {
      date: '30/03/2026 04:17 PM',
      summary: '',
      strengths: [
        'You show strong curiosity and motivation, especially when exploring advanced ideas like diffusion, the Kirkendall effect, and wave–particle duality.',
        'You can clearly explain interference and connect it to X-ray diffraction and Bragg\'s law, which is a solid foundation for later work on crystal structures.'
      ],
      weaknesses: [
        'There is not yet evidence that you can link different bonding types to specific material structures and properties using concrete examples.',
        'You have not yet shown that you can identify and describe crystal structures, unit cells, or non-crystalline arrangements, or apply Bragg\'s law quantitatively.',
        'There is no observable work yet on mechanical behavior of materials (elastic vs plastic deformation, fracture, or interpreting stress–strain curves).'
      ],
      nextSteps: [
        'For bonding and properties, make a small table listing each bonding type (ionic, covalent, metallic, van der Waals) with example materials and typical properties…'
      ]
    },
    part2: {
      date: '',
      summary: '"So far, you\'ve mainly explored a few key ideas in kinetics: the difference between thermodynamics and kinetics, the Kirkendall effect, and Fick\'s first law of diffusion. Your messages show interest and willingness to continue, but you haven\'t yet explained ideas in your own words or answered problems, so it\'s hard to judge your mastery level. With more active practice — like solving small questions or summarising concepts — you\'ll be able to show what you understand much more clearly."',
      strengths: [
        'Shows clear curiosity and motivation to continue learning the topic',
        'Engages with advanced concepts such as the Kirkendall effect and Fick\'s law'
      ],
      weaknesses: [
        'Has not yet summarised concepts in own words to demonstrate understanding',
        'No quiz answers or problem-solving attempts to show application of ideas'
      ],
      nextSteps: [
        'After each explanation, briefly write in your own words what you think the main idea is (for example, explain the Kirkendall effect or Fick\'s first law in 2–3 sentences) and ask the tutor to check it.',
        'Try a few short practice problems on diffusion (e.g., identifying direction of flux, comparing diffusion rates…).'
      ]
    },
    part3: {
      date: '23/07/2026 11:19 PM',
      summary: 'You showed a clear understanding of what a phase diagram represents and how it connects to what the material actually looks like (mixture of solid and liquid in the L+S region). You correctly used the lever rule several times and linked changes in phase fractions to microstructural evolution during cooling.',
      strengths: [
        'Accurately described the physical meaning of two-phase regions and tie lines in your own words',
        'Correctly applied the lever rule and interpreted what changing phase fractions mean for the material\'s microstructure'
      ],
      weaknesses: [
        'Minor notation slips (e.g., writing X0/B instead of XB0) that could cause confusion in more complex problems',
        'Haven\'t yet explained microstructural evolution over time (e.g., how shapes and arrangements of phases change), only phase fractions'
      ],
      nextSteps: [
        'Review common phase diagram notation and symbols (e.g., XB0 vs X0/B).'
      ]
    }
  };

  window.openFeedback = function(key){
    var d = feedbackData[key];
    if(!d) return;
    document.getElementById('fbDate').textContent = d.date || '';
    var html = d.summary ? ('<p>' + d.summary + '</p>') : '';
    html += '<p class="fb-label">Strengths:</p>';
    d.strengths.forEach(function(s){ html += '<p class="fb-bullet">• ' + s + '</p>'; });
    html += '<p class="fb-label">Weaknesses:</p>';
    d.weaknesses.forEach(function(s){ html += '<p class="fb-bullet">• ' + s + '</p>'; });
    html += '<p class="fb-label">💡 Recommended Next Steps</p>';
    d.nextSteps.forEach(function(s){ html += '<p class="fb-bullet">' + s + '</p>'; });
    document.getElementById('fbContent').innerHTML = html;
    document.getElementById('fbOverlay').classList.add('open');
  };

  // ---- Tabs ----
  var tabBtns = document.querySelectorAll('.tabbtn');
  var panels = document.querySelectorAll('.panel');
  tabBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      tabBtns.forEach(function(b){b.classList.remove('active');});
      panels.forEach(function(p){p.classList.remove('active');});
      btn.classList.add('active');
      document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
    });
  });

  // ---- Checklist ----
  var STORAGE_KEY = 'bu_walter_ai_checklist';
  var items = document.querySelectorAll('.item');
  var state = {};
  try{ state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }catch(e){ state = {}; }

  function updateProgress(){
    var total = items.length;
    var done = 0;
    items.forEach(function(it){ if(state[it.dataset.id]) done++; });
    var pct = total ? Math.round((done/total)*100) : 0;
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressLabel').textContent = done + ' / ' + total;
  }

  function applyState(){
    items.forEach(function(it){
      if(state[it.dataset.id]){ it.classList.add('checked'); }
      else{ it.classList.remove('checked'); }
    });
    updateProgress();
  }

  items.forEach(function(it){
    it.addEventListener('click', function(e){
      if(e.target.tagName === 'A') return; // don't toggle when clicking a link
      var id = it.dataset.id;
      state[id] = !state[id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      applyState();
    });
  });

  document.getElementById('resetBtn').addEventListener('click', function(){
    state = {};
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    applyState();
  });

  applyState();

  // ---- Use case pills ----
  var ucPills = document.querySelectorAll('.uc-pill');
  var ucDetails = document.querySelectorAll('.uc-detail');
  function selectUC(key){
    ucPills.forEach(function(p){
      var on = p.dataset.uc === key;
      p.classList.toggle('active', on);
      p.style.background = on ? p.style.getPropertyValue('--c') : '#fff';
      p.style.borderColor = on ? p.style.getPropertyValue('--c') : '';
    });
    ucDetails.forEach(function(d){ d.classList.toggle('active', d.dataset.uc === key); });
  }
  ucPills.forEach(function(p){
    p.addEventListener('click', function(){ selectUC(p.dataset.uc); });
  });
  selectUC('roleplay');
})();

(function () {
  if (window.parent === window) return;

  function reportHeight() {
    var h = Math.ceil(Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      document.documentElement.offsetHeight,
      document.body.offsetHeight
    ));
    window.parent.postMessage({ type: 'walter-info-height', height: h }, '*');
  }

  var scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      reportHeight();
    });
  }

  window.addEventListener('load', schedule);
  window.addEventListener('resize', schedule);
  document.addEventListener('click', function () {
    setTimeout(schedule, 50);
    setTimeout(schedule, 300);
  });

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(schedule).observe(document.body);
  }

  schedule();
})();
