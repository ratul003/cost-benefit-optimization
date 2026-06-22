import CaseStudy, { type CaseStudyData } from "./CaseStudy";
import { PredictionCurves, CrossoverChart } from "./StackingCharts";

const data: CaseStudyData = {
  accent: "#f97316",
  accentRgb: "249, 115, 22",
  accentLight: "#fdba74",
  category: "Applied Analytics · On-Demand Marketplace",
  title: "Cost-Benefit Optimization of Order Stacking",
  tagline:
    "When a regional platform's central team pushed algorithmic order-stacking across every market to cut delivery cost, dense markets bled customer experience instead. This is the analysis that found where stacking stops paying for itself — and quantified the crossover in cost per order.",
  meta: [
    { label: "Company", value: "Regional food-delivery platform" },
    { label: "Region", value: "South Asia" },
    { label: "Window", value: "Jan–Dec 2022 · 16 wks" },
    { label: "Stack", value: "BigQuery · R · Tableau" },
  ],
  heroLogos: [
    { domain: "cloud.google.com", label: "BigQuery" },
    { domain: "tableau.com", label: "Tableau" },
    { domain: "r-project.org", label: "R" },
  ],
  source: [
    { label: "GitHub repository", href: "https://github.com/ratul003/Cost-Benefit-Optimization-Using-Predictive-Analytics" },
  ],
  sections: [
    // ── 01 ───────────────────────────────────────────────────────────────────
    {
      id: "overview",
      num: "01",
      label: "Overview",
      heading: "How much stacking is too much?",
      paras: [
        "Stacking lets one rider carry several orders on a single trip. It is the cheapest lever a delivery platform has: bundle two drop-offs and you roughly halve the pickup cost of the second order. So the instinct is to stack as aggressively as the dispatch algorithm allows.",
        "But every extra order on a trip adds detours, and detours add minutes. Past a point those minutes turn into late orders, refunds, compensation, complaints, and churn — costs that land on different P&L lines than rider pay, so they are easy to miss. The objective here was to find that point: the stacking level where the marginal saving stops covering the marginal damage.",
      ],
      blocks: [
        {
          type: "callout",
          text: "Stacking lowers rider cost per order — until the customer-experience cost it creates outweighs the saving. This project quantifies that crossover and converts it into a stacking target.",
        },
      ],
    },
    // ── 02 ───────────────────────────────────────────────────────────────────
    {
      id: "trigger",
      num: "02",
      label: "The trigger",
      heading: "A region-wide cost push that backfired",
      paras: [
        "In the first half of 2022 the platform's central team rolled a single cost-optimization playbook across 12 markets in the region: raise the dispatch algorithm's stacking priority everywhere, lift rider efficiency, drive rider cost per order down. One global setting, one direction.",
        "The impact was wildly heterogeneous. In low-density markets the economies of scale showed up as promised. In dense, traffic-heavy markets the same setting produced detours, late orders, and a wave of customer compensation — the saving evaporated while the damage compounded. Over five months in the market studied here:",
      ],
      blocks: [
        {
          type: "stats",
          items: [
            { value: "+56%", label: "Refund per order — driven by late-order complaints" },
            { value: "+17%", label: "Customer compensation per order" },
            { value: "+38%", label: "Delayed orders, in five months" },
            { value: "~0%", label: "Rider cost per order — the intended saving never landed" },
          ],
        },
        {
          type: "callout",
          text: "The million-dollar question: what stacking level minimizes cost while keeping a healthy customer experience? A one-size setting was the wrong tool — the answer is market-specific, and it has to be measured.",
        },
      ],
    },
    // ── 03 ───────────────────────────────────────────────────────────────────
    {
      id: "mechanism",
      num: "03",
      label: "The mechanism",
      heading: "The rider-assignment journey",
      paras: [
        "When two customers order from the same vendor in the same zone within a short window, the dispatch model can assign both to the rider closest to the vendor. The rider picks up both orders, then delivers to the first customer and on to the second. The \"stacking %\" is the share of deliveries bundled this way, split into single, double, and triple stacks.",
        "The upside is real: stacking saves roughly a quarter of the rider cost on the second order by collapsing its pickup leg, and it lifts orders completed per rider-hour. The downside is the second customer's order now waits through the first delivery's drop-off — added minutes that scale with how aggressively, and how deeply, you stack.",
      ],
      blocks: [
        {
          type: "twocol",
          left: {
            title: "Drives benefits",
            items: [
              "Rider cost per order (pickup leg shared)",
              "Orders completed per rider-hour",
              "Rider earnings per hour",
              "Fully-loaded gross profit per order",
              "Economies of scale at the zone level",
            ],
          },
          right: {
            title: "Drives costs",
            items: [
              "Delivery time / extreme-delay rate",
              "Reactive & proactive compensation",
              "Refund & wallet compensation",
              "Customer contact / incident rate",
              "Reorder rate, retention, churn",
            ],
          },
        },
      ],
    },
    // ── 04 ───────────────────────────────────────────────────────────────────
    {
      id: "data",
      num: "04",
      label: "Data & ETL",
      heading: "27 operational signals, one weekly panel",
      paras: [
        "The analytical dataset is a weekly country panel — 16 ISO weeks of own-delivery operations, 27 variables spanning demand, logistics, cost, and experience. It was assembled in BigQuery from six families of SQL extracts, each joining a different slice of the fulfillment warehouse, then centered and scaled in R before modeling.",
      ],
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { title: "Orders & seamless", desc: "Weekly orders, delivery time, delayed %, seamless-order %, stacking % by depth (single/double/triple).", tag: "lg_orders · pd_orders" },
            { title: "Riders & fill rate", desc: "Deliveries completed, rider fill rate, acceptance, total working hours, utilisation (UTR).", tag: "lg_shifts" },
            { title: "Surge & shrinkage", desc: "Weighted surge-time %, shrinkage-time %, and zone-closure % from demand-supply events.", tag: "das_events" },
            { title: "Reorder rates", desc: "7 / 30 / 60-day reorder behaviour against compensated orders — the retention signal.", tag: "compensation_events" },
            { title: "Rider economics", desc: "Earnings decomposed into basic, per-order, per-hour, per-km, scoring, quest and CSV components → rider CPO.", tag: "daily_rider_payments" },
            { title: "Refund & compensation", desc: "Voucher + wallet refunds and reactive/proactive compensation → refund & comp cost per order.", tag: "refund_events" },
          ],
        },
        {
          type: "tags",
          items: ["Delivery time", "Delayed %", "Stacked deliveries %", "Single/double/triple stack %", "Rider fill rate", "UTR", "Surge / shrinkage %", "CSAT", "AO-NPS", "Seamless %", "Auto-comp CPO", "Refund CPO", "Rider CPO", "Rider CPH", "Reorder 7/30/60d", "Churn"],
        },
      ],
    },
    // ── 05 ───────────────────────────────────────────────────────────────────
    {
      id: "method",
      num: "05",
      label: "Method",
      heading: "Direction, strength, and impact",
      paras: [
        "Rather than reading dashboards, each relationship between stacking % and an operational KPI was tested three ways: does a relationship exist, how strong is it, and what would a marginal change actually do?",
      ],
      blocks: [
        {
          type: "cards",
          items: [
            { title: "Covariance", desc: "Establish the direction of the relationship between stacking % and each operations metric." },
            { title: "Pearson correlation", desc: "Measure the strength of each relationship and test it against the 5% significance threshold." },
            { title: "Multi-linear regression", desc: "Predict the impact of an X-point change in stacking on delivery time and on each cost lever, with 95% confidence intervals." },
          ],
        },
      ],
    },
    // ── 06 ───────────────────────────────────────────────────────────────────
    {
      id: "correlation",
      num: "06",
      label: "Correlation",
      heading: "What moves with stacking",
      paras: [
        "Pearson correlations of each KPI against stacking %, with two-sided p-values. The pattern is unambiguous: stacking is strongly tied to longer delivery times, more delayed orders, lower CSAT, and higher refunds — every one of them statistically significant. Rider cost per order moves down, but only weakly.",
      ],
      blocks: [
        {
          type: "table",
          head: ["KPI vs stacking %", "Pearson r", "p-value", "Significant"],
          rows: [
            ["Delivery time", "+0.82", "0.0008", "yes ✦✦"],
            ["Delayed orders %", "+0.781", "0.0035", "yes ✦✦"],
            ["CSAT %", "−0.775", "0.0026", "yes ✦✦"],
            ["Refund cost / order", "+0.426", "0.0019", "yes ✦✦"],
            ["Rider cost / order", "−0.185", "0.0004", "yes ✦✦"],
            ["Compensation cost / order", "−0.27", "0.319", "no"],
            ["Reorder rate %", "−0.225", "0.33", "no"],
            ["Churn", "−0.133", "0.62", "no"],
          ],
          caption: "Pearson r against stacking %, weekly panel (n = 16). ✦✦ significant at p < 0.05.",
        },
        {
          type: "callout",
          text: "The benefit (lower rider cost) is real but small. The costs (delivery time, delays, lost satisfaction, refunds) are large and significant. The signs alone tell you the trade is asymmetric — the regressions tell you by how much.",
        },
      ],
    },
    // ── 07 ───────────────────────────────────────────────────────────────────
    {
      id: "models",
      num: "07",
      label: "Models",
      heading: "Four regressions, and where to trust them",
      paras: [
        "Each cost lever was regressed on stacking depth (single/double/triple, log-transformed) alongside operational controls — fill rate, UTR, working hours, distance, surge/shrinkage, churn, and reorder behaviour. Fit statistics:",
      ],
      blocks: [
        {
          type: "table",
          head: ["Model — target", "R²", "Adj. R²", "F", "p"],
          rows: [
            ["m1 — Delivery time", "0.997", "0.984", "78.6", "0.0021"],
            ["m2 — Rider cost / order", "0.916", "0.686", "3.98", "0.097"],
            ["m3 — Auto-compensation / order", "0.982", "0.912", "13.9", "0.026"],
            ["m4 — Refund cost / order", "0.975", "0.907", "14.3", "0.010"],
          ],
          caption: "Multi-linear regression fits. High R² with 16 observations and 11–12 predictors leaves only 3–4 residual degrees of freedom.",
        },
        {
          type: "callout",
          text: "Honest reliability note: with 16 weeks and a dozen predictors, R² near 0.99 is partly overfit and confidence intervals are wide. The auto-compensation model (m3) is the worst offender — it predicts negative compensation above the baseline, which is impossible. So the defensible cost story rests on the two stable, sign-correct, monotonic models: delivery time (m1) and refund cost (m4).",
        },
        {
          type: "list",
          items: [
            "Delivery time rises with stacking and is the most reliable model (adj. R² 0.98) — the cleanest evidence of the cost.",
            "Refund cost rises monotonically with stacking; daily working hours is the only individually-significant control, but the stacking-depth terms move it the right way.",
            "Rider cost per order falls, but the model is weak (F p = 0.097) and the predicted saving is tiny — consistent with the experiment's \"rider CPO was stagnant\" outcome.",
            "Triple-stacking carries the heaviest delivery-time and refund penalties of any depth — deep stacks are where the damage concentrates.",
          ],
        },
      ],
    },
    // ── 08 ───────────────────────────────────────────────────────────────────
    {
      id: "predictions",
      num: "08",
      label: "Predictions",
      heading: "What a stacking change does",
      paras: [
        "Holding every other operational input at its status-quo level and moving only overall stacking, the models predict the following (fit, with 95% confidence interval). The status quo is ~24% stacking, ~26-minute delivery time.",
      ],
      blocks: [
        {
          type: "table",
          head: ["Stacking", "Delivery time (min)", "Rider cost / order", "Refund cost / order"],
          rows: [
            ["19%  (−5)", "24.8  (21.1–28.6)", "32.49  (26.6–38.4)", "0.64  (0.20–1.08)"],
            ["24%  (base)", "26.3  (24.3–28.3)", "32.38  (26.6–38.2)", "0.94  (0.44–1.44)"],
            ["29%  (+5)", "27.5  (26.1–28.9)", "32.28  (26.5–38.1)", "1.18  (0.35–2.01)"],
            ["34%  (+10)", "28.6  (26.4–30.7)", "32.21  (26.4–38.0)", "1.39  (0.23–2.54)"],
            ["39%  (+15)", "29.5  (26.0–33.1)", "32.19  (26.4–38.0)", "1.59  (0.12–3.06)"],
          ],
          caption: "Predicted KPI levels at each overall stacking %, other inputs held at status quo. Cost in local currency per order.",
        },
        { type: "node", node: <PredictionCurves /> },
      ],
    },
    // ── 09 ───────────────────────────────────────────────────────────────────
    {
      id: "synthesis",
      num: "09",
      label: "Cost-benefit",
      heading: "Where stacking stops paying for itself",
      paras: [
        "The predictions become a decision once you net them against each other. Define the per-order benefit of a stacking level s, relative to the 24% baseline, as the rider-cost saving it produces minus the refund cost it adds:",
      ],
      blocks: [
        {
          type: "math",
          items: [
            {
              tex: "\\text{Net}(s)=\\underbrace{\\big[\\hat r(24)-\\hat r(s)\\big]}_{\\text{rider-cost saving}}-\\underbrace{\\big[\\hat f(s)-\\hat f(24)\\big]}_{\\text{refund-cost increase}}",
              note: "r̂ = predicted rider cost per order, f̂ = predicted refund cost per order. Positive Net = cheaper than the status quo.",
            },
            {
              tex: "\\text{Net}(29\\%)=\\big[32.38-32.28\\big]-\\big[1.18-0.94\\big]=0.092-0.243=-0.151",
              note: "Stepping stacking up 5 points: the refund increase alone is ~2.7× the rider saving — before counting any delivery-time-driven compensation, contacts, or churn.",
            },
          ],
        },
        {
          type: "table",
          head: ["Stacking", "Rider saving", "Refund cost", "Net / order"],
          rows: [
            ["19%  (−5)", "−0.118", "−0.298", "+0.179"],
            ["24%  (base)", "0.000", "0.000", "0.000"],
            ["29%  (+5)", "+0.092", "+0.243", "−0.151"],
            ["34%  (+10)", "+0.166", "+0.449", "−0.282"],
            ["39%  (+15)", "+0.190", "+0.648", "−0.459"],
          ],
          caption: "Net per-order economics vs the 24% baseline (local currency). Positive = cheaper than status quo. Rider saving is the cost avoided; refund cost is the cost added.",
        },
        { type: "node", node: <CrossoverChart /> },
        {
          type: "callout",
          text: "The crossover sits at or below the status quo. Every step up in stacking is net-negative, and the curve only turns positive by moving down toward ~19–20%. And this is the conservative view — it ignores the delivery-time channel that feeds compensation, contacts, and churn, all of which steepen the loss.",
        },
      ],
    },
    // ── 10 ───────────────────────────────────────────────────────────────────
    {
      id: "recommendation",
      num: "10",
      label: "Recommendation",
      heading: "Hold the line at 20–24%",
      paras: [
        "The recommendation back to the central team: stop treating stacking as a global dial to maximize. In this market the healthy balance between cost and logistics performance sits in a 20–24% overall stacking band — at the low end of where the platform already was, and well below where the region-wide push was driving it.",
        "Below ~19% the rider economies of scale start to erode and confidence intervals widen; above ~24% the refund-and-experience cost overruns the rider saving. The band is the answer, not a single point — and it is the opposite of \"stack as much as possible.\"",
      ],
      blocks: [
        {
          type: "steps",
          items: [
            { n: "1", title: "Identify the problem", desc: "A region-wide stacking push degrading delivery time and inflating refunds in dense markets." },
            { n: "2", title: "Consult stakeholders", desc: "Align central dispatch, local operations, and finance on the cost levers that actually moved." },
            { n: "3", title: "Pinpoint with analytics", desc: "Correlation, regression, and a netted cost-benefit model to locate the crossover." },
            { n: "4", title: "Drive the narrative", desc: "Carry the empirical case — 20–24% target — into the dispatch configuration decision." },
            { n: "5", title: "Protect retention", desc: "Frame the target around reorder rate and experience for long-term growth, not a one-quarter cost cut." },
          ],
        },
        {
          type: "callout",
          text: "The same arithmetic generalizes: the optimal stacking level is wherever the marginal rider saving equals the marginal experience cost — and that point is denser-market-specific, not a regional constant. A global setting was always going to be wrong somewhere.",
        },
      ],
    },
    // ── 11 ───────────────────────────────────────────────────────────────────
    {
      id: "stack",
      num: "11",
      label: "Stack",
      heading: "Tools & references",
      blocks: [
        { type: "tags", items: ["Google BigQuery", "Standard SQL", "R / RMarkdown", "lm() multi-linear regression", "Pearson correlation", "Tableau", "Cost-benefit analysis", "Operations analytics"] },
        {
          type: "refs",
          items: [
            "Project repository — SQL extracts, R modeling (RMarkdown), and stakeholder deck. github.com/ratul003/Cost-Benefit-Optimization-Using-Predictive-Analytics",
            "Models m1–m4: multi-linear regressions of delivery time and cost-per-order levers on stacking depth and operational controls, weekly panel n = 16, Jan–Dec 2022.",
            "Cost-benefit synthesis: net per-order economics derived from m2 (rider cost) and m4 (refund cost) predictions, relative to the 24% status quo.",
          ],
        },
      ],
    },
  ],
  related: [
    { label: "Modeling Directional Dependence (Thesis)", href: "https://research-directional-dependence.vercel.app" },
    { label: "Directional Dependence via Copulas (HHMI)", href: "https://research-copulas-directional-depend.vercel.app" },
    { label: "Cognitive Change & NHANES (UROP)", href: "https://research-nhanes-cognitive.vercel.app" },
    { label: "Portfolio home", href: "https://wahid-ratul.vercel.app" },
  ],
};

export default function Page() {
  return <CaseStudy data={data} />;
}
