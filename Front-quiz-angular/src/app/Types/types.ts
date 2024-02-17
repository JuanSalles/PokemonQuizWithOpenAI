type Question = {
    Id: number;
    Text: string;
    Answers: string[];
} 

type Score = {
    Nickname: string;
    Score: number;
    Date: string;
}

type Ranking = Score[]

export type { Question, Score, Ranking}



