use image::{io::Reader as ImageReader, GenericImageView, ImageBuffer};
use std::f64::consts::PI;

fn main() {
    println!("opening image");

    let origin = ImageReader::open("mercator_projection_mini.png")
        .unwrap()
        .decode()
        .unwrap();

    let dest_width = 100;
    let dest_height = 100; // (dest_width as f64 / PI) as u32;

    println!("generating image");
    let mut max_phi = 0.0f64;
    // A ojo de buen cubero... el N de groenlandia esta a 85º, que son 1.46rad. Amb aquesta constant, es queda un max phi de 1.46
    let Y_NORM = 5.8f64;
    let dest = ImageBuffer::from_fn(dest_width, dest_height, |d_x, d_y| {
        // Sphere coordinates: (phi, theta)
        // theta is the horizontal angle 0 -> 360
        // phi is the vertical angle 90 north -> 90 south
        // 0 -> 1
        let normalised_d_x = (d_x as f64) / (dest_width as f64);
        // -? -> ?: keeps the relative size to the width
        let normalised_d_y = Y_NORM * (dest_height as f64 / 2. - d_y as f64) / (dest_width as f64);

        // mercator https://www.marksmath.org/classes/common/MapProjection.pdf https://www.johndcook.com/blog/2009/09/21/gudermannian/
        let mut theta = normalised_d_x * 2. * PI;
        let mut phi = normalised_d_y.sinh().atan();
        max_phi = max_phi.max(phi);

        // Aquesta operació no es la que estic buscant. Perque senzillament m'estic desplaçant cap al nord
        // Aixo provoca que les parts que surten de dalt son "reflectides", i es perd la info del sud
        // La rotació que vull fer és bastant més complicada. Situant el nord al equador, s'ha de "desenrotllar" la
        // terra a traves del meridià (theta pasa a ser el meridià), i es projecta la resta al cilindre
        phi += 8.0 * PI / 16.;

        if phi < -PI / 2. {
            phi = -(PI + phi);
            theta += PI;
        }
        if phi > PI / 2. {
            phi = PI - phi;
            theta += PI;
        }

        while theta >= 2. * PI {
            theta -= 2. * PI;
        }
        while theta < 0. {
            theta += 2. * PI;
        }

        // mercator
        let normalised_s_x = theta / (2. * PI);
        let normalised_s_y = ((1. / phi.cos()) + phi.tan()).ln();

        let s_x = (normalised_s_x * origin.width() as f64) as u32;
        let s_y = ((origin.height() / 2) as i32
            - ((normalised_s_y * origin.width() as f64 / Y_NORM) as i32))
            .max(0)
            .min(origin.height() as i32 - 1) as u32;

        origin.get_pixel(s_x, s_y)
    });
    println!("Max phi {max_phi}, {}", PI / 2.);

    println!("saving image");
    dest.save("output.png").unwrap();

    println!("done");
}
