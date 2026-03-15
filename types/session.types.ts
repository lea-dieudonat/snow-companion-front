export interface Session {
    id: string;
    date: Date;
    station: string;
    conditions: string | null;
    tricks: string[];
    notes: string | null;
    photos: string[];
    rating?: number;
    runCount?: number | null;
    maxSpeed?: number | null;
    totalDistance?: number | null;
    verticalDrop?: number | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateSessionInput {
    date: string;
    station: string;
    conditions?: string;
    tricks?: string[];
    notes?: string;
    photos?: string[];
    rating?: number;
    runCount?: number;
    maxSpeed?: number;
    totalDistance?: number;
    verticalDrop?: number;
    userId: string;
}