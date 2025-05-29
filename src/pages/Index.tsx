import React, { useState, useEffect, useRef } from 'react';
import {
  SiPython,
  SiMysql,
  SiTableau,
  SiGoogleanalytics,
  SiMicrosoftexcel,
  SiScikitlearn,
  SiFlask,
  SiPandas,
  SiNumpy,
  SiR,
  SiMongodb,
  SiLinux,
} from 'react-icons/si';

const TABS = ['terminal', 'aboutme', 'skills', 'workexperience', 'projects', 'contactme'] as const;
type TabType = typeof TABS[number];
type ProjectKey = 'sentiment_analysis' | 'airbnb_analysis' | 'movie_recommender';

const projectsMeta: Record<ProjectKey, {
  file: string;
  description: string;
  tools: string[];
  github: string;
}> = {
  sentiment_analysis: {
    file: 'sentiment_analysis.py',
    description: `Scraped and processed 5,000+ iPhone-14 Flipkart reviews, engineered TF-IDF features, and trained a logistic-regression model (90% accuracy) to label sentiment. Deployed as a Flask web app for real-time insights.`,
    tools: ['Python', 'Flask', 'BeautifulSoup', 'scikit-learn'],
    github: 'https://github.com/indraneelperumal/sentiment-analysis',
  },
  airbnb_analysis: {
    file: 'airbnb_analysis.py',
    description: `Modeled nightly-rate elasticity and occupancy drivers across 10,000+ Airbnb listings using gradient-boosting regression; surfaced revenue-lift scenarios via interactive Matplotlib dashboards.`,
    tools: ['Python', 'Pandas', 'Matplotlib', 'GradientBoostingRegressor'],
    github: 'https://github.com/indraneelperumal/airbnb-analysis',
  },
  movie_recommender: {
    file: 'movie_recommender.py',
    description: `Built a hybrid recommendation system combining content-based methods and collaborative filtering to provide personalized movie suggestions based on user ratings and metadata.`,
    tools: ['Python', 'Pandas', 'NumPy', 'scikit-learn'],
    github: 'https://github.com/indraneelperumal/movie-recommender',
  },
};

const prefixTitle = (type: TabType) =>
  type === 'terminal' ? '~ — -zsh' : `~/${type.replace(/\s+/g, '')} — -zsh`;

const TabButton: React.FC<{
  type: TabType;
  isActive: boolean;
  onClick: (t: TabType) => void;
}> = ({ type, isActive, onClick }) => (
  <button
    onClick={() => onClick(type)}
    className={`relative flex items-center px-3 py-1 text-sm rounded-t-lg font-medium mr-1 ${
      isActive
        ? 'bg-gray-100 dark:bg-gray-800'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
    }`}
  >
    {prefixTitle(type)}
  </button>
);

interface HistoryEntry {
  cmd: string;
  output: string | null;
}

const fortunes = [
  "Data is the new oil. – Clive Humby",
  "In God we trust. All others must bring data. – W. Edwards Deming",
  "Without big data, you are blind and deaf. – Geoffrey Moore",
  "Torture the data, and it will confess to anything. – Ronald Coase",
];

const towelArt = `
                              _..----.._
                          _.-'          '-._
                       .-'    .-''"''-.     '-.
                     .'     /__________\\\\      '.
                    /      |            |       \\
                   /       |   ASCII    |        \\
                   |       |    ART!    |        |
                   |       '------------'        |
                   |                              |
                   |                              |
                   '._      TOWEL.BLINKENLIGHTS   |
                      '-._   .-''"''-.        _.-'
                          '-._\\\\______/_..--'
`;

const Index: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [loginTime, setLoginTime] = useState('');
  const [cwd, setCwd] = useState<TabType>('terminal');
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectKey | null>(null);
  const [selectedWorkFile, setSelectedWorkFile] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoginTime(
      new Date().toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
    inputRef.current?.focus();
  }, []);

  const runCommand = (cmd: string) => {
    let output: string | null = null;
    const [base, arg] = cmd.trim().split(/\s+/);

    if (base === 'view' && arg && arg in projectsMeta) {
      setSelectedProject(arg as ProjectKey);
      setHistory(h => [...h, { cmd, output: null }]);
      return;
    }

    switch (base) {
      case 'ls':
        break;
      case 'cd':
        if ((TABS as readonly string[]).includes(arg)) {
          setCwd(arg as TabType);
          setSelectedProject(null);
          setSelectedWorkFile(null);
        } else {
          output = `zsh: no such file or directory: ${arg}`;
        }
        break;
      case 'help':
        output =
          'Commands: ls, cd [aboutme|skills|workexperience|projects|contactme], view <project_key>, fortune, telnet [towel.blinkenlights.nl|me], help';
        break;
      case 'fortune':
        output = fortunes[Math.floor(Math.random() * fortunes.length)];
        break;
      case 'telnet':
        if (arg === 'towel.blinkenlights.nl') {
          output = towelArt;
        } else if (arg === 'me') {
          setCwd('contactme');
          setSelectedProject(null);
          setSelectedWorkFile(null);
        } else {
          output = `zsh: could not connect to host: ${arg}`;
        }
        break;
      default:
        output = `zsh: command not found: ${base}`;
    }

    setHistory(h => [...h, { cmd, output }]);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      runCommand(command);
      setCommand('');
    }
  };

  const topBarTitle =
    cwd === 'terminal' ? '~ indraneelperumal — -zsh' : `~/${cwd} — -zsh`;

  const renderContent = () => {
    if (cwd === 'terminal') {
      return (
        <div className="flex flex-col space-y-1 whitespace-pre-wrap font-mono">
          {history.map((h, i) => (
            <div key={i}>
              <div>
                <span>indraneelperumal ~ $</span> <span>{h.cmd}</span>
              </div>
              {h.output && <div className="pl-4 text-current">{h.output}</div>}
            </div>
          ))}
        </div>
      );
    }

    if (cwd === 'aboutme') {
      return (
        <pre className="text-current whitespace-pre font-mono">
{`indraneelperumal ~ cd aboutme
indraneelperumal ~/aboutme  cat about.txt
┌──────────────────────────────────────────────────────────────────────────────┐
│ I’m Indraneel Reddy Perumal, an MS Business Analytics candidate at UTD and a │
│ BBA graduate from PES University, where I discovered the power of data-      │
│ driven strategy. At Saasguru, Optimal Strategix, and Capgemini, I’ve optimized│
│ marketing campaigns, developed demand-forecasting models, and automated      │
│ reporting pipelines to enhance efficiency. My technical toolkit—Python, SQL, │
│ Tableau, PySpark, and scikit-learn—has driven projects like a Flask-based     │
│ sentiment analyzer and a hybrid recommendation engine. Passionate about     │
│ continuous learning, I pursue certifications in AI and machine learning and │
│ thrive in hackathons, building fraud-detection and risk-assessment tools.     │
│ Let’s connect to turn data into actionable insights and drive innovation     │
│ together.                                                                   │
└──────────────────────────────────────────────────────────────────────────────┘

├─────────────────────────────────────────────────────────────────────┤
│  Education          │ MS Business Analytics @ UTD (’24–’26)         │
│                      │ - Awarded merit-based scholarship             │
│                      │ BBA @ PES University (’20–’23)               │
├──────────────────────┼───────────────────────────────────────────────┤
│  Key Skills         │ Python | SQL | Tableau | Scikit-learn | Hadoop    │
├──────────────────────┼───────────────────────────────────────────────┤
│  Achievements       │ Winner – 2025 Conagra Brands Analytics Competetion.  │
└──────────────────────┴───────────────────────────────────────────────┘`}
        </pre>
      );
    }

    if (cwd === 'skills') {
      const skills = [
        { icon: <SiPython />, name: 'Python' },
        { icon: <SiMysql />, name: 'SQL' },
        { icon: <SiTableau />, name: 'Tableau' },
        { icon: <SiGoogleanalytics />, name: 'Google Analytics' },
        { icon: <SiMicrosoftexcel />, name: 'Excel' },
        { icon: <SiScikitlearn />, name: 'Scikit-learn' },
        { icon: <SiFlask />, name: 'Flask' },
        { icon: <SiPandas />, name: 'Pandas' },
        { icon: <SiNumpy />, name: 'NumPy' },
        { icon: <SiR />, name: 'R' },
        { icon: <SiMongodb />, name: 'MongoDB' },
        { icon: <SiLinux />, name: 'Linux' },
      ];
      return (
        <>
          <pre>{`indraneelperumal ~ cd skills
indraneelperumal ~/skills ls`}</pre>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {skills.map((s, i) => (
              <div key={i} className="flex items-center space-x-2 p-2 rounded">
                <span className="text-2xl">{s.icon}</span>
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </>
      );
    }

    if (cwd === 'workexperience') {
  const files = [
    'saasguru.sql',
    'optimal_strategix_group.sql',
    'capgemini.sql',
  ];

  const workData: Record<string, { company: string; role: string; date: string; resp: string }> = {
    'saasguru.sql': {
      company: 'Saasguru',
      role: 'Growth Analyst Intern',
      date: 'Dec 2023–Jun 2024',
      resp: 'Google Analytics, SQL, +20% engagement',
    },
    'optimal_strategix_group.sql': {
      company: 'Optimal Strategix Group',
      role: 'Marketing Analyst Intern',
      date: 'Feb 2023–May 2023',
      resp: 'Tableau dashboards, Python analysis, +15% social reach',
    },
    'capgemini.sql': {
      company: 'Capgemini',
      role: 'Data Analyst Intern',
      date: 'Jul 2022–Sep 2022',
      resp: 'Dynamic client DB, Excel macros, –15% manual labor',
    },
  };

  return (
    <>
      <pre>
{`indraneelperumal ~  cd workexperience
indraneelperumal ~/workexperience ls`}
      </pre>

      <ul className="mt-2 space-y-1">
        {files.map((f) => (
          <li key={f}>
            <button className="hover:underline" onClick={() => setSelectedWorkFile(f)}>
              {f}
            </button>
          </li>
        ))}
      </ul>

      {selectedWorkFile && (
        <div className="mt-4 p-4 border rounded bg-white dark:bg-black text-current">
          <pre>
{`SELECT Company, JobRole, Date, Responsibilities
  FROM WorkExperience
 WHERE FileName = '${selectedWorkFile}';`}
          </pre>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm border-collapse border">
              <thead className="bg-white dark:bg-black">
                <tr>
                  <th className="border p-1">Company</th>
                  <th className="border p-1">JobRole</th>
                  <th className="border p-1">Date</th>
                  <th className="border p-1">Responsibilities</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1">{workData[selectedWorkFile].company}</td>
                  <td className="border p-1">{workData[selectedWorkFile].role}</td>
                  <td className="border p-1">{workData[selectedWorkFile].date}</td>
                  <td className="border p-1">{workData[selectedWorkFile].resp}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

    if (cwd === 'projects') {
      const keys = Object.keys(projectsMeta) as ProjectKey[];
      return (
        <>
          <pre>
{`indraneelperumal ~  cd projects
indraneelperumal ~/projects ls`}
      </pre>

          <div className="mt-4 space-y-1">
            {keys.map((k) => (
              <button
                key={k}
                onClick={() => setSelectedProject(k)}                className="block text-left hover:underline"
              >
                {projectsMeta[k].file}
              </button>
            ))}
          </div>

          {selectedProject && (
            <div className="mt-6 border-t pt-4 font-mono text-current">
              <pre className="whitespace-pre">
{`# ${projectsMeta[selectedProject].file}

"""
Description:
    ${projectsMeta[selectedProject].description.replace(/\n/g, '\n    ')}

Tools:
${projectsMeta[selectedProject].tools.map(t => `    - ${t}`).join('\n')}
"""`}
              </pre>
              <div className="pl-4 mt-2">
                GitHub:{' '}
                <a
                  href={projectsMeta[selectedProject].github}
                  target="_blank"
                  className="underline hover:text-blue-500"
                  rel="noopener noreferrer"
                >
                  {projectsMeta[selectedProject].github}
                </a>
              </div>
            </div>
          )}
        </>
      );
    }

    if (cwd === 'contactme') {
  return (
    <div className="font-mono text-current">
      <div>indraneelperumal ~ ls</div>
      <div className="mt-2 whitespace-pre">
        {'{'}
      </div>
      <ul className="pl-4">
        <li>
          "email":&nbsp;
          <a
            href="mailto:perumal.indraneel@outlook.com"
            className="underline hover:text-blue-500"
          >
            "perumal.indraneel@outlook.com",
          </a>
        </li>
        <li>
          "linkedin":&nbsp;
          <a
            href="https://linkedin.com/in/indraneelperumal"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-500"
          >
            "linkedin.com/in/indraneelperumal",
          </a>
        </li>
        <li>
          "github":&nbsp;
          <a
            href="https://github.com/indraneelperumal"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-500"
          >
            "github.com/indraneelperumal",
          </a>
        </li>
        <li>
          "phone":&nbsp;
          "+1 945 260 8096"
        </li>
      </ul>
      <div className="whitespace-pre">{'}'}</div>
    </div>
  );
}

    return null;
  };

  return (
    <div className={isDarkTheme ? 'dark' : ''}>
      <div className="min-h-screen font-mono bg-white text-black dark:bg-black dark:text-white">
        {/* ROW 1 */}
        <div className="flex items-center px-3 py-2 bg-white dark:bg-black border-b">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <div className="flex-1 flex justify-center text-sm font-medium">
            <span className="text-gray-500 dark:text-gray-400">📁</span>
            <span className="ml-1 text-gray-800 dark:text-gray-200">
              {topBarTitle}
            </span>
          </div>
          <div className="w-12" />
        </div>

        {/* ROW 2 */}
        <div className="border-b bg-white dark:bg-black px-3 py-1">
          <select
            className="w-full sm:hidden bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded"
            value={cwd}
            onChange={(e) => {
              setCwd(e.target.value as TabType);
              setSelectedProject(null);
              setSelectedWorkFile(null);
            }}
          >
            {TABS.map((t) => (
              <option key={t} value={t}>
                {prefixTitle(t)}
              </option>
            ))}
          </select>
          <div className="hidden sm:flex items-center overflow-x-auto">
            {TABS.map((t) => (
              <TabButton
                key={t}
                type={t}
                isActive={cwd === t}
                onClick={(x) => {
                  setCwd(x);
                  setSelectedProject(null);
                  setSelectedWorkFile(null);
                }}
              />
            ))}
            <button
              onClick={() => setCwd('terminal')}
              className="px-3 py-1 text-sm rounded-t-lg font-bold bg-gray-200 dark:bg-gray-700 mr-1"
            >
              +
            </button>
            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className="px-3 py-1 text-xs rounded-t-lg font-medium bg-gray-200 dark:bg-gray-700"
            >
              ~/.theme
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4">
          {cwd === 'terminal' && (
            <>
              <div className="text-sm mb-2">
                Last login: {loginTime}
              </div>
              <div className="flex items-center mb-4">
                <span>indraneelperumal ~ </span>
                <input
                  ref={inputRef}
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="ml-2 flex-1 bg-transparent outline-none"
                  placeholder="type ‘help’, ‘fortune’, ‘telnet me’, or ‘view <project_key>’"
                />
              </div>
            </>
          )}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
