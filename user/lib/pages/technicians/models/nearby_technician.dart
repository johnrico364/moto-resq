class NearbyTechnician {
  const NearbyTechnician({
    required this.name,
    required this.distance,
    required this.eta,
    required this.seed,
    this.service,
    this.rating,
  });

  final String name;
  final String distance;
  final String eta;
  final int seed;

  /// Shown on detail; defaults in UI if null.
  final String? service;
  final String? rating;
}
