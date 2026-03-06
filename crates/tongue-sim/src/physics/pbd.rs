use crate::anatomy::{AnatomyConfig, Vec2};
use crate::phoneme::ArticulatoryState;
use crate::physics::mesh::{TongueMesh, DistanceConstraint, AreaConstraint, quad_area, NUM_NODES};
use crate::physics::muscles;
use crate::physics::collisions;

const RAYLEIGH_MASS: f64 = 12.0;
const PBD_ITERATIONS: usize = 10;

/// Step the tongue mesh forward by dt seconds using PBD.
pub fn step_mesh(
    mesh: &mut TongueMesh,
    target: &ArticulatoryState,
    anatomy: &AnatomyConfig,
    dt: f64,
) {
    let n = NUM_NODES;

    // 1. Compute muscle forces
    let mut forces_d = vec![Vec2::new(0.0, 0.0); n];
    let mut forces_v = vec![Vec2::new(0.0, 0.0); n];

    muscles::apply_muscle_forces(
        &mesh.dorsal, &mesh.ventral,
        &target.muscle_activations,
        &mut forces_d, &mut forces_v,
    );

    // Small gravity term (scaled for mm / s² units)
    let gravity_acc = -98.1; // mm/s² (0.01 × 9810)

    // 2. Predict positions: x* = x + v*dt + a*dt²
    for i in 0..n {
        {
            let node = &mut mesh.dorsal[i];
            if node.inv_mass > 0.0 {
                node.velocity.x *= 1.0 - RAYLEIGH_MASS * dt;
                node.velocity.y *= 1.0 - RAYLEIGH_MASS * dt;
                let ax = forces_d[i].x * node.inv_mass;
                let ay = forces_d[i].y * node.inv_mass + gravity_acc;
                node.velocity.x += ax * dt;
                node.velocity.y += ay * dt;
                clamp_speed(&mut node.velocity, 500.0);
                node.predicted.x = node.position.x + node.velocity.x * dt;
                node.predicted.y = node.position.y + node.velocity.y * dt;
            } else {
                node.predicted = node.position.clone();
            }
        }
        {
            let node = &mut mesh.ventral[i];
            if node.inv_mass > 0.0 {
                node.velocity.x *= 1.0 - RAYLEIGH_MASS * dt;
                node.velocity.y *= 1.0 - RAYLEIGH_MASS * dt;
                let ax = forces_v[i].x * node.inv_mass;
                let ay = forces_v[i].y * node.inv_mass + gravity_acc;
                node.velocity.x += ax * dt;
                node.velocity.y += ay * dt;
                clamp_speed(&mut node.velocity, 500.0);
                node.predicted.x = node.position.x + node.velocity.x * dt;
                node.predicted.y = node.position.y + node.velocity.y * dt;
            } else {
                node.predicted = node.position.clone();
            }
        }
    }

    // 3. Constraint solving
    let edge_c = mesh.edge_constraints.clone();
    let area_c = mesh.area_constraints.clone();

    for _ in 0..PBD_ITERATIONS {
        for c in &edge_c {
            solve_distance_constraint(mesh, c);
        }
        for c in &area_c {
            solve_area_constraint(mesh, c);
        }
        collisions::project_tongue_from_palate(mesh, anatomy);
    }

    // 4. Update velocities and positions
    for i in 0..n {
        {
            let node = &mut mesh.dorsal[i];
            if node.inv_mass > 0.0 {
                node.velocity.x = (node.predicted.x - node.position.x) / dt;
                node.velocity.y = (node.predicted.y - node.position.y) / dt;
                node.position = node.predicted.clone();
            }
        }
        {
            let node = &mut mesh.ventral[i];
            if node.inv_mass > 0.0 {
                node.velocity.x = (node.predicted.x - node.position.x) / dt;
                node.velocity.y = (node.predicted.y - node.position.y) / dt;
                node.position = node.predicted.clone();
            }
        }
    }
}

fn clamp_speed(v: &mut Vec2, max_speed: f64) {
    let s = (v.x * v.x + v.y * v.y).sqrt();
    if s > max_speed {
        v.x *= max_speed / s;
        v.y *= max_speed / s;
    }
}

// --- Node access helpers ---

fn get_predicted(mesh: &TongueMesh, id: usize) -> Vec2 {
    if id < NUM_NODES {
        mesh.dorsal[id].predicted.clone()
    } else {
        mesh.ventral[id - NUM_NODES].predicted.clone()
    }
}

fn get_inv_mass(mesh: &TongueMesh, id: usize) -> f64 {
    if id < NUM_NODES {
        mesh.dorsal[id].inv_mass
    } else {
        mesh.ventral[id - NUM_NODES].inv_mass
    }
}

fn set_predicted(mesh: &mut TongueMesh, id: usize, p: Vec2) {
    if id < NUM_NODES {
        mesh.dorsal[id].predicted = p;
    } else {
        mesh.ventral[id - NUM_NODES].predicted = p;
    }
}

// --- Constraint solvers ---

fn solve_distance_constraint(mesh: &mut TongueMesh, c: &DistanceConstraint) {
    let pa = get_predicted(mesh, c.a);
    let pb = get_predicted(mesh, c.b);
    let wa = get_inv_mass(mesh, c.a);
    let wb = get_inv_mass(mesh, c.b);
    let w_sum = wa + wb;
    if w_sum < 1e-10 { return; }

    let delta = pb.sub(&pa);
    let dist = delta.length();
    if dist < 1e-10 { return; }

    let constraint = (dist - c.rest_length) / dist;
    let dx = delta.scale(constraint * c.stiffness / w_sum);

    if wa > 0.0 {
        set_predicted(mesh, c.a, pa.add(&dx.scale(wa)));
    }
    if wb > 0.0 {
        set_predicted(mesh, c.b, pb.sub(&dx.scale(wb)));
    }
}

fn solve_area_constraint(mesh: &mut TongueMesh, c: &AreaConstraint) {
    let p = [
        get_predicted(mesh, c.nodes[0]),
        get_predicted(mesh, c.nodes[1]),
        get_predicted(mesh, c.nodes[2]),
        get_predicted(mesh, c.nodes[3]),
    ];
    let w = [
        get_inv_mass(mesh, c.nodes[0]),
        get_inv_mass(mesh, c.nodes[1]),
        get_inv_mass(mesh, c.nodes[2]),
        get_inv_mass(mesh, c.nodes[3]),
    ];

    let area = quad_area(&p[0], &p[1], &p[2], &p[3]);
    let constraint_val = area - c.rest_area;

    if constraint_val.abs() < 0.01 { return; }

    // Gradient of quad area w.r.t. each vertex
    let grad = [
        Vec2::new(-(p[3].y - p[1].y) * 0.5, (p[3].x - p[1].x) * 0.5),
        Vec2::new(-(p[2].y - p[0].y) * 0.5, (p[2].x - p[0].x) * 0.5),
        Vec2::new(-(p[1].y - p[3].y) * 0.5, (p[1].x - p[3].x) * 0.5),
        Vec2::new(-(p[0].y - p[2].y) * 0.5, (p[0].x - p[2].x) * 0.5),
    ];

    let denom: f64 = grad.iter().zip(w.iter()).map(|(g, &wi)| wi * g.dot(g)).sum();
    if denom.abs() < 1e-10 { return; }

    let lambda = -constraint_val * c.stiffness / denom;

    for i in 0..4 {
        if w[i] > 0.0 {
            let new_p = p[i].add(&grad[i].scale(lambda * w[i]));
            set_predicted(mesh, c.nodes[i], new_p);
        }
    }
}
