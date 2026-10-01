package com.bloodfinder.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum BloodGroup {
    A_POSITIVE("A+"),
    A_NEGATIVE("A-"),
    B_POSITIVE("B+"),
    B_NEGATIVE("B-"),
    AB_POSITIVE("AB+"),
    AB_NEGATIVE("AB-"),
    O_POSITIVE("O+"),
    O_NEGATIVE("O-");

    private final String displayName;

    BloodGroup(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static BloodGroup fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        String normalized = value.trim().toUpperCase().replace(" ", "");
        for (BloodGroup bg : BloodGroup.values()) {
            if (bg.name().equalsIgnoreCase(normalized) || 
                bg.displayName.equalsIgnoreCase(normalized) ||
                bg.name().replace("_", "").equalsIgnoreCase(normalized)) {
                return bg;
            }
        }
        // Handle common symbol variations
        switch (normalized) {
            case "A+": case "APOSITIVE": case "A_POS": return A_POSITIVE;
            case "A-": case "ANEGATIVE": case "A_NEG": return A_NEGATIVE;
            case "B+": case "BPOSITIVE": case "B_POS": return B_POSITIVE;
            case "B-": case "BNEGATIVE": case "B_NEG": return B_NEGATIVE;
            case "AB+": case "ABPOSITIVE": case "AB_POS": return AB_POSITIVE;
            case "AB-": case "ABNEGATIVE": case "AB_NEG": return AB_NEGATIVE;
            case "O+": case "OPOSITIVE": case "O_POS": return O_POSITIVE;
            case "O-": case "ONEGATIVE": case "O_NEG": return O_NEGATIVE;
            default:
                throw new IllegalArgumentException("Unknown blood group: " + value + 
                    ". Supported values: A+, A-, B+, B-, AB+, AB-, O+, O-");
        }
    }
}
