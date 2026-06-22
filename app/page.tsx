import CaseStudy, { type CaseStudyData } from "./CaseStudy";
import { PredictionCurves, CrossoverChart } from "./StackingCharts";
import StackingExplorer from "./StackingExplorer";
import AssignmentFlow from "./AssignmentFlow";
import CorrelationBars from "./CorrelationBars";
import ImpactTrend from "./ImpactTrend";
import ScaleBand from "./ScaleBand";
import PipelineFlow from "./PipelineFlow";

const data: CaseStudyData = {
  accent: "#f97316",
  accentRgb: "249, 115, 22",
  accentLight: "#fdba74",
  category: "Applied Analytics · On-Demand Marketplace",
  title: "Cost-Benefit Optimization of Order Assignment in On-Demand Marketplace",
  tagline:
    "A regional marketplace pushed algorithmic order-stacking across every market to cut delivery cost. In dense cities it backfired. I found the stacking band that protects margin and experience at once, then built the data infrastructure that holds it across 65 cities and 20,000 riders.",
  meta: [
    { label: "Company", value: "Regional on-demand marketplace" },
    { label: "Scale", value: "1M+ orders, 65 cities" },
    { label: "Window", value: "Jan to Dec 2022" },
    { label: "Stack", value: "BigQuery, R, Tableau" },
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
        "Stacking lets one rider carry several orders on a single trip. Bundle two drop-offs and the second order's pickup cost nearly vanishes, so the instinct is to stack as hard as the dispatch algorithm allows.",
        "That instinct has a ceiling. Past a point the detours become late orders, refunds, and churn, costs that land on different P&L lines than rider pay and slip by unnoticed. I set out to find the ceiling, price it, and turn it into a setting the platform could actually hold.",
      ],
      blocks: [
        {
          type: "callout",
          text: "Stacking lowers rider cost per order, until the experience cost it creates outweighs the saving. This work finds that crossover, then turns it into a per-city stacking target that holds at scale.",
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
        "In early 2022 the central team rolled one cost playbook across 12 markets: raise stacking priority everywhere, lift rider efficiency, push rider cost per order down. One global dial, turned in one direction.",
        "Geography split the outcome. Low-density markets banked the economies of scale. Dense, traffic-heavy cities got detours, late orders, and a wave of compensation instead. Over five months in the market I studied, the costs ran the wrong way:",
      ],
      blocks: [
        {
          type: "stats",
          items: [
            { value: "+56%", label: "Refund per order, from late-order complaints" },
            { value: "+17%", label: "Customer compensation per order" },
            { value: "+38%", label: "Delayed orders, over five months" },
            { value: "~0%", label: "Rider cost per order, the saving never landed" },
          ],
        },
        { type: "node", node: <ImpactTrend /> },
        {
          type: "callout",
          text: "The fix was never a better global number. The optimal stacking level is city-specific, so it has to be measured first, then governed.",
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
        "When two customers order from the same vendor in the same zone within a short window, dispatch can hand both to the rider closest to the vendor. One pickup, then two drop-offs in sequence. The stacking percentage is the share of deliveries bundled this way, split into single, double, and triple stacks.",
        "The upside is real. A shared pickup saves about a quarter of the rider cost on the second order and lifts orders per rider-hour. The catch sits downstream: the second customer waits through the first drop-off, and delivery time grows with every extra stop.",
      ],
      blocks: [
        { type: "node", node: <AssignmentFlow /> },
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
              "Delivery time and extreme-delay rate",
              "Reactive and proactive compensation",
              "Refund and wallet compensation",
              "Customer contact and incident rate",
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
        "The dataset is a weekly panel: 16 ISO weeks of own-delivery operations, 27 variables across demand, logistics, cost, and experience. I built it in BigQuery from six SQL extracts, each joining a different slice of the fulfillment warehouse, then centered and scaled it in R before modeling.",
      ],
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { title: "Orders & seamless", desc: "Weekly orders, delivery time, delayed %, seamless-order %, and stacking % by depth (single, double, triple).", tag: "lg_orders, pd_orders" },
            { title: "Riders & fill rate", desc: "Deliveries completed, rider fill rate, acceptance, total working hours, utilisation (UTR).", tag: "lg_shifts" },
            { title: "Surge & shrinkage", desc: "Weighted surge-time %, shrinkage-time %, and zone-closure % from demand-supply events.", tag: "das_events" },
            { title: "Reorder rates", desc: "7, 30, and 60-day reorder behavior against compensated orders, the retention signal.", tag: "compensation_events" },
            { title: "Rider economics", desc: "Earnings split into basic, per-order, per-hour, per-km, scoring, quest, and CSV components, rolled up to rider CPO.", tag: "daily_rider_payments" },
            { title: "Refund & compensation", desc: "Voucher and wallet refunds plus reactive and proactive compensation, rolled up to cost per order.", tag: "refund_events" },
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
        "I tested each link between stacking and a KPI three ways: whether it exists, how strong it is, and what a marginal move would do.",
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
        "Pearson correlations against stacking, with two-sided p-values. The pattern is clean. Stacking tracks longer delivery times, more delays, lower CSAT, and higher refunds, every one significant. Rider cost per order edges down, but only weakly.",
      ],
      blocks: [
        {
          type: "table",
          head: ["KPI vs stacking %", "Pearson r", "p-value", "Significant"],
          rows: [
            ["Delivery time", "+0.82", "0.0008", "yes ✦✦"],
            ["Delayed orders %", "+0.781", "0.0035", "yes ✦✦"],
            ["CSAT %", "-0.775", "0.0026", "yes ✦✦"],
            ["Refund cost / order", "+0.426", "0.0019", "yes ✦✦"],
            ["Rider cost / order", "-0.185", "0.0004", "yes ✦✦"],
            ["Compensation cost / order", "-0.27", "0.319", "no"],
            ["Reorder rate %", "-0.225", "0.33", "no"],
            ["Churn", "-0.133", "0.62", "no"],
          ],
          caption: "Pearson r against stacking %, weekly panel (n = 16). ✦✦ significant at p < 0.05.",
        },
        { type: "node", node: <CorrelationBars /> },
        {
          type: "callout",
          text: "The benefit is real and small. The costs are large and significant. The signs alone show an asymmetric trade. The regressions put numbers on it.",
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
        "I regressed each cost lever on stacking depth (single, double, triple, log-transformed) alongside operational controls: fill rate, UTR, working hours, distance, surge and shrinkage, churn, and reorder behavior. The fits:",
      ],
      blocks: [
        {
          type: "table",
          head: ["Model (target)", "R²", "Adj. R²", "F", "p"],
          rows: [
            ["m1, Delivery time", "0.997", "0.984", "78.6", "0.0021"],
            ["m2, Rider cost / order", "0.916", "0.686", "3.98", "0.097"],
            ["m3, Auto-compensation / order", "0.982", "0.912", "13.9", "0.026"],
            ["m4, Refund cost / order", "0.975", "0.907", "14.3", "0.010"],
          ],
          caption: "Multi-linear regression fits. With 16 observations and 11 to 12 predictors, only 3 to 4 residual degrees of freedom remain.",
        },
        {
          type: "callout",
          text: "Reliability, stated up front: with 16 weeks and a dozen predictors, an R-squared near 0.99 is partly overfit and the intervals are wide. The auto-compensation model even predicts negative compensation above baseline, which is impossible. So I lean on the two stable, sign-correct models: delivery time and refund cost.",
        },
        {
          type: "list",
          items: [
            "Delivery time rises with stacking and is the most reliable model (adjusted R-squared 0.98), the cleanest evidence of the cost.",
            "Refund cost rises monotonically with stacking. Daily working hours is the only individually significant control, but the stacking-depth terms still push it the right way.",
            "Rider cost per order falls, yet the model is weak (F p = 0.097) and the predicted saving is tiny, matching the rollout's stagnant rider CPO.",
            "Triple stacks carry the heaviest delivery-time and refund penalties of any depth. Deep stacks are where the damage concentrates.",
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
        "Holding every other input at status quo and moving only overall stacking, the models predict the following, with 95% confidence intervals. Status quo is about 24% stacking and a 26-minute delivery time.",
      ],
      blocks: [
        {
          type: "table",
          head: ["Stacking", "Delivery time (min)", "Rider cost / order", "Refund cost / order"],
          rows: [
            ["19% (-5)", "24.8 (21.1-28.6)", "32.49 (26.6-38.4)", "0.64 (0.20-1.08)"],
            ["24% (base)", "26.3 (24.3-28.3)", "32.38 (26.6-38.2)", "0.94 (0.44-1.44)"],
            ["29% (+5)", "27.5 (26.1-28.9)", "32.28 (26.5-38.1)", "1.18 (0.35-2.01)"],
            ["34% (+10)", "28.6 (26.4-30.7)", "32.21 (26.4-38.0)", "1.39 (0.23-2.54)"],
            ["39% (+15)", "29.5 (26.0-33.1)", "32.19 (26.4-38.0)", "1.59 (0.12-3.06)"],
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
        "The predictions become a decision once you net them. Drag the control to set any stacking level and the per-order economics resolve live. The formula below is what it computes.",
      ],
      blocks: [
        { type: "node", node: <StackingExplorer /> },
        {
          type: "math",
          items: [
            {
              tex: "\\text{Net}(s)=\\underbrace{\\big[\\hat r(24)-\\hat r(s)\\big]}_{\\text{rider-cost saving}}-\\underbrace{\\big[\\hat f(s)-\\hat f(24)\\big]}_{\\text{refund-cost increase}}",
              note: "r-hat is predicted rider cost per order, f-hat is predicted refund cost per order. A positive Net means cheaper than status quo.",
            },
            {
              tex: "\\text{Net}(29\\%)=\\big[32.38-32.28\\big]-\\big[1.18-0.94\\big]=0.092-0.243=-0.151",
              note: "Stepping stacking up 5 points, the refund increase alone is about 2.7 times the rider saving, before counting any delivery-time-driven compensation, contacts, or churn.",
            },
          ],
        },
        {
          type: "table",
          head: ["Stacking", "Rider saving", "Refund cost", "Net / order"],
          rows: [
            ["19% (-5)", "-0.118", "-0.298", "+0.179"],
            ["24% (base)", "0.000", "0.000", "0.000"],
            ["29% (+5)", "+0.092", "+0.243", "-0.151"],
            ["34% (+10)", "+0.166", "+0.449", "-0.282"],
            ["39% (+15)", "+0.190", "+0.648", "-0.459"],
          ],
          caption: "Net per-order economics vs the 24% baseline (local currency). Positive means cheaper than status quo. Rider saving is the cost avoided, refund cost is the cost added.",
        },
        { type: "node", node: <CrossoverChart /> },
        {
          type: "callout",
          text: "The crossover sits at or below status quo. Every step up is net negative, and the curve only turns positive by moving down toward 19 to 20%. This is the optimistic read: it leaves out the delivery-time channel that feeds compensation and churn, which steepens the loss.",
        },
      ],
    },
    // ── 10 ───────────────────────────────────────────────────────────────────
    {
      id: "recommendation",
      num: "10",
      label: "Recommendation",
      heading: "Hold the band at 20 to 24%",
      paras: [
        "My recommendation to the central team was direct: stop treating stacking as a global dial to maximize. In this market the healthy balance sits in a 20 to 24% band, the low end of where the platform already ran, and well under where the push was driving it.",
        "Below 19% the economies of scale erode and the intervals widen. Above 24% the refund and experience cost overruns the rider saving. The answer is a band, set per city, not one number stamped across a region.",
      ],
      blocks: [
        {
          type: "steps",
          items: [
            { n: "1", title: "Frame the problem", desc: "A region-wide stacking push lifting delivery time and refunds in dense cities." },
            { n: "2", title: "Align stakeholders", desc: "Get central dispatch, local operations, and finance onto the cost levers that actually moved." },
            { n: "3", title: "Pinpoint with analytics", desc: "Correlation, regression, and a netted cost-benefit model to locate the crossover." },
            { n: "4", title: "Carry the evidence", desc: "Take the 20 to 24% target into the dispatch configuration decision." },
            { n: "5", title: "Protect retention", desc: "Anchor the target on reorder rate and experience for durable growth, not a one-quarter cut." },
          ],
        },
        {
          type: "callout",
          text: "The arithmetic generalizes. The optimal stacking level is wherever the marginal rider saving meets the marginal experience cost, and that point moves with city density. A single global setting was always going to miss somewhere.",
        },
      ],
    },
    // ── 11 ───────────────────────────────────────────────────────────────────
    {
      id: "scale",
      num: "11",
      label: "At scale",
      heading: "Built to scale, not to sit in a deck",
      paras: [
        "A finding in a slide changes nothing on its own. What made this stick was the infrastructure behind it. The same six BigQuery extracts feed the weekly panel, the models re-fit on a schedule, and the resulting band lands in a Tableau view that dispatch and operations actually open. The target stays honest because the measurement never stops.",
        "On that footing the framework moved past the original 16-week study and into production: more than 1,000,000 orders, 65 cities, and roughly 20,000 riders, each city carrying its own band instead of a borrowed one.",
      ],
      blocks: [
        { type: "node", node: <ScaleBand /> },
        { type: "node", node: <PipelineFlow /> },
        {
          type: "callout",
          text: "The win was not a one-off cost cut. It was a repeatable system: measure the crossover per city, set the band, watch it weekly, adjust. That is what turns an analysis into an operating capability.",
        },
      ],
    },
    // ── 12 ───────────────────────────────────────────────────────────────────
    {
      id: "stack",
      num: "12",
      label: "Stack",
      heading: "Tools and references",
      blocks: [
        { type: "tags", items: ["Google BigQuery", "Standard SQL", "R / RMarkdown", "lm() multi-linear regression", "Pearson correlation", "Tableau", "Cost-benefit analysis", "Operations analytics"] },
        {
          type: "refs",
          items: [
            "Project repository: SQL extracts, R modeling (RMarkdown), and the stakeholder deck. github.com/ratul003/Cost-Benefit-Optimization-Using-Predictive-Analytics",
            "Models m1 to m4: multi-linear regressions of delivery time and cost-per-order levers on stacking depth and operational controls, weekly panel n = 16, Jan to Dec 2022.",
            "Cost-benefit synthesis: net per-order economics from the m2 (rider cost) and m4 (refund cost) predictions, relative to the 24% status quo.",
            "Production rollout: framework extended to 1,000,000+ orders, 65 cities, and roughly 20,000 riders, refreshed weekly.",
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
