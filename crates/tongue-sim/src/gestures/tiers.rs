/// Gesture tier identifiers — each tier controls independent articulators.
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum GestureTier {
    LipAperture,
    LipProtrusion,
    TongueTip,
    TongueBody,
    Velum,
    Glottis,
}

/// Trapezoidal gesture activation profile.
/// Time 0..1 within the phoneme.
pub fn trapezoid(t: f64, onset: f64, plateau_start: f64, plateau_end: f64, offset: f64) -> f64 {
    if t < onset {
        0.0
    } else if t < plateau_start {
        (t - onset) / (plateau_start - onset).max(1e-9)
    } else if t <= plateau_end {
        1.0
    } else if t < offset {
        1.0 - (t - plateau_end) / (offset - plateau_end).max(1e-9)
    } else {
        0.0
    }
}
