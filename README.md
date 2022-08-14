# Geometrical Inversion in React.js

_Node.js, React_

## Description

This is a simple React.js app that demonstrates the [geometrical inversion](https://en.wikipedia.org/wiki/Inversive_geometry) of a point in a circle. The app is built using React and Node.js.

It works by transforming the plane (image) accoring to the following rule:

> Each point $P$ is mapped to the point $P'$ on a ray $OP$, such that $OP \cdot OP' = R^2$, where $R$ is the radius of the inversion.
> Working with pixels makes the coordinates descrete and to improve the quality of the image, the root mean squared [[1]](https://www.youtube.com/watch?v=LKnqECcg6Gw&ab_channel=minutephysics) of pixel values are taken.

## Demo

Demo is available [here](https://nomomon.github.io/inversion-geometry). Upload an image and select the center and radius of inversion.

![demonstration](./demo.gif)
