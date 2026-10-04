# Hexapod Robot Simulator

A browser-based kinematics and gait simulator adapted from Mithi's Bare-Minimum Hexapod Robot Simulator for the scorpion-style hexapod prototype described below. The calculations run in the browser; this project does not send commands to the physical servos.

## Prototype configuration

All model dimensions are in **millimetres**. The six coxa axes are arranged in three left/right pairs:

| Measurement | Value |
| --- | ---: |
| Left-to-right coxa-axis spacing, at each station | 120 mm |
| Front-to-middle and middle-to-rear coxa-axis spacing | 115 mm each |
| Coxia link: body axis to femur axis | 64.5 mm |
| Femur link: femur axis to tibia axis | 64.5 mm |
| Tibia link: tibia axis to foot tip | 130.59 mm |

The current body parameters are `front: 60`, `middle: 60`, and `side: 115` in `src/templates/hexapodParams.js`. In this model, `front` and `middle` are offsets from the body centre (half the 120 mm spacing); `side` is the offset of the front and rear stations from the middle station. All six hip mounts sit along the two side rails, not at the chassis corners. The simple outline currently extends 30 mm beyond the front and rear mounts; replace that visual estimate when the chassis edge dimensions are available.

The prototype uses 18 RDS3218 servos (three per leg, specified as 20 kg and 270°). The simulator currently has **no tail model**, as requested.

## Features

- Interactive 3D hexapod view and editable dimensions.
- Forward kinematics, inverse kinematics, leg-pose controls, and support/stability checks.
- Tripod and ripple gait options, forward/backward playback, and rotation mode.
- Gait frames are generated from Cartesian foot paths and solved through IK. If a requested stride or lift is unreachable, the solver reduces the gait amplitude until it finds a reachable sequence.
- The initial gait settings use the prototype's tripod reference values: 15° hip swing and 20° lift swing.

The body and legs are rendered as a simplified kinematic model, not as the physical CAD solids.

## Run locally

Requirements: Node.js and Yarn.

```bash
yarn install
yarn start
```

The development server normally opens at <http://localhost:3000>.

Other useful commands:

```bash
yarn test --watchAll=false --runInBand
yarn build
```

## Hardware and angle conventions

This repository is a **kinematic simulator**, not a dynamics simulator or servo controller. It does not model servo torque, electrical limits, collisions, mass/inertia, or ground friction, and it does not output PWM signals.

The hardware `stand`, `sit`, and `belly_touch` poses in the reference Python controller use servo command angles. They are not automatically the same as the simulator's `alpha`, `beta`, and `gamma` angles. A hardware mapping needs each joint's zero offset, direction (including any mirrored joints), and installed usable travel. A servo's advertised 270° travel should not be treated as a safe ±270° joint range; calibrate mechanical limits before using any simulated angles to drive hardware.

## Main code locations

- `src/templates/hexapodParams.js` — prototype dimensions, default pose, and gait parameters.
- `src/hexapod/VirtualHexapod.js`, `src/hexapod/Linkage.js` — robot geometry and forward kinematics.
- `src/hexapod/solvers/ik/` — inverse-kinematics solvers.
- `src/hexapod/solvers/walkSequenceSolver.js` — Cartesian gait paths and per-frame IK.
- `src/components/pages/WalkingGaitsPage.js` — gait controls and animation.

## Attribution

This project is based on Mithi's Bare-Minimum Hexapod Robot Simulator 2 and its contributors. The upstream project is licensed under the Apache License 2.0; see [LICENSE](./LICENSE).
