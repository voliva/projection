use image::{io::Reader as ImageReader, GenericImageView, ImageBuffer};
use nalgebra::{DVector, Matrix3, Vector3};
use std::{f64::consts::PI, ops::Mul};

fn main() {
    println!("opening image");

    let origin = ImageReader::open("mercator_projection.jpeg")
        .unwrap()
        .decode()
        .unwrap();

    let dest_width = 500;
    let dest_height = 500; // (dest_width as f64 / PI) as u32;

    println!("generating image");
    let mut max_phi = 0.0f64;
    // A ojo de buen cubero... el N de groenlandia esta a 85º, que son 1.46rad. Amb aquesta constant, es queda un max phi de 1.46
    let Y_NORM = 5.8f64;

    // https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
    let k_vec = [0.0, 0.0, 1.0]; // x y z

    #[rustfmt::skip]
    let k_matrix = Matrix3::new(
        0.0, -k_vec[2], k_vec[1],
        k_vec[2], 0.0, -k_vec[0],
        -k_vec[1], k_vec[0], 0.0
    );

    let angle = PI / 2.0;
    let sin_part = angle.sin();
    let sin_matrix = Matrix3::new(
        sin_part, sin_part, sin_part, sin_part, sin_part, sin_part, sin_part, sin_part, sin_part,
    );
    let cos_part = 1.0 - angle.cos();
    let cos_matrix = Matrix3::new(
        cos_part, cos_part, cos_part, cos_part, cos_part, cos_part, cos_part, cos_part, cos_part,
    );
    let rotation_matrix = Matrix3::identity()
        + k_matrix.component_mul(&sin_matrix)
        + k_matrix.mul(k_matrix).component_mul(&cos_matrix);
    // println!("{rotation_matrix}");

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

        let dest_vec = Vector3::new(theta.cos() * phi.cos(), phi.sin(), theta.sin() * phi.cos());
        // println!("t: {theta}, p: {phi}, vec: {dest_vec}");
        let src_vec = rotation_matrix * dest_vec;
        phi = src_vec[1].asin();
        theta = src_vec[2].atan2(src_vec[0]);
        // println!("=> t: {theta}, p: {phi}, vec: {src_vec}");

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
        let normalised_s_y = ((1. / phi.cos()) + phi.tan()).ln().min(10.0).max(-10.0);

        let s_x = ((normalised_s_x * origin.width() as f64) as u32).min(origin.width() - 1);
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
