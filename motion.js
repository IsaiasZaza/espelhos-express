/* Espelhos Express — um momento autoral: a fila de placas entra no cavalete
   e o reflexo acompanha o cursor. O resto só desenha as linhas do romaneio. */
(function () {
  // Links que abrem em nova aba avisam leitores de tela
  document.querySelectorAll('a[target="_blank"]').forEach((a) => {
    const s = document.createElement("span");
    s.className = "sr-only";
    s.textContent = " (abre em nova aba)";
    a.appendChild(s);
  });

  // Cabeçalho fixo: ganha fundo ao rolar, para o botão do Instagram ficar sempre à mão
  const top = document.querySelector(".top");
  const syncTop = () => top.classList.toggle("is-stuck", window.scrollY > 24);
  syncTop();
  window.addEventListener("scroll", syncTop, { passive: true });

  // Fila rolável no celular: só entra na ordem de tabulação quando realmente rola
  const rack = document.querySelector(".rack");
  const syncRack = () => {
    if (rack.scrollWidth > rack.clientWidth + 1) rack.setAttribute("tabindex", "0");
    else rack.removeAttribute("tabindex");
  };
  syncRack();
  window.addEventListener("resize", syncRack);

  if (!window.gsap) return;
  gsap.registerPlugin(window.ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const hero = document.querySelector(".hero");
    const plates = gsap.utils.toArray(".unit");

    // Placas sobem para dentro do cavalete, uma depois da outra, da esquerda para a direita
    gsap.from(plates, {
      yPercent: 115,
      duration: 0.9,
      ease: "power4.out",
      stagger: 0.09,
      delay: 0.1,
    });
    gsap.from(".tag", { autoAlpha: 0, y: 8, duration: 0.45, ease: "power3.out", stagger: 0.09, delay: 0.7 });

    // Título entra por linha, de dentro da máscara
    gsap.from(".line__in", { yPercent: 105, duration: 0.8, ease: "power4.out", stagger: 0.08 });
    gsap.from(".hero__lead, .hero__actions, .top", { autoAlpha: 0, y: 12, duration: 0.6, ease: "power3.out", stagger: 0.08, delay: 0.35 });

    // Reflexo que acompanha o cursor (só em ponteiro fino)
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      gsap.set(hero, { "--gx": 0.5 });
      const setGx = gsap.quickTo(hero, "--gx", { duration: 0.7, ease: "power3.out" });
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        setGx(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
      });
    }

    // Linhas do romaneio são "escritas" ao entrar
    gsap.utils.toArray(".field").forEach((el, i) => {
      gsap.fromTo(el, { "--rule": 0 }, {
        "--rule": 1, duration: 0.7, ease: "power3.out", delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });
  });
})();
