export interface PollOption {
    id: string;
    text: string;
    votes: number;
}

export interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: string; // User ID of the poll creator
}