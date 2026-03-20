export interface Club {
    id: string;
    name: string;
    description: string;
    members: string[];
    events: string[];
    createdAt: Date;
    updatedAt: Date;
}

export class ClubModel {
    constructor(public club: Club) {}

    // Additional methods for managing club data can be added here
}