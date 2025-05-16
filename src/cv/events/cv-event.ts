import { CvAction } from "../../cv/entities/cv-history.entity";

export class CvEvent{
    constructor(
        public readonly action: CvAction,
        public readonly cvId: number,
        public readonly userId: number
    ){}
}