import { CvAction } from "../entities/cv-history.entity";

export class CvEvent{
    constructor(
        public readonly action: CvAction,
        public readonly cvId: number,
        public readonly userId: number
    ){}
}