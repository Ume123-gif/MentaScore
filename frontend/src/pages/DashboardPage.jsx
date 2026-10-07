import edaInsights from '../data/edaInsights.json'
import StatCard from '../components/dashboard/StatCard.jsx'
import BarInsight from '../components/dashboard/BarInsight.jsx'
import ScatterInsight from '../components/dashboard/ScatterInsight.jsx'
import CorrelationStrip from '../components/dashboard/CorrelationStrip.jsx'
import '../components/dashboard/Dashboard.css'
import './DashboardPage.css'

export default function DashboardPage() {
  const {
    overview,
    byStressLevel,
    bySleepBucket,
    byUsageBucket,
    byPlatform,
    byAcademicLevel,
    correlations,
    scatterUsageVsScore,
    scatterSleepVsScore,
  } = edaInsights

  return (
    <div className="dashboard-page">
      <div className="predict-intro">
        <p className="section-heading">Dataset insights</p>
        <h1>What the training data actually shows</h1>
        <p className="muted predict-lede">
          Computed directly from the project's 5,000-row survey dataset — the same relationships
          the prediction model is built on.
        </p>
      </div>

      <div className="stat-grid">
        <StatCard label="Respondents" value={overview.totalRecords.toLocaleString()} />
        <StatCard label="Average score" value={overview.avgScore} unit="/ 10" />
        <StatCard label="Average sleep" value={overview.avgSleep} unit="h" />
        <StatCard label="Average usage" value={overview.avgUsage} unit="h/day" />
      </div>

      <div className="insight-grid">
        <BarInsight
          title="Score by stress level"
          description="Higher self-reported stress tracks with a lower average score."
          data={byStressLevel}
          barColor="var(--clay)"
        />
        <BarInsight
          title="Score by sleep (hours/night)"
          description="More sleep is consistently associated with a higher score."
          data={bySleepBucket}
          barColor="var(--moss)"
        />
        <BarInsight
          title="Score by daily usage (hours)"
          description="Score drops off sharply once daily usage passes ~6 hours."
          data={byUsageBucket}
          barColor="var(--amber-deep)"
        />
        <BarInsight
          title="Score by academic level"
          description="Differences here are smaller than for sleep, stress or usage."
          data={byAcademicLevel}
          barColor="var(--ink-soft)"
        />
      </div>

      <CorrelationStrip correlations={correlations} />

      <div className="insight-grid">
        <ScatterInsight
          title="Usage hours vs. score"
          description="Each dot is one respondent (150-point sample). A clear downward trend."
          data={scatterUsageVsScore}
          xLabel="Usage hours"
          dotColor="var(--amber-deep)"
        />
        <ScatterInsight
          title="Sleep hours vs. score"
          description="Each dot is one respondent (150-point sample). A clear upward trend."
          data={scatterSleepVsScore}
          xLabel="Sleep hours"
          dotColor="var(--moss)"
        />
      </div>

      <BarInsight
        title="Score by most-used platform"
        description="Platforms most linked to entertainment/scrolling skew lower; education/networking platforms skew higher — likely reflecting usage patterns more than the app itself."
        data={byPlatform}
        barColor="var(--amber-deep)"
      />
    </div>
  )
}
