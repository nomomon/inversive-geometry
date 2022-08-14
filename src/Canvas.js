import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function Canvas({ proportionCenter, proportionRadius }) {
    const canvasRef = useRef();


    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        const w = canvasRef.current.width;
        const h = canvasRef.current.height;

        const radius = proportionRadius * Math.min(w, h);
        // clear canvas
        ctx.clearRect(0, 0, w, h);
        // draw center
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(
            proportionCenter.x * w,
            proportionCenter.y * h,
            3,
            0, 2 * Math.PI
        );
        ctx.fill();
        // draw circle
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.arc(
            proportionCenter.x * w,
            proportionCenter.y * h,
            radius,
            0, 2 * Math.PI
        );
        ctx.stroke();
    })

    return (
        <canvas
            ref={canvasRef}
            id='canvas'
            width={100}
            height={100}
        ></canvas>
    )
}

Canvas.propTypes = {
    proportionCenter: PropTypes.object.isRequired,
    proportionRadius: PropTypes.number.isRequired
}

export default Canvas;