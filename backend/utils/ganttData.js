/**
 * Gantt Chart Data Generator
 * Generates construction timeline based on project area and type
 */

class GanttDataGenerator {
  /**
   * Generate construction timeline based on plinth area
   * @param {number} plinthArea - Area in square feet
   * @param {string} projectType - Type of construction (residential, commercial)
   * @param {number} floorMultiplier - Multiplier for additional floors
   * @returns {Object} Gantt chart data with timeline
   */
  static generateTimeline(plinthArea, projectType = 'residential', floorMultiplier = 1) {
    if (!plinthArea || plinthArea <= 0) {
      throw new Error('Valid plinth area is required');
    }

    // Base duration calculation (days per sq ft) with floor multiplier
    const baseDurationPerSqFt = projectType === 'commercial' ? 0.8 : 0.6;
    const totalProjectDays = Math.ceil(plinthArea * baseDurationPerSqFt * floorMultiplier);
    
    // Construction phases with their duration percentages
    const phases = [
      {
        id: 1,
        name: 'Site Preparation & Excavation',
        description: 'Land clearing, excavation, and site setup',
        percentage: 8,
        dependencies: [],
        category: 'foundation'
      },
      {
        id: 2,
        name: 'Foundation Work',
        description: 'Foundation laying, concrete work, and curing',
        percentage: 15,
        dependencies: [1],
        category: 'foundation'
      },
      {
        id: 3,
        name: 'Plinth & Column Construction',
        description: 'Plinth beam and column construction',
        percentage: 12,
        dependencies: [2],
        category: 'structure'
      },
      {
        id: 4,
        name: 'Wall Construction',
        description: 'Brick/block masonry and structural walls',
        percentage: 18,
        dependencies: [3],
        category: 'structure'
      },
      {
        id: 5,
        name: 'Roof Structure',
        description: 'Roof beam, slab, and waterproofing',
        percentage: 12,
        dependencies: [4],
        category: 'roofing'
      },
      {
        id: 6,
        name: 'Electrical & Plumbing Rough-in',
        description: 'Electrical wiring and plumbing installation',
        percentage: 10,
        dependencies: [4],
        category: 'MEP'
      },
      {
        id: 7,
        name: 'Plastering & Rendering',
        description: 'Internal and external plastering',
        percentage: 8,
        dependencies: [5, 6],
        category: 'finishing'
      },
      {
        id: 8,
        name: 'Flooring & Tiling',
        description: 'Floor installation and bathroom tiling',
        percentage: 7,
        dependencies: [7],
        category: 'finishing'
      },
      {
        id: 9,
        name: 'Door & Window Installation',
        description: 'Installing doors, windows, and fixtures',
        percentage: 5,
        dependencies: [7],
        category: 'finishing'
      },
      {
        id: 10,
        name: 'Painting & Final Finishing',
        description: 'Interior/exterior painting and final touches',
        percentage: 5,
        dependencies: [8, 9],
        category: 'finishing'
      }
    ];

    // Calculate start and end dates for each phase
    const startDate = new Date();
    let currentDate = new Date(startDate);
    
    const ganttData = phases.map((phase, index) => {
      const duration = Math.ceil((phase.percentage / 100) * totalProjectDays);
      const start = new Date(currentDate);
      
      // Add duration to get end date (excluding weekends)
      let endDate = new Date(start);
      let workingDays = 0;
      
      while (workingDays < duration) {
        endDate.setDate(endDate.getDate() + 1);
        // Skip weekends (Saturday = 6, Sunday = 0)
        if (endDate.getDay() !== 0 && endDate.getDay() !== 6) {
          workingDays++;
        }
      }
      
      // Update current date for next phase (with 1-day overlap for some phases)
      if (phase.dependencies.length > 0 && index > 0) {
        // Allow some phases to start before previous one ends
        currentDate = new Date(start.getTime() + (duration * 0.7 * 24 * 60 * 60 * 1000));
      } else {
        currentDate = new Date(endDate);
      }
      
      return {
        id: phase.id,
        name: phase.name,
        description: phase.description,
        start: start.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        duration: duration,
        progress: 0,
        category: phase.category,
        dependencies: phase.dependencies,
        resources: this.getPhaseResources(phase.category),
        milestones: this.getPhaseMilestones(phase.name),
        color: this.getPhaseColor(phase.category)
      };
    });

    // Calculate project summary
    const projectStart = ganttData[0].start;
    const projectEnd = ganttData[ganttData.length - 1].end;
    const totalDuration = Math.ceil((new Date(projectEnd) - new Date(projectStart)) / (1000 * 60 * 60 * 24));

    return {
      projectInfo: {
        name: `${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Construction Project`,
        plinthArea,
        projectType,
        totalDuration,
        workingDays: totalProjectDays,
        startDate: projectStart,
        endDate: projectEnd,
        status: 'planned'
      },
      phases: ganttData,
      summary: {
        totalPhases: phases.length,
        estimatedCost: this.estimateProjectCost(plinthArea),
        criticalPath: this.getCriticalPath(ganttData),
        resourceUtilization: this.getResourceUtilization(ganttData)
      },
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get resources required for each phase
   */
  static getPhaseResources(category) {
    const resources = {
      foundation: ['Excavator', 'Concrete Mixer', 'Mason', 'Helper'],
      structure: ['Crane', 'Mason', 'Steel Fixer', 'Carpenter'],
      roofing: ['Crane', 'Carpenter', 'Waterproofing Specialist'],
      MEP: ['Electrician', 'Plumber', 'Helper'],
      finishing: ['Painter', 'Tiler', 'Carpenter', 'Helper']
    };
    
    return resources[category] || ['General Worker'];
  }

  /**
   * Get milestones for each phase
   */
  static getPhaseMilestones(phaseName) {
    const milestones = {
      'Site Preparation & Excavation': ['Site clearance complete', 'Excavation complete'],
      'Foundation Work': ['Foundation laid', 'Concrete cured'],
      'Plinth & Column Construction': ['Plinth complete', 'Columns erected'],
      'Wall Construction': ['Wall masonry complete'],
      'Roof Structure': ['Roof slab complete', 'Waterproofing done'],
      'Electrical & Plumbing Rough-in': ['Wiring complete', 'Plumbing rough-in done'],
      'Plastering & Rendering': ['Internal plastering done', 'External rendering complete'],
      'Flooring & Tiling': ['Flooring complete', 'Bathroom tiling done'],
      'Door & Window Installation': ['All fixtures installed'],
      'Painting & Final Finishing': ['Painting complete', 'Final inspection']
    };
    
    return milestones[phaseName] || ['Phase complete'];
  }

  /**
   * Get color coding for different phase categories
   */
  static getPhaseColor(category) {
    const colors = {
      foundation: '#8B4513',
      structure: '#4682B4',
      roofing: '#32CD32',
      MEP: '#FFD700',
      finishing: '#FF6347'
    };
    
    return colors[category] || '#808080';
  }

  /**
   * Estimate project cost based on area
   */
  static estimateProjectCost(plinthArea) {
    // Rough estimate: NPR 2000-2500 per sq ft for standard construction
    return {
      estimated: Math.round(plinthArea * 2200),
      range: {
        min: Math.round(plinthArea * 2000),
        max: Math.round(plinthArea * 2500)
      },
      currency: 'NPR'
    };
  }

  /**
   * Get critical path phases
   */
  static getCriticalPath(ganttData) {
    // For construction, the critical path is usually the sequential phases
    return ganttData
      .filter(phase => phase.dependencies.length <= 1)
      .map(phase => phase.id);
  }

  /**
   * Calculate resource utilization
   */
  static getResourceUtilization(ganttData) {
    const resourceCounts = {};
    
    ganttData.forEach(phase => {
      phase.resources.forEach(resource => {
        resourceCounts[resource] = (resourceCounts[resource] || 0) + 1;
      });
    });

    return Object.entries(resourceCounts)
      .map(([resource, count]) => ({
        resource,
        utilizationCount: count,
        utilizationPercentage: Math.round((count / ganttData.length) * 100)
      }))
      .sort((a, b) => b.utilizationCount - a.utilizationCount);
  }

  /**
   * Generate timeline for specific construction type
   */
  static generateSpecializedTimeline(type, area, floors = 1) {
    // Calculate floor multiplier for timeline
    const floorMultiplier = this.calculateFloorMultiplier(floors);
    
    switch (type) {
      case 'renovation':
        return this.generateRenovationTimeline(area, floorMultiplier);
      case 'commercial':
        return this.generateTimeline(area, 'commercial', floorMultiplier);
      case 'villa':
        return this.generateVillaTimeline(area, floorMultiplier);
      default:
        return this.generateTimeline(area, 'residential', floorMultiplier);
    }
  }

  /**
   * Calculate timeline multiplier based on number of floors
   */
  static calculateFloorMultiplier(floors) {
    // Base multiplier for additional floors
    // Each additional floor adds complexity and time
    if (floors <= 1) return 1;
    if (floors <= 2) return 1.3;
    if (floors <= 3) return 1.6;
    if (floors <= 4) return 1.8;
    return 2.0; // 5+ floors
  }

  /**
   * Generate renovation-specific timeline
   */
  static generateRenovationTimeline(area, floorMultiplier = 1) {
    // Renovation projects are typically 40-60% of new construction time
    const baseTimeline = this.generateTimeline(area, 'residential', floorMultiplier);
    
    // Adjust phases for renovation
    const renovationPhases = baseTimeline.phases
      .filter(phase => !['Site Preparation & Excavation', 'Foundation Work'].includes(phase.name))
      .map(phase => ({
        ...phase,
        duration: Math.ceil(phase.duration * 0.6),
        name: phase.name.replace('Construction', 'Renovation')
      }));

    return {
      ...baseTimeline,
      projectInfo: {
        ...baseTimeline.projectInfo,
        name: 'Renovation Project',
        totalDuration: renovationPhases.reduce((sum, phase) => sum + phase.duration, 0)
      },
      phases: renovationPhases
    };
  }

  /**
   * Generate villa-specific timeline (luxury construction)
   */
  static generateVillaTimeline(area, floorMultiplier = 1) {
    const baseTimeline = this.generateTimeline(area, 'residential', floorMultiplier);
    
    // Villa construction takes longer due to detailed work
    const villaPhases = baseTimeline.phases.map(phase => ({
      ...phase,
      duration: Math.ceil(phase.duration * 1.3),
      description: phase.description + ' (Premium Quality)'
    }));

    return {
      ...baseTimeline,
      projectInfo: {
        ...baseTimeline.projectInfo,
        name: 'Villa Construction Project',
        totalDuration: villaPhases.reduce((sum, phase) => sum + phase.duration, 0)
      },
      phases: villaPhases
    };
  }
}

module.exports = GanttDataGenerator;
