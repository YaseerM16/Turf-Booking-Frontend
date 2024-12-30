import { RRule, Weekday } from 'rrule';

export const mapDayIndexToRRuleDay = (dayIndex: number): Weekday => {
    switch (dayIndex) {
        case 0:
            return RRule.SU;
        case 1:
            return RRule.MO;
        case 2:
            return RRule.TU;
        case 3:
            return RRule.WE;
        case 4:
            return RRule.TH;
        case 5:
            return RRule.FR;
        case 6:
            return RRule.SA;
        default:
            return RRule.SU; // Default to Sunday if invalid
    }
};
