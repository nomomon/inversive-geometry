import React from 'react';
import { useState } from 'react';
import { invert_image } from './image_inversion';
import Canvas from './Canvas';
import './App.css';

function $(q) {
    return document.querySelector(q);
}

function App() {
    const [file, setFile] = useState(null);
    const [proportionCenter, setProportionCenter] = useState({ x: .5, y: .5 });
    const [proportionRadius, setProportionRadius] = useState(.1);

    return (
        <div className="App">
            <h1>Geometrical Inversion on Image</h1>
            <p>
                Upload an image and click on the button to see the geometrical inversion of the image.
            </p>
            {/* upload image */}
            <input
                type="file"
                id="file"
                accept="image/*"
                onChange={(e) => {
                    setFile(e.target.files[0])

                    // set image to image tag
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        $('#image').src = e.target.result;
                        $('#image').onload = () => {
                            $('#canvas').width = $('#image').clientWidth;
                            $('#canvas').height = $('#image').clientHeight;
                        }
                    }
                    reader.readAsDataURL(e.target.files[0]);
                }} />
            {/* button disabled if file not uploaded */}
            <button
                id="inversion"
                disabled={file === null}
                onClick={() => {
                    // invert image
                    let center = {
                        x: proportionCenter.x * $('#image').width,
                        y: proportionCenter.y * $('#image').height
                    }
                    let radius = proportionRadius * Math.min(
                        $('#image').width,
                        $('#image').height
                    );
                    invert_image($('#image'), radius, center);
                    // reset upload button
                    $('#file').value = null;
                }}
            >Apply inversion</button>
            <br />
            <input type="range" id='radius_range' onChange={
                (e) => setProportionRadius(Number(e.target.value))
            }
                min={0}
                max={1}
                step={.0001}
                value={proportionRadius}
            />
            <label htmlFor='radius_range'>R</label>
            <br />
            <input type="range" id='x_range' onChange={
                (e) => setProportionCenter({ x: Number(e.target.value), y: proportionCenter.y })
            }
                min={0}
                max={1}
                step={.001}
                value={proportionCenter.x}
            />
            <label htmlFor='x_range'>x</label>
            <br />
            <input type="range" id='y_range' onChange={
                (e) => setProportionCenter({ x: proportionCenter.x, y: Number(e.target.value) })
            }
                min={0}
                max={1}
                step={.001}
                value={proportionCenter.y}
            />
            <label htmlFor='y_range'>y</label>
            <br />
            <div className='container'>
                <Canvas
                    proportionCenter={proportionCenter}
                    proportionRadius={proportionRadius}
                ></Canvas>
                <img id='image' alt='alt tag' src='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='></img>
            </div>
        </div >
    );
}

export default App;
