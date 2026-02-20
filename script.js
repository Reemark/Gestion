const financialData = [
  {
    timestamp: "2023-01-10 08:00:00",
    sales_amount: 5000,
    successful_orders: 100,
    failed_orders: 10,
    total_visitors: 1000,
  },
  {
    timestamp: "2023-01-10 09:00:00",
    sales_amount: 2000,
    successful_orders: 40,
    failed_orders: 60,
    total_visitors: 2000,
  },
  {
    timestamp: "2023-01-10 10:00:00",
    sales_amount: 3000,
    successful_orders: 60,
    failed_orders: 40,
    total_visitors: 1500,
  },
];

const socialData = [
  { sentiment: "negatif" },
  { sentiment: "negatif" },
  { sentiment: "positif" },
];

function computeKpis() {
  const totalSales = financialData.reduce((sum, d) => sum + d.sales_amount, 0);
  const totalSuccess = financialData.reduce(
    (sum, d) => sum + d.successful_orders,
    0
  );
  const totalFailed = financialData.reduce((sum, d) => sum + d.failed_orders, 0);
  const totalVisitors = financialData.reduce(
    (sum, d) => sum + d.total_visitors,
    0
  );

  const conversionRate = (totalSuccess / totalVisitors) * 100;
  const failRate = (totalFailed / (totalSuccess + totalFailed)) * 100;
  const negativeRate =
    (socialData.filter((d) => d.sentiment === "negatif").length /
      socialData.length) *
    100;

  return [
    {
      label: "CA observé (échantillon)",
      target: totalSales,
      decimals: 0,
      prefix: "",
      suffix: " EUR",
      hint: "données fictives fournies",
    },
    {
      label: "Taux d'échec commandes",
      target: failRate,
      decimals: 1,
      prefix: "",
      suffix: "%",
      hint: `${totalFailed} échecs / ${totalSuccess + totalFailed} tentatives`,
    },
    {
      label: "Conversion visiteurs",
      target: conversionRate,
      decimals: 1,
      prefix: "",
      suffix: "%",
      hint: `${totalSuccess} commandes réussies`,
    },
    {
      label: "Sentiment négatif social",
      target: negativeRate,
      decimals: 0,
      prefix: "",
      suffix: "%",
      hint: "pression réputationnelle élevée",
    },
  ];
}

function formatCount(value, decimals, prefix = "", suffix = "") {
  const formatted = value.toLocaleString("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${prefix}${formatted}${suffix}`;
}

function animateCountup(el, options = {}) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const target = Number(options.target ?? el.dataset.target ?? 0);
  const decimals = Number(options.decimals ?? el.dataset.decimals ?? 0);
  const prefix = options.prefix ?? el.dataset.prefix ?? "";
  const suffix = options.suffix ?? el.dataset.suffix ?? "";
  const duration = prefersReducedMotion ? 0 : Number(options.duration ?? 1200);

  if (!Number.isFinite(target)) return;

  if (duration <= 0) {
    el.textContent = formatCount(target, decimals, prefix, suffix);
    return;
  }

  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = formatCount(current, decimals, prefix, suffix);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function renderKpis() {
  const node = document.getElementById("kpis");
  const kpis = computeKpis();

  node.innerHTML = kpis
    .map(
      (kpi) => `
      <article class="metric">
        <p class="label">${kpi.label}</p>
        <p
          class="value countup-inline"
          data-target="${kpi.target}"
          data-decimals="${kpi.decimals}"
          data-prefix="${kpi.prefix}"
          data-suffix="${kpi.suffix}"
        >0</p>
        <p class="hint">${kpi.hint}</p>
      </article>
    `
    )
    .join("");

  node.querySelectorAll(".countup-inline").forEach((el, index) => {
    animateCountup(el, { duration: 1000 + index * 160 });
  });
}

function renderInlineCountups() {
  document.querySelectorAll(".countup-inline[data-target]").forEach((el, index) => {
    if (el.closest("#kpis")) return;
    animateCountup(el, { duration: 900 + index * 120 });
  });
}

renderKpis();
renderInlineCountups();
