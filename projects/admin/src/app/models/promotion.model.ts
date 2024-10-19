import { BigDecimal } from 'bigdecimal.js'; // Make sure to import the BigDecimal library if neede

export interface Promotion {
    promotionID: string;
    promotionName: string;
    discountPercentage: BigDecimal; // Adjust the type based on how you handle BigDecimal
    startDate: Date; // Adjust the type based on how you handle LocalDate
    endDate: Date
}