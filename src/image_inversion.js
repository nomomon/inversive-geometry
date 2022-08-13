function get_pixels(img_element) {
    var canvas = document.createElement('canvas');
    canvas.width = img_element.width;
    canvas.height = img_element.height;
    var context = canvas.getContext('2d');
    context.drawImage(img_element, 0, 0);
    return context.getImageData(0, 0, canvas.width, canvas.height);
}

function set_pixels(img_element, pixels) {
    var canvas = document.createElement('canvas');
    canvas.width = img_element.width;
    canvas.height = img_element.height;
    var context = canvas.getContext('2d');
    context.putImageData(pixels, 0, 0);
    img_element.src = canvas.toDataURL();
}

class NewArray extends Array {
    constructor(...args) {
        super(...args);
    }

    RGBARootMeanSquare() {
        let rgba = this.reduce((rgba1, rgba2) => {
            const [r1, g1, b1, a1] = rgba1;
            const [r2, g2, b2, a2] = rgba2;

            return [
                Math.sqrt((r1 * r1 + r2 * r2)),
                Math.sqrt((g1 * g1 + g2 * g2)),
                Math.sqrt((b1 * b1 + b2 * b2)),
                Math.sqrt((a1 * a1 + a2 * a2))
            ];
        });
        for (var key in rgba) {
            if (rgba.hasOwnProperty(key)) {
                rgba[key] /= Math.sqrt(this.length);
            }
        }
        for (var key in rgba) {
            if (rgba.hasOwnProperty(key)) {
                rgba[key] = Math.round(rgba[key]);
            }
        }

        return Object.values(rgba);
    }
}

function invert_image_array(
    pixels,
    w,
    h,
    R,
    center,
    outlineCircle = false
) {
    center = center || { x: w / 2, y: h / 2 };
    const c = (x, y) => {
        return (x + y * w) * 4;
    }
    const new_pixels = new Uint8ClampedArray(pixels.length);

    for (let x1 = 0; x1 < w; x1++) {
        for (let y1 = 0; y1 < h; y1++) {
            let x1_ = x1 - center.x,
                y1_ = y1 - center.y;
            let d1 = Math.sqrt(x1_ * x1_ + y1_ * y1_);
            let k = x1_ / y1_;
            let Q = R * R / d1;
            let x2_ = Q / Math.sqrt(1 / (k * k) + 1) * Math.sign(x1_),
                y2_ = Q / Math.sqrt(k * k + 1) * Math.sign(y1_);
            let x2 = x2_ + center.x,
                y2 = y2_ + center.y;

            let x2_u = Math.floor(x2),
                x2_d = Math.ceil(x2);
            let y2_u = Math.floor(y2),
                y2_d = Math.ceil(y2);

            if (x2 >= 0 && x2 < w && y2 >= 0 && y2 < h) {
                let rgba = new NewArray(
                    pixels.slice(c(x2_u, y2_u), c(x2_u, y2_u) + 4),
                    pixels.slice(c(x2_u, y2_d), c(x2_u, y2_d) + 4),
                    pixels.slice(c(x2_d, y2_u), c(x2_d, y2_u) + 4),
                    pixels.slice(c(x2_d, y2_d), c(x2_d, y2_d) + 4)
                ).RGBARootMeanSquare();

                for (let i = 0; i < 4; i++) {
                    new_pixels[c(x1, y1) + i] = rgba[i];
                }
            }
            if (d1 - R < 0.5 && d1 - R > -0.5 && outlineCircle) {
                new_pixels[c(x1, y1)] = 255;
                new_pixels[c(x1, y1) + 1] = 0;
                new_pixels[c(x1, y1) + 2] = 0;
                new_pixels[c(x1, y1) + 3] = 0;
            }
        }
    }

    return new_pixels;
}

function invert_image(img_element, R, center, outlineCircle) {
    const pixels = get_pixels(img_element);
    const new_pixels = invert_image_array(
        pixels.data,
        pixels.width,
        pixels.height,
        R,
        center,
        outlineCircle
    );

    set_pixels(img_element, new ImageData(new_pixels, pixels.width, pixels.height));
}

export { invert_image };