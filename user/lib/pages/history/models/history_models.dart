enum HistoryStatus { completed, canceled }

class HistoryEntry {
  const HistoryEntry({
    required this.name,
    required this.timestamp,
    required this.status,
    required this.seed,
  });

  final String name;
  final String timestamp;
  final HistoryStatus status;
  final int seed;
}
