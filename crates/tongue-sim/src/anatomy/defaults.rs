use super::{AnatomyConfig, ArcSpec, Vec2};

/// Default adult vocal tract geometry.
///
/// Coordinate system (midsagittal, mm):
///   x increases posteriorly → anteriorly (lips direction)
///   y increases upward (toward palate / skull)
///   Origin near the larynx/hyoid region.
///
/// Key landmarks:
///   Glottis:             x≈15, y≈0
///   Hyoid:               x≈30, y≈8
///   Tongue body center:  x≈65, y≈18
///   Velum hinge:         x≈55, y≈50
///   Hard palate span:    x=[60,145], y≈48→40
///   Alveolar ridge:      x≈145, y≈42
///   Upper teeth:         x=[145,158], y≈42→30
///   Lips:                x≈162, y≈28/18
///   TMJ pivot:           x≈135, y≈58
pub fn default_anatomy() -> AnatomyConfig {
    AnatomyConfig {
        // Hard palate: cubic Bezier from velum junction to alveolar ridge
        palate_bezier: [
            Vec2::new(60.0, 50.0),
            Vec2::new(90.0, 52.0),
            Vec2::new(120.0, 50.0),
            Vec2::new(148.0, 42.0),
        ],

        // Alveolar ridge bump
        alveolar_ridge: vec![
            Vec2::new(145.0, 42.0),
            Vec2::new(148.0, 44.0),
            Vec2::new(152.0, 43.0),
            Vec2::new(155.0, 40.0),
            Vec2::new(157.0, 37.0),
        ],

        // Posterior pharyngeal wall
        pharyngeal_wall: vec![
            Vec2::new(15.0, -5.0),
            Vec2::new(15.0, 10.0),
            Vec2::new(14.0, 25.0),
            Vec2::new(13.0, 40.0),
            Vec2::new(14.0, 52.0),
            Vec2::new(18.0, 60.0),
        ],

        // Nasal cavity (closed polygon above palate)
        nasal_cavity: vec![
            Vec2::new(55.0, 50.0),
            Vec2::new(60.0, 52.0),
            Vec2::new(90.0, 54.0),
            Vec2::new(120.0, 53.0),
            Vec2::new(148.0, 48.0),
            Vec2::new(160.0, 50.0),
            Vec2::new(160.0, 78.0),
            Vec2::new(55.0, 78.0),
        ],

        // Upper teeth (polygonal)
        upper_teeth: vec![
            Vec2::new(148.0, 42.0),
            Vec2::new(152.0, 43.0),
            Vec2::new(158.0, 38.0),
            Vec2::new(160.0, 32.0),
            Vec2::new(158.0, 28.0),
            Vec2::new(153.0, 26.0),
            Vec2::new(149.0, 28.0),
            Vec2::new(147.0, 32.0),
            Vec2::new(148.0, 38.0),
        ],

        // Lower teeth in mandible-local coords (jaw hinge = origin for rotation)
        lower_teeth_local: vec![
            Vec2::new(148.0, 18.0),
            Vec2::new(152.0, 18.0),
            Vec2::new(157.0, 14.0),
            Vec2::new(158.0, 9.0),
            Vec2::new(155.0, 5.0),
            Vec2::new(150.0, 4.0),
            Vec2::new(146.0, 6.0),
            Vec2::new(145.0, 12.0),
            Vec2::new(147.0, 17.0),
        ],

        // TMJ pivot
        tmj_pivot: Vec2::new(135.0, 58.0),

        // Mandible polygon (at 0° jaw angle, rest)
        mandible_polygon: vec![
            Vec2::new(135.0, 58.0),
            Vec2::new(100.0, 10.0),
            Vec2::new(50.0, 5.0),
            Vec2::new(20.0, 8.0),
            Vec2::new(15.0, 4.0),
            Vec2::new(15.0, -5.0),
            Vec2::new(30.0, -8.0),
            Vec2::new(60.0, -5.0),
            Vec2::new(110.0, 0.0),
            Vec2::new(135.0, 20.0),
            Vec2::new(145.0, 35.0),
            Vec2::new(148.0, 42.0),
        ],

        // Hyoid bone
        hyoid_position: Vec2::new(30.0, 8.0),
        hyoid_range: (-6.0, 4.0),

        // Epiglottis hinge near larynx
        epiglottis_anchor: Vec2::new(20.0, 22.0),

        // Larynx / glottis
        larynx_position: Vec2::new(15.0, 3.0),

        // Trachea bottom
        trachea_bottom: Vec2::new(15.0, -20.0),

        // Tongue root arc: center below/behind hyoid, radius ~12mm
        tongue_root_arc: ArcSpec {
            center: Vec2::new(22.0, 14.0),
            radius: 12.0,
            angle_start: 0.3,  // radians from positive-x axis
            angle_end: 1.2,
        },

        // Upper lip (5 control points)
        upper_lip: vec![
            Vec2::new(155.0, 36.0),
            Vec2::new(158.0, 35.0),
            Vec2::new(162.0, 32.0),
            Vec2::new(164.0, 29.0),
            Vec2::new(163.0, 27.0),
        ],

        // Lower lip (5 control points)
        lower_lip: vec![
            Vec2::new(155.0, 20.0),
            Vec2::new(158.0, 21.0),
            Vec2::new(162.0, 22.0),
            Vec2::new(164.0, 21.0),
            Vec2::new(163.0, 19.0),
        ],

        // Velum hinge (posterior soft palate)
        velum_hinge: Vec2::new(52.0, 50.0),
        velum_length: 22.0,
    }
}
