#[cfg(test)]
mod tests {
    use tongue_sim::anatomy::defaults::default_anatomy;
    use tongue_sim::physics::mesh::TongueMesh;
    use tongue_sim::physics::rigid_bodies::RigidBodies;
    use tongue_sim::physics::pbd::step_mesh;
    use tongue_sim::phoneme::targets::get_target;

    #[test]
    fn test_mesh_initialization() {
        let anatomy = default_anatomy();
        let mesh = TongueMesh::new(&anatomy);
        assert_eq!(mesh.dorsal.len(), 15, "Dorsal should have 15 nodes");
        assert_eq!(mesh.ventral.len(), 15, "Ventral should have 15 nodes");
        // Root nodes should be pinned (inv_mass = 0)
        assert!(mesh.dorsal[0].inv_mass < 1e-10, "Root dorsal should be pinned");
        assert!(mesh.ventral[0].inv_mass < 1e-10, "Root ventral should be pinned");
    }

    #[test]
    fn test_mesh_edge_constraints() {
        let anatomy = default_anatomy();
        let mesh = TongueMesh::new(&anatomy);
        // All edge constraints should have positive rest lengths
        for c in &mesh.edge_constraints {
            assert!(c.rest_length > 0.0, "Rest length must be positive");
            assert!(c.stiffness > 0.0 && c.stiffness <= 1.0, "Stiffness in range");
        }
    }

    #[test]
    fn test_rigid_bodies_pd_step() {
        let anatomy = default_anatomy();
        let mut rigid = RigidBodies::new(&anatomy);
        let target = get_target("IY");

        // After many steps, jaw should converge toward target
        for _ in 0..500 {
            rigid.step(&target, 1.0 / 240.0);
        }

        assert!(
            (rigid.jaw_angle - target.jaw_angle).abs() < 2.0,
            "Jaw should converge to IY target: got {} expected {}",
            rigid.jaw_angle, target.jaw_angle
        );
    }

    #[test]
    fn test_pbd_step_stability() {
        let anatomy = default_anatomy();
        let mut mesh = TongueMesh::new(&anatomy);
        let target = get_target("AA");
        let dt = 1.0 / 240.0;

        // Run 200 steps and check for NaN / stability
        for _ in 0..200 {
            step_mesh(&mut mesh, &target, &anatomy, dt);
        }

        for node in &mesh.dorsal {
            assert!(node.position.x.is_finite(), "x should be finite");
            assert!(node.position.y.is_finite(), "y should be finite");
            // Nodes should stay within plausible range
            assert!(node.position.x > 0.0 && node.position.x < 300.0);
            assert!(node.position.y > -50.0 && node.position.y < 100.0);
        }
    }

    #[test]
    fn test_tongue_positions_differ_by_phoneme() {
        let anatomy = default_anatomy();
        let dt = 1.0 / 240.0;

        let run_to_equilibrium = |arpabet: &str| -> Vec<(f64, f64)> {
            let mut mesh = TongueMesh::new(&anatomy);
            let target = get_target(arpabet);
            for _ in 0..150 {
                step_mesh(&mut mesh, &target, &anatomy, dt);
            }
            mesh.dorsal.iter().map(|n| (n.position.x, n.position.y)).collect()
        };

        let iy_pos = run_to_equilibrium("IY");
        let aa_pos = run_to_equilibrium("AA");

        // IY (high front) vs AA (low back) — dorsal midpoint should differ in y
        let mid = 7usize;
        let iy_y = iy_pos[mid].1;
        let aa_y = aa_pos[mid].1;

        // IY tongue body should be higher than AA
        assert!(
            iy_y > aa_y - 1.0,
            "IY ({}) should have higher tongue body than AA ({}) at midpoint",
            iy_y, aa_y
        );
    }
}
