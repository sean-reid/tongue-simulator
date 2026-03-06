pub mod defaults;

use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Vec2 {
    pub x: f64,
    pub y: f64,
}

impl Vec2 {
    pub fn new(x: f64, y: f64) -> Self {
        Vec2 { x, y }
    }

    pub fn distance(&self, other: &Vec2) -> f64 {
        let dx = self.x - other.x;
        let dy = self.y - other.y;
        (dx * dx + dy * dy).sqrt()
    }

    pub fn dot(&self, other: &Vec2) -> f64 {
        self.x * other.x + self.y * other.y
    }

    pub fn length(&self) -> f64 {
        (self.x * self.x + self.y * self.y).sqrt()
    }

    pub fn normalized(&self) -> Vec2 {
        let len = self.length();
        if len < 1e-10 {
            Vec2::new(0.0, 0.0)
        } else {
            Vec2::new(self.x / len, self.y / len)
        }
    }

    pub fn scale(&self, s: f64) -> Vec2 {
        Vec2::new(self.x * s, self.y * s)
    }

    pub fn add(&self, other: &Vec2) -> Vec2 {
        Vec2::new(self.x + other.x, self.y + other.y)
    }

    pub fn sub(&self, other: &Vec2) -> Vec2 {
        Vec2::new(self.x - other.x, self.y - other.y)
    }

    pub fn lerp(&self, other: &Vec2, t: f64) -> Vec2 {
        Vec2::new(
            self.x + (other.x - self.x) * t,
            self.y + (other.y - self.y) * t,
        )
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ArcSpec {
    pub center: Vec2,
    pub radius: f64,
    pub angle_start: f64, // radians
    pub angle_end: f64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AnatomyConfig {
    /// Hard palate as 4 control points of a cubic Bezier (posterior → anterior)
    pub palate_bezier: [Vec2; 4],
    /// Alveolar ridge — bump at anterior end of hard palate
    pub alveolar_ridge: Vec<Vec2>,
    /// Posterior pharyngeal wall — vertical polyline
    pub pharyngeal_wall: Vec<Vec2>,
    /// Nasal cavity boundary — closed polygon (above palate)
    pub nasal_cavity: Vec<Vec2>,
    /// Upper teeth polygon
    pub upper_teeth: Vec<Vec2>,
    /// Lower teeth polygon (in mandible-local coords)
    pub lower_teeth_local: Vec<Vec2>,
    /// Jaw rotation pivot (TMJ)
    pub tmj_pivot: Vec2,
    /// Mandible polygon (rest position, 0° jaw angle)
    pub mandible_polygon: Vec<Vec2>,
    /// Hyoid bone position (rest)
    pub hyoid_position: Vec2,
    /// Hyoid vertical range (min_offset, max_offset) in mm
    pub hyoid_range: (f64, f64),
    /// Epiglottis anchor (hinge point)
    pub epiglottis_anchor: Vec2,
    /// Larynx / glottis position
    pub larynx_position: Vec2,
    /// Trachea bottom
    pub trachea_bottom: Vec2,
    /// Arc along which tongue root nodes slide (attached to hyoid)
    pub tongue_root_arc: ArcSpec,
    /// Upper lip curve (5 control points, rest position)
    pub upper_lip: Vec<Vec2>,
    /// Lower lip curve (5 control points, rest position)
    pub lower_lip: Vec<Vec2>,
    /// Velum hinge point
    pub velum_hinge: Vec2,
    /// Velum rest length (mm)
    pub velum_length: f64,
}
