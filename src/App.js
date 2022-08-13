import React from 'react';
import { useState } from 'react';
import { invert_image } from './image_inversion';
import './App.css';

function App() {
    const [file, setFile] = useState(null);

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
                        document.querySelector('#image').src = e.target.result;
                    }
                    reader.readAsDataURL(e.target.files[0]);
                }} />
            {/* button disabled if file not uploaded */}
            <button
                id="inversion"
                disabled={file === null}
                onClick={() => {
                    // invert image
                    invert_image(document.querySelector('#image'), 100);
                }}
            >Apply inversion</button>
            <br />
            <br />
            {/* image tag and canvas for inversion */}
            <div>
                <img id='image' alt='alt tag' src='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='></img>
            </div>
        </div>
    );
}

export default App;
