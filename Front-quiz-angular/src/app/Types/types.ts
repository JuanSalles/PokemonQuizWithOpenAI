type Question = {
    question: string;
    options: string[];
} 

type Score = {
    Nickname: string;
    Score: number;
    Date: string;
}

type Ranking = Score[]

export type { Question, Score, Ranking}



