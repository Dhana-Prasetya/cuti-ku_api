class Leave_Balance {
    public user_id: string;
    public year: number;
    public total_allowed: number;
    public taken: number;

    constructor(
        user_id: string,
        year: number,
        total_allowed: number,
        taken: number,
    ) {
        this.user_id = user_id;
        this.year = year;
        this.total_allowed = total_allowed;
        this.taken = taken;
    }
}

module.exports = Leave_Balance;
