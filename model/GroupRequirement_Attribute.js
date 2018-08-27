'use strict';

/**
 * Constructor GroupRequirement_Attribute
 */
class GroupRequirement_Attribute {
    constructor(attributeId, attributeDesignation, currentValue, targetValue) {
        this.attributeId = attributeId;
        this.attributeDesignation = attributeDesignation;
        this.currentValue = currentValue;
        this.targetValue = targetValue;
    }
}

module.exports = GroupRequirement_Attribute;