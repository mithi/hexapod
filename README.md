
[![build status](https://github.com/mithi/hexapod/workflows/build/badge.svg)](https://hexapod.netlify.app)
[![Code Climate](https://codeclimate.com/github/mithi/hexapod/badges/gpa.svg)](https://codeclimate.com/github/mithi/hexapod)
[![technical debt](https://img.shields.io/codeclimate/tech-debt/mithi/hexapod)](https://codeclimate.com/github/mithi/hexapod/trends/technical_debt)
[![codecov](https://codecov.io/gh/mithi/hexapod/branch/master/graph/badge.svg)](https://codecov.io/gh/mithi/hexapod)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![buy me coffee](https://img.shields.io/badge/Buy%20me%20-coffee!-orange.svg?logo=buy-me-a-coffee&color=795548)](https://ko-fi.com/minimithi)

# Mithi's Bare-Minimum Hexapod Robot Simulator 2

<p align="center">
    <img src="https://mithi.github.io/robotics-blog/show-off.gif" alt="drawing" width="400" />
</p>

You can use this web app to solve inverse kinematics, simulate various gaits, and more. In real time, you can also view all the angles the robot's eighteen joints make at any particular pose. All the computations are solely done in your browser, nothing's fetching data from somewhere else, so it should be fast. Another (somewhat) cool thing is that this app does NOT depend on any external mathematics library; it only uses Javascript's built-in Math object.

Consider buying me [a few cups of coffee ☕ ☕ ☕](https://ko-fi.com/minimithi) to motivate me to build other robotics-related visualizers. (Quadrotors?!)

## Features

<img src="https://mithi.github.io/robotics-blog/show-off-v2-1.gif" alt="drawing" width="325" align="right" />

🎉 Control

- [x] The robot's dimensions
- [x] The robot's 3d orientation, translation, stance, and more

🎉 Solve

- [x] Inverse Kinematics
- [x] Forward Kinematics

🎉 Simulate

- [x] Ripple and tripod gait variations
- [x] Walking forward and backwards
- [x] Rotating clockwise and counterclockwise

[🤖](https://hexapod.netlify.app/) [🐳](https://mithi.github.io/deep-blueberry/) [☕](https://ko-fi.com/minimithi)

## Related Things

If you'd like to build your own user interface with Node, you can download the algorithm alone as a package: [Hexapod Kinematics Library](https://github.com/mithi/hexapod-kinematics-library). There is also [a "fork" modified where you can use the app to control a physical hexapod robot](https://github.com/mithi/hexapod-irl) as you can see in the gif below. 

|![](https://user-images.githubusercontent.com/1670421/103467849-46981980-4d8e-11eb-911e-7cb63282c0c2.gif)|![](https://user-images.githubusercontent.com/1670421/103467765-451a2180-4d8d-11eb-8f94-1a23201595b9.gif)|
|--------|-------|
| Walking Gaits | Kinematics |

## Main Contributors [![PRs welcome!](https://img.shields.io/badge/PRs-welcome-orange.svg?style=flat)](./CONTRIBUTING.md)

Any contribution to improve the source code is always appreciated. [See contributing Guide](./CONTRIBUTING.md). I will put your name below if I've merged your PR multiple times or if you've substantially contributed to this project in other ways.

- [@mithi](https://github.com/mithi)
- [@icyJoseph](https://github.com/icyJoseph)
- [@mikong](https://github.com/mikong)

## I love badges! (Don't we all?)

[![License](https://img.shields.io/badge/License-Apache%202.0-orange.svg?style=flat)](https://opensource.org/licenses/Apache-2.0)
[![code climate issues](https://img.shields.io/codeclimate/issues/mithi/hexapod?label=code%20climate%20issues)](https://codeclimate.com/github/mithi/hexapod/issues)
[![last commit](https://img.shields.io/github/last-commit/mithi/hexapod)](https://github.com/mithi/hexapod/commits/master)
[![commits per month](https://img.shields.io/github/commit-activity/m/mithi/hexapod?color=yellow&style=flat)](https://github.com/mithi/hexapod/graphs/commit-activity)
![top language](https://img.shields.io/github/languages/top/mithi/hexapod)
![code files size](https://img.shields.io/github/languages/code-size/mithi/hexapod?color=yellow)
![repo size](https://img.shields.io/github/repo-size/mithi/hexapod?color=violet)
[![code base blanks count](https://tokei.rs/b1/github/mithi/hexapod?category=blanks)](https://github.com/mithi/hexapod)
[![code base line count](https://tokei.rs/b1/github/mithi/hexapod?category=lines)](https://github.com/mithi/hexapod)
[![number of files count](https://tokei.rs/b1/github/mithi/hexapod?category=files)](https://github.com/mithi/hexapod)
[![number of comments line in code base](https://tokei.rs/b1/github/mithi/hexapod?category=comments)](https://github.com/mithi/hexapod)
[![lines of code](https://tokei.rs/b1/github/mithi/hexapod?category=code)](https://github.com/mithi/hexapod)
[![HitCount](http://hits.dwyl.com/mithi/hexapod.svg)](http://hits.dwyl.com/mithi/hexapod)

