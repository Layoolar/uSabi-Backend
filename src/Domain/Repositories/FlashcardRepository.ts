import { Flashcard, QA } from "@domain/Models/Flashcards";
import { IDatabase } from "@infrastructure/Database";

export interface IFlashcardRepository {
    readonly db: IDatabase;
    getAllFlashcards(): Promise<Flashcard[]>;
    getFlashcardById(flashcardId: string): Promise<Flashcard>;
    createFlashcard(flashcard: Flashcard): Promise<QA[]>;
    updateFlashcard(flashcardId: string, flashcard: Partial<Flashcard>): Promise<void>;
}

export class FlashcardRepository implements IFlashcardRepository {
    constructor(readonly db: IDatabase) {}

    async getAllFlashcards(): Promise<Flashcard[]> {
        const flashcards = await this.db.execute(
            `SELECT fc.*
            FROM flashcards fc
	    ORDER BY fc.createdAt DESC`
	);
	return flashcards as Flashcard[];
    }

    async getFlashcardById(flashcardId: string): Promise<Flashcard> {
        const [flashcard] = await this.db.execute(
            `SELECT fc.*
	    FROM flashcards as fc
	    WHERE fc.id=?`,
	    [flashcardId],
	);

	return {
		...flashcard,
		qas: flashcard.qas ? JSON.parse(flashcard.qas) : []
	} as Flashcard;
    }

    async createFlashcard(flashcard: Flashcard): Promise<QA[]> {
        // const [flashcard] = 
	await this.db.execute(
            `INSERT INTO flashcards (flashcardId, category, title, avatar, qas, difficulty, numberOfQuestions)
	    VALUES (?,?,?,?,?,?,?)`,
	    [
		flashcard.flashcardId, flashcard.category, flashcard.title, flashcard.avatar,
		JSON.stringify(flashcard.qas), flashcard.difficulty, flashcard.numberOfQuestions
	    ]
	);
	// const flashcardId = (flashcard as any).insertId
	return flashcard.qas as QA[];
    }

    async updateFlashcard(flashcardId: string, flashcard: Partial<Flashcard>): Promise<void> {
	const keys = Object.keys(flashcard);
	const values = Object.values(flashcard).map((value, index) => {
            if (keys[index] === "qas" && Array.isArray(value)) {
                return JSON.stringify(value);
	    }
	    return value;
	});

        const setClause = keys.map((key) => `${key} = ?`).join(", ");

	await this.db.execute(
            `UPDATE flashcards
            SET ${setClause}
	    WHERE id = ?`,
	    [...values, flashcardId] as (string | number | null)[]
	);
    }
}
