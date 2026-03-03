export class Paid_Leave {
    public id: string;
    public user_id: string;
    public start_date: Date;
    public end_date: Date;
    public attachment_url: string;
    public status: string;
    public rejection_reason: string | null;
    public approved_by: string | null;

    constructor(
        id: string,
        user_id: string,
        start_date: Date,
        end_date: Date,
        attachment_url: string,
        status: string,
        rejection_reason: string | null,
        approved_by: string | null,
    ) {
        this.id = id;
        this.user_id = user_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.attachment_url = attachment_url;
        this.status = status;
        this.rejection_reason = rejection_reason;
        this.approved_by = approved_by;
    }
}
