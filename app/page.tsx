import CaseStudy, { type CaseStudyData } from "./CaseStudy";

const data: CaseStudyData = {
  accent: "#f97316",
  accentRgb: "249, 115, 22",
  accentLight: "#fdba74",
  category: "Applied Analytics · foodpanda | Delivery Hero · Bangladesh",
  title: "Cost-Benefit Optimization of Order Stacking",
  tagline:
    "Finding the stacking level where algorithmic order assignment stops paying for itself, quantifying the trade between delivery cost and customer experience across the largest food-delivery platform in Bangladesh.",
  meta: [
    { label: "Company", value: "foodpanda | Delivery Hero" },
    { label: "Region", value: "Bangladesh" },
    { label: "Window", value: "Jan-Dec 2022" },
    { label: "Stack", value: "BigQuery · R · Tableau" },
  ],
  heroLogos: [
    { domain: "foodpanda.com", label: "foodpanda" },
    { domain: "cloud.google.com", label: "BigQuery" },
    { domain: "tableau.com", label: "Tableau" },
    { domain: "r-project.org", label: "R" },
  ],
  source: [
    { label: "GitHub repository", href: "https://github.com/ratul003/Cost-Benefit-Optimization-Using-Predictive-Analytics" },
  ],
  sections: [
    {
      id: "overview",
      num: "01",
      label: "Overview",
      heading: "How much stacking is too much?",
      paras: [
        "Built at foodpanda | Delivery Hero in Bangladesh, the country's largest food-delivery platform, as part of an initiative to drive top-line profitability while keeping a healthy customer experience at optimal cost efficiency.",
        "The objective: determine the optimal \"ML algorithmic order assignment\" stacking levels using cost-benefit analysis. Stacking is efficient for riders and cheaper per order, but pushed too far it degrades delivery times and customer experience. The question is where the line sits.",
      ],
      blocks: [
        {
          type: "callout",
          text: "Stacking lowers rider cost per order, until the customer-experience cost it creates outweighs the saving. The project quantifies that crossover.",
        },
      ],
    },
    {
      id: "concept",
      num: "02",
      label: "The mechanism",
      heading: "The rider-assignment journey",
      paras: [
        "Stacking means a single rider carries multiple orders on one trip. The dispatch algorithm decides how aggressively to bundle orders together, the \"stacking %\". Higher stacking improves rider efficiency and cost per order, but adds pickup and drop-off detours that can extend delivery time and trigger compensation, refunds, and customer complaints.",
      ],
    },
    {
      id: "stages",
      num: "03",
      label: "Approach",
      heading: "Three stages",
      blocks: [
        {
          type: "steps",
          items: [
            { n: "1", title: "Data, ETL", desc: "Extract and transform operational data in SQL on Google BigQuery." },
            { n: "2", title: "Statistical modeling", desc: "Quantify relationships between stacking % and operational KPIs in R (RMarkdown)." },
            { n: "3", title: "Project management & execution", desc: "Translate findings into stakeholder slides and an action plan with the central operations team." },
          ],
        },
      ],
    },
    {
      id: "tradeoff",
      num: "04",
      label: "The trade",
      heading: "Benefits vs. costs",
      blocks: [
        {
          type: "twocol",
          left: {
            title: "Drive benefits",
            items: [
              "Fully-loaded gross profit per order",
              "Customer experience",
              "Customer reorder rates",
              "Rider efficiency rate",
              "Seamless, on-time orders",
            ],
          },
          right: {
            title: "Lower costs",
            items: [
              "Reactive & proactive compensation",
              "Refund & wallet compensation",
              "Rider payments",
              "Extreme-delay & late-order rates",
              "Customer contact / incident rate",
            ],
          },
        },
      ],
    },
    {
      id: "method",
      num: "05",
      label: "Method",
      heading: "Direction, strength, and impact",
      paras: [
        "Rather than eyeballing dashboards, the analysis measured the relationship between stacking % and each operational KPI three ways, testing whether a relationship exists, how strong it is, and what a marginal change would do.",
      ],
      blocks: [
        {
          type: "cards",
          items: [
            { title: "Covariance test", desc: "Establish the direction of the relationship between stacking % and each operations metric." },
            { title: "Pearson correlation", desc: "Measure the strength of each relationship and its confidence interval." },
            { title: "Multi-linear regression", desc: "Predict the impact of an X% increase in stacking on top-line metrics." },
          ],
        },
      ],
    },
    {
      id: "relationships",
      num: "06",
      label: "Analysis",
      heading: "Four relationships, each fully modeled",
      paras: [
        "For each pair, the deck carried a correlation matrix, a regression output, and a graph, so stakeholders could see direction, strength, and predicted impact together.",
      ],
      blocks: [
        {
          type: "list",
          items: [
            "Stacking % vs. delivery time",
            "Stacking % vs. compensation cost per order",
            "Stacking % vs. refund cost per order",
            "Stacking % vs. rider cost per order",
          ],
        },
      ],
    },
    {
      id: "impact",
      num: "07",
      label: "Impact",
      heading: "From analysis to action",
      paras: [
        "Tracked stacking % month over month against compensation cost per order, refund cost per order, and delayed orders across Jan-Dec 2022, framing an action plan that protects customer retention and experience for long-term growth rather than chasing short-term cost cuts.",
      ],
      blocks: [
        { type: "tags", items: ["Google BigQuery", "SQL", "RStudio", "Tableau", "Cost-benefit analysis", "Regression", "Operations analytics"] },
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
