use crate::anatomy::{AnatomyConfig, Vec2};
use crate::physics::mesh::{TongueMesh, NUM_NODES};

/// Cubic Bezier evaluation.
pub fn bezier3(p0: &Vec2, p1: &Vec2, p2: &Vec2, p3: &Vec2, t: f64) -> Vec2 {
    let u = 1.0 - t;
    let b0 = u * u * u;
    let b1 = 3.0 * u * u * t;
    let b2 = 3.0 * u * t * t;
    let b3 = t * t * t;
    Vec2::new(
        b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x,
        b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y,
    )
}

/// Approximate the palate y-coordinate at a given x by sampling the Bezier.
pub fn palate_y_at_x(x: f64, p0: &Vec2, p1: &Vec2, p2: &Vec2, p3: &Vec2) -> f64 {
    // Binary search for t where bezier.x ≈ x
    let mut lo = 0.0f64;
    let mut hi = 1.0f64;
    for _ in 0..12 {
        let mid = (lo + hi) * 0.5;
        let bx = bezier3(p0, p1, p2, p3, mid).x;
        if bx < x { lo = mid; } else { hi = mid; }
    }
    let t = (lo + hi) * 0.5;
    bezier3(p0, p1, p2, p3, t).y
}

/// Project tongue nodes out of the hard palate.
pub fn project_tongue_from_palate(mesh: &mut TongueMesh, anatomy: &AnatomyConfig) {
    let [ref p0, ref p1, ref p2, ref p3] = anatomy.palate_bezier;
    let alveolar = &anatomy.alveolar_ridge;

    // Only dorsal nodes can contact palate (upper surface)
    for i in 0..NUM_NODES {
        let node = &mut mesh.dorsal[i];
        if node.inv_mass < 1e-10 { continue; }

        // Only in the x range of the palate
        if node.predicted.x < 55.0 || node.predicted.x > 165.0 { continue; }

        let palate_y_approx = palate_y_at_x(node.predicted.x, p0, p1, p2, p3);

        // If node is above the palate — push it down (allow 1mm contact layer)
        if node.predicted.y > palate_y_approx - 1.0 {
            node.predicted.y = palate_y_approx - 1.0;
        }
    }

    // Alveolar ridge constraint for tip nodes (anterior dorsal)
    for i in (NUM_NODES - 3)..NUM_NODES {
        let node = &mut mesh.dorsal[i];
        if node.inv_mass < 1e-10 { continue; }
        if node.predicted.x < 140.0 || node.predicted.x > 165.0 { continue; }

        // Find ridge y at this x
        for j in 0..alveolar.len().saturating_sub(1) {
            let a = &alveolar[j];
            let b = &alveolar[j + 1];
            if node.predicted.x >= a.x && node.predicted.x <= b.x {
                let frac = (node.predicted.x - a.x) / (b.x - a.x).max(0.01);
                let ridge_y = a.y + (b.y - a.y) * frac;
                if node.predicted.y > ridge_y - 1.0 {
                    node.predicted.y = ridge_y - 1.0;
                }
                break;
            }
        }
    }

    // Ventral / floor constraint
    for i in 0..NUM_NODES {
        let node = &mut mesh.ventral[i];
        if node.inv_mass < 1e-10 { continue; }
        if node.predicted.y < 14.0 {
            node.predicted.y = 14.0;
        }
    }
}
