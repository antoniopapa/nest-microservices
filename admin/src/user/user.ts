export class User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    is_ambassador: boolean;

    get name() {
        return `${this.first_name} ${this.last_name}`;
    }
}
