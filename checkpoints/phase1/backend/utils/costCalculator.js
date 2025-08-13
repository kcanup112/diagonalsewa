/**
 * Cost Calculator Utility
 * Calculates construction costs based on plinth area
 * Rates are based on current Nepalese construction market rates (2024)
 */

// Base rates per square foot in NPR
const CONSTRUCTION_RATES = {
  // Material costs per sq ft
  materials: {
    cement: 180,        // Per sq ft
    steel: 220,         // Per sq ft  
    bricks: 120,        // Per sq ft
    sand: 45,           // Per sq ft
    aggregate: 55,      // Per sq ft
    tiles: 180,         // Per sq ft
    finishing: 250      // Per sq ft (paint, electrical, plumbing fixtures)
  },
  
  // Labor costs per sq ft
  labor: {
    masonry: 150,       // Per sq ft
    carpentry: 120,     // Per sq ft
    electrical: 80,     // Per sq ft
    plumbing: 70,       // Per sq ft
    painting: 40,       // Per sq ft
    finishing: 90       // Per sq ft
  },
  
  // Other costs per sq ft
  other: {
    design: 50,         // Architectural design
    supervision: 40,    // Site supervision
    permits: 25,        // Municipal permits
    contingency: 100    // 5-10% contingency
  }
};

// Quality multipliers
const QUALITY_MULTIPLIERS = {
  basic: 0.8,
  standard: 1.0,
  premium: 1.3,
  luxury: 1.8
};

class CostCalculator {
  /**
   * Calculate total construction cost and breakdown
   * @param {number} plinthArea - Area in square feet
   * @param {string} quality - Quality level (basic, standard, premium, luxury)
   * @returns {Object} Cost breakdown and total
   */
  static calculateCost(plinthArea, quality = 'standard') {
    if (!plinthArea || plinthArea <= 0) {
      throw new Error('Valid plinth area is required');
    }

    const multiplier = QUALITY_MULTIPLIERS[quality] || 1.0;
    
    // Calculate material costs
    const materialCosts = {
      cement: Math.round(CONSTRUCTION_RATES.materials.cement * plinthArea * multiplier),
      steel: Math.round(CONSTRUCTION_RATES.materials.steel * plinthArea * multiplier),
      bricks: Math.round(CONSTRUCTION_RATES.materials.bricks * plinthArea * multiplier),
      sand: Math.round(CONSTRUCTION_RATES.materials.sand * plinthArea * multiplier),
      aggregate: Math.round(CONSTRUCTION_RATES.materials.aggregate * plinthArea * multiplier),
      tiles: Math.round(CONSTRUCTION_RATES.materials.tiles * plinthArea * multiplier),
      finishing: Math.round(CONSTRUCTION_RATES.materials.finishing * plinthArea * multiplier)
    };

    // Calculate labor costs
    const laborCosts = {
      masonry: Math.round(CONSTRUCTION_RATES.labor.masonry * plinthArea * multiplier),
      carpentry: Math.round(CONSTRUCTION_RATES.labor.carpentry * plinthArea * multiplier),
      electrical: Math.round(CONSTRUCTION_RATES.labor.electrical * plinthArea * multiplier),
      plumbing: Math.round(CONSTRUCTION_RATES.labor.plumbing * plinthArea * multiplier),
      painting: Math.round(CONSTRUCTION_RATES.labor.painting * plinthArea * multiplier),
      finishing: Math.round(CONSTRUCTION_RATES.labor.finishing * plinthArea * multiplier)
    };

    // Calculate other costs
    const otherCosts = {
      design: Math.round(CONSTRUCTION_RATES.other.design * plinthArea),
      supervision: Math.round(CONSTRUCTION_RATES.other.supervision * plinthArea),
      permits: Math.round(CONSTRUCTION_RATES.other.permits * plinthArea),
      contingency: Math.round(CONSTRUCTION_RATES.other.contingency * plinthArea)
    };

    // Calculate totals
    const totalMaterials = Object.values(materialCosts).reduce((sum, cost) => sum + cost, 0);
    const totalLabor = Object.values(laborCosts).reduce((sum, cost) => sum + cost, 0);
    const totalOther = Object.values(otherCosts).reduce((sum, cost) => sum + cost, 0);
    const grandTotal = totalMaterials + totalLabor + totalOther;

    // Generate pie chart data (percentages)
    const pieChartData = [
      {
        name: 'Materials',
        value: Math.round((totalMaterials / grandTotal) * 100),
        amount: totalMaterials,
        color: '#8884d8'
      },
      {
        name: 'Labor',
        value: Math.round((totalLabor / grandTotal) * 100),
        amount: totalLabor,
        color: '#82ca9d'
      },
      {
        name: 'Design & Others',
        value: Math.round((totalOther / grandTotal) * 100),
        amount: totalOther,
        color: '#ffc658'
      }
    ];

    // Detailed breakdown for materials
    const materialBreakdown = Object.entries(materialCosts).map(([item, cost]) => ({
      item: item.charAt(0).toUpperCase() + item.slice(1),
      cost,
      percentage: Math.round((cost / totalMaterials) * 100)
    }));

    // Rate per square foot
    const ratePerSqFt = Math.round(grandTotal / plinthArea);

    return {
      plinthArea,
      quality,
      totalCost: grandTotal,
      ratePerSqFt,
      breakdown: {
        materials: {
          total: totalMaterials,
          items: materialCosts,
          detailed: materialBreakdown
        },
        labor: {
          total: totalLabor,
          items: laborCosts
        },
        other: {
          total: totalOther,
          items: otherCosts
        }
      },
      pieChartData,
      currency: 'NPR',
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get cost estimation for different quality levels
   * @param {number} plinthArea - Area in square feet
   * @returns {Object} Cost estimates for all quality levels
   */
  static getQualityComparison(plinthArea) {
    const comparisons = {};
    
    Object.keys(QUALITY_MULTIPLIERS).forEach(quality => {
      const estimate = this.calculateCost(plinthArea, quality);
      comparisons[quality] = {
        totalCost: estimate.totalCost,
        ratePerSqFt: estimate.ratePerSqFt,
        quality: quality.charAt(0).toUpperCase() + quality.slice(1)
      };
    });

    return {
      plinthArea,
      estimates: comparisons,
      currency: 'NPR'
    };
  }

  /**
   * Calculate cost for specific construction phase
   * @param {number} plinthArea - Area in square feet
   * @param {string} phase - Construction phase
   * @returns {Object} Phase-specific cost
   */
  static calculatePhaseWiseCost(plinthArea, phase) {
    const phaseRates = {
      foundation: 400,
      structure: 600,
      roofing: 300,
      masonry: 350,
      finishing: 450
    };

    if (!phaseRates[phase]) {
      throw new Error('Invalid construction phase');
    }

    const phaseCost = Math.round(phaseRates[phase] * plinthArea);
    
    return {
      phase: phase.charAt(0).toUpperCase() + phase.slice(1),
      cost: phaseCost,
      ratePerSqFt: phaseRates[phase],
      plinthArea,
      currency: 'NPR'
    };
  }
}

module.exports = CostCalculator;
