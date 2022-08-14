function get_pixels(img_element) {
    var canvas = document.createElement('canvas');
    canvas.width = img_element.width;
    canvas.height = img_element.height;
    var context = canvas.getContext('2d');
    context.drawImage(img_element, 0, 0, canvas.width, canvas.height);
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
    RGBARootMeanSquare(weights = [1, 1, 1, 1]) {
        // take the square root of the weighted sum of the squares of the RGBA values
        let rgba = this.reduce((rgba1, rgba2, i) => {
            const [r1, g1, b1, a1] = rgba1;
            const [r2, g2, b2, a2] = rgba2;

            return [
                Math.sqrt((r1 * r1 + r2 * r2 * weights[i])),
                Math.sqrt((g1 * g1 + g2 * g2 * weights[i])),
                Math.sqrt((b1 * b1 + b2 * b2 * weights[i])),
                Math.sqrt((a1 * a1 + a2 * a2 * weights[i]))
            ];
        }, [0, 0, 0, 0]);

        // divide by weights sum root
        for (let key in rgba) {
            rgba[key] /= Math.sqrt(weights.reduce((a, b) => a + b));
        }

        // round to int
        for (let key in rgba) {
            rgba[key] = Math.round(rgba[key]);
        }

        return Object.values(rgba);
    }
}

class Vector extends Array {
    constructor(x, y) {
        super(x, y);
    }

    get x() {
        return this[0];
    }

    get y() {
        return this[1];
    }

    set x(x) {
        this[0] = x;
    }

    set y(y) {
        this[1] = y;
    }

    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    divide(scalar) {
        return new Vector(this.x / scalar, this.y / scalar);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        return this.divide(this.magnitude());
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    cross(vector) {
        return this.x * vector.y - this.y * vector.x;
    }

    angle(vector) {
        return Math.acos(this.dot(vector) / (this.magnitude() * vector.magnitude()));
    }

    rotate(angle) {
        return new Vector(
            this.x * Math.cos(angle) - this.y * Math.sin(angle),
            this.x * Math.sin(angle) + this.y * Math.cos(angle)
        );
    }

    static fromPoints(point1, point2) {
        return new Vector(point2.x - point1.x, point2.y - point1.y);
    }
}

function invert_image_array(
    pixels,
    w,
    h,
    R,
    center
) {
    center = center || { x: w / 2, y: h / 2 };
    const center_vector = new Vector(center.x, center.y);

    const new_pixels = new Uint8ClampedArray(pixels.length);
    const c = (x, y) => {
        return (x + y * w) * 4;
    }

    for (let x1 = 0; x1 < w; x1++) {
        for (let y1 = 0; y1 < h; y1++) {
            const pixel1 = new Vector(x1, y1);
            const pixel1_vector = pixel1.subtract(center_vector);
            const pixel2_vector = pixel1_vector
                .normalize()
                .multiply(R * R)
                .divide(pixel1_vector.magnitude());
            const pixel2 = pixel2_vector.add(center_vector);
            let x2 = pixel2.x,
                y2 = pixel2.y;

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
                ).RGBARootMeanSquare([
                    (1 - (x2_u - x2)) * (1 - (y2_u - y2)),
                    (1 - (x2_u - x2)) * (1 - (y2 - y2_d)),
                    (1 - (x2 - x2_d)) * (1 - (y2_u - y2)),
                    (1 - (x2 - x2_d)) * (1 - (y2 - y2_d))
                ]);

                for (let i = 0; i < 4; i++) {
                    new_pixels[c(x1, y1) + i] = rgba[i];
                }
            }
        }
    }

    return new_pixels;
}

function invert_image(img_element, R, center) {
    const pixels = get_pixels(img_element);
    const new_pixels = invert_image_array(
        pixels.data,
        pixels.width,
        pixels.height,
        R,
        center
    );

    set_pixels(img_element, new ImageData(new_pixels, pixels.width, pixels.height));
}

export { invert_image };