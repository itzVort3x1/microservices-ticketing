import {
    Subjects,
    Publisher,
    ExpirationCompleteEvent,
} from "@kaustubhtech/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}
