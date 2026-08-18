/* ============================================================
   Khushboo Sharma — Portfolio chat agent
   Self-contained: no external APIs. Knowledge base baked in.
   Also handles: nav hamburger, active-page highlight,
   fade-in on scroll, hero tagline rotator.
   ============================================================ */
(function () {
  "use strict";

  /* ----------------------------------------------------------
     KNOWLEDGE BASE
     Each topic: keywords (scored per match) + answer.
     ---------------------------------------------------------- */
  var KNOWLEDGE_BASE = [
    {
      id: "overview",
      keywords: ["who", "about", "overview", "summary", "profile", "introduce", "introduction", "bio", "who is she"],
      answer: "Khushboo is a product leader with 10+ years spanning product management and product design, now focused on digital growth and AI product management in fintech. She turns complex, regulated problems into intuitive, high-converting experiences — with a track record of measurable funnel, activation, and satisfaction gains. She's currently Lead Product Manager, Acquisition & Onboarding at EQ Bank in Toronto."
    },
    {
      id: "fintech",
      keywords: ["fintech", "bank", "banking", "financial", "finance", "credit card", "credit", "debit", "regulated", "compliance", "eq bank", "pc financial", "president's choice", "finlabs"],
      answer: "Khushboo has deep fintech experience: she currently leads acquisition & onboarding product at EQ Bank, spent 3+ years at President's Choice Financial driving digital growth for credit and debit products, and started her career designing fintech interfaces at Finlabs India. She's shipped high-quality experiences in regulated environments, partnering closely with Risk, Legal, and Compliance throughout."
    },
    {
      id: "ai",
      keywords: ["ai", "artificial intelligence", "llm", "machine learning", "ml", "ai pm", "ai product", "genai", "signalbrief", "guardrails"],
      answer: "Khushboo holds an AI Product Management Certification from Product Faculty (Maven, 2026). Her capstone, SignalBrief, is an AI daily media brief tool for fintech comms leads — it cut a ~45-minute manual task to under 5 minutes using a Noise/Watch/Act/Crisis framework. Her AI PM approach emphasizes judgment, guardrails, and evaluation thinking, not just shipping features."
    },
    {
      id: "wins",
      keywords: ["wins", "achievements", "impact", "metrics", "results", "accomplishments", "biggest", "numbers", "outcomes", "success", "proud", "highlights"],
      answer: "Her biggest wins: enabled 2,000+ instant credit card activations with ~70% digital wallet adoption in 2 days; lifted digital application submissions ~10%; reduced key funnel drop-offs from ~8.1% to ~1.5%; delivered 1,993 MoM incremental applications via cross-sell mechanics; and drove a ~25% increase in customer satisfaction through dashboard/UX work."
    },
    {
      id: "zero-to-one",
      keywords: ["0 to 1", "zero to one", "0→1", "launch", "launches", "new product", "from scratch", "greenfield", "first"],
      answer: "Khushboo led the 0→1 launch of PC Financial's first fee-based credit card digital journey — from UX strategy through launch and optimization. She owned end-to-end discovery: user research, journey mapping, prototyping, testing, and stakeholder alignment across Marketing, Product, and Engineering."
    },
    {
      id: "design",
      keywords: ["design", "designer", "ux", "ui", "user experience", "research", "prototyping", "usability", "design system", "figma", "konnect", "mcdonald", "honda", "decathlon", "airport"],
      answer: "Before product management, Khushboo spent 6+ years as a Senior Product Designer at Konnect Insights, designing analytics dashboards for clients including McDonald's, Delhi Airport, Decathlon, and Honda. She built a scalable design system, led user research and usability testing, and her dashboard work drove a ~25% increase in customer satisfaction. That design foundation shapes how she builds products today."
    },
    {
      id: "leadership",
      keywords: ["leadership", "lead", "manage", "team", "work style", "how does she work", "collaborate", "stakeholder", "cross-functional", "prd", "roadmap", "prioritization", "executive"],
      answer: "Khushboo leads cross-functional pods (engineering, UX, content, SRE, analytics) and drives alignment through clear PRDs, trade-off narratives, and decision logs. She defines KPI frameworks to guide roadmaps, ships iteratively via experiments and rapid prototyping, and is known for executive-ready storytelling that brings Marketing, Product, and Engineering together."
    },
    {
      id: "education",
      keywords: ["education", "school", "university", "degree", "study", "studied", "college", "gpa", "seneca", "vancouver island"],
      answer: "Khushboo studied Project Management in Information Technology at Seneca Polytechnic (2022) and holds a Graduate Certificate in Business from Vancouver Island University (2021), where she earned a 4.11 GPA."
    },
    {
      id: "certifications",
      keywords: ["certification", "certified", "certificate", "award", "awards", "honors", "honours", "recognition", "td auto"],
      answer: "Khushboo holds an AI Product Management Certification from Product Faculty (Maven, 2026), among 7 total certifications. Her honors include the Annual Summit Winner 2022 at TD Auto Finance (a national win) and the Composite Award Q4 2022 — ranked 1st nationally in Canada for customer service."
    },
    {
      id: "skills",
      keywords: ["skills", "skill", "capabilities", "expertise", "tools", "what can she do", "strengths", "competencies"],
      answer: "Her skills span five areas: Product Leadership (strategy, roadmapping, prioritization, PRDs), Growth & Experimentation (acquisition, activation, funnel optimization, A/B testing), Design & Research (UX/UI, user research, design systems, data visualization), AI Product (AI PM, guardrails & evaluation thinking, rapid prototyping), and Collaboration (cross-functional leadership, executive storytelling, regulated environments)."
    },
    {
      id: "location",
      keywords: ["location", "where", "based", "toronto", "canada", "relocate", "remote", "hybrid", "available", "availability", "open to", "hiring", "opportunities"],
      answer: "Khushboo is based in Toronto, Ontario, Canada, and is open to hearing about interesting opportunities. Feel free to reach out at skhushboo71@gmail.com."
    },
    {
      id: "contact",
      keywords: ["contact", "email", "reach", "linkedin", "connect", "get in touch", "message", "call", "talk", "hire"],
      answer: "You can reach Khushboo at <a href=\"mailto:skhushboo71@gmail.com\">skhushboo71@gmail.com</a> or connect on <a href=\"https://www.linkedin.com/in/khushboo-sharma27\" target=\"_blank\" rel=\"noopener\">LinkedIn</a>. She'd love to hear from you."
    },
    {
      id: "languages",
      keywords: ["language", "languages", "speak", "hindi", "english", "bilingual"],
      answer: "Khushboo speaks English and Hindi."
    }
  ];

  var FALLBACK = "I can tell you about Khushboo's fintech and AI product experience, her biggest wins, her design background, education, or how to reach her. What would you like to know?";
  var GREETING = "Hi! I'm Khushboo's portfolio assistant. Ask me anything about her experience, wins, or background — or try one of these:";
  var CHIPS = [
    "What's her fintech experience?",
    "Tell me about her AI PM background",
    "What are her biggest wins?",
    "How can I contact her?"
  ];

  /* ----------------------------------------------------------
     Intent matching: lowercase message, score each topic by
     keyword hits (longer keywords weigh more), pick the best.
     ---------------------------------------------------------- */
  function matchIntent(message) {
    var text = message.toLowerCase();
    var best = null;
    var bestScore = 0;
    KNOWLEDGE_BASE.forEach(function (topic) {
      var score = 0;
      topic.keywords.forEach(function (kw) {
        // Word-boundary match (with optional plural) so "ai" doesn't
        // match inside "email", but "win" still matches "wins".
        var escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        var re = new RegExp("\\b" + escaped + "(s|es)?\\b");
        if (re.test(text)) {
          // Longer / multi-word keywords are more specific → weigh more.
          score += (kw.length > 6 || kw.indexOf(" ") !== -1) ? 2 : 1;
        }
      });
      if (score > bestScore) {
        bestScore = score;
        best = topic;
      }
    });
    return bestScore > 0 ? best.answer : FALLBACK;
  }

  /* ----------------------------------------------------------
     Chat widget UI
     ---------------------------------------------------------- */
  function buildWidget() {
    var fab = document.createElement("button");
    fab.className = "chat-fab";
    fab.setAttribute("aria-label", "Open chat — ask about Khushboo");
    fab.setAttribute("aria-expanded", "false");
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C6.5 3 2 6.9 2 11.7c0 2.2 1 4.2 2.6 5.7-.2 1.2-.8 2.4-1.6 3.3-.2.2 0 .6.3.6 1.9-.1 3.6-.8 4.9-1.7 1.2.4 2.5.6 3.8.6 5.5 0 10-3.9 10-8.7S17.5 3 12 3z"/></svg>';

    var panel = document.createElement("div");
    panel.className = "chat-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Ask about Khushboo");
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML =
      '<div class="chat-header">' +
      '  <div><h2>Ask about Khushboo</h2><span class="chat-sub">Instant answers, no waiting</span></div>' +
      '  <button class="chat-close" aria-label="Close chat">&times;</button>' +
      '</div>' +
      '<div class="chat-messages" role="log" aria-live="polite"></div>' +
      '<div class="chat-chips" role="group" aria-label="Suggested questions"></div>' +
      '<form class="chat-input-row">' +
      '  <input class="chat-input" type="text" placeholder="Ask a question…" aria-label="Type your question" autocomplete="off" />' +
      '  <button class="chat-send" type="submit" aria-label="Send message">' +
      '    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>' +
      '  </button>' +
      '</form>';

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    var messagesEl = panel.querySelector(".chat-messages");
    var chipsEl = panel.querySelector(".chat-chips");
    var form = panel.querySelector(".chat-input-row");
    var input = panel.querySelector(".chat-input");
    var closeBtn = panel.querySelector(".chat-close");
    var greeted = false;

    function addMessage(text, who) {
      var msg = document.createElement("div");
      msg.className = "chat-msg " + who;
      if (who === "bot") {
        msg.innerHTML = text; // bot answers are trusted, may contain links
      } else {
        msg.textContent = text;
      }
      messagesEl.appendChild(msg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
      var t = document.createElement("div");
      t.className = "chat-typing";
      t.setAttribute("aria-hidden", "true");
      t.innerHTML = "<span></span><span></span><span></span>";
      messagesEl.appendChild(t);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return t;
    }

    function botReply(userText) {
      var typing = showTyping();
      setTimeout(function () {
        typing.remove();
        addMessage(matchIntent(userText), "bot");
      }, 400);
    }

    function handleUserMessage(text) {
      if (!text.trim()) return;
      addMessage(text, "user");
      chipsEl.innerHTML = ""; // clear chips after first interaction
      botReply(text);
    }

    function renderChips() {
      chipsEl.innerHTML = "";
      CHIPS.forEach(function (chipText) {
        var chip = document.createElement("button");
        chip.className = "chat-chip";
        chip.type = "button";
        chip.textContent = chipText;
        chip.addEventListener("click", function () {
          handleUserMessage(chipText);
        });
        chipsEl.appendChild(chip);
      });
    }

    function openPanel() {
      panel.classList.add("open");
      panel.setAttribute("aria-hidden", "false");
      fab.setAttribute("aria-expanded", "true");
      if (!greeted) {
        greeted = true;
        addMessage(GREETING, "bot");
        renderChips();
      }
      input.focus();
    }

    function closePanel() {
      panel.classList.remove("open");
      panel.setAttribute("aria-hidden", "true");
      fab.setAttribute("aria-expanded", "false");
      fab.focus();
    }

    fab.addEventListener("click", function () {
      panel.classList.contains("open") ? closePanel() : openPanel();
    });
    closeBtn.addEventListener("click", closePanel);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("open")) closePanel();
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      handleUserMessage(input.value);
      input.value = "";
    });
  }

  /* ----------------------------------------------------------
     Nav: hamburger toggle + active page highlight
     ---------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    // Active page underline
    var current = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === current) a.setAttribute("aria-current", "page");
    });
  }

  /* ----------------------------------------------------------
     Fade-in on scroll (IntersectionObserver)
     ---------------------------------------------------------- */
  function initFadeIn() {
    var els = document.querySelectorAll(".fade-in");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ----------------------------------------------------------
     Hero tagline rotator
     ---------------------------------------------------------- */
  function initTagline() {
    var el = document.querySelector(".hero-tagline .rotator");
    if (!el) return;
    var phrases = ["Product Leader", "Digital Growth", "AI Product Management", "0→1 Launches"];
    var i = 0;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setInterval(function () {
      i = (i + 1) % phrases.length;
      el.style.animation = "none";
      void el.offsetWidth; // restart animation
      el.style.animation = "";
      el.textContent = phrases[i];
    }, 2800);
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildWidget();
    initNav();
    initFadeIn();
    initTagline();
  });
})();
