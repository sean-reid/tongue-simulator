use crate::anatomy::{AnatomyConfig, Vec2};

pub const NUM_SEGMENTS: usize = 14;
pub const NUM_NODES: usize = NUM_SEGMENTS + 1; // 15 per layer

/// A single node in the tongue mesh.
#[derive(Clone, Debug)]
pub struct MeshNode {
    pub id: usize,
    pub position: Vec2,
    pub predicted: Vec2,
    pub velocity: Vec2,
    pub inv_mass: f64,          // 0.0 = pinned
    pub muscle_weights: [f64; 9],
}

impl MeshNode {
    pub fn new(id: usize, pos: Vec2, inv_mass: f64, weights: [f64; 9]) -> Self {
        MeshNode {
            id,
            position: pos.clone(),
            predicted: pos,
            velocity: Vec2::new(0.0, 0.0),
            inv_mass,
            muscle_weights: weights,
        }
    }
}

/// Distance constraint between two nodes.
#[derive(Clone, Debug)]
pub struct DistanceConstraint {
    pub a: usize,
    pub b: usize,
    pub rest_length: f64,
    pub stiffness: f64, // 0..1
}

/// Area constraint for a quad element (incompressibility).
#[derive(Clone, Debug)]
pub struct AreaConstraint {
    pub nodes: [usize; 4],  // quad corners
    pub rest_area: f64,
    pub stiffness: f64,
}

/// The tongue soft-body mesh.
pub struct TongueMesh {
    pub dorsal: Vec<MeshNode>,   // root (i=0) → tip (i=14)
    pub ventral: Vec<MeshNode>,  // root (i=0) → tip (i=14)
    pub edge_constraints: Vec<DistanceConstraint>,
    pub area_constraints: Vec<AreaConstraint>,
}

impl TongueMesh {
    pub fn new(anatomy: &AnatomyConfig) -> Self {
        let (dorsal, ventral) = rest_positions(anatomy);
        let edge_constraints = build_edge_constraints(&dorsal, &ventral);
        let area_constraints = build_area_constraints(&dorsal, &ventral);
        TongueMesh { dorsal, ventral, edge_constraints, area_constraints }
    }

    /// Total number of nodes (dorsal + ventral).
    pub fn node_count(&self) -> usize {
        self.dorsal.len() + self.ventral.len()
    }

    pub fn all_nodes_mut(&mut self) -> impl Iterator<Item = &mut MeshNode> {
        self.dorsal.iter_mut().chain(self.ventral.iter_mut())
    }
}

/// Build rest positions for the tongue mesh based on anatomy.
fn rest_positions(anatomy: &AnatomyConfig) -> (Vec<MeshNode>, Vec<MeshNode>) {
    // Tongue tip is near (130, 22) dorsal, (130, 15) ventral
    // Tongue root is on the hyoid arc
    let root_arc = &anatomy.tongue_root_arc;

    // Generate 15 dorsal positions from root → tip
    let dorsal_positions: Vec<Vec2> = (0..NUM_NODES)
        .map(|i| {
            let t = i as f64 / (NUM_NODES - 1) as f64;
            if i == 0 {
                // Root node on the arc at mid-angle
                let angle = (root_arc.angle_start + root_arc.angle_end) * 0.5;
                Vec2::new(
                    root_arc.center.x + root_arc.radius * angle.cos(),
                    root_arc.center.y + root_arc.radius * angle.sin() + 2.0,
                )
            } else {
                // Interpolate from root toward tip with a slight curve
                let x = 30.0 + t * (130.0 - 30.0);
                let y = 22.0 + (t * std::f64::consts::PI).sin() * 14.0 + t * 4.0;
                Vec2::new(x, y)
            }
        })
        .collect();

    let ventral_positions: Vec<Vec2> = (0..NUM_NODES)
        .map(|i| {
            let t = i as f64 / (NUM_NODES - 1) as f64;
            if i == 0 {
                let angle = (root_arc.angle_start + root_arc.angle_end) * 0.5;
                Vec2::new(
                    root_arc.center.x + root_arc.radius * angle.cos(),
                    root_arc.center.y + root_arc.radius * angle.sin() - 2.0,
                )
            } else {
                let x = 30.0 + t * (130.0 - 30.0);
                let y = 16.0 + (t * std::f64::consts::PI).sin() * 6.0 + t * 3.0;
                Vec2::new(x, y)
            }
        })
        .collect();

    // Muscle weight distributions (per muscle index 0..9)
    // [GGa, GGp, SG, HG, PG, SL, IL, T, V]
    let dorsal_nodes: Vec<MeshNode> = dorsal_positions
        .iter()
        .enumerate()
        .map(|(i, pos)| {
            let t = i as f64 / (NUM_NODES - 1) as f64;
            let inv_mass = if i == 0 { 0.0 } else { 1.0 }; // root pinned
            MeshNode::new(i, pos.clone(), inv_mass, dorsal_weights(t))
        })
        .collect();

    let ventral_nodes: Vec<MeshNode> = ventral_positions
        .iter()
        .enumerate()
        .map(|(i, pos)| {
            let t = i as f64 / (NUM_NODES - 1) as f64;
            let inv_mass = if i == 0 { 0.0 } else { 1.0 };
            MeshNode::new(NUM_NODES + i, pos.clone(), inv_mass, ventral_weights(t))
        })
        .collect();

    (dorsal_nodes, ventral_nodes)
}

/// Muscle weight distribution for dorsal nodes (0=root, 1=tip).
fn dorsal_weights(t: f64) -> [f64; 9] {
    let tip = t;       // increases toward tip
    let body = 1.0 - (t - 0.5).abs() * 2.0; // peaks at mid-body
    let root = 1.0 - t; // decreases from root

    [
        tip * 0.9,           // GGa: tip region
        body * 0.6,          // GGp: body region
        body * 0.7,          // SG: body (pulls up+back)
        root * 0.7,          // HG: root-body region
        body * 0.6,          // PG: body (elevates dorsum)
        tip * 0.9,           // SL: tip (curls up)
        tip * 0.7,           // IL: tip (curls down)
        body * 0.5,          // T: whole tongue (narrows)
        body * 0.6,          // V: body (flattens)
    ]
}

fn ventral_weights(t: f64) -> [f64; 9] {
    let tip = t;
    let body = 1.0 - (t - 0.5).abs() * 2.0;
    let root = 1.0 - t;

    [
        tip * 0.7,
        body * 0.5,
        body * 0.5,
        root * 0.8,
        body * 0.4,
        tip * 0.5,   // SL less effect on ventral
        tip * 0.9,   // IL more effect on ventral
        body * 0.5,
        body * 0.7,
    ]
}

fn build_edge_constraints(
    dorsal: &[MeshNode],
    ventral: &[MeshNode],
) -> Vec<DistanceConstraint> {
    let mut constraints = Vec::new();
    let stiffness = 0.9;

    // Dorsal edge constraints (along surface)
    for i in 0..NUM_NODES - 1 {
        let rest = dorsal[i].position.distance(&dorsal[i + 1].position);
        constraints.push(DistanceConstraint {
            a: dorsal[i].id,
            b: dorsal[i + 1].id,
            rest_length: rest,
            stiffness,
        });
    }

    // Ventral edge constraints
    for i in 0..NUM_NODES - 1 {
        let rest = ventral[i].position.distance(&ventral[i + 1].position);
        constraints.push(DistanceConstraint {
            a: ventral[i].id,
            b: ventral[i + 1].id,
            rest_length: rest,
            stiffness,
        });
    }

    // Cross-section constraints (dorsal ↔ ventral at each segment)
    let cross_stiffness = 0.95; // high stiffness for thickness preservation
    for i in 0..NUM_NODES {
        let rest = dorsal[i].position.distance(&ventral[i].position);
        constraints.push(DistanceConstraint {
            a: dorsal[i].id,
            b: ventral[i].id,
            rest_length: rest,
            stiffness: cross_stiffness,
        });
    }

    // Diagonal constraints (shear resistance)
    let shear_stiffness = 0.7;
    for i in 0..NUM_NODES - 1 {
        let rest_a = dorsal[i].position.distance(&ventral[i + 1].position);
        constraints.push(DistanceConstraint {
            a: dorsal[i].id,
            b: ventral[i + 1].id,
            rest_length: rest_a,
            stiffness: shear_stiffness,
        });
        let rest_b = ventral[i].position.distance(&dorsal[i + 1].position);
        constraints.push(DistanceConstraint {
            a: ventral[i].id,
            b: dorsal[i + 1].id,
            rest_length: rest_b,
            stiffness: shear_stiffness,
        });
    }

    constraints
}

fn build_area_constraints(dorsal: &[MeshNode], ventral: &[MeshNode]) -> Vec<AreaConstraint> {
    let mut constraints = Vec::new();
    for i in 0..NUM_NODES - 1 {
        // Quad: dorsal[i], dorsal[i+1], ventral[i+1], ventral[i]
        let p0 = &dorsal[i].position;
        let p1 = &dorsal[i + 1].position;
        let p2 = &ventral[i + 1].position;
        let p3 = &ventral[i].position;
        let rest_area = quad_area(p0, p1, p2, p3);
        constraints.push(AreaConstraint {
            nodes: [dorsal[i].id, dorsal[i + 1].id, ventral[i + 1].id, ventral[i].id],
            rest_area,
            stiffness: 0.5,
        });
    }
    constraints
}

pub fn quad_area(p0: &Vec2, p1: &Vec2, p2: &Vec2, p3: &Vec2) -> f64 {
    // Cross product of diagonals
    let d1 = p2.sub(p0);
    let d2 = p3.sub(p1);
    (d1.x * d2.y - d1.y * d2.x) * 0.5
}
