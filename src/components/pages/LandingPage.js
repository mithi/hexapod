import React from "react"
import { Link } from "react-router-dom"
import { PATHS, SECTION_NAMES } from "../vars"

const RobotDiagram = () => (
    <div className="hero-visual">
        <svg
            className="robot-diagram"
            viewBox="0 0 360 300"
            role="img"
            aria-label="Top view diagram with three leg mounts on each side of the chassis"
        >
            <defs>
                <radialGradient id="diagram-glow">
                    <stop offset="0" stopColor="#35c9bb" stopOpacity="0.22" />
                    <stop offset="1" stopColor="#35c9bb" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="diagram-body-fill" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0" stopColor="#203850" />
                    <stop offset="1" stopColor="#132539" />
                </linearGradient>
            </defs>

            <circle cx="180" cy="150" r="145" fill="url(#diagram-glow)" />
            <text x="180" y="18" className="diagram-front-label" textAnchor="middle">
                FRONT
            </text>
            <path d="M180 23v13m-5-5 5 5 5-5" className="diagram-direction" />

            <g className="diagram-leg-lines">
                <path d="M132 78 84 59 34 43" />
                <path d="M132 150 81 150 27 150" />
                <path d="M132 222 84 241 34 257" />
                <path d="M228 78 276 59 326 43" />
                <path d="M228 150 279 150 333 150" />
                <path d="M228 222 276 241 326 257" />
            </g>

            <g className="diagram-feet">
                <circle cx="34" cy="43" r="5" />
                <circle cx="27" cy="150" r="5" />
                <circle cx="34" cy="257" r="5" />
                <circle cx="326" cy="43" r="5" />
                <circle cx="333" cy="150" r="5" />
                <circle cx="326" cy="257" r="5" />
            </g>

            <rect
                x="132"
                y="38"
                width="96"
                height="224"
                rx="34"
                className="diagram-body"
            />
            <rect x="148" y="54" width="64" height="192" rx="24" className="diagram-deck" />
            <path d="M180 68v164M160 150h40" className="diagram-centerline" />
            <circle cx="180" cy="150" r="12" className="diagram-cog" />

            <g className="diagram-joints">
                <circle cx="132" cy="78" r="7" />
                <circle cx="132" cy="150" r="7" />
                <circle cx="132" cy="222" r="7" />
                <circle cx="228" cy="78" r="7" />
                <circle cx="228" cy="150" r="7" />
                <circle cx="228" cy="222" r="7" />
            </g>
        </svg>
        <div className="visual-caption">Three side-mounted legs on each side</div>
    </div>
)

const TOOL_CARDS = [
    {
        path: PATHS.walkingGaits.path,
        number: "01",
        title: SECTION_NAMES.walkingGaits,
        text: "Preview tripod and ripple steps solved from foot paths.",
    },
    {
        path: PATHS.inverseKinematics.path,
        number: "02",
        title: SECTION_NAMES.inverseKinematics,
        text: "Explore body movement and the resulting joint pose.",
    },
    {
        path: PATHS.forwardKinematics.path,
        number: "03",
        title: SECTION_NAMES.forwardKinematics,
        text: "Set joint angles and inspect the robot pose in 3D.",
    },
]

class LandingPage extends React.Component {
    pageName = SECTION_NAMES.landingPage

    componentDidMount = () => this.props.onMount(this.pageName)

    render = () => (
        <div id="landing" className="landing-content">
            <section className="hero-panel">
                <div className="hero-copy">
                    <div className="eyebrow">SCORPION HEXAPOD · KINEMATICS</div>
                    <h1>Hexapod Robot Simulator</h1>
                    <p className="hero-lede">
                        A kinematic workbench for the six-legged prototype. Explore joint
                        poses, inverse kinematics, and walking gaits in an interactive 3D
                        view.
                    </p>
                    <div className="hero-actions">
                        <Link to={PATHS.walkingGaits.path} className="button button-primary">
                            Open gait lab <span aria-hidden="true">→</span>
                        </Link>
                        <Link
                            to={PATHS.inverseKinematics.path}
                            className="button button-secondary"
                        >
                            Inverse kinematics
                        </Link>
                    </div>
                    <div className="hero-facts">
                        <div>
                            <strong>6</strong>
                            <span>legs</span>
                        </div>
                        <div>
                            <strong>18</strong>
                            <span>servo axes</span>
                        </div>
                        <div>
                            <strong>mm</strong>
                            <span>model units</span>
                        </div>
                    </div>
                </div>
                <RobotDiagram />
            </section>

            <section className="tool-section" aria-labelledby="tools-heading">
                <div className="section-heading">
                    <div>
                        <div className="eyebrow">SIMULATION TOOLS</div>
                        <h2 id="tools-heading">Choose a workspace</h2>
                    </div>
                    <span className="section-note">Tail is omitted in this prototype model</span>
                </div>
                <div className="tool-grid">
                    {TOOL_CARDS.map(tool => (
                        <Link to={tool.path} className="tool-card" key={tool.path}>
                            <span className="tool-number">{tool.number}</span>
                            <div className="tool-copy">
                                <h3>{tool.title}</h3>
                                <p>{tool.text}</p>
                            </div>
                            <span className="tool-arrow" aria-hidden="true">
                                ↗
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default LandingPage
