<?php

declare(strict_types=1);

namespace App\Controllers;

use PDO;

class StatsController
{
  private PDO $pdo;

  public function __construct(PDO $pdo)
  {
    $this->pdo = $pdo;
  }

  /**
   * Get system statistics
   * Returns counts of sites, guides, and visitors
   */
  public function getStats(): array
  {
    try {
      // Count approved sites
      $sitesStmt = $this->pdo->prepare("
                SELECT COUNT(*) as count 
                FROM sites 
                WHERE status = 'approved'
            ");
      $sitesStmt->execute();
      $sitesCount = (int) $sitesStmt->fetch(PDO::FETCH_ASSOC)['count'];

      // Count active guides (site_agents)
      $guidesStmt = $this->pdo->prepare("
                SELECT COUNT(*) as count 
                FROM users 
                WHERE role = 'site_agent' AND status = 'active'
            ");
      $guidesStmt->execute();
      $guidesCount = (int) $guidesStmt->fetch(PDO::FETCH_ASSOC)['count'];

      // Count visitors
      $visitorsStmt = $this->pdo->prepare("
                SELECT COUNT(*) as count 
                FROM users 
                WHERE role = 'visitor'
            ");
      $visitorsStmt->execute();
      $visitorsCount = (int) $visitorsStmt->fetch(PDO::FETCH_ASSOC)['count'];

      return [
        'sites' => $sitesCount,
        'guides' => $guidesCount,
        'visitors' => $visitorsCount
      ];
    } catch (\Exception $e) {
      return [
        '_status' => 500,
        'error' => 'Failed to fetch statistics',
        'details' => $e->getMessage()
      ];
    }
  }
}
